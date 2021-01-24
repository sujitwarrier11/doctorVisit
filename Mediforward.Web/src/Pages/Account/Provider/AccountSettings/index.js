import React, { useRef, useState, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  Box,
  TextType,
  TextField,
  Button,
  Snackbar,
  CheckBox,
  Accordian,
  Breakpoints,
  Switch,
} from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";
import styled from "@emotion/styled";
import Accordion from "@root/src/Components/Atoms/Accordian";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { push } from "connected-react-router";
import Card from "@root/src/Components/Molecules/Cards";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Form, Field } from "react-final-form";
import CloseIcon from "@material-ui/icons/Close";
import FormField from "@root/src/Components/Molecules/FormField";
import FormSelect from "@root/src/Components/Molecules/FormSelect";
import { makeStyles } from "@material-ui/core/styles";
import {
  updateProviderDetails,
  uploadFile,
  updateRoomDetails,
  updateEmail,
  updatePassword,
  addNewUser,
  getAllUsers,
  deleteUser,
  getRoomUserStatus,
  removeUserFromRoom,
  addSharedRoom,
  getAllUsersForRoom,
  updateNotificationSettings,
} from "@root/src/Redux/ActionCreators";
import DeleteIcon from "@material-ui/icons/Delete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GroupIcon from "@material-ui/icons/Group";

const Wrapper = styled(Box)`
  .MuiAccordion-root {
    border: none;
    box-shadow: none;
  }

  .Mui-expanded {
    border: none;
    box-shadow: none;
  }
  .MuiPaper-elevation1 {
    border: none;
    box-shadow: none;
  }
  margin-bottom: 7px;
`;

const StyledAccordian = styled(Accordion)`
  border: none;
  box-shadow: none;

  .MuiAccordion-root {
    border: none;
    box-shadow: none;
  }

  .Mui-expanded {
    border: none;
    box-shadow: none;
  }
  .MuiPaper-elevation1 {
    border: none;
    box-shadow: none;
  }
  label {
    padding-top: 0px;
  }
`;

const useStyles = makeStyles({
  root: {
    boxShadow: "none",
  },
  expanded: {
    boxShadow: "none",
  },
  elevation1: {
    boxShadow: "none",
  },
});

const dialogStyles = makeStyles({
  paper: {  },
});

const StyledLink = styled(Flex)`
  color: ${(props) => props.fontColor};
  font-family: ${(props) => props.fontFamily};
  font-weight: 400;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

const LinkBox = styled(Flex)`
  position: relative;
  color: ${(props) =>
    props.selected
      ? props.theme.color.ThemeColor1
      : props.theme.color.RegularTextColor};
  &:hover {
    color: ${(props) => props.theme.color.ThemeColor1};
  }
  cursor: pointer;
`;

const AccountSettings = ({ theme }) => {
  const dispatch = useDispatch();
  const [selection, setSelection] = useState("settings");
  const {
    ProviderProfile,
    CurrentRoomId,
    Rooms,
    userList,
    roomUserStatus,
    usersForCurrentSharedRoom,
  } = useSelector((state) => state.provider);
  const CurrentRoom = Rooms?.find((item) => item.Id === CurrentRoomId);
  const { Email, role } = useSelector((state) => state.user);
  const { file } = useSelector((state) => state.common);
  const classes = useStyles();
  const fileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openAddUser, setAddUser] = useState(false);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [openSharedRoomPopup, setOpenSharedRoomPopup] = useState(false);
  const [openSharedRoomUsersPopup, setOpenSharedRoomUsersPopup] = useState(
    false
  );

  const [currentSharedRoom, setCurrentSharedRoom] = useState();

  const RoomData = CurrentRoom || Rooms[0];

  const dialogClasses = dialogStyles();

  const AddNewUser = (values) => {
    dispatch(addNewUser(values));
    setAddUser(false);
  };

  const onUserDetailsSubmit = (values) => {
    dispatch(updateProviderDetails(values));
  };

  const onNotificatonUpdate = (values) => {
    dispatch(updateNotificationSettings({ ...ProviderProfile, ...values }));
  };

  const onFileChange = (objFile) => {
    dispatch(uploadFile(objFile));
  };

  const emailChange = (values) => {
    if (values.Email === values.confirmemail) {
      dispatch(updateEmail(values));
      setOpen(false);
    } else {
      return {
        confirmemail: "Emails do not match",
      };
    }
  };

  const passwordChange = (values) => {
    if (values.NewPassword === values.ConfirmPassword) {
      dispatch(updatePassword(values));
      setOpenPassword(false);
    } else {
      return {
        ConfirmPassword: "Passwords do not match",
      };
    }
  };

  useEffect(() => {
    if (file && window.objForm) {
      window.objForm.mutators.setProfilePicture(file);
    }
  }, [file]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  useEffect(() => {
    if (CurrentRoomId && role === "admin")
      dispatch(getRoomUserStatus({ Id: CurrentRoomId }));
  }, [CurrentRoomId]);

  const createSharedRoom = ({ RoomName, UsePasscode, RoomCode }) => {
    dispatch(
      addSharedRoom({
        RoomDetails: {
          RoomName,
          UsePasscode,
          RoomCode,
          ProviderId: ProviderProfile.ProviderId,
        },
        Providers: [ProviderProfile.ProviderId],
      })
    );
    setOpenSharedRoomPopup(false);
  };

  const renderTabs = () => {
    switch (selection) {
      case "csett":
        return (
          <Flex flexDirection="column">
            <Box pt="25px" px="20px">
              <Wrapper
                pb="25px"
                style={{
                  borderBottom: `1px solid ${theme.color.borderCream}`,
                }}
              >
                <StyledAccordian className={classes}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Flex flexDirection="column">
                      <TextType variant="SettingsSectionHeader">
                        Manage Users
                      </TextType>
                      <Box
                        style={{
                          opacity: "0.6",
                        }}
                      >
                        <TextType variant="RegularMedium">
                          Add or remove users to the clinic
                        </TextType>
                      </Box>
                    </Flex>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Flex width="100%">
                      <Form
                        onSubmit={onUserDetailsSubmit}
                        initialValues={ProviderProfile}
                        render={({
                          form,
                          handleSubmit,
                          errors,
                          touched,
                          values,
                        }) => {
                          return (
                            <form
                              style={{
                                width: "100%",
                              }}
                              onSumbit={handleSubmit}
                            >
                              <Flex width="100%" flexDirection="column">
                                <Flex width="100%" flexDirection="column">
                                  <Flex pl="16px" width="100%">
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Name
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Email Address
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Room Name
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Status
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%" />
                                  </Flex>
                                  {userList?.map((item, index) => (
                                    <Flex
                                      bg={
                                        index % 2 !== 0
                                          ? "ThemeColor2"
                                          : "mainBg"
                                      }
                                      pl="16px"
                                      width="100%"
                                      py="10px"
                                      key={item.ProviderId}
                                    >
                                      <Flex width="20%">
                                        <TextType variant="RegularMediumBreak">
                                          {item.Name}
                                        </TextType>
                                      </Flex>
                                      <Flex width="20%">
                                        <TextType variant="RegularMediumBreak">
                                          {item.Email}
                                        </TextType>
                                      </Flex>
                                      <Flex width="20%">
                                        <TextType variant="RegularMediumBreak">
                                          {item.RoomName}
                                        </TextType>
                                      </Flex>
                                      <Flex width="20%">
                                        <TextType variant="RegularMediumBreak">
                                          {item.CurrentRole}
                                        </TextType>
                                      </Flex>
                                      <Flex
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        color="red"
                                        width="20%"
                                        onClick={() =>
                                          dispatch(deleteUser(item))
                                        }
                                      >
                                        <DeleteIcon />
                                      </Flex>
                                    </Flex>
                                  ))}
                                </Flex>
                                <Box mt="16px">
                                  <Button
                                    styleProps={{
                                      background: theme.color.ThemeColor1,
                                      fontFamily: theme.fontFamily,
                                      lineHeight: "18.2px",
                                      textTransform: "capitalize",
                                      height: "46px",
                                      boxShadow: "none",
                                    }}
                                    onClick={() => setAddUser(true)}
                                    buttonType="button"
                                  >
                                    Add Users
                                  </Button>
                                </Box>
                              </Flex>
                            </form>
                          );
                        }}
                      />
                    </Flex>
                  </AccordionDetails>
                </StyledAccordian>
              </Wrapper>
              <Wrapper
                pb="25px"
                style={{
                  borderBottom: `1px solid ${theme.color.borderCream}`,
                }}
              >
                <StyledAccordian className={classes}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Flex flexDirection="column">
                      <TextType variant="SettingsSectionHeader">
                        My Room Access
                      </TextType>
                      <Box
                        style={{
                          opacity: "0.6",
                        }}
                      >
                        <TextType variant="RegularMedium">
                          Grant Access to your Room
                        </TextType>
                      </Box>
                    </Flex>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Flex width="100%">
                      <Form
                        onSubmit={onUserDetailsSubmit}
                        initialValues={ProviderProfile}
                        render={({
                          form,
                          handleSubmit,
                          errors,
                          touched,
                          values,
                        }) => {
                          return (
                            <form
                              style={{
                                width: "100%",
                              }}
                              onSumbit={handleSubmit}
                            >
                              <Flex width="100%" flexDirection="column">
                                <Flex width="100%" flexDirection="column">
                                  <Flex pl="16px" width="100%">
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Name
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Email Address
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Room Name
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Status
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%" />
                                  </Flex>
                                  {roomUserStatus?.map((item, index) => (
                                    <Flex
                                      bg={
                                        index % 2 !== 0
                                          ? "ThemeColor2"
                                          : "mainBg"
                                      }
                                      pl="16px"
                                      width="100%"
                                      py="10px"
                                      key={item.ProviderId}
                                    >
                                      <Flex width="20%">
                                        <TextType variant="RegularMediumBreak">
                                          {item.Name}
                                        </TextType>
                                      </Flex>
                                      <Flex width="20%">
                                        <TextType variant="RegularMediumBreak">
                                          {item.Email}
                                        </TextType>
                                      </Flex>
                                      <Flex width="20%">
                                        <TextType variant="RegularMediumBreak">
                                          {item.RoomName}
                                        </TextType>
                                      </Flex>
                                      <Flex width="20%">
                                        <Switch
                                          checked={item.Allowed}
                                          onChange={() =>
                                            dispatch(
                                              removeUserFromRoom({
                                                RoomId: CurrentRoomId,
                                                ProviderId: item.ProviderId,
                                              })
                                            )
                                          }
                                        />
                                      </Flex>
                                    </Flex>
                                  ))}
                                </Flex>
                              </Flex>
                            </form>
                          );
                        }}
                      />
                    </Flex>
                  </AccordionDetails>
                </StyledAccordian>
              </Wrapper>
              <Wrapper
                pb="25px"
                style={{
                  borderBottom: `1px solid ${theme.color.borderCream}`,
                }}
              >
                <StyledAccordian className={classes}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Flex flexDirection="column">
                      <TextType variant="SettingsSectionHeader">
                        Shared Room
                      </TextType>
                      <Box
                        style={{
                          opacity: "0.6",
                        }}
                      >
                        <TextType variant="RegularMedium">
                          Manage your clinic's shared rooms
                        </TextType>
                      </Box>
                    </Flex>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Flex width="100%">
                      <Form
                        onSubmit={createSharedRoom}
                        render={({
                          form,
                          handleSubmit,
                          errors,
                          touched,
                          values,
                        }) => {
                          return (
                            <form
                              style={{
                                width: "100%",
                              }}
                              onSumbit={handleSubmit}
                            >
                              <Flex width="100%" flexDirection="column">
                                <Flex width="100%" flexDirection="column">
                                  <Flex pl="16px" width="100%">
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Room Name
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%">
                                      <TextType variant="tableHeader">
                                        Status
                                      </TextType>
                                    </Flex>
                                    <Flex width="20%">
                                      <TextType variant="tableHeader"></TextType>
                                    </Flex>
                                    <Flex width="20%">
                                      <TextType variant="tableHeader"></TextType>
                                    </Flex>
                                    <Flex width="20%" />
                                  </Flex>
                                  {Rooms?.filter(
                                    (item) => item.Type === "Shared"
                                  )?.map((item, index) => (
                                    <Flex
                                      bg={
                                        index % 2 !== 0
                                          ? "ThemeColor2"
                                          : "mainBg"
                                      }
                                      pl="16px"
                                      width="100%"
                                      py="10px"
                                      key={item.Id}
                                    >
                                      <Flex width="20%">
                                        <TextType variant="RegularMediumBreak">
                                          {item.RoomName}
                                        </TextType>
                                      </Flex>
                                      <Flex width="20%">
                                        <TextType variant="RegularMediumBreak">
                                          Admin
                                        </TextType>
                                      </Flex>
                                      <Flex
                                        onClick={() => {
                                          dispatch(
                                            getAllUsersForRoom({
                                              Id: item.Id,
                                            })
                                          );
                                          setOpenSharedRoomUsersPopup(true);
                                          setCurrentSharedRoom(item);
                                        }}
                                        width="20%"
                                      >
                                        <TextType variant="RegularMediumBreak">
                                          <LinkBox theme={theme}>
                                            <GroupIcon
                                              style={{
                                                fontSize: "25px",
                                              }}
                                            />
                                            <Box pt="3px">Users</Box>
                                          </LinkBox>
                                        </TextType>
                                      </Flex>
                                    </Flex>
                                  ))}
                                </Flex>
                              </Flex>
                              <Flex pt="16px" mt="8px" width="100%">
                                <Flex pt="8px" width="35%" />
                                <Flex width="65%">
                                  <Button
                                    styleProps={{
                                      background: theme.color.ThemeColor1,
                                      fontFamily: theme.fontFamily,
                                      lineHeight: "18.2px",
                                      textTransform: "capitalize",
                                      height: "46px",
                                      boxShadow: "none",
                                    }}
                                    onClick={() => setOpenSharedRoomPopup(true)}
                                    buttonType="button"
                                  >
                                    Create new shared room
                                  </Button>
                                </Flex>
                              </Flex>
                            </form>
                          );
                        }}
                      />
                    </Flex>
                  </AccordionDetails>
                </StyledAccordian>
              </Wrapper>
            </Box>
          </Flex>
        );
      case "notif":
        return (
          <Flex pl="20px" pr="140px" flexDirection="column">
            <Form
              onSubmit={onNotificatonUpdate}
              initialValues={ProviderProfile}
              render={({ form, handleSubmit, errors, touched, values }) => {
                return (
                  <form
                    style={{
                      width: "100%",
                    }}
                    onSumbit={handleSubmit}
                  >
                    {console.log("values", values)}
                    <Flex width="100%">
                      <Flex pt="8px" width="35%">
                        <TextType variant="link2">Email Alert</TextType>
                      </Flex>
                      <Flex width="65%">
                        <Field
                          name="AllowEmail"
                          render={({ input }) => {
                            return <Switch {...input} checked={input.value} />;
                          }}
                        />
                      </Flex>
                    </Flex>
                    <Flex mt="16px" width="100%">
                      <Flex pt="8px" width="35%">
                        <TextType variant="link2">SMS Alert</TextType>
                      </Flex>
                      <Flex width="65%">
                        <Field
                          name="AllowSMS"
                          render={({ input }) => {
                            return <Switch {...input} checked={input.value} />;
                          }}
                        />
                      </Flex>
                    </Flex>
                    {/* {values.EmailAlert && (
                      <Flex
                        style={{
                          borderBottom: `1px solid ${theme.color.borderCream}`,
                        }}
                        mt="16px"
                        width="100%"
                      >
                        <Flex pt="8px" width="35%">
                          <TextType variant="link2">Send To</TextType>
                        </Flex>
                        <Flex width="65%">
                          <FormField
                            errors={errors}
                            touched={touched}
                            fieldName="SendTo"
                            placeholder=""
                          />
                        </Flex>
                      </Flex>
                    )} */}
                    <Flex pt="16px" mt="8px" width="100%">
                      <Flex pt="8px" width="35%" />
                      <Flex width="65%">
                        <Button
                          styleProps={{
                            background: theme.color.ThemeColor1,
                            fontFamily: theme.fontFamily,
                            lineHeight: "18.2px",
                            textTransform: "capitalize",
                            height: "46px",
                            boxShadow: "none",
                          }}
                          onClick={form.submit}
                          buttonType="button"
                        >
                          Update
                        </Button>
                      </Flex>
                    </Flex>
                  </form>
                );
              }}
            />
          </Flex>
        );
      case "settings":
      default:
        return (
          <Flex flexDirection="column">
            <Box pt="25px" px="20px">
              <Wrapper
                pb="25px"
                style={{
                  borderBottom: `1px solid ${theme.color.borderCream}`,
                }}
              >
                <StyledAccordian className={classes}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Flex flexDirection="column">
                      <TextType variant="SettingsSectionHeader">
                        Personal Info
                      </TextType>
                      <Box
                        style={{
                          opacity: "0.6",
                        }}
                      >
                        <TextType variant="RegularMedium">
                          Change your personal information.
                        </TextType>
                      </Box>
                    </Flex>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Flex width="100%">
                      <Form
                        onSubmit={onUserDetailsSubmit}
                        initialValues={ProviderProfile}
                        render={({
                          form,
                          handleSubmit,
                          errors,
                          touched,
                          values,
                        }) => {
                          return (
                            <form
                              style={{
                                width: "100%",
                                paddingRight: "120px",
                              }}
                              onSumbit={handleSubmit}
                            >
                              {console.log("values", values)}
                              <Flex width="100%">
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">Title</TextType>
                                </Flex>
                                <Flex width="65%">
                                  <FormSelect
                                    errors={errors}
                                    touched={touched}
                                    fieldName="Salutation"
                                    placeholder=""
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
                                </Flex>
                              </Flex>

                              <Flex width="100%">
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">
                                    First Name
                                  </TextType>
                                </Flex>
                                <Flex width="65%">
                                  <FormField
                                    errors={errors}
                                    touched={touched}
                                    fieldName="FirstName"
                                    placeholder=""
                                  />
                                </Flex>
                              </Flex>

                              <Flex width="100%">
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">Last Name</TextType>
                                </Flex>
                                <Flex width="65%">
                                  <FormField
                                    errors={errors}
                                    touched={touched}
                                    fieldName="LastName"
                                    placeholder=""
                                  />
                                </Flex>
                              </Flex>

                              <Flex width="100%">
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">
                                    Display Name
                                  </TextType>
                                </Flex>
                                <Flex width="65%">
                                  <FormField
                                    errors={errors}
                                    touched={touched}
                                    fieldName="DisplayName"
                                    placeholder=""
                                  />
                                </Flex>
                              </Flex>

                              <Flex width="100%">
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">
                                    Speciality
                                  </TextType>
                                </Flex>
                                <Flex width="65%">
                                  <FormField
                                    errors={errors}
                                    touched={touched}
                                    fieldName="Speciality"
                                    placeholder=""
                                  />
                                </Flex>
                              </Flex>

                              <Flex width="100%">
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">
                                    Medical Licence Number
                                  </TextType>
                                </Flex>
                                <Flex width="65%">
                                  <FormField
                                    errors={errors}
                                    touched={touched}
                                    fieldName="MedicalLicenceNumber"
                                    placeholder=""
                                  />
                                </Flex>
                              </Flex>
                              <Flex width="100%">
                                <Flex pt="8px" width="35%" />
                                <Flex width="65%">
                                  <Button
                                    styleProps={{
                                      background: theme.color.ThemeColor1,
                                      fontFamily: theme.fontFamily,
                                      lineHeight: "18.2px",
                                      textTransform: "capitalize",
                                      height: "46px",
                                      boxShadow: "none",
                                    }}
                                    onClick={form.submit}
                                    buttonType="button"
                                  >
                                    Update
                                  </Button>
                                </Flex>
                              </Flex>
                            </form>
                          );
                        }}
                      />
                    </Flex>
                  </AccordionDetails>
                </StyledAccordian>
              </Wrapper>
              <Wrapper
                pb="25px"
                style={{
                  borderBottom: `1px solid ${theme.color.borderCream}`,
                }}
              >
                <StyledAccordian className={classes}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Flex flexDirection="column">
                      <TextType variant="SettingsSectionHeader">
                        Room Settings
                      </TextType>
                      <Box
                        style={{
                          opacity: "0.6",
                        }}
                      >
                        <TextType variant="RegularMedium">
                          View and edit your room settings.
                        </TextType>
                      </Box>
                    </Flex>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Flex width="100%">
                      <Form
                        onSubmit={(allValues) =>
                          dispatch(
                            updateRoomDetails({
                              ...RoomData,
                              ...allValues,
                              Path: `/room/${RoomData.Id}/${allValues.RoomName}`,
                            })
                          )
                        }
                        initialValues={
                          RoomData
                            ? {
                                ...RoomData,
                                DashboardCamEnabled:
                                  ProviderProfile.DashboardCamEnabled,
                                ProfilePicture:
                                  ProviderProfile.ProfilePicture ||
                                  (file && file[0]?.path),
                              }
                            : {
                                ProfilePicture:
                                  file[0]?.path || ProviderProfile?.ProfilePicture,
                                DashboardCamEnabled:
                                  ProviderProfile.DashboardCamEnabled,
                              }
                        }
                        mutators={{
                          setProfilePicture: (args, state, utils) => {
                            utils.changeValue(
                              state,
                              "ProfilePicture",
                              () => args[0].path
                            );
                          },
                        }}
                        render={({
                          form,
                          handleSubmit,
                          errors,
                          touched,
                          values,
                        }) => {
                          window.objForm = form;
                          return (
                            <form
                              style={{
                                width: "100%",
                                paddingRight: "120px",
                              }}
                              onSumbit={handleSubmit}
                            >
                              <Flex mb="16px" width="100%">
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">
                                    Profile Pictue
                                  </TextType>
                                </Flex>
                                <Flex
                                  flexDirection="column"
                                  alignItems="center"
                                  width="65%"
                                >
                                  <input
                                    type="file"
                                    ref={fileRef}
                                    style={{
                                      display: "none",
                                    }}
                                    onChange={(e) =>
                                      onFileChange(e.target.files)
                                    }
                                  />
                                  <Field
                                    name="ProfilePicture"
                                    render={({ input }) => {
                                      return <input {...input} type="hidden" />;
                                    }}
                                  />
                                  <Box
                                    width="155px"
                                    height="155px"
                                    r="50%"
                                    style={{
                                      cursor: "pointer",
                                      border: `1px solid ${theme.color.fillGrey}`,
                                    }}
                                    p="2px"
                                    onClick={(e) => {
                                      fileRef.current.click();
                                    }}
                                  >
                                    <img
                                      alt="Profilepic"
                                      height="100%"
                                      width="100%"
                                      style={{
                                        borderRadius: "50%",
                                      }}
                                      src={
                                        values?.ProfilePicture || "/avatar.jpg"
                                      }
                                    />
                                  </Box>
                                  <Box mt="5px">
                                    <TextType variant="RegularMedium">
                                      Click on image to upload.
                                    </TextType>
                                  </Box>
                                </Flex>
                              </Flex>

                              <Flex
                                style={{
                                  borderBottom: `1px solid ${theme.color.borderCream}`,
                                }}
                                width="100%"
                              >
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">Room Name</TextType>
                                </Flex>
                                <Flex width="65%">
                                  <FormField
                                    errors={errors}
                                    touched={touched}
                                    fieldName="RoomName"
                                    placeholder=""
                                  />
                                </Flex>
                              </Flex>
                              <Flex mt="8px" width="100%">
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">
                                    Camera preview in dashboard
                                  </TextType>
                                </Flex>
                                <Flex width="65%">
                                  <Field
                                    name="DashboardCamEnabled"
                                    render={({ input }) => {
                                      console.log("input", input);
                                      return (
                                        <Switch
                                          {...input}
                                          checked={input.value}
                                        />
                                      );
                                    }}
                                  />
                                </Flex>
                              </Flex>
                              <Flex width="100%">
                                <Flex pt="8px" width="35%">
                                  <TextType variant="link2">
                                    Room Passcode
                                  </TextType>
                                </Flex>
                                <Flex flexDirection="column" width="65%">
                                  <Field
                                    name="UsePasscode"
                                    render={({ input }) => {
                                      return (
                                        <Switch
                                          {...input}
                                          checked={input.value}
                                        />
                                      );
                                    }}
                                  />
                                  {values.UsePasscode && (
                                    <Box mt="8px">
                                      <FormField
                                        errors={errors}
                                        touched={touched}
                                        fieldName="RoomCode"
                                        fieldType="password"
                                        placeholder=""
                                      />
                                    </Box>
                                  )}
                                </Flex>
                              </Flex>
                              <Flex mt="8px" width="100%">
                                <Flex pt="8px" width="35%" />
                                <Flex width="65%">
                                  <Button
                                    styleProps={{
                                      background: theme.color.ThemeColor1,
                                      fontFamily: theme.fontFamily,
                                      lineHeight: "18.2px",
                                      textTransform: "capitalize",
                                      height: "46px",
                                      boxShadow: "none",
                                    }}
                                    onClick={form.submit}
                                    buttonType="button"
                                  >
                                    Update
                                  </Button>
                                </Flex>
                              </Flex>
                            </form>
                          );
                        }}
                      />
                    </Flex>
                  </AccordionDetails>
                </StyledAccordian>
              </Wrapper>
              <Wrapper
                pb="25px"
                style={{
                  borderBottom: `1px solid ${theme.color.borderCream}`,
                }}
              >
                <StyledAccordian className={classes}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Flex flexDirection="column">
                      <TextType variant="SettingsSectionHeader">
                        Login Credentials
                      </TextType>
                      <Box
                        style={{
                          opacity: "0.6",
                        }}
                      >
                        <TextType variant="RegularMedium">
                          Change Email,Password
                        </TextType>
                      </Box>
                    </Flex>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Flex flexDirection="column" width="100%">
                      <Flex mt="16px" width="100%">
                        <Flex pt="8px" width="35%">
                          <TextType variant="link2">Email</TextType>
                        </Flex>
                        <Flex flexDirection="column" width="65%">
                          <TextType variant="RegularMedium">{Email}</TextType>
                          <StyledLink
                            fontColor={theme.color.ThemeColor1}
                            hoverColor={theme.color.linkHoverColor}
                            fontFamily={theme.fontFamily}
                            onClick={() => setOpen(true)}
                          >
                            Change
                          </StyledLink>
                          <Flex />
                        </Flex>
                      </Flex>
                      <Flex mt="16px" width="100%">
                        <Flex pt="8px" width="35%">
                          <TextType variant="link2">Password</TextType>
                        </Flex>
                        <Flex flexDirection="column" width="65%">
                          <TextType variant="RegularMedium">*******</TextType>
                          <StyledLink
                            fontColor={theme.color.ThemeColor1}
                            hoverColor={theme.color.linkHoverColor}
                            fontFamily={theme.fontFamily}
                            onClick={() => setOpenPassword(true)}
                          >
                            Change
                          </StyledLink>
                          <Flex />
                        </Flex>
                      </Flex>
                    </Flex>
                  </AccordionDetails>
                </StyledAccordian>
              </Wrapper>
            </Box>
          </Flex>
        );
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      px={["10px", "20px", "20px", "20px"]}
      pt="40px"
      style={{
        overflowY: "scroll",
      }}
    >
      <Box
        mb="30px"
        style={{
          cursor: "pointer",
        }}
        onClick={() => dispatch(push("/account/dashboard"))}
      >
        <TextType variant="link2">← Back To Dashboard</TextType>
      </Box>
      <Flex
        maxWidth="768px"
        pb="25px"
        px={["10px", "25px", "25px", "25px"]}
        flexDirection="column"
        width={["100%", "100%", "auto", "auto"]}
        minWidth={["auto", "auto", "768px", "768px"]}
        mb="20px"
      >
        <Flex
          style={{
            cursor: "pointer",
            overflowX: "hidden",
          }}
          width="100%"
          height="55px"
        >
          <Flex
            bg={selection === "settings" ? "ThemeColor2" : "mainBg"}
            onClick={() => setSelection("settings")}
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            width="105.938px"
            style={{
              borderTopRightRadius: "4px",
              borderTopLeftRadius: "4px",
            }}
          >
            <TextType variant="tabHeader">Settings</TextType>
          </Flex>
          <Flex
            bg={selection === "notif" ? "ThemeColor2" : "mainBg"}
            onClick={() => setSelection("notif")}
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            width="139.875px"
            style={{
              borderTopRightRadius: "4px",
              borderTopLeftRadius: "4px",
            }}
          >
            <TextType variant="tabHeader">Notifications</TextType>
          </Flex>
          {role === "admin" && (
            <Flex
              bg={selection === "csett" ? "ThemeColor2" : "mainBg"}
              onClick={() => setSelection("csett")}
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              width="153.738px"
              style={{
                borderTopRightRadius: "4px",
                borderTopLeftRadius: "4px",
              }}
            >
              <TextType variant="tabHeader">Clinical Settings</TextType>
            </Flex>
          )}
        </Flex>
        <Flex
          flexDirection="column"
          bg="ThemeColor2"
          width="100%"
          minHeight="418px"
          pt="15px"
        >
          {renderTabs()}
        </Flex>
      </Flex>
      <Form
        onSubmit={emailChange}
        render={({ form, handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            {console.log(("errors", errors))}
            <Dialog
              open={open}
              variant="outlined"
              color="primary"
              scrimClickAction=""
              escapeKeyAction=""
              fullWidth="lg"
            >
              <Flex flexDirection="column" width="100%" height="100%">
                <Flex
                  color="ThemeColor2"
                  py="20px"
                  width="100%"
                  position="relative"
                  bg="ThemeColor1"
                  px="16px"
                >
                  <Box width="100%">
                    <TextType variant="PopupTitle">Email Address</TextType>
                  </Box>
                  <Box
                    mt="10px"
                    mr="5px"
                    position="absolute"
                    style={{
                      top: 0,
                      right: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => setOpen(false)}
                  >
                    <CloseIcon
                      style={{
                        fontSize: "35px",
                      }}
                    />
                  </Box>
                </Flex>
                <DialogContent>
                  <Flex
                    flex="1"
                    minHeight="200px"
                    flexDirection="column"
                    py="12px"
                  >
                    <Flex width="100%">
                      <Flex pt="8px" width="35%">
                        <TextType variant="link2">Current Password</TextType>
                      </Flex>
                      <Flex width="65%">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldType="Password"
                          fieldName="password"
                          placeholder=""
                        />
                      </Flex>
                    </Flex>
                    <Flex width="100%">
                      <Flex pt="8px" width="35%">
                        <TextType variant="link2">New Email</TextType>
                      </Flex>
                      <Flex width="65%">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldName="Email"
                          placeholder=""
                        />
                      </Flex>
                    </Flex>
                    <Flex width="100%">
                      <Flex pt="8px" width="35%">
                        <TextType variant="link2">Confirm New Email</TextType>
                      </Flex>
                      <Flex width="65%">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldName="confirmemail"
                          placeholder=""
                        />
                      </Flex>
                    </Flex>
                    <Flex mt="8px" width="100%">
                      <Flex pt="8px" width="35%" />
                      <Flex flexDirection="row-reverse" width="65%">
                        <Button
                          styleProps={{
                            background: theme.color.ThemeColor1,
                            fontFamily: theme.fontFamily,
                            lineHeight: "18.2px",
                            textTransform: "capitalize",
                            height: "46px",
                            boxShadow: "none",
                          }}
                          onClick={form.submit}
                          buttonType="button"
                        >
                          Update
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </DialogContent>
              </Flex>
            </Dialog>
          </form>
        )}
      />
      <Form
        onSubmit={passwordChange}
        render={({ form, handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <Dialog
              open={openPassword}
              variant="outlined"
              color="primary"
              scrimClickAction=""
              escapeKeyAction=""
              fullWidth="lg"
            >
              <Flex flexDirection="column" width="100%" height="100%">
                <Flex
                  color="ThemeColor2"
                  py="20px"
                  width="100%"
                  position="relative"
                  bg="ThemeColor1"
                  px="16px"
                >
                  <Box width="100%">
                    <TextType variant="PopupTitle">Password</TextType>
                  </Box>
                  <Box
                    mt="10px"
                    mr="5px"
                    position="absolute"
                    style={{
                      top: 0,
                      right: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => setOpenPassword(false)}
                  >
                    <CloseIcon
                      style={{
                        fontSize: "35px",
                      }}
                    />
                  </Box>
                </Flex>
                <DialogContent>
                  <Flex
                    flex="1"
                    minHeight="200px"
                    flexDirection="column"
                    py="12px"
                  >
                    <Flex width="100%">
                      <Flex pt="8px" width="35%">
                        <TextType variant="link2">Current Password</TextType>
                      </Flex>
                      <Flex width="65%">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldType="Password"
                          fieldName="password"
                          placeholder=""
                        />
                      </Flex>
                    </Flex>
                    <Flex width="100%">
                      <Flex pt="8px" width="35%">
                        <TextType variant="link2">New Password</TextType>
                      </Flex>
                      <Flex width="65%">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldType="password"
                          fieldName="NewPassword"
                          placeholder=""
                        />
                      </Flex>
                    </Flex>
                    <Flex width="100%">
                      <Flex pt="8px" width="35%">
                        <TextType variant="link2">
                          Confirm New Password
                        </TextType>
                      </Flex>
                      <Flex width="65%">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldType="password"
                          fieldName="ConfirmPassword"
                          placeholder=""
                        />
                      </Flex>
                    </Flex>
                    <Flex mt="8px" width="100%">
                      <Flex pt="8px" width="35%" />
                      <Flex flexDirection="row-reverse" width="65%">
                        <Button
                          styleProps={{
                            background: theme.color.ThemeColor1,
                            fontFamily: theme.fontFamily,
                            lineHeight: "18.2px",
                            textTransform: "capitalize",
                            height: "46px",
                            boxShadow: "none",
                          }}
                          onClick={form.submit}
                          buttonType="button"
                        >
                          Update
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </DialogContent>
              </Flex>
            </Dialog>
          </form>
        )}
      />
      <Form
        onSubmit={AddNewUser}
        render={({ form, handleSubmit, errors, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <Dialog
              open={openAddUser}
              variant="outlined"
              color="primary"
              scrimClickAction=""
              escapeKeyAction=""
              classes={{ paper: dialogClasses.paper }}
            >
              {console.log("errors", errors)}
              <Flex flexDirection="column" width="100%" height="100%">
                <Flex
                  color="ThemeColor2"
                  py="20px"
                  width="100%"
                  position="relative"
                  bg="ThemeColor1"
                  px="16px"
                >
                  <Box width="100%">
                    <TextType variant="PopupTitle">
                      Add users to your Clinic account
                    </TextType>
                  </Box>
                  <Box
                    mt="10px"
                    mr="5px"
                    position="absolute"
                    style={{
                      top: 0,
                      right: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => setAddUser(false)}
                  >
                    <CloseIcon
                      style={{
                        fontSize: "35px",
                      }}
                    />
                  </Box>
                </Flex>
                <DialogContent>
                  <Flex
                    flex="1"
                    minHeight="200px"
                    flexDirection="column"
                    py="12px"
                  >
                    <Flex flexDirection={["column", "column", "row", "row"]}>
                      <Box mr="8px">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldName="Email"
                          placeholder="Email"
                        />
                      </Box>
                      <Box mr="8px" width={["97%", "97%", "78px", "78px"]}>
                        <FormSelect
                          errors={errors}
                          touched={touched}
                          fieldName="Salutation"
                          placeholder="Title"
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
                      </Box>
                      <Box mr="8px">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldName="FirstName"
                          placeholder="First Name"
                        />
                      </Box>
                      <Box mr="8px">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldName="LastName"
                          placeholder="Last Name"
                        />
                      </Box>
                      <Box mr="8px">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldName="RoomName"
                          placeholder="Room Name"
                        />
                      </Box>
                    </Flex>
                    <Flex flexDirection="row-reverse">
                      <Flex width="300px">
                        <Button
                          styleProps={{
                            background: theme.color.ThemeColor1,
                            fontFamily: theme.fontFamily,
                            lineHeight: "18.2px",
                            textTransform: "capitalize",
                            height: "46px",
                            boxShadow: "none",
                            width: "100%",
                          }}
                          onClick={form.submit}
                          buttonType="submit"
                        >
                          Update
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </DialogContent>
              </Flex>
            </Dialog>
          </form>
        )}
      />
      <Form
        onSubmit={createSharedRoom}
        render={({ form, handleSubmit, errors, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <Dialog
              open={openSharedRoomPopup}
              variant="outlined"
              color="primary"
              scrimClickAction=""
              escapeKeyAction=""
              fullWidth
              maxWidth="sm"
            >
              <Flex
                color="black"
                py="20px"
                width="100%"
                position="relative"
                bg="ThemeColor2"
                px="16px"
              >
                <Box width="100%">
                  <TextType variant="PopupTitle">Create Shared Room</TextType>
                </Box>
                <Box
                  mt="5px"
                  mr="5px"
                  position="absolute"
                  style={{
                    top: 0,
                    right: 0,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenSharedRoomPopup(false);
                  }}
                >
                  <CloseIcon />
                </Box>
              </Flex>
              <DialogContent>
                <Flex
                  flex="1"
                  minHeight="200px"
                  flexDirection="column"
                  py="12px"
                >
                  <Box width="100%">
                    <TextType variant="ControlHeader">Room Name</TextType>
                    <FormField
                      errors={errors}
                      touched={touched}
                      fieldName="RoomName"
                      placeholder="Enter Room Name"
                    />
                  </Box>
                  <Flex flexDirection="column" width="65%">
                    <Field
                      name="UsePasscode"
                      render={({ input }) => {
                        return (
                          <FormControlLabel
                            control={
                              <Switch {...input} checked={input.value} />
                            }
                            label="Room passcode"
                          />
                        );
                      }}
                    />
                    {values.UsePasscode && (
                      <Box mt="8px">
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldName="RoomCode"
                          fieldType="password"
                          placeholder=""
                        />
                      </Box>
                    )}
                    <Box mt="16px">
                      <Button
                        styleProps={{
                          background: theme.color.ThemeColor1,
                          fontFamily: theme.fontFamily,
                          lineHeight: "18.2px",
                          textTransform: "capitalize",
                          height: "46px",
                          boxShadow: "none",
                        }}
                        onClick={() => form.submit()}
                        buttonType="button"
                      >
                        Create Room
                      </Button>
                    </Box>
                  </Flex>
                </Flex>
              </DialogContent>
            </Dialog>
          </form>
        )}
      />
      <Dialog
        open={openSharedRoomUsersPopup}
        variant="outlined"
        color="primary"
        scrimClickAction=""
        escapeKeyAction=""
        fullWidth
        maxWidth="sm"
      >
        <Flex
          color="black"
          py="20px"
          width="100%"
          position="relative"
          bg="ThemeColor2"
          px="16px"
        >
          <Box width="100%">
            <TextType variant="PopupTitle">Manage shared room users</TextType>
          </Box>
          <Box
            mt="5px"
            mr="5px"
            position="absolute"
            style={{
              top: 0,
              right: 0,
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenSharedRoomUsersPopup(false);
            }}
          >
            <CloseIcon />
          </Box>
        </Flex>
        <DialogContent>
          <Flex flex="1" minHeight="200px" flexDirection="column" py="12px">
            <Flex width="100%" flexDirection="column">
              <Flex pl="16px" width="100%">
                <Flex width="20%">
                  <TextType variant="tableHeader">Name</TextType>
                </Flex>
                <Flex width="20%">
                  <TextType variant="tableHeader">Email Address</TextType>
                </Flex>
                <Flex width="20%">
                  <TextType variant="tableHeader">Room Name</TextType>
                </Flex>
                <Flex width="20%">
                  <TextType variant="tableHeader">Status</TextType>
                </Flex>
                <Flex width="20%" />
              </Flex>
              {usersForCurrentSharedRoom
                ?.filter(
                  (item) => item.ProviderId !== ProviderProfile?.ProviderId
                )
                ?.map((item, index) => (
                  <Flex
                    bg={index % 2 !== 0 ? "ThemeColor2" : "mainBg"}
                    pl="16px"
                    width="100%"
                    py="10px"
                    key={item.ProviderId}
                  >
                    <Flex width="20%">
                      <TextType variant="RegularMediumBreak">
                        {item.Name}
                      </TextType>
                    </Flex>
                    <Flex width="20%">
                      <TextType variant="RegularMediumBreak">
                        {item.Email}
                      </TextType>
                    </Flex>
                    <Flex width="20%">
                      <TextType variant="RegularMediumBreak">
                        {item.RoomName}
                      </TextType>
                    </Flex>
                    <Flex width="20%">
                      <Switch
                        checked={item.Allowed}
                        onChange={() =>
                          dispatch(
                            removeUserFromRoom({
                              RoomId: currentSharedRoom?.Id,
                              ProviderId: item.ProviderId,
                            })
                          )
                        }
                      />
                    </Flex>
                  </Flex>
                ))}
            </Flex>
          </Flex>
        </DialogContent>
      </Dialog>
    </Flex>
  );
};

export default withTheme(AccountSettings);
