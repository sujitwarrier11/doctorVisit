import React from "react";
import { useBreakpoints } from "@root/src/Components/Atoms/Breakpoints";
import withTheme from "@root/src/Components/Atoms/withTheme";
import styled from "@emotion/styled";

const Div = styled("div")`
  box-sizing: border-box;
`;
const Box = ({ getStyle, ...props }) => {
  const { breakSize } = useBreakpoints();
  const sizes = ["xs", "sm", "md", "lg"];
  return (
    <Div {...props} style={getStyle(props, sizes.indexOf(breakSize || "lg"))} />
  );
};

export default withTheme(Box);
