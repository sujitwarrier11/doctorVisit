import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import {
  Flex,
  Box,
  TextType,
  Breakpoints,
  Button,
} from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";
import { useSelector, useDispatch } from "react-redux";
import {
  navigateToRoom,
  removePatient,
  setCurrentPatient,
  setMessageRead,
  uploadFile,
  clearFile,
  snackBarConfig,
} from "@root/src/Redux/ActionCreators";
import { push } from "connected-react-router";
import styled from "@emotion/styled";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import dayJs from "dayjs";
import CloseIcon from "@material-ui/icons/Close";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import VideocamIcon from "@material-ui/icons/Videocam";
import CallIcon from "@material-ui/icons/Call";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CallEndIcon from "@material-ui/icons/CallEnd";

const OtherOptions = styled(Box)`
  background: ${(props) => props.bgColor};
  width: 545px;
  height: 261px;
  position: absolute;
  z-index: 340;
  right: -576px;
  border-radius: 5px;
  top: -113px;
  border: 0.5px solid ${(props) => props.borderColor};
  box-shadow: 0 0 10 px 0 rgba(0, 0, 0, 0.4);
  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 30%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: ${(props) => props.bgColor};
    border-left: 0;
    margin-top: -5px;
    margin-left: -5px;
  }
`;

const MoreOptions = withTheme(
  ({
    theme,
    patient,
    onClick,
    onClose,
    setCurrentAppointment,
    setFileTransferPopupStatus,
    setOpenCallSwitch,
  }) => {
    const dispatch = useDispatch();
    const { Rooms, objConnection, ProviderProfile } = useSelector(
      (state) => state.provider
    );
    const { role } = useSelector((state) => state.user);
    const CurrentRoom = Rooms?.find((item) => item.Id === patient.RoomId);
    const parts = CurrentRoom?.Path?.split("/");
    const timerRef = useRef(null);
    let strUnit = "m";
    let intDiff = dayJs(new Date()).diff(dayJs(patient.TimeStamp), "m");
    if (intDiff > 59) {
      intDiff = Math.round(intDiff / 60);
      strUnit = "hrs";
    }
    let strColor = "green";

    if (intDiff < 5) strColor = "green";
    else if (intDiff < 10) strColor = "orange";
    else strColor = "red";

    useEffect(() => {
      const fn = () => onClose();
      document.addEventListener("click", fn);
      return () => {
        document.removeEventListener("click", fn);
      };
    }, []);
    useLayoutEffect(() => {
      const objTime = setInterval(() => {
        let unit = "m";
        let diff = dayJs(new Date()).diff(dayJs(patient.TimeStamp), "m");
        if (diff > 59) {
          diff = Math.round(diff / 60);
          unit = "hrs";
        }
        if (diff < 5) timerRef.current.style.color = "green";
        else if (diff < 10) timerRef.current.style.color = "orange";
        else timerRef.current.style.color = "red";
        timerRef.current.innerHTML = `${diff}${unit}`;
      }, [60000]);
      return () => {
        clearInterval(objTime);
      };
    }, []);
    return (
      <Box position="relative">
        <Breakpoints lg md>
          <OtherOptions
            borderColor={theme.color.borderCream}
            bgColor={theme.color.ThemeColor2}
            flexDirection="column"
          >
            <Flex mx="16px" my="8px" position="relative">
              <Box
                position="absolute"
                style={{
                  cursor: "pointer",
                  top: 0,
                  right: 0,
                }}
                color="deepCream"
                onClick={onClose}
              >
                <CloseIcon />
              </Box>
              <Flex>
                <Flex mr="6px" mb="6px">
                  <img
                    alt="profile pic"
                    src={patient?.ProfileImage || "/avatar.jpg"}
                    height="165px"
                    width="165px"
                    style={{
                      borderRadius: "5px",
                    }}
                  />
                </Flex>
                <Flex flex="1" flexDirection="column">
                  <Flex>
                    <TextType variant="PatientName">{patient?.Name}</TextType>
                  </Flex>
                  <Flex mt="5px">
                    <Box
                      mt="3px"
                      mr="4px"
                      width="10px"
                      height="10px"
                      r="50%"
                      bg="green"
                    />
                    <Box mr="3px">
                      <TextType variant="WaitingText">Waiting</TextType>
                    </Box>
                    <div
                      style={{
                        marginRight: "3px",
                        fontSize: "15px",
                        lineHeight: "18px",
                        textSizeAdjust: "100%",
                        wordBreak: "break-all",
                        fontWeight: 500,
                        fontFamily: theme.fontFamily,
                        color: strColor,
                      }}
                      ref={timerRef}
                    >
                      {`${intDiff}${strUnit}`}
                    </div>
                    {parts && (
                      <TextType variant="WaitingText">{`in /${
                        parts[parts.length - 1]
                      }`}</TextType>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex mx="15px">
              <Flex width="25%" mr="4px">
                <Button
                  onClick={() => {
                    dispatch(
                      setMessageRead({ AppointmentId: patient.AppointmentId })
                    );
                    dispatch(setCurrentPatient({ ...patient, OpenChat: true }));
                  }}
                  styleProps={{
                    background: theme.color.ThemeColor1,
                    fontFamily: theme.fontFamily,
                    lineHeight: "18.2px",
                    textTransform: "capitalize",
                    boxShadow: "none",
                    width: "100%",
                    height: "48px",
                  }}
                >
                  <Flex>
                    <Box mr="3px">
                      <ChatBubbleIcon />
                    </Box>
                    <Box>Chat</Box>
                  </Flex>
                </Button>
              </Flex>
              <Flex width="25%" mr="4px">
                <Button
                  onClick={() => {
                    setCurrentAppointment({
                      ...patient,
                      room: CurrentRoom?.Path,
                      voiceCall: true,
                      reload: true,
                    });
                    setOpenCallSwitch(true);
                  }}
                  styleProps={{
                    background: theme.color.ThemeColor1,
                    fontFamily: theme.fontFamily,
                    lineHeight: "18.2px",
                    textTransform: "capitalize",
                    boxShadow: "none",
                    width: "100%",
                    height: "48px",
                  }}
                >
                  <Flex>
                    <Box mr="3px">
                      <CallIcon />
                    </Box>
                    <Box>Voice Call</Box>
                  </Flex>
                </Button>
              </Flex>
              <Flex width="25%" mr="4px">
                <Button
                  onClick={() => {
                    setCurrentAppointment(patient);
                    setFileTransferPopupStatus(true);
                  }}
                  styleProps={{
                    background: theme.color.ThemeColor1,
                    fontFamily: theme.fontFamily,
                    lineHeight: "18.2px",
                    textTransform: "capitalize",
                    boxShadow: "none",
                    width: "100%",
                    height: "48px",
                  }}
                >
                  <Flex>
                    <Box mr="3px">
                      <AttachFileIcon />
                    </Box>
                    <Box>Attach Files</Box>
                  </Flex>
                </Button>
              </Flex>
              <Flex width="25%" mr="4px">
                <Button
                  onClick={() => {
                    const obj = {};
                    obj.ParticipantId = ProviderProfile.ProviderId;
                    obj.AppointmentId = patient.AppointmentId;
                    obj.Role = role;
                    obj.RoomId = patient.RoomId;
                    obj.Status = "I";
                    objConnection.invoke("CallEnd", JSON.stringify(obj));
                    dispatch(removePatient(patient));
                  }}
                  styleProps={{
                    background: theme.color.ThemeColor1,
                    fontFamily: theme.fontFamily,
                    lineHeight: "18.2px",
                    textTransform: "capitalize",
                    boxShadow: "none",
                    width: "100%",
                    height: "48px",
                  }}
                >
                  <Flex>
                    <Box mr="3px">
                      <CloseIcon />
                    </Box>
                    <Box>Remove</Box>
                  </Flex>
                </Button>
              </Flex>
            </Flex>
          </OtherOptions>
        </Breakpoints>
        <Breakpoints sm xs>
          <Flex
            bg="ThemeColor2"
            width="100%"
            height="100%"
            style={{
              top: "0",
              left: "0",
              border: `0.5px solid ${theme.color.borderCream}`,
              zIndex: "500",
            }}
            flexDirection="column"
            position="fixed"
            pt="40px"
          >
            <Flex mx="16px" my="8px" position="relative">
              <Box
                position="absolute"
                style={{
                  cursor: "pointer",
                  top: -35,
                  right: 0,
                }}
                color="deepCream"
                onClick={onClose}
              >
                <CloseIcon />
              </Box>
              <Flex>
                <Flex mr="6px" mb="6px">
                  <img
                    alt="profile pic"
                    src={patient?.ProfileImage || "/avatar.jpg"}
                    height="165px"
                    width="165px"
                    style={{
                      borderRadius: "5px",
                    }}
                  />
                </Flex>
                <Flex flex="1" flexDirection="column">
                  <Flex>
                    <TextType variant="PatientName">{patient?.Name}</TextType>
                  </Flex>
                  <Flex mt="5px">
                    <Box
                      mt="3px"
                      mr="4px"
                      width="10px"
                      height="10px"
                      r="50%"
                      bg="green"
                    />
                    <Box mr="3px">
                      <TextType variant="WaitingText">Waiting </TextType>
                    </Box>
                    <div
                      style={{
                        marginRight: "3px",
                        fontSize: "15px",
                        lineHeight: "18px",
                        textSizeAdjust: "100%",
                        color: "black",
                        wordBreak: "break-all",
                        fontWeight: 500,
                        fontFamily: theme.fontFamily,
                        color: strColor,
                      }}
                      ref={timerRef}
                    >
                      {`${intDiff}${strUnit}`}
                    </div>
                    {parts && (
                      <TextType variant="WaitingText">{`in /${
                        parts[parts.length - 1]
                      }`}</TextType>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex flexDirection="column" mx="15px">
              <Flex width="100%" mb="4px">
                <Button
                  onClick={() => {
                    dispatch(
                      setMessageRead({ AppointmentId: patient.AppointmentId })
                    );
                    dispatch(setCurrentPatient({ ...patient, OpenChat: true }));
                  }}
                  styleProps={{
                    background: theme.color.ThemeColor1,
                    fontFamily: theme.fontFamily,
                    lineHeight: "18.2px",
                    textTransform: "capitalize",
                    boxShadow: "none",
                    width: "100%",
                    height: "48px",
                  }}
                >
                  <Flex>
                    <Box mr="3px">
                      <ChatBubbleIcon />
                    </Box>
                    <Box>Chat</Box>
                  </Flex>
                </Button>
              </Flex>
              <Flex width="100%" mb="4px">
                <Button
                  onClick={() => {
                    setCurrentAppointment({
                      ...patient,
                      room: CurrentRoom?.Path,
                      voiceCall: true,
                      reload: true,
                    });
                    setOpenCallSwitch(true);
                  }}
                  styleProps={{
                    background: theme.color.ThemeColor1,
                    fontFamily: theme.fontFamily,
                    lineHeight: "18.2px",
                    textTransform: "capitalize",
                    boxShadow: "none",
                    width: "100%",
                    height: "48px",
                  }}
                >
                  <Flex>
                    <Box mr="3px">
                      <VideocamIcon />
                    </Box>
                    <Box>Voice Call</Box>
                  </Flex>
                </Button>
              </Flex>
              <Flex width="25%" mr="4px">
                <Button
                  onClick={() => {
                    setCurrentAppointment(patient);
                    setFileTransferPopupStatus(true);
                  }}
                  styleProps={{
                    background: theme.color.ThemeColor1,
                    fontFamily: theme.fontFamily,
                    lineHeight: "18.2px",
                    textTransform: "capitalize",
                    boxShadow: "none",
                    width: "100%",
                    height: "48px",
                  }}
                >
                  <Flex>
                    <Box mr="3px">
                      <AttachFileIcon />
                    </Box>
                    <Box>Attach Files</Box>
                  </Flex>
                </Button>
              </Flex>
              <Flex width="100%" mb="4px">
                <Button
                  onClick={() => {
                    const obj = {};
                    obj.ParticipantId = ProviderProfile.ProviderId;
                    obj.AppointmentId = patient.AppointmentId;
                    obj.Role = role;
                    obj.RoomId = patient.RoomId;
                    obj.Status = "I";
                    objConnection.invoke("CallEnd", JSON.stringify(obj));
                    dispatch(removePatient(patient));
                  }}
                  styleProps={{
                    background: theme.color.ThemeColor1,
                    fontFamily: theme.fontFamily,
                    lineHeight: "18.2px",
                    textTransform: "capitalize",
                    boxShadow: "none",
                    width: "100%",
                    height: "48px",
                  }}
                >
                  <Flex>
                    <Box mr="3px">
                      <CloseIcon />
                    </Box>
                    <Box>Remove</Box>
                  </Flex>
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Breakpoints>
      </Box>
    );
  }
);

export const PatientAppointment = withTheme(
  ({
    patient,
    onClick,
    theme,
    setCurrentAppointment,
    setFileTransferPopupStatus,
    setOpenCallSwitch,
  }) => {
    const { ProviderProfile, Rooms } = useSelector((state) => state.provider);
    const CurrentRoom = Rooms?.find((item) => item.Id === patient.RoomId);
    const { chatMessages } = useSelector((state) => state.common);
    const dispatch = useDispatch();
    const messages =
      (chatMessages && patient && chatMessages[patient.AppointmentId]) || [];
    const parts = CurrentRoom?.Path?.split("/");
    const timerRef = useRef(null);
    const [showMoreOptions, setShowOptions] = useState(false);

    useLayoutEffect(() => {
      const objTime = setInterval(() => {
        let unit = "m";
        let diff = dayJs(new Date()).diff(dayJs(patient.TimeStamp), "m");
        if (diff > 59) {
          diff = Math.round(diff / 60);
          unit = "hrs";
        }
        if (diff < 5) timerRef.current.style.color = "green";
        else if (diff < 10) timerRef.current.style.color = "orange";
        else timerRef.current.style.color = "red";
        timerRef.current.innerHTML = `${diff}${unit}`;
      }, [60000]);
      return () => {
        clearInterval(objTime);
      };
    }, []);
    return (
      <>
        <Flex
          style={{
            cursor: "pointer",
          }}
          height="48px"
          width="100%"
          onClick={() => {
            if (onClick) onClick(patient);
            dispatch(navigateToRoom({ ...patient, room: CurrentRoom.Path }));
          }}
        >
          <Flex position="relative">
            <Box r="50%" height="32px" mr="5px">
              <img
                height="32px"
                width="32px"
                style={{
                  borderRadius: "50%",
                }}
                alt="profilepic"
                src={patient?.ProfileImage || "/avatar.jpg"}
              />
            </Box>
          </Flex>
          <Flex flexDirection="column">
            <TextType variant="PatientListUserName">{`${patient.Name?.substring(
              0,
              8
            )}${patient?.Name?.length > 8 ? "..." : ""}`}</TextType>
            {parts && (
              <TextType variant="Regular">{`/${
                parts[parts.length - 1]
              }`}</TextType>
            )}
          </Flex>
          <Flex
            ml="4px"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            flex="1"
          >
            {messages?.filter((item) => !item.read)?.length > 0 && (
              <Flex
                alignItems="center"
                justifyContent="center"
                height="15px"
                width="15px"
                fontSize="12px"
                color="white"
                bg="red"
                r="50%"
              >
                {messages?.filter((item) => !item.read)?.length}
              </Flex>
            )}
            <Flex height="30%" />
          </Flex>
          <Flex>
            <Box
              style={{
                fontSize: "14px",
                lineHeight: "16px",
                fontFamily: theme.fontFamily,
                color: "green",
              }}
              pt="4px"
            >
              <div ref={timerRef}>{"< 1m"}</div>
            </Box>
            <Box
              style={{
                cursor: "pointer",
              }}
              color="black"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowOptions(!showMoreOptions);
              }}
            >
              <MoreVertIcon />
            </Box>
          </Flex>
        </Flex>
        {showMoreOptions && (
          <MoreOptions
            onClick={onClick}
            patient={patient}
            onClose={() => setShowOptions(false)}
            setCurrentAppointment={setCurrentAppointment}
            setFileTransferPopupStatus={setFileTransferPopupStatus}
            setOpenCallSwitch={setOpenCallSwitch}
          />
        )}
      </>
    );
  }
);

const OtherPatientListSection = ({ theme, patientList, clickHandler }) => {
  const dispatch = useDispatch();
  const [openFileTransfer, setFileTransferPopupStatus] = useState(false);
  const [openCallSwitch, setOpenCallSwitch] = useState(false);
  const [transferComplete, setTransferStatus] = useState(false);
  const [fileUploadedByPatient, setFileUploadedByPatient] = useState(false);
  const { role, patientDetails, userTheme, Email } = useSelector(
    (state) => state.user
  );
  const fileRef = useRef(null);
  const { file } = useSelector((state) => state.common);
  const {
    patients,
    ProviderProfile,
    objConnection,
    patientPicture,
    Rooms,
    CurrentAppointment: SelectedAppointment
  } = useSelector((state) => state.provider);
  const onFileChange = (objFiles) => {
    dispatch(uploadFile(objFiles));
  };
  const [doctorFile, setDocfile] = useState([]);
  const [CurrentAppointment, setCurrentAppointment] = useState();

  const renderFileUploadDialog = () => {
    if (file) {
      return (
        <Flex
          flex="1"
          height="200px"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {transferComplete ? (
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box mb="7px" color="SuccessGreen">
                <CloudUploadIcon
                  style={{
                    fontSize: "70px",
                  }}
                />
              </Box>
              <Box mb="7px">
                <TextType variant="Regular">
                  {`${file.FileName} sent to ${CurrentAppointment?.Name}.`}
                </TextType>
              </Box>
              <Flex>
                <Box mr="8px">
                  <Button
                    styleProps={{
                      background: theme.color.NavlinkFontColor,
                      fontFamily: theme.fontFamily,
                      lineHeight: "18.2px",
                      textTransform: "capitalize",
                      height: "46px",
                      boxShadow: "none",
                    }}
                    onClick={() => {
                      setTransferStatus(false);
                      dispatch(clearFile());
                    }}
                  >
                    Send More
                  </Button>
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
                    dispatch(clearFile());
                    setTransferStatus(false);
                    setFileTransferPopupStatus(false);
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          ) : (
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box mb="7px" color="SuccessGreen">
                <CloudUploadIcon
                  style={{
                    fontSize: "70px",
                  }}
                />
              </Box>
              <Box mb="7px">
                <TextType variant="Regular">
                  {CurrentAppointment &&
                    `Waiting for ${CurrentAppointment.Name} to start download ...`}
                </TextType>
              </Box>
            </Flex>
          )}
        </Flex>
      );
    }
    if (fileUploadedByPatient) {
      return (
        <Flex
          flex="1"
          height="200px"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box mb="7px" color="NavlinkFontColor">
            <CloudDownloadIcon
              style={{
                fontSize: "70px",
              }}
            />
          </Box>
          <Box mb="7px">
            <TextType variant="SubHeader">
              {CurrentAppointment &&
                `${CurrentAppointment.Name} wants to send you a file.`}
            </TextType>
          </Box>
          <Flex flexDirection="column">
            {doctorFile &&
              doctorFile?.map((dFile) => (
                <Box key={dFile.Id} mb="7px">
                  <TextType variant="Regular">
                    {dFile && `${dFile.FileName}, ${dFile.Size}`}
                  </TextType>
                </Box>
              ))}
          </Flex>
          <Box>
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
                doctorFile?.forEach((dFile) => {
                  fetch(dFile?.Path, {})
                    .then((response) => response.blob())
                    .then((blob) => {
                      const blobUrl = window.URL.createObjectURL(blob);
                      const anchor = document.createElement("a");
                      anchor.href = blobUrl;
                      anchor.target = "_blank";
                      anchor.download = dFile?.FileName;
                      anchor.click();
                      const event = new Event("click");
                      anchor.dispatchEvent(event);
                      anchor.remove();
                      setFileUploadedByPatient(false);
                    })
                    .catch((e) => console.error(e));
                });
                objConnection.invoke(
                  "InformFileTransferAcceptance",
                  JSON.stringify({
                    AppointmentId: CurrentAppointment?.AppointmentId,
                    RoomId: CurrentAppointment?.RoomId,
                    ParticipantId: CurrentAppointment?.PatientId,
                    Role: role,
                  })
                );
              }}
            >
              Download
            </Button>
          </Box>
        </Flex>
      );
    }
    return (
      <Flex
        flex="1"
        height="200px"
        flexDirection="column"
        style={{
          border: `1px dashed ${theme.color.RegularTextColor}`,
        }}
        alignItems="center"
        justifyContent="center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFileChange(e.dataTransfer.files);
        }}
      >
        <Box mb="7px" color="NavlinkFontColor">
          <CloudUploadIcon
            style={{
              fontSize: "70px",
            }}
          />
        </Box>
        <Box mb="7px">
          <TextType variant="Regular">Drag & Drop File Here to Share</TextType>
        </Box>
        <Box mb="7px">
          <TextType variant="LargeRegular">OR</TextType>
        </Box>
        <Box style={{ display: "none" }}>
          <input
            type="file"
            ref={fileRef}
            multiple
            onChange={(e) => {
              onFileChange(e.target.files);
            }}
          />
        </Box>
        <Box>
          <Button
            styleProps={{
              background: theme.color.ThemeColor1,
              fontFamily: theme.fontFamily,
              lineHeight: "18.2px",
              textTransform: "capitalize",
              height: "46px",
              boxShadow: "none",
            }}
            onClick={(e) => {
              fileRef.current.click();
            }}
          >
            Select File to Share
          </Button>
        </Box>
      </Flex>
    );
  };

  const FileTransferAccepted = useCallback((res) => {
    dispatch(
      snackBarConfig({
        open: true,
        variant: "success",
        snackbarText: "The file has been downloaded.",
      })
    );
    setTransferStatus(true);
  }, []);

  useEffect(() => {
    if (
      typeof objConnection?.off === "function" &&
      typeof objConnection?.on === "function"
    ) {
      objConnection?.off("FileTransferAccepted");
      objConnection?.on("FileTransferAccepted", FileTransferAccepted);
    }
  });

  useEffect(() => {
    if (file && objConnection && CurrentAppointment) {
      const arrfiles = [];
      file?.forEach((objFile) => {
        arrfiles.push({
          AppointmentId: CurrentAppointment.AppointmentId,
          RoomId: CurrentAppointment.RoomId,
          ParticipantId: CurrentAppointment.PatientId,
          Role: role,
          Path: objFile.path,
          FileName: objFile.FileName,
          Size: objFile.Size,
          ProviderId: ProviderProfile?.ProviderId,
        });
      });
      objConnection.invoke("FileUploaded", JSON.stringify(arrfiles));
    }
  }, [file, objConnection, CurrentAppointment, ProviderProfile]);

  return (
    <Box>
      <Box
        borderBottom={`1px solid ${theme.color.ThemeColor1}`}
        pb="4px"
        mb="9px"
      >
        <TextType variant="NavHeaders">Patient Queue</TextType>
      </Box>
      <Box mb="15px">
        {patientList && patientList.length > 0 ? (
          <>
            {patientList?.map((item) => (
              <PatientAppointment
                key={item.ProviderId}
                patient={item}
                onClick={clickHandler}
                setCurrentAppointment={setCurrentAppointment}
                setFileTransferPopupStatus={setFileTransferPopupStatus}
                setOpenCallSwitch={setOpenCallSwitch}
              />
            ))}
          </>
        ) : (
          <TextType variant="EmptyMessaging">
            No one has checked in yet
          </TextType>
        )}
      </Box>
      <Dialog
        open={openFileTransfer}
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
              <TextType variant="PopupTitle">
                {CurrentAppointment &&
                  `File transfer with ${CurrentAppointment.Name}`}
              </TextType>
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
                dispatch(clearFile());
                setTransferStatus(false);
                setFileTransferPopupStatus(false);
                setFileUploadedByPatient(false);
                dispatch(snackBarConfig({ open: false }));
              }}
            >
              <CloseIcon />
            </Box>
          </Flex>
          <DialogContent>{renderFileUploadDialog()}</DialogContent>
          <DialogActions>
            <Flex>
              <Button
                variant="outlined"
                aria-haspopup="true"
                aria-controls="customized-menu"
                styleProps={{
                  color: theme.color.ThemeColor1,
                  fontFamily: theme.fontFamily,
                  lineHeight: "18.2px",
                  textTransform: "capitalize",
                  border: `1px solid ${theme.color.ThemeColor1}`,
                }}
                onClick={() => {
                  objConnection.invoke(
                    "AskPatientToUploadFile",
                    JSON.stringify({
                      AppointmentId: CurrentAppointment?.AppointmentId,
                      RoomId: CurrentAppointment?.RoomId,
                      ParticipantId: CurrentAppointment?.PatientId,
                      Role: role,
                    })
                  );
                }}
              >
                Request file from Patient
              </Button>
            </Flex>
          </DialogActions>
        </Flex>
      </Dialog>
      <Dialog
        open={openCallSwitch}
        variant="outlined"
        color="primary"
        scrimClickAction=""
        escapeKeyAction=""
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
              <TextType variant="PopupTitle">{`Start call with ${CurrentAppointment?.Name}`}</TextType>
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
                setOpenCallSwitch(false);
              }}
            >
              <CloseIcon />
            </Box>
          </Flex>
          <DialogContent>
            <Flex
              flex="1"
              height="200px"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Flex
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpenCallSwitch(false);
                  objConnection.invoke(
                    "JoinGroupCall",
                    JSON.stringify({
                      AppointmentId: CurrentAppointment.AppointmentId,
                      RoomId: SelectedAppointment.RoomId,
                      ParticipantId: CurrentAppointment.PatientId,
                      SessionId: SelectedAppointment.SessionId,
                      CurrentAppointmentId: SelectedAppointment.AppointmentId,
                      ProfileImage: SelectedAppointment.ProfileImage,
                      Role: "patient",
                    })
                  );
                }}
                mb="20px"
              >
                <TextType variant="PopupButton">
                  <Flex>
                    <Box mr="10px">
                      <PersonAddIcon />
                    </Box>
                    <Box>Add patient to active call.</Box>
                  </Flex>
                </TextType>
              </Flex>
              <Flex
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (clickHandler) clickHandler();
                  dispatch(navigateToRoom(CurrentAppointment));
                  dispatch(push("/reload"));
                  setOpenCallSwitch(false);
                }}
              >
                <TextType variant="PopupButton">
                  <Flex color="red">
                    <Box mr="10px">
                      <CallEndIcon />
                    </Box>
                    <Box>End active call and start a new one</Box>
                  </Flex>
                </TextType>
              </Flex>
            </Flex>
          </DialogContent>
        </Flex>
      </Dialog>
    </Box>
  );
};

export default withTheme(OtherPatientListSection);
