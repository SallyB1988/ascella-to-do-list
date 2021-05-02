import React, { createContext, useContext, useReducer } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue, blueGrey } from "@material-ui/core/colors";
import { v4 as uuidV4 } from "uuid";
import {
  makeStyles,
  Button,
  DialogTitle,
  DialogContent,
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
  addItemRow: {
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
      id: uuidV4(),
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
      newTodos = _.filter(state.todos, (item) => item.id !== action.value);
      return { ...state, todos: newTodos };
    case actions.UPDATE_CHECKED:
      const checked = action.value.checked;
      const index = _.findIndex(
        state.todos,
        (item) => item.id === action.value.id
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
  const [newId, setNewId] = React.useState(uuidV4());
  const [newNote, setNewNote] = React.useState("");
  const [editExisting, setEditExisting] = React.useState(undefined);

  const clearFields = () => {
    setNewNote("");
    setNewTitle("");
  };

  const handleCloseDialog = () => {
    clearFields();
    setDialogOpen(false);
  };

  const handleAddItem = () => {
    setNewId(uuidV4());
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
    setEditExisting(undefined);
  };

  const handleOpenModal = (id) => {
    const editItem = _.find(todos, (item) => item.id === id);
    setEditExisting(id);
    setNewTitle(editItem.title);
    setNewNote(editItem.note);
    setDialogOpen(true);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const copiedItems = [...todos];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    updateTodos(copiedItems);
  };

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <div>
          <ToDoHeader />
          <div className={classes.addItemRow}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setDialogOpen(true)}
            >
              Add Item
            </Button>
          </div>
          <div className={classes.itemsDiv}>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
              <Droppable droppableId="droppable-id">
                {(provided, snapshot) => {
                  return (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {_.map(todos, (item, idx) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={idx}
                        >
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps.style}
                                ref={provided.innerRef}
                              >
                                <ToDo
                                  key={`todo-${idx}`}
                                  id={item.id}
                                  title={item.title}
                                  note={item.note}
                                  checked={item.checked}
                                  updateChecked={updateChecked}
                                  handleEditItem={() =>
                                    handleOpenModal(item.id)
                                  }
                                  handleDeleteItem={() => deleteTodo(item.id)}
                                />
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                    </div>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </div>
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
              {editExisting ? (
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
        </div>
      </Paper>
    </Container>
  );
}
