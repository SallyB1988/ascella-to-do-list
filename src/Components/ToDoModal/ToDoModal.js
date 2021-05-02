import React, { useContext } from "react";
import { v4 as uuidV4 } from "uuid";
import {
  Button,
  DialogTitle,
  DialogContent,
  TextField,
  Dialog,
  DialogActions,
} from "@material-ui/core";
import _ from "lodash";

import { ToDoContext } from "../DisplayToDoList/DisplayToDoList";

/**
 *
 * @param {dialogOpen}     boolean:  opens/closes dialog window
 * @param {setDialogOpen}  method to set dialogOpen
 * @param {editExisting}  string: contains uuid of item if one is being modified, otherwise is undefined
 * @param {setEditExisting} method to set editExisting
 * @returns
 *
 * Material UI Dialog component containing input fields for todo title and note
 */
export default function ToDoModal({
  dialogOpen,
  setDialogOpen,
  editExisting,
  setEditExisting,
}) {
  const {
    todos,
    newItem,
    addTodo,
    updateNewTitle,
    updateNewNote,
    updateNewId,
    updateTodos,
  } = useContext(ToDoContext);

  const clearFields = () => {
    updateNewNote("");
    updateNewTitle("");
  };

  const clearNewItem = () => {
    updateNewNote("");
    updateNewTitle("");
    updateNewId(undefined);
  };

  const handleCloseDialog = () => {
    clearFields();
    setDialogOpen(false);
  };

  const handleAddItem = () => {
    updateNewId(uuidV4());
    const item = {
      title: newItem.title,
      note: newItem.note,
      checked: false,
      id: newItem.id,
    };
    addTodo(item);
    clearFields();
    setDialogOpen(false);
  };

  const handleUpdateItem = () => {
    const index = _.findIndex(todos, (item) => item.id === editExisting);
    const copyId = todos[index].id;

    if (index >= 0) {
      // create object with new title and note using the previous id
      const updatedNewItem = {
        ...todos[index],
        title: newItem.title,
        note: newItem.note,
        id: copyId,
      };
      let modifiedToDos = [...todos];
      modifiedToDos[index] = updatedNewItem;

      updateTodos(modifiedToDos);
      clearNewItem();
    } else {
      console.log("This should never happen");
    }

    clearFields();
    setDialogOpen(false);
    setEditExisting(undefined);
  };

  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle id="form-dialog-title">Add New Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="new-title"
          label="Title"
          value={newItem.title}
          onChange={(e) => updateNewTitle(e.target.value)}
          type="text"
          fullWidth
        />
        <TextField
          margin="dense"
          id="new-note"
          label="Notes"
          value={newItem.note}
          onChange={(e) => updateNewNote(e.target.value)}
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
          <Button onClick={handleAddItem} variant="contained" color="primary">
            Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
