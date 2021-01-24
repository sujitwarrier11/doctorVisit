import React from "react";
import withTheme from "@root/src/Components/Atoms/withTheme";
import styled from "@emotion/styled";

const P = styled.p``;

const TextType = ({ children, variant, getTextStyles }) => (
  <P style={getTextStyles(variant)}>{children}</P>
);

export default withTheme(TextType);
