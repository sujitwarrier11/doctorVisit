import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Flex,
  Box,
  TextType,
  TextField,
  Button,
} from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import { setChatMessage, openChat } from "@root/src/Redux/ActionCreators";

const AnimatedFlex = styled(Flex)`
  bottom: -312px;
  right: 20px;
  &[data-below="1"] {
    bottom: 0;
    transition: bottom 600ms ease-in;
  }
  &[data-below="0"] {
    bottom: -312px;
    transition: bottom 600ms ease-in;
  }
`;

const SpeechBubbleAfter = styled(Box)`
  position: relative;
  background-color: ${(props) => props.bgColor};
  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-right-color: ${(props) => props.bgColor};
    border-left: 0;
    border-bottom: 0;
    margin-top: -4px;
    margin-left: -8px;
  }
`;

const SpeechBubbleBefore = styled(Box)`
  position: relative;
  background-color: ${(props) => props.bgColor};
  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-left-color: ${(props) => props.bgColor};
    border-right: 0;
    border-bottom: 0;
    margin-top: -4px;
    margin-right: -8px;
  }
`;

const ChatModule = ({ theme }) => {
  const dispatch = useDispatch();
  const {
    objConnection,
    CurrentPatientId,
    ProviderProfile,
    CurrentRoomId,
    Rooms,
    patients,
    OpenChat,
  } = useSelector((state) => state.provider);
  const { role } = useSelector((state) => state.user);
  const {
    patientConnection,
    providerDetails,
    appointmentData,
    RoomData,
    groupCallAppointment,
    OpenPatientChat,
  } = useSelector((state) => state.patient);
  const CurrentPatient =
    groupCallAppointment ||
    patients?.find((item) => item.PatientId === CurrentPatientId);

  const { ProfileImage, chatMessages } = useSelector((state) => state.common);
  const AppointmentId =
    CurrentPatient?.AppointmentId || appointmentData?.AppointmentId;
  const [goUp, setGoUp] = useState(0);
  const [typedMessaage, setTypedMessage] = useState("");

  const CurrentRoom = Rooms?.find((item) => item.Id === CurrentRoomId);

  useEffect(() => {
    if (OpenChat || OpenPatientChat) setGoUp(1);
  }, [OpenChat, OpenPatientChat]);

  const messages = chatMessages[AppointmentId] || [];

  const RoomId = CurrentRoom?.Id || RoomData?.Id;
  const msgRef = useRef(null);
  const audioRef = useRef(null);
  const msgHandler = useCallback(
    (res) => {
      const objMessage = JSON.parse(res);
      const Msg = {
        id: Math.random(),
        sender: "other",
        message: objMessage.Msg,
        read: objMessage.AppointmentId === AppointmentId,
      };
      let stopAddMessage = false;
      if (role === "patient") {
        stopAddMessage =
          role === objMessage.Role &&
          appointmentData.PatientId === objMessage.ParticipantId;
      } else {
        stopAddMessage =
          role === objMessage.Role &&
          ProviderProfile.ProviderId === objMessage.ParticipantId;
      }
      if (!stopAddMessage) {
        dispatch(
          setChatMessage({ AppointmentId: objMessage.AppointmentId, Msg })
        );
        setGoUp(1);
        msgRef.current.scrollIntoView();
        audioRef.current.play();
      }
    },
    [CurrentPatient, appointmentData, role, ProviderProfile]
  );

  const getImageSource = (msg) => {
    if (msg.sender === "you") {
      if (role === "patient") {
        return ProfileImage || "/avatar.jpg";
      }
      return ProviderProfile?.ProfilePicture || "/avatar.jpg";
    }
    if (role === "patient") {
      return providerDetails?.ProfilePicture || "/avatar.jpg";
    }
    return CurrentPatient?.ProfileImage || "/avatar.jpg";
  };

  const renderAvatar = (msg) => (
    <Box r="50%" height="36px" width="36px" minWidth="36px">
      <img
        alt="profilepic"
        style={{
          borderRadius: "50%",
          height: "100%",
          width: "100%",
        }}
        src={getImageSource(msg)}
      />
    </Box>
  );

  const renderChatMessages = () => {
    return (
      <Flex width="100%" flexDirection="column">
        {messages.map((msg) => {
          if (msg.sender === "other") {
            return (
              <Flex
                width="100%"
                key={msg.id}
                flexDirection="row-reverse"
                minHeight="36px"
                mb="5px"
              >
                {renderAvatar(msg)}
                <SpeechBubbleBefore
                  style={{
                    wordWrap: "break-word",
                  }}
                  minWidth="15px"
                  mr="12px"
                  color="white"
                  bgColor={theme.color.chatBubble2}
                  px="4px"
                  pt="6px"
                  r="4px"
                >
                  <TextType variant="ChatMessage2">{msg.message}</TextType>
                </SpeechBubbleBefore>
              </Flex>
            );
          }
          return (
            <Flex
              width="100%"
              key={msg.id}
              flexDirection="flex-start"
              minHeight="36px"
              mb="5px"
            >
              {renderAvatar(msg)}
              <SpeechBubbleAfter
                minWidth="15px"
                ml="12px"
                color="RegularTextColor"
                bgColor={theme.color.chatBubble1}
                style={{
                  wordWrap: "break-word",
                }}
                px="4px"
                pt="6px"
                r="4px"
              >
                <TextType variant="ChatMessage1">{msg.message}</TextType>
              </SpeechBubbleAfter>
            </Flex>
          );
        })}
      </Flex>
    );
  };

  useEffect(() => {
    if (
      typeof objConnection?.on === "function" ||
      typeof patientConnection?.on === "function"
    ) {
      objConnection?.off("ReceiveChatMessage");
      objConnection?.on("ReceiveChatMessage", msgHandler);
      patientConnection?.off("ReceiveChatMessage");
      patientConnection?.on("ReceiveChatMessage", msgHandler);
    }
  });

  const sendMessage = () => {
    const msgContents = {};
    msgContents.ParticipantId =
      ProviderProfile?.ProviderId || appointmentData?.PatientId;
    msgContents.Role = role;
    msgContents.AppointmentId =
      CurrentPatient?.AppointmentId || appointmentData?.AppointmentId;
    msgContents.Msg = typedMessaage;
    msgContents.RoomId = RoomId;
    const Msg = {
      id: Math.random(),
      sender: "you",
      message: typedMessaage,
      read: true,
    };
    objConnection?.invoke("SendChatMessage", JSON.stringify(msgContents));
    patientConnection?.invoke("SendChatMessage", JSON.stringify(msgContents));
    setTypedMessage("");
    dispatch(setChatMessage({ AppointmentId: msgContents.AppointmentId, Msg }));
    setTimeout(() => {
      msgRef.current.scrollIntoView();
    }, 100);
  };

  return (
    <AnimatedFlex
      position="fixed"
      width="295px"
      height="350px"
      flexDirection="column"
      data-below={goUp}
    >
      <audio ref={audioRef}>
        <source src="/notif.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <Flex
        style={{
          borderTopRightRadius: "4px",
          borderTopLeftRadius: "4px",
          cursor: "pointer",
        }}
        bg="chatBlack"
        color="white"
        height="36px"
        onClick={() => {
          dispatch(openChat(false));
          setGoUp(goUp ? 0 : 1);
          setTimeout(() => {
            msgRef.current.scrollIntoView();
          }, 100);
        }}
      >
        <Flex pt="4px" pl="4px">
          <CloseIcon
            style={{
              fontSize: "27px",
            }}
          />
        </Flex>
        <Flex alignItems="center" justifyContent="center" flex="1">
          <Box>
            <TextType variant="ChatHeader">{`Send ${
              CurrentPatient?.Name ||
              (providerDetails &&
                `${providerDetails.Salutation}${providerDetails.FirstName}`) ||
              ""
            } a message`}</TextType>
          </Box>
        </Flex>
        <Flex></Flex>
      </Flex>
      <Flex
        height="100%"
        bg="ThemeColor2"
        flexDirection="column"
        style={{
          overflowY: "scroll",
        }}
        p="5px"
      >
        {renderChatMessages()}
        <Flex ref={msgRef} />
      </Flex>
      <Flex p="10px" bg="mainBg">
        <Box width="100%" mr="10px">
          <TextField
            value={typedMessaage}
            placeholder="Type your message"
            br="5px"
            fullWidth
            bg={theme.color.ThemeColor2}
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
            onChange={(e) => setTypedMessage(e.target.value)}
            onKeyUp={(e) => e.keyCode === 13 && sendMessage()}
          />
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
          onClick={sendMessage}
        >
          Send
        </Button>
      </Flex>
    </AnimatedFlex>
  );
};

export default withTheme(ChatModule);
