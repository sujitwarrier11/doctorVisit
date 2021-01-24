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
import { generateForgotPasswordEmail } from "@root/src/Redux/ActionCreators";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const handleSubmit = (values) => {
    dispatch(
      generateForgotPasswordEmail({
        ...values,
        HostName: window.location.hostname.replace(".mediforward.in", ""),
      })
    );
  };
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
          <TextType variant="header">Forgot Password</TextType>
          <p>
            To reset your password, enter your login email and we'll send you
            instructions.
          </p>
        </Box>
        <Form
          onSubmit={handleSubmit}
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
                {console.log("values", values)}
                <FormField
                  autoFocus
                  errors={errors}
                  touched={touched}
                  fieldName="Email"
                  placeholder="Email"
                />

                <ColorButton
                  variant="contained"
                  color="primary"
                  className={classes.margin}
                  buttonType="submit"
                >
                  Send Instructions
                </ColorButton>
                <Box mt="15px">
                  <p className="text-link">
                    <Link to="/">Return to Sign In</Link>
                  </p>
                </Box>
              </form>
            );
          }}
        />
      </Box>
    </Flex>
  );
};

export default withRouter(ForgotPassword);
