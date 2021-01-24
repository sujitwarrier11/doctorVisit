import React from 'react';
import { Flex, Box, TextType } from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";

const Cards = ({ theme, ...props }) => {
  return <Flex r="5px" bg={theme.color.ThemeColor2} border={`1px solid ${theme.color.CardBorder}`} {...props} />;
};

export default withTheme(Cards);
