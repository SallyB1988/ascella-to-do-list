import React from "react";
import { shallow } from "enzyme";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import ToDo from "../src/Components/ToDo/ToDo";

const mockUpdateChecked = jest.fn();
const mockHandleEditItem = jest.fn();
const mockHandleDeleteItem = jest.fn();
const props = {
  title: "this is a title",
  note: "and a note",
  id: "222",
  checked: false,
  HandleDeleteItem: mockHandleDeleteItem,
  HandleEditItem: mockHandleEditItem,
  UpdateChecked: mockUpdateChecked,
};

describe("ToDo tests", () => {
  it("shallow renders", () => {
    const wrapper = shallow(<ToDo {...props} />);
    expect(wrapper).toBeTruthy();
  });

  it("displays the title, editIcon, deleteIcon and expandIcon  renders", () => {
    const wrapper = shallow(<ToDo {...props} />);
    const editIcon = wrapper.find(EditIcon);
    const deleteIcon = wrapper.find(DeleteIcon);
    const expandIcon = wrapper.find(ExpandMoreIcon);
    expect(wrapper.find("h4").text()).toEqual(props.title);
    expect(editIcon).toBeTruthy();
    expect(deleteIcon).toBeTruthy();
    expect(expandIcon).toBeTruthy();
  });
});
