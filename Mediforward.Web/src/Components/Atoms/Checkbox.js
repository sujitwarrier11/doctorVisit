import React from "react";
import MUICheckbox from "@material-ui/core/Checkbox";
import withTheme from "@root/src/Components/Atoms/withTheme";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
    padding: "0px",
    color: (props) => props.bg,
  },
});

const CheckBox = ({ theme }) => {
  const classes = useStyles({ bg: theme.color.deepCream });
  return <MUICheckbox className={classes.root} />;
};

export default withTheme(CheckBox);
