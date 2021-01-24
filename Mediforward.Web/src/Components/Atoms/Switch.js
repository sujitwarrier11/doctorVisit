import React from "react";
import MUSwitch from "@material-ui/core/Switch";
import styled from "@emotion/styled";
import { makeStyles } from "@material-ui/core/styles";
import withTheme from "@root/src/Components/Atoms/withTheme";

const useStyles = makeStyles({
  root: {
    width: 42,
    height: 26,
    padding: 0,
  },
  switchBase: {
    color: (props) => props.theme.color.ThemeColor1,
    "&$checked": {
      color: (props) => props.theme.color.ThemeColor1,
    },
    "&$checked + $track": {
      backgroundColor: (props) => props.theme.color.ThemeColor1,
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  checked: {},
  focusVisible: {},
});

const Switch = ({ theme, ...props }) => {
  const classes = useStyles({ theme });
  return <MUSwitch {...props} className={classes} />;
};

export default withTheme(Switch);
