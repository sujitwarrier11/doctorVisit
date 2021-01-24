import React, { useEffect, useState, useRef } from "react";
import {
  Flex,
  Button,
  TextType,
  Breakpoints,
  Box,
} from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";
import { useSelector, useDispatch } from "react-redux";
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
import {
  navigateToRoom,
  removePatient,
  setCurrentPatient,
  setMessageRead,
  uploadFile,
  clearFile,
  snackBarConfig,
  openPatientChat,
} from "@root/src/Redux/ActionCreators";

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
  }) => {
    const dispatch = useDispatch();
    const { providerDetails } = useSelector((state) => state.patient);
    const { role } = useSelector((state) => state.user);


    useEffect(() => {
      const fn = () => onClose();
      document.addEventListener("click", fn);
      return () => {
        document.removeEventListener("click", fn);
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
                    src={providerDetails?.ProfilePicture || "/avatar.jpg"}
                    height="165px"
                    width="165px"
                    style={{
                      borderRadius: "5px",
                    }}
                  />
                </Flex>
                <Flex flex="1" flexDirection="column">
                  <Flex>
                    <TextType variant="PatientName">
                      {providerDetails &&
                        `${providerDetails.Salutation}${providerDetails.FirstName}`}
                    </TextType>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex mx="15px">
              <Flex width="25%" mr="4px">
                <Button
                  onClick={() => {
                    dispatch(openPatientChat(true));
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
                    src={providerDetails?.ProfilePicture || "/avatar.jpg"}
                    height="165px"
                    width="165px"
                    style={{
                      borderRadius: "5px",
                    }}
                  />
                </Flex>
                <Flex flex="1" flexDirection="column">
                  <Flex>
                    <TextType variant="PatientName">
                      {providerDetails &&
                        `${providerDetails.Salutation}${providerDetails.FirstName}`}
                    </TextType>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex flexDirection="column" mx="15px">
              <Flex width="100%" mb="4px">
                <Button
                  onClick={() => {
                    dispatch(openPatientChat(true));
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
            </Flex>
          </Flex>
        </Breakpoints>
      </Box>
    );
  }
);

const ProviderCallDetailsSection = ({ theme }) => {
  const { providerDetails, patientConnection, appointmentData } = useSelector(
    (state) => state.patient
  );
  const { file } = useSelector((state) => state.common);
  const [openFileTransfer, setFileTransferPopupStatus] = useState(false);
  const [showMoreOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  const [transferComplete, setTransferStatus] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (file && patientConnection && appointmentData && providerDetails) {
      const arrfiles = [];
      file?.forEach((objFile) => {
        arrfiles.push({
          AppointmentId: appointmentData.AppointmentId,
          RoomId: appointmentData.RoomId,
          ParticipantId: providerDetails.ProviderId,
          Role: "patient",
          Path: objFile.path,
          FileName: objFile.FileName,
          Size: objFile.Size,
        });
      });
      patientConnection.invoke("FileUploaded", JSON.stringify(arrfiles));
    }
  }, [file, patientConnection, appointmentData, providerDetails]);
  const onFileChange = (objFiles) => {
    dispatch(uploadFile(objFiles));
  };
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
                  {`${file.FileName} sent to ${providerDetails?.Salutation} ${providerDetails?.FirstName} ${providerDetails?.LastName}.`}
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
                  {providerDetails &&
                    `Waiting for ${providerDetails.Salutation} ${providerDetails.FirstName} to start download...`}
                </TextType>
              </Box>
            </Flex>
          )}
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
  return (
    <Box>
      <Box
        borderBottom={`1px solid ${theme.color.ThemeColor1}`}
        pb="4px"
        mb="9px"
      >
        <TextType variant="NavHeaders">In call with</TextType>
      </Box>
      <Box mb="15px">
        <Flex
          style={{
            cursor: "pointer",
          }}
          height="48px"
          width="100%"
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
                src={providerDetails?.ProfilePicture || "/avatar.jpg"}
              />
            </Box>
          </Flex>
          <Flex flex="1" flexDirection="column">
            <TextType variant="PatientListUserName">
              {providerDetails &&
                `${providerDetails.Salutation}${providerDetails.FirstName}`}
            </TextType>
          </Flex>
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
      </Box>
      {showMoreOptions && (
        <MoreOptions
          onClose={() => setShowOptions(false)}
          setFileTransferPopupStatus={setFileTransferPopupStatus}
        />
      )}
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
                {providerDetails &&
                  `File transfer with ${providerDetails?.Salutation}${providerDetails?.FirstName}`}
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
                setFileTransferPopupStatus(false);
                dispatch(snackBarConfig({ open: false }));
              }}
            >
              <CloseIcon />
            </Box>
          </Flex>
          <DialogContent>{renderFileUploadDialog()}</DialogContent>
        </Flex>
      </Dialog>
    </Box>
  );
};

export default withTheme(ProviderCallDetailsSection);
