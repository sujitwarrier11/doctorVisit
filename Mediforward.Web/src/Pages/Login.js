import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Flex,
  Box,
  TextType,
  TextField,
  Button,
} from "@root/src/Components/Atoms";
import { Form, Field } from "react-final-form";

import { login, getTheme } from "@root/src/Redux/ActionCreators";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Breapoint from "@root/src/Components/Atoms/Breakpoints";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import { green, purple } from "@material-ui/core/colors";
import FacebookIcon from "@material-ui/icons/Facebook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import withTheme from "@root/src/Components/Atoms/withTheme";
import ErrorMessaging from "@root/src/Components/Molecules/ErrorMessaging";
import Env from "@root/Env";

//import logo from "../../public/images/logo.png"

const Login = ({ theme }) => {
  const dispatch = useDispatch();
  const { error, userTheme } = useSelector((state) => state.user);
  const [openSnackbar, setSnackBarStatus] = useState(false);

  const handleSubmit = (values) => {
    dispatch(login({ ...values }));
  };

  useEffect(() => {
    if (error) {
      console.log("error", error);
      setSnackBarStatus(true);
    }
  }, [error]);

  const isRequired = (value) => (value ? undefined : "This is Required");

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

  const classes = useStyles();

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

  const FaceBookButton = withStyles((theme) => ({
    root: {
      backgroundColor: "#3b5998",
      fontWeight: "500",
      textTransform: "capitalize",
      width: "100%",
      "&:hover": {
        backgroundColor: "#2d4373",
      },
    },
  }))(Button);

  const GoogleButton = withStyles((theme) => ({
    root: {
      textAlign: "right",
      backgroundColor: "#d34836",
      fontWeight: "500",
      textTransform: "capitalize",
      marginBottom: "10px",
      width: "100%",
      "&:hover": {
        backgroundColor: "#b03626",
      },
    },
  }))(Button);
  const mUiTheme = createMuiTheme({
    palette: {
      primary: green,
    },
  });

  const styles = (theme) =>
    createStyles({
      input: {
        "&::placeholder": {
          fontStyle: "italic",
        },
      },
    });

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
        bg="ThemeColor2"
        width={["95%", "95%", "45%", "45%"]}
        alignItems="center"
        px={["15px", "25px", "15px", "25px"]}
        py="50px"
      >
        <Box>
          <Box
            style={{
              display: "block",
              margin: "0 auto 40px 0",
              textAlign: "center",
            }}
          >
            <img
              alt="logo"
              src={
                (userTheme && `${Env.baseUrl}${userTheme.Logo}`) ||
                "/images/logo.png"
              }
              height="95"
              width="140"
            />
          </Box>
        </Box>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {/* <h1 className="title">Login</h1> */}
              <Flex
                pb="35px"
                flexDirection={["row", "row", "flex-start", "flex-start"]}
              >
                <TextType variant="header">Sign In</TextType>
              </Flex>
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
                      <Box mb="20px">
                        <Field
                          name="username"
                          render={({ input, meta }) => (
                            <TextField
                              placeholder="Username"
                              input={input}
                              meta={meta}
                              br="5px"
                              bg={theme.color.mainBg}
                              errorColor={theme.color.errorBorder}
                              fontFamily={theme.fontFamily}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                disableUnderline: true,
                                disableLabel: true,
                              }}
                              behaviourProps={{
                                isRemoveSecondaryLabelDiv: true,
                              }}
                            />
                          )}
                          validate={isRequired}
                        />
                        {errors.username && touched.username && (
                          <Box pl="3px" pt="3px">
                            <ErrorMessaging message={errors.username} />
                          </Box>
                        )}
                      </Box>
                      <Box mb="20px">
                        <Field
                          name="password"
                          render={({ input, meta }) => (
                            <TextField
                              placeholder="Password"
                              inputType="password"
                              input={input}
                              meta={meta}
                              br="5px"
                              bg={theme.color.mainBg}
                              errorColor={theme.color.errorBorder}
                              inputFontSize=""
                              fontFamily={theme.fontFamily}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                disableUnderline: true,
                                disableLabel: true,
                              }}
                            />
                          )}
                          validate={isRequired}
                        />
                        {errors.password && touched.password && (
                          <Box pl="3px" pt="3px">
                            <ErrorMessaging message={errors.password} />
                          </Box>
                        )}
                      </Box>
                      <ColorButton
                        variant="contained"
                        color="primary"
                        buttonType="submit"
                      >
                        Sign Up
                      </ColorButton>

                      <Box mt="15px">
                        <p className="text-link">
                          <Link to="/forgotpassword" className="text">
                            Forgot Password?
                          </Link>
                        </p>
                      </Box>
                    </form>
                  );
                }}
              />
            </Grid>
          </Grid>
        </div>
      </Box>
    </Flex>
  );
};

export default withRouter(withTheme(Login));
