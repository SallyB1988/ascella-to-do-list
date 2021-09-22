import React from "react";
import { shallow } from "enzyme";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { ToDoList } from "../src/Components/DisplayToDoList/DisplayToDoList";

const mockUpdateChecked = jest.fn();
const mockDeleteTodo = jest.fn();
const mockUpdateTodos = jest.fn();
const mockUpdateNewTitle = jest.fn();
const mockUpdateNewNote = jest.fn();
const mockedEvent = { stopPropagation: jest.fn() };

// const props = {
//   todos: todos,
//   updateChecked: mockUpdateChecked,
//   updateTodos: mockUpdateTodos,
//   deleteTodo: mockDeleteTodo,
//   updateNewTitle: mockUpdateNewTitle,
//   updateNewNote: mockUpdateNewNote,
// };
jest.mock("react", () => {
  const ActualReact = require.requireActual("react");
  const todos = [
    {
      title: "this is a title",
      note: "and a note",
      id: "222",
      checked: false,
    },
    {
      title: "this is a second item",
      note: "This has a different note",
      id: "323",
      checked: false,
    },
    {
      title: "third item",
      note: "blah blah",
      id: "121",
      checked: true,
    },
  ];
  return {
    ...ActualReact,
    useContext: () => ({
      state: {
        todos: todos,
        updateChecked: mockUpdateChecked,
        updateTodos: mockUpdateTodos,
        deleteTodo: mockDeleteTodo,
        updateNewTitle: mockUpdateNewTitle,
        updateNewNote: mockUpdateNewNote,
      },
    }),
  };
});
describe("ToDoList tests", () => {
  let wrapper;

  // beforeEach(() => {
  // wrapper = shallow(<ToDoList {...props} />);
  // });

  it("shallow renders", () => {
    wrapper = shallow(<ToDoList />);
    expect(wrapper).toBeTruthy();
  });

  xit("displays the title, editIcon, deleteIcon and expandIcon  renders", () => {
    const editIcon = wrapper.find(EditIcon);
    const deleteIcon = wrapper.find(DeleteIcon);
    const expandIcon = wrapper.find(ExpandMoreIcon);
    expect(wrapper.find("h4").text()).toEqual(props.title);
    expect(editIcon).toBeTruthy();
    expect(deleteIcon).toBeTruthy();
    expect(expandIcon).toBeTruthy();
  });

  xit("handles edit click", () => {
    const id = `#edit-${props.id}`;
    wrapper.find(id).simulate("click", mockedEvent);
    expect(mockHandleEditItem).toHaveBeenCalledWith(props.id);
  });

  xit("handles delete click", () => {
    const id = `#delete-${props.id}`;
    wrapper.find(id).simulate("click", mockedEvent);
    expect(mockHandleEditItem).toHaveBeenCalledWith(props.id);
  });

  xit("handles checkbox click", () => {
    const mockCheckedEvent = {
      stopPropagation: jest.fn(),
      target: { checked: true },
    };

    const id = `#checkbox-${props.id}`;
    wrapper.find(id).simulate("click", mockCheckedEvent);
    expect(mockUpdateChecked).toHaveBeenCalledWith({
      id: props.id,
      checked: true,
    });
  });
});
