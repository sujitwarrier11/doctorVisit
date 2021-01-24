import React, { forwardRef } from "react";
import { useBreakpoints } from "@root/src/Components/Atoms/Breakpoints";
import withTheme from "@root/src/Components/Atoms/withTheme";
import styled from "@emotion/styled";

const Div = styled("div")`
  box-sizing: border-box;
  display: flex;
`;
const Flex = ({ getStyle, ...props }, ref) => {
  const { breakSize } = useBreakpoints();

  const sizes = ["xs", "sm", "md", "lg"];

  return (
    <Div
      ref={ref}
      {...props}
      style={getStyle(props, sizes.indexOf(breakSize || "lg"), true)}
    />
  );
};

export default withTheme(forwardRef(Flex));
