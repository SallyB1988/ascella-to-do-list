import React from "react";
import { mount, shallow } from "enzyme";
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
    console.log(wrapper.debug());
    expect(wrapper).toBeTruthy();
  });

  xit("displays the title,  renders", () => {
    const wrapper = shallow(<ToDo {...props} />);
    console.log(wrapper.debug());
    expect(wrapper).toBeTruthy();
  });
});
