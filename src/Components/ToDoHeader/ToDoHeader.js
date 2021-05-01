import React from "react";

import { styled } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const StyledHeader = styled(Typography)({
  background: "linear-gradient(0deg, #a29a9a 20%, #93c2da 90%)",
  variant: "h3",
  border: 2,
  borderRadius: 3,
  color: "white",
  fontSize: 28,
  height: 48,
  padding: "30px 30px",
});

export default function ToDoHeader() {
  return <StyledHeader>To Do List</StyledHeader>;
}
