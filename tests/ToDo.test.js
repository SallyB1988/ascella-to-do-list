import React from "react";
import { shallow } from "enzyme";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import ToDo from "../src/Components/ToDo/ToDo";

const mockUpdateChecked = jest.fn();
const mockHandleEditItem = jest.fn();
const mockHandleDeleteItem = jest.fn();
const mockedEvent = { stopPropagation: jest.fn() };

const props = {
  title: "this is a title",
  note: "and a note",
  id: "222",
  checked: false,
  handleDeleteItem: mockHandleDeleteItem,
  handleEditItem: mockHandleEditItem,
  updateChecked: mockUpdateChecked,
};

describe("ToDo tests", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ToDo {...props} />);
  });

  it("shallow renders", () => {
    expect(wrapper).toBeTruthy();
  });

  it("displays the title, editIcon, deleteIcon and expandIcon  renders", () => {
    const editIcon = wrapper.find(EditIcon);
    const deleteIcon = wrapper.find(DeleteIcon);
    const expandIcon = wrapper.find(ExpandMoreIcon);
    expect(wrapper.find("h4").text()).toEqual(props.title);
    expect(editIcon).toBeTruthy();
    expect(deleteIcon).toBeTruthy();
    expect(expandIcon).toBeTruthy();
  });

  it("handles edit click", () => {
    const id = `#edit-${props.id}`;
    wrapper.find(id).simulate("click", mockedEvent);
    expect(mockHandleEditItem).toHaveBeenCalledWith(props.id);
  });

  it("handles delete click", () => {
    const id = `#delete-${props.id}`;
    wrapper.find(id).simulate("click", mockedEvent);
    expect(mockHandleEditItem).toHaveBeenCalledWith(props.id);
  });

  it("handles checkbox click", () => {
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
