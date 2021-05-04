import React from "react";
import {
  makeStyles,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  IconButton,
  Grid,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: "0px 0px",
  },
  floatLeft: {
    float: "left",
    textAlign: "left",
  },
  notes: {
    textAlign: "left",
  },
}));

/*
 *  Component for displaying a ToDo item and its note.
 *     The display of the note can be expanded or collapsed
 *     ToDo item has a checkbox for marking completion of item
 *     Displays icons for editing or deleting the item
 */
export default function ToDo({
  title,
  note,
  id,
  checked,
  updateChecked,
  handleEditItem,
  handleDeleteItem,
}) {
  const classes = useStyles();
  return (
    <Accordion className={classes.root}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={1}>
            <Checkbox
              id={`checkbox-${id}`}
              checked={checked}
              onClick={(event) => {
                event.stopPropagation();
                updateChecked({ id: id, checked: event.target.checked });
              }}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </Grid>
          <Grid item xs={9}>
            <h4 className={classes.floatLeft}>{title}</h4>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              id={`edit-${id}`}
              onClick={(event) => {
                event.stopPropagation();
                handleEditItem(id);
              }}
            >
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              id={`delete-${id}`}
              onClick={(event) => {
                event.stopPropagation();
                handleDeleteItem(id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails className={classes.notes}>{note}</AccordionDetails>
    </Accordion>
  );
}
