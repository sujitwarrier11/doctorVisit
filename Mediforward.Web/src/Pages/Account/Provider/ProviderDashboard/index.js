import React, { useState, useEffect, useRef } from "react";
import {
  Flex,
  TextType,
  Box,
  TextField,
  Button,
  Menu,
  Select,
} from "@root/src/Components/Atoms";
import Card from "@root/src/Components/Molecules/Cards";
import withTheme from "@root/src/Components/Atoms/withTheme";
import { useDispatch, useSelector } from "react-redux";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import Breakpoints from "@root/src/Components/Atoms/Breakpoints";
import SettingsIcon from "@material-ui/icons/Settings";
import MailIcon from "@material-ui/icons/Mail";
import VideoPreview from "@root/src/Components/Molecules/VideoPreview";
import {
  setCurrentRoom,
  getEmailBody,
  sendInviteEmail,
  getSmsBody,
  sendSMS,
} from "@root/src/Redux/ActionCreators";
import { push } from "connected-react-router";
import MenuItem from "@material-ui/core/MenuItem";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SmsIcon from "@material-ui/icons/Sms";
import { useTranslation, Trans } from "@root/src/Translation";

const Dashboard = ({ theme, setImage, objConnection, profileImage }) => {
  const {
    ProviderProfile,
    Rooms,
    CurrentRoomId,
    emailBody,
    smsBody,
  } = useSelector((state) => state.provider);
  const CurrentRoom = Rooms?.find((item) => item.Id === CurrentRoomId);
  const inputRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const [showEmailPopUp, setShowEmail] = useState(false);
  const [showEmailMessage, setShowEmailMessage] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [smsNumbers, setNumbers] = useState("");
  const [openSMS, setOpenSMS] = useState(false);
  const t = useTranslation();
  return (
    <Flex
      position="relative"
      width="100%"
      height="100%"
      pt={["20px", "20px", "40px", "40px"]}
      px={["15px", "15px", "20px", "20px"]}
      flexDirection="column"
    >
      <Breakpoints lg md>
        <VideoPreview
          style={{
            right: 0,
            top: 0,
          }}
          zIndex="2"
          checkVideoPermission
          capturePhoto={(pic) => setImage(pic)}
        />
      </Breakpoints>
      {ProviderProfile && (
        <Card
          maxWidth="535px"
          pt={["15px", "15px", "35px", "35px"]}
          pb="25px"
          px="25px"
          flexDirection="column"
          width={["100%", "100%", "auto", "auto"]}
          minWidth={["auto", "auto", "530px", "530px"]}
          mb="20px"
        >
          <Breakpoints md lg>
            <Flex mb="10px">
              <TextType variant="MainTitle">{`Welcome, ${ProviderProfile.Salutation} ${ProviderProfile.FirstName}!`}</TextType>
            </Flex>
            <Flex mb="40px">
              <TextType variant="SubHeader">
                <Trans langKey="roomLinkMessage" />
              </TextType>
            </Flex>
          </Breakpoints>
          <Breakpoints sm xs>
            <Flex>
              <Box width="70%">
                <Breakpoints md lg>
                  <Flex mb="10px">
                    <TextType variant="MainTitle">{`Welcome, ${ProviderProfile.Salutation} ${ProviderProfile.FirstName}!`}</TextType>
                  </Flex>
                </Breakpoints>
                <Breakpoints xs sm>
                  <Flex mb="10px">
                    <TextType variant="MainTitle">Welcome!</TextType>
                  </Flex>
                </Breakpoints>
                <Flex mb="40px">
                  <TextType variant="SubHeader">
                    <Trans langKey="roomLinkMessage" />
                  </TextType>
                </Flex>
              </Box>
              <Flex flexDirection="row-reverse" width="30%">
                <VideoPreview isNotAbsoulte checkVideoPermission />
              </Flex>
            </Flex>
          </Breakpoints>
          {Rooms && Rooms.length > 0 && (
            <Flex
              width="100%"
              flexDirection={["column", "column", "row", "row"]}
            >
              <Flex width="100%">
                <Box width="100%" maxWidth={["100%", "100%", "295px", "295px"]}>
                  {Rooms?.length === 1 ? (
                    <TextField
                      value={`${window.location.origin}${CurrentRoom?.Path}`}
                      disabled
                      fullWidth
                      inputRef={inputRef}
                      bg={theme.color.mainBg}
                      errorColor={theme.color.errorBorder}
                      fontFamily={theme.fontFamily}
                      InputProps={{
                        disableUnderline: true,
                        disableLabel: true,
                      }}
                      behaviourProps={{
                        isRemoveSecondaryLabelDiv: true,
                      }}
                    />
                  ) : (
                    <Select
                      br="5px"
                      fullWidth
                      label="Room"
                      bg={theme.color.mainBg}
                      errorColor={theme.color.errorBorder}
                      InputLabelProps={{ shrink: true }}
                      focusColor={theme.color.RegularTextColor}
                      InputProps={{
                        disableUnderline: true,
                        disableLabel: true,
                        shrink: true,
                      }}
                      SelectDisplayProps={{
                        color: theme.color.RegularTextColor,
                      }}
                      behaviourProps={{
                        isRemoveSecondaryLabelDiv: true,
                      }}
                      value={CurrentRoomId}
                      onChange={(e) =>
                        dispatch(setCurrentRoom({ Id: e.target.value }))
                      }
                    >
                      {Rooms?.map((item) => (
                        <MenuItem key={item.Id} value={item.Id}>
                          {`${window.location.origin}${item?.Path}`}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Box>
                <Button
                  styleProps={{
                    background: theme.color.ThemeColor1,
                    fontFamily: theme.fontFamily,
                    lineHeight: "18.2px",
                    textTransform: "capitalize",
                    height: "46px",
                    boxShadow: "none",
                  }}
                  onClick={() => {
                    let rx = document.createElement("input");
                    rx.value = `${window.location.origin}${CurrentRoom?.Path}`;
                    document.body.appendChild(rx);
                    rx.select();
                    rx.setSelectionRange(0, 99999);
                    document.execCommand("copy");
                    rx.remove();
                  }}
                >
                  <Trans langKey="copy" />
                </Button>
              </Flex>
              <Flex mt={["5px", "5px", "0px", "0px"]}>
                <Breakpoints md lg>
                  <Button
                    variant="outlined"
                    aria-haspopup="true"
                    aria-controls="customized-menu"
                    styleProps={{
                      color: theme.color.ThemeColor1,
                      fontFamily: theme.fontFamily,
                      lineHeight: "18.2px",
                      textTransform: "capitalize",
                      height: "46px",
                      border: `1px solid ${theme.color.ThemeColor1}`,
                    }}
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setOpen(!isOpen);
                    }}
                  >
                    <Trans langKey="inviteVia" />
                  </Button>
                </Breakpoints>
                <Breakpoints xs sm>
                  <Button
                    variant="outlined"
                    aria-haspopup="true"
                    aria-controls="customized-menu"
                    styleProps={{
                      color: theme.color.ThemeColor1,
                      fontFamily: theme.fontFamily,
                      lineHeight: "18.2px",
                      textTransform: "capitalize",
                      height: "46px",
                      width: "100%",
                    }}
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setOpen(!isOpen);
                    }}
                  >
                    <Trans langKey="inviteVia" />
                  </Button>
                </Breakpoints>
                <Menu
                  open={isOpen}
                  keepMounted
                  anchorEl={anchorEl}
                  items={[
                    {
                      key: 1,
                      click: () => {
                        setOpen(!isOpen);
                        setShowEmail(true);
                        dispatch(
                          getEmailBody({
                            RoomId: CurrentRoomId,
                            HostName: window.location.hostname.replace(
                              ".mediforward.in",
                              ""
                            ),
                          })
                        );
                      },
                      Icon: MailIcon,
                      text: "Email",
                    },
                    {
                      key: 2,
                      click: () => {
                        setOpen(!isOpen);
                        setOpenSMS(true);
                        dispatch(
                          getSmsBody({
                            RoomId: CurrentRoomId,
                          })
                        );
                      },
                      Icon: SmsIcon,
                      text: "SMS",
                    },
                  ]}
                  onClose={() => setOpen(!isOpen)}
                  color={theme.color.RegularTextColor}
                  hoverColor={theme.color.ThemeColor1}
                  bg={theme.color.mainBg}
                />
              </Flex>
            </Flex>
          )}
        </Card>
      )}
      <Breakpoints lg>
        <Flex width="100%">
          <Card
            alignItems="center"
            justifyContent="center"
            mr="22px"
            height="116px"
            width="116px"
            flexDirection="column"
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(setCurrentRoom(CurrentRoom));
              dispatch(push("/account/EditWaitingRoom"));
            }}
          >
            <Box mb="10px" color="ThemeColor1">
              <MeetingRoomIcon
                style={{
                  fontSize: "40px",
                }}
              />
            </Box>
            <TextType variant="Regular">
              <Trans langKey="editWaitingRoom" />
            </TextType>
          </Card>
          <Card
            alignItems="center"
            justifyContent="center"
            mr="22px"
            height="116px"
            width="116px"
            flexDirection="column"
            style={{
              cursor: "pointer",
            }}
            onClick={() => dispatch(push("/account/settings"))}
          >
            <Box mb="10px" color="ThemeColor1">
              <SettingsIcon
                style={{
                  fontSize: "40px",
                }}
              />
            </Box>
            <TextType variant="Regular">
              <Trans langKey="accountSettings" />
            </TextType>
          </Card>
        </Flex>
      </Breakpoints>

      <Dialog
        open={showEmailPopUp}
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
            <TextType variant="PopupTitle">Invite via Email</TextType>
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
              setShowEmail(false);
              setEmailAddress("");
            }}
          >
            <CloseIcon />
          </Box>
        </Flex>
        <Flex
          p="10px"
          flexDirection="column"
          width="100%"
          maxHeight="615px"
          mg="mainBg"
        >
          <Flex width="100%" mb="6px">
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
              onClick={() => {
                setShowEmailMessage(false);
                window.open(
                  `https://mail.google.com/mail?view=cm&tf=0&su=${encodeURIComponent(
                    `Telemedicine Invitation`
                  )}&body=${encodeURIComponent(
                    `Hello this is ${ProviderProfile.Salutation} ${ProviderProfile.FirstName}, Please join me for a secure video call ${window.location.origin}${CurrentRoom?.Path}`
                  )}`
                );
              }}
            >
              Send Via Gmail
            </Button>
          </Flex>
          <Button
            styleProps={{
              background: theme.color.ThemeColor1,
              fontFamily: theme.fontFamily,
              lineHeight: "18.2px",
              textTransform: "capitalize",
              height: "46px",
              boxShadow: "none",
            }}
            onClick={() => {
              setShowEmailMessage(true);
              setEmailAddress("");
            }}
          >
            Send Via Mediforward
          </Button>
          {showEmailMessage && (
            <>
              <Flex mb="20px" flexDirection="Column">
                <TextField
                  placeholder="Email Address"
                  br="5px"
                  fullWidth
                  bg={theme.color.mainBg}
                  errorColor={theme.color.errorBorder}
                  InputLabelProps={{ shrink: true }}
                  focusColor={theme.color.RegularTextColor}
                  InputProps={{
                    disableUnderline: true,
                    disableLabel: true,
                  }}
                  behaviourProps={{
                    isRemoveSecondaryLabelDiv: true,
                  }}
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </Flex>
              <Box
                style={{
                  border: `0.5px solid ${theme.color.ThemeColor2}`,
                }}
                dangerouslySetInnerHTML={{ __html: emailBody || "" }}
              />
              <Button
                styleProps={{
                  background: theme.color.ThemeColor1,
                  fontFamily: theme.fontFamily,
                  lineHeight: "18.2px",
                  textTransform: "capitalize",
                  height: "46px",
                  boxShadow: "none",
                }}
                onClick={() => {
                  dispatch(
                    sendInviteEmail({
                      RoomId: CurrentRoomId,
                      HostName: window.location.hostname.replace(
                        ".mediforward.in",
                        ""
                      ),
                      Email: emailAddress,
                    })
                  );
                  setShowEmail(false);
                  setShowEmailMessage(false);
                  setEmailAddress("");
                }}
              >
                Send Invite
              </Button>
            </>
          )}
        </Flex>
      </Dialog>
      <Dialog
        open={openSMS}
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
            <TextType variant="PopupTitle">Invite via SMS</TextType>
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
              setOpenSMS(false);
            }}
          >
            <CloseIcon />
          </Box>
        </Flex>
        <Flex
          p="10px"
          flexDirection="column"
          width="100%"
          maxHeight="615px"
          mg="mainBg"
        >
          <>
            <Flex mb="20px" flexDirection="Column">
              <TextField
                placeholder="Phone Numbers"
                br="5px"
                fullWidth
                bg={theme.color.mainBg}
                errorColor={theme.color.errorBorder}
                InputLabelProps={{ shrink: true }}
                focusColor={theme.color.RegularTextColor}
                InputProps={{
                  disableUnderline: true,
                  disableLabel: true,
                }}
                behaviourProps={{
                  isRemoveSecondaryLabelDiv: true,
                }}
                value={smsNumbers}
                onChange={(e) => setNumbers(e.target.value)}
              />
            </Flex>
            <Box
              style={{
                border: `0.5px solid ${theme.color.ThemeColor2}`,
              }}
            >
              {smsBody}
            </Box>
            <Button
              styleProps={{
                background: theme.color.ThemeColor1,
                fontFamily: theme.fontFamily,
                lineHeight: "18.2px",
                textTransform: "capitalize",
                height: "46px",
                boxShadow: "none",
              }}
              onClick={() => {
                setOpenSMS(false);
                dispatch(
                  sendSMS({
                    RoomId: CurrentRoomId,
                    Number: smsNumbers,
                  })
                );
              }}
            >
              Send Invite
            </Button>
          </>
        </Flex>
      </Dialog>
    </Flex>
  );
};

export default withTheme(Dashboard);
