import React, { createContext, useContext, useReducer } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue, blueGrey } from "@material-ui/core/colors";

import {
  makeStyles,
  Button,
  DialogTitle,
  DialogContent,
  Grid,
  Paper,
  Container,
  TextField,
  Dialog,
  DialogActions,
} from "@material-ui/core";
import _ from "lodash";

import ToDo from "../ToDo/ToDo";
import ToDoHeader from "../ToDoHeader/ToDoHeader";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: blueGrey,
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    height: 850,
    width: 700,
    padding: "2%",
    backgroundColor: "#1e709e",
  },
  gridRow: {
    padding: "10px",
    backgroundColor: "#bdcd754",
  },
  paper: {
    paddingTop: 2,
    paddingBottom: 15,
    height: "95%",
    margin: "auto",
    width: 500,
    backgroundColor: "#e0d9d1",
  },
  itemsDiv: {
    height: "600px",
    overflow: "auto",
    margin: "auto",
    width: 500,
    backgroundColor: "#e0d9d1",
  },
}));

const initialState = {
  todos: [
    {
      title: "Example initial item",
      note:
        "This can have a note attached to it. All items can be updated or deleted.",
      checked: false,
      id: 1555,
    },
  ],
};

const actions = {
  ADD_TODO: "ADD_TODO",
  UPDATE_TODOS: "UPDATE_TODOS",
  DELETE_TODO: "DELETE_TODO",
  UPDATE_CHECKED: "UPDATE_CHECKED",
};

function toDoListReducer(state, action) {
  let newTodos = [];
  switch (action.type) {
    case actions.ADD_TODO:
      newTodos = [...state.todos, action.value];
      return { ...state, todos: newTodos };
    case actions.UPDATE_TODOS:
      return { ...state, todos: action.value };
    case actions.DELETE_TODO:
      newTodos = _.filter(state.todos, (item) => item.id != action.value);
      return { ...state, todos: newTodos };
    case actions.UPDATE_CHECKED:
      const checked = action.value.checked;
      const index = _.findIndex(
        state.todos,
        (item) => item.id == action.value.id
      );
      newTodos = [...state.todos];
      newTodos[index] = { ...newTodos[index], checked: checked };
      return { ...state, todos: newTodos };
    default:
      return state;
  }
}

export default function DisplayToDoList() {
  return (
    <Provider>
      <MuiThemeProvider theme={theme}>
        <ToDoList />
      </MuiThemeProvider>
    </Provider>
  );
}

export const ToDoContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(toDoListReducer, initialState);

  const value = {
    todos: state.todos,
    addTodo: (value) => dispatch({ type: actions.ADD_TODO, value }),
    updateTodos: (value) => dispatch({ type: actions.UPDATE_TODOS, value }),
    deleteTodo: (value) => dispatch({ type: actions.DELETE_TODO, value }),
    updateChecked: (value) => dispatch({ type: actions.UPDATE_CHECKED, value }),
  };

  return <ToDoContext.Provider value={value}>{children}</ToDoContext.Provider>;
}

export function ToDoList() {
  const classes = useStyles();

  const { todos, updateChecked, addTodo, updateTodos, deleteTodo } = useContext(
    ToDoContext
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newId, setNewId] = React.useState(1);
  const [newNote, setNewNote] = React.useState("");
  const [editExisting, setEditExisting] = React.useState(-1);

  const clearFields = () => {
    setNewNote("");
    setNewTitle("");
  };

  const handleCloseDialog = () => {
    clearFields();
    setDialogOpen(false);
  };

  const handleAddItem = () => {
    setNewId(newId + 1);
    const item = {
      title: newTitle,
      note: newNote,
      checked: false,
      id: newId,
    };
    addTodo(item);
    clearFields();
    setDialogOpen(false);
  };

  const handleUpdateItem = () => {
    const index = _.findIndex(todos, (item) => item.id === editExisting);

    if (index >= 0) {
      const newItem = { ...todos[index], title: newTitle, note: newNote };
      let modifiedToDos = [...todos];
      modifiedToDos[index] = newItem;

      updateTodos(modifiedToDos);
    } else {
      console.log("This should never happen");
    }

    clearFields();
    setDialogOpen(false);
    setEditExisting(-1);
  };

  const handleOpenModal = (id) => {
    const editItem = _.find(todos, (item) => item.id === id);
    setEditExisting(id);
    setNewTitle(editItem.title);
    setNewNote(editItem.note);
    setDialogOpen(true);
  };

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Grid>
          <Grid item xs={12} position="sticky">
            <ToDoHeader />
          </Grid>
          <Grid className={classes.gridRow} container direction="row">
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setDialogOpen(true)}
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.itemsDiv}>
              {_.map(todos, (item, idx) => (
                <ToDo
                  key={`todo-${idx}`}
                  id={item.id}
                  title={item.title}
                  note={item.note}
                  checked={item.checked}
                  updateChecked={updateChecked}
                  handleEditItem={() => handleOpenModal(item.id)}
                  handleDeleteItem={() => deleteTodo(item.id)}
                />
              ))}
            </div>
          </Grid>
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle id="form-dialog-title">Add New Item</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="new-title"
                label="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                type="text"
                fullWidth
              />
              <TextField
                margin="dense"
                id="new-note"
                label="Notes"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                type="text"
                multiline
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
              {editExisting >= 0 ? (
                <Button
                  onClick={handleUpdateItem}
                  variant="contained"
                  color="primary"
                >
                  Update
                </Button>
              ) : (
                <Button
                  onClick={handleAddItem}
                  variant="contained"
                  color="primary"
                >
                  Add
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Grid>
      </Paper>
    </Container>
  );
}
