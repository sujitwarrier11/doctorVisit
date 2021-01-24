import React from "react";
import {
  Flex,
  Box,
  TextType,
  TextField,
  Button,
} from "@root/src/Components/Atoms";
import { Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { callRegister } from "@root/src/Redux/ActionCreators";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { green, purple } from "@material-ui/core/colors";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import withTheme from "@root/src/Components/Atoms/withTheme";
import FormField from "@root/src/Components/Molecules/FormField";
import Env from "@root/Env";
import FormSelect from "@root/src/Components/Molecules/FormSelect";

const Register = ({ theme }) => {
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    dispatch(callRegister({ ...values }));
  };
  const { userTheme } = useSelector((state) => state.user);

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

  const firstCheckbox = () => {
    return (
      <div>
        <p>What is a room?</p>
        <p>hasjhahj</p>
      </div>
    );
  };

  const roomToolTip = () => {
    return (
      <div>
        <h1>What is a room?</h1>
        <p>hasjhahj</p>
      </div>
    );
  };

  return (
    <Flex bg="mainBg" width="100%" flexDirection="column" alignItems="center">
      <Box
        m="auto"
        r="15px"
        bg="white"
        width={["95%", "95%", "32%", "32%"]}
        alignItems="center"
        px={["15px", "40px", "15px", "40px"]}
        py="50px"
      >
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
        <Box mb="40px">
          <TextType variant="header">Register</TextType>
        </Box>
        <Form
          onSubmit={handleSubmit}
          validate={(values) => {
            const objErrors = {};
            if (values.Email && values.ConfirmEmail) {
              if (values.Email !== values.ConfirmEmail)
                objErrors.ConfirmEmail = "Email does not match.";
            }
            return objErrors;
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
                {console.log("values", values)}
                <FormSelect
                  errors={errors}
                  touched={touched}
                  fieldName="Salutation"
                  placeholder="Salutation"
                  items={[
                    {
                      id: 1,
                      label: "Mr.",
                      value: "Mr.",
                    },
                    {
                      id: 2,
                      label: "Dr.",
                      value: "Dr.",
                    },
                    {
                      id: 3,
                      label: "Mrs.",
                      value: "Mrs.",
                    },
                    {
                      id: 4,
                      label: "Ms.",
                      value: "Ms.",
                    },
                  ]}
                />

                <FormField
                  errors={errors}
                  touched={touched}
                  fieldName="FirstName"
                  placeholder="First Name"
                />

                <FormField
                  errors={errors}
                  touched={touched}
                  fieldName="LastName"
                  placeholder="Last Name"
                />

                <FormField
                  errors={errors}
                  touched={touched}
                  fieldName="RoomName"
                  placeholder="Room Name"
                />

                <FormField
                  errors={errors}
                  touched={touched}
                  fieldName="Email"
                  placeholder="Email"
                />
                <FormField
                  errors={errors}
                  touched={touched}
                  fieldName="ConfirmEmail"
                  placeholder="Confirm Email"
                />
                <FormField
                  errors={errors}
                  touched={touched}
                  fieldName="PhoneNumber"
                  placeholder="Phone Number"
                />
                <FormField
                  errors={errors}
                  touched={touched}
                  fieldName="MedicalLicenceNumber"
                  placeholder="Medical Licence Number"
                />

                <FormField
                  errors={errors}
                  touched={touched}
                  fieldName="Password"
                  placeholder="Password"
                  fieldType="password"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      name="checkedI"
                    />
                  }
                  label={firstCheckbox}
                  inputProps={firstCheckbox}
                />

                <ColorButton
                  variant="contained"
                  color="primary"
                  className={classes.margin}
                  buttonType="submit"
                >
                  Register
                </ColorButton>
              </form>
            );
          }}
        />
      </Box>
    </Flex>
  );
};

export default withRouter(withTheme(Register));
