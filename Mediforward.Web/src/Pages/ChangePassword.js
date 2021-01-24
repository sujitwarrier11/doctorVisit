import React from "react";
import {
  Flex,
  Box,
  TextType,
  TextField,
  Button,
} from "@root/src/Components/Atoms";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import { Form, Field } from "react-final-form";
import { withRouter, Link } from "react-router-dom";
import { green, purple } from "@material-ui/core/colors";
import FormField from "@root/src/Components/Molecules/FormField";
import { useDispatch } from "react-redux";
import { resetUserPassword } from "@root/src/Redux/ActionCreators";

const ForgotPassword = ({ match }) => {
  const dispatch = useDispatch();

  const { validationKey } = match.params;
  const isRequired = (value) => (value ? undefined : "* Required");
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    in: {
      padding: 8,
    },
  }));

  const handleSubmit = (values) => {
    dispatch(resetUserPassword({ ...values, VaidationToken:  validationKey }));
  };
  const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: "#029ba7",
      fontWeight: "500",

      width: "100%",
      "&:hover": {
        backgroundColor: "#02848e",
      },
    },
  }))(Button);
  const classes = useStyles();

  return (
    <Flex
      width="100%"
      bg="mainBg"
      height="100%"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        m="auto"
        r="15px"
        bg="white"
        width={["95%", "95%", "32%", "32%"]}
        alignItems="center"
        px={["15px", "40px", "15px", "40px"]}
        py="50px"
        mb="40px"
      >
        <div className="logo">
          <img
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            alt="logo"
            src="/images/logo.png"
            height="95"
            width="140"
          />
        </div>
        <Box mb="40px">
          <TextType variant="header">Change your Password</TextType>
          <p>Please key in your new password.</p>
        </Box>
        <Form
          onSubmit={handleSubmit}
          validate={(values) => {
            if (
              values.ConfirmPassword &&
              values.NewPassword &&
              values.ConfirmPassword !== values.NewPassword
            )
              return {
                ConfirmPassword: "Passwords do not match.",
              };
          }}
          render={({
            form,
            values,
            invalid,
            handleSubmit,
            errors,
            touched,
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <FormField
                  autoFocus
                  errors={errors}
                  touched={touched}
                  fieldName="NewPassword"
                  placeholder="Password"
                  fieldType="password"
                />
                <FormField
                  autoFocus
                  errors={errors}
                  touched={touched}
                  fieldName="ConfirmPassword"
                  placeholder="Confirm Password"
                  fieldType="password"
                />

                <ColorButton
                  variant="contained"
                  color="primary"
                  className={classes.margin}
                  buttonType="submit"
                >
                  Send Instructions
                </ColorButton>
              </form>
            );
          }}
        />
      </Box>
    </Flex>
  );
};

export default withRouter(ForgotPassword);
