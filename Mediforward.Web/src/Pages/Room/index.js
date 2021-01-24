import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  Flex,
  Button,
  TextType,
  Breakpoints,
  Box,
} from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import FormField from "@root/src/Components/Molecules/FormField";
import CurrentCallDetailsSection from "@root/src/Components/Molecules/Navbar/Sections/CurrentCallDetailsSection";
import OtherPatientListSection from "@root/src/Components/Molecules/Navbar/Sections/OtherPatientListSection";
import ProviderCallDetailsSection from "@root/src/Components/Molecules/Navbar/Sections/ProviderCallDetailsSection";
import {
  getProviderName,
  checkIfPatientExists,
  setPatients,
  removePatient,
  uploadFile,
  clearFile,
  getRoomDetails,
  clearPatientDetails,
  logout,
  setPatientConnection,
  setProfileImage,
  setPatientPicture,
  roomCleanUp,
  clearPatientPicture,
  snackBarConfig,
  setMessageRead,
  setSecondaryPatient,
} from "@root/src/Redux/ActionCreators";
import Env from "@root/Env";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VideoPreview from "@root/src/Components/Molecules/VideoPreview";
import NavBar from "@root/src/Components/Molecules/Navbar";
import CallEndIcon from "@material-ui/icons/CallEnd";
import styled from "@emotion/styled";
import { push } from "connected-react-router";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { PatientAppointment } from "@root/src/Components/Molecules/Navbar/Sections/PatientListSection";
import PaymentIcon from "@material-ui/icons/Payment";
import InputAdornment from "@material-ui/core/InputAdornment";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloseIcon from "@material-ui/icons/Close";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import RoomElement from "@root/src/Components/Molecules/RoomElement";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import MicOffIcon from "@material-ui/icons/MicOff";
import { useBreakpoints } from "@root/src/Components/Atoms/Breakpoints";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import MicIcon from "@material-ui/icons/Mic";
import VideocamIcon from "@material-ui/icons/Videocam";
import { useTranslation, Trans } from "@root/src/Translation";
import { ValidateEmail } from "@root/Utilities/regex";

const ParentFlex = styled(Flex)`
  overflow: hidden;
`;

const AnimatedFlex = styled(Flex)`
  transition: top ${(props) => props.time || 1}s
    cubic-bezier(0.42, 0, 0.23, 1.39);
  top: 100%;
  z-index: 100;
  ${ParentFlex}:hover & {
    top: 85%;
  }
`;
const HiddenDiv = styled(Flex)`
  display: none;
`;

const CallDisconnect = withTheme(({ theme, onClick }) => {
  return (
    <AnimatedFlex
      bg="rgba(0, 0, 0, 0.2)"
      position="absolute"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50px"
      width="50px"
      r="50%"
      style={{
        cursor: "pointer",
        left: "47%",
      }}
      onClick={onClick}
    >
      <Box m="auto" color="red">
        <CallEndIcon />
      </Box>
    </AnimatedFlex>
  );
});

const Hidevideo = withTheme(
  ({ theme, onClick, objPublisher, selected, setSelected }) => {
    const objSize = useBreakpoints();
    return (
      <AnimatedFlex
        time="1.2"
        bg={selected ? "red" : "rgba(0, 0, 0, 0.2)"}
        position="absolute"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="50px"
        width="50px"
        r="50%"
        style={{
          cursor: "pointer",
          left:
            objSize?.breakSize === "xs" || objSize?.breakSize === "sm"
              ? "31%"
              : "40%",
        }}
        onClick={() => {
          objPublisher.publishVideo(selected);
          setSelected(!selected);
        }}
      >
        <Box m="auto" color="white">
          {selected ? <VideocamOffIcon /> : <VideocamIcon />}
        </Box>
      </AnimatedFlex>
    );
  }
);

const Mute = withTheme(({ theme, onClick, objPublisher }) => {
  const [selected, setSelected] = useState(false);
  const objSize = useBreakpoints();
  return (
    <AnimatedFlex
      time="800m"
      bg={selected ? "red" : "rgba(0, 0, 0, 0.2)"}
      position="absolute"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50px"
      width="50px"
      r="50%"
      style={{
        cursor: "pointer",
        left:
          objSize?.breakSize === "xs" || objSize?.breakSize === "sm"
            ? "63%"
            : "54%",
      }}
      onClick={() => {
        objPublisher.publishAudio(selected);
        setSelected(!selected);
      }}
    >
      <Box m="auto" color="white">
        {selected ? <MicOffIcon /> : <MicIcon />}
      </Box>
    </AnimatedFlex>
  );
});

const NavbarToggle = withTheme(({ theme, onClick }) => {
  return (
    <Flex
      bg="rgba(0, 0, 0, 0.2)"
      position="absolute"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50px"
      width="50px"
      r="50%"
      style={{
        cursor: "pointer",
        top: "85%",
        left: "10%",
      }}
      onClick={onClick}
    >
      <Box m="auto" color="white">
        <ChevronLeftIcon />
      </Box>
    </Flex>
  );
});

const Room = ({ theme, match }) => {
  const { role, patientDetails, userTheme, Email, token } = useSelector(
    (state) => state.user
  );
  const { providerDetails, appointmentData, RoomData } = useSelector(
    (state) => state.patient
  );

  const t = useTranslation();

  const {
    CurrentAppointment,
    patients,
    ProviderProfile,
    objConnection: conObj,
    patientPicture,
  } = useSelector((state) => state.provider);
  const { appointmentToken, file } = useSelector((state) => state.common);
  const [open, setOpen] = useState(!role);
  const dispatch = useDispatch();
  const vidRef1 = useRef(null);
  const vidRef2 = useRef(null);
  const fileRef = useRef(null);
  const navbarRef = useRef(null);
  const { roomId, roomName } = match.params;
  const [permission, setPermnission] = useState(false);
  const [objConnection, setConnection] = useState(conObj);
  const [profileImage, setImage] = useState("");
  const [doctorDetails, setDetails] = useState();
  const [callStarted, setCallStatus] = useState(false);
  const [objSession, setSession] = useState();
  const [openGrp, setGrpOpen] = useState(false);
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [isPaymentProcessing, setProcessing] = useState(false);
  const [openFileTransfer, setFileTransferPopupStatus] = useState(false);
  const [doctorFile, setDocfile] = useState([]);
  const [openPatientFile, setPatientfileStatus] = useState(false);
  const [transferComplete, setTransferStatus] = useState(false);
  const [fileUploadedByPatient, setFileUploadedByPatient] = useState(false);
  const [objPublisher, setPublisher] = useState();
  const [objOT, setOT] = useState();
  const [vidStatus, setVidStatus] = useState(false);
  const [paticipants, setParticipants] = useState([]);
  const [showPatientPicture, setShowPicture] = useState(false);
  const [openScreenShare, setOpenScreenShare] = useState(false);
  const [shareMyScreen, setShareMyScreen] = useState(false);
  const [objScreenPublisher, setScreenPublisher] = useState();
  const [openPatientPayment, setOpenPatientPayment] = useState(false);
  const [paymentData, setPaymentData] = useState();
  const [paymentResponse, setPaymentResponse] = useState();
  const [docStatus, setDocStatus] = useState("offlineRed");
  const otherPatients = patients?.filter(
    (item) => item.PatientId !== CurrentAppointment?.PatientId
  );
  const audioRef = useRef(null);

  useEffect(() => {
    if (patientPicture) {
      setShowPicture(true);
    }
  }, [patientPicture]);

  const closeConnection = useCallback(() => {
    const obj = {};
    if (role === "doctor" || role === "admin") {
      obj.ParticipantId = providerDetails && providerDetails.ProviderId;
      obj.AppointmentId = CurrentAppointment.AppointmentId;
    } else {
      obj.ParticipantId = appointmentData && appointmentData.PatientId;
      obj.AppointmentId = appointmentData.AppointmentId;
    }
    obj.Role = role;
    obj.RoomId = roomId;
    obj.Status = "I";
    objConnection?.invoke("CallEnd", JSON.stringify(obj));
  }, [
    role,
    appointmentData,
    providerDetails,
    objConnection,
    CurrentAppointment,
    roomId,
  ]);

  const DoctorOffline = useCallback(
    (res) => {
      const objMessage = JSON.parse(res);

      if (objMessage?.ProviderId === providerDetails.ProviderId) {
        setDocStatus("offlineRed");
      }
    },
    [providerDetails]
  );

  console.log("status", docStatus);

  const DoctorOnline = useCallback(
    (res) => {
      const objMessage = JSON.parse(res);
      if (objMessage?.ProviderId === providerDetails.ProviderId) {
        objConnection.invoke(
          "ParticipantJoined",
          JSON.stringify({
            AppointmentId: parseInt(appointmentData.AppointmentId, 10),
            SessionId: appointmentData.RoomSID,
            RoomId: parseInt(roomId, 10),
            ParticipantId: parseInt(appointmentData.PatientId, 10),
            ProfileImage: profileImage,
            Role: role,
            HostName: window.location.hostname.replace(".mediforward.in", ""),
          })
        );
      }
    },
    [providerDetails, appointmentData, roomId, profileImage, role]
  );

  const doctorJoinedCallUnMemo = (res) => {
    const objMessage = JSON.parse(res);
    setCallStatus(true);
    import("@opentok/client").then((OT) => {
      const session = OT.initSession(Env.key1, appointmentData.RoomSID);
      const publisher = OT.initPublisher(
        "local-media",
        {
          insertMode: "append",
          width: "100%",
          height: "100%",
        },
        (error) => {
          console.error(error);
        }
      );
      if (objMessage.VoiceCall) {
        publisher.publishVideo(false);
      }
      setSession(session);
      setOT(OT);
      setPublisher(publisher);
      session.connect(appointmentToken.AccessToken, (error) => {
        // If the connection is successful, publish to the session
        if (error) {
          console.log(error);
        } else {
          session.publish(publisher, (error1) => {
            console.log(error1);
          });
        }
      });
      session.on("streamCreated", (event) => {
        if (event.stream.videoType === "screen") {
          setShareMyScreen(true);
          session.subscribe(
            event.stream,
            "screen-share",
            {
              insertMode: "append",
              width: "100%",
              height: "100%",
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          session.subscribe(
            event.stream,
            "remote-media-div",
            {
              insertMode: "append",
              width: "100%",
              height: "100%",
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
      session.on("streamDestroyed", (event) => {
        // The user clicked stop.
        if (event.stream.videoType === "screen") {
          setShareMyScreen(false);
        }
      });
    });
  };

  const doctorJoinedCall = useCallback(doctorJoinedCallUnMemo, [
    appointmentData,
    appointmentToken,
  ]);

  const FileUploaded = useCallback((res) => {
    const objFile = JSON.parse(res);
    setDocfile(objFile);
    setPatientfileStatus(true);
  }, []);

  const FileUploadedByPatient = useCallback((res) => {
    const objFile = JSON.parse(res);
    setDocfile(objFile);
    setFileUploadedByPatient(true);
  }, []);

  const FileUploadRequested = useCallback((res) => {
    setFileTransferPopupStatus(true);
  }, []);

  const JoinGroupCall = useCallback(
    (res) => {
      setCallStatus(true);
      const callDetails = JSON.parse(res);
      objSession?.disconnect();
      objConnection?.invoke(
        "RegisterForAppointment",
        JSON.stringify({
          AppointmentId: callDetails.AppointmentId,
        })
      );
      dispatch(setSecondaryPatient(callDetails));
      import("@opentok/client").then((OT) => {
        const session = OT.initSession(Env.key1, callDetails.SessionId);
        const publisher = OT.initPublisher(
          "local-media",
          {
            insertMode: "append",
            width: "100%",
            height: "100%",
          },
          (error) => {
            console.error(error);
          }
        );
        setSession(session);
        setOT(OT);
        setPublisher(publisher);
        session.connect(callDetails.AccessToken, (error) => {
          // If the connection is successful, publish to the session
          if (error) {
            console.log(error);
          } else {
            session.publish(publisher, (error1) => {
              console.log(error1);
            });
          }
        });

        session.on("streamCreated", (event) => {
          if (event.stream.videoType === "screen") {
            setShareMyScreen(true);
            session.subscribe(
              event.stream,
              "screen-share",
              {
                insertMode: "append",
                width: "100%",
                height: "100%",
              },
              (error) => {
                console.log(error);
              }
            );
          } else {
            session.subscribe(
              event.stream,
              "remote-media-div",
              {
                insertMode: "append",
                width: "100%",
                height: "100%",
              },
              (error) => {
                console.log(error);
              }
            );
          }
        });
        session.on("streamDestroyed", (event) => {
          // The user clicked stop.
          if (event.stream.videoType === "screen") {
            setShareMyScreen(false);
          }
        });
      });
    },
    [objConnection, objSession]
  );

  const PatientJoined = useCallback((res) => {
    const patientInfo = JSON.parse(res);
    dispatch(setPatients(patientInfo));
  }, []);

  const ParticipantDisconnected = useCallback(
    (res) => {
      audioRef.current?.play();
      const participantDetails = JSON.parse(res);
      dispatch(removePatient(participantDetails));
      if (role === "doctor" || role === "admin") {
        objSession.disconnect();
        dispatch(
          snackBarConfig({
            open: true,
            variant: "alert",
            snackbarText: `${
              CurrentAppointment?.Name || "Patient"
            } has left the call.`,
          })
        );
        if (!CurrentAppointment?.reload)
          setTimeout(() => {
            dispatch(push("/account/dashboard"));
          }, 500);
      }
      if (
        role === "patient" &&
        participantDetails.AppointmentId === appointmentData.AppointmentId
      ) {
        objSession?.disconnect();
        dispatch(logout());
        closeConnection();
        setTimeout(() => {
          closeConnection();
          window.location.reload();
        }, 100);
      }
    },
    [
      role,
      objSession,
      appointmentData,
      providerDetails,
      objConnection,
      CurrentAppointment,
      roomId,
    ]
  );

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

  const DoctorJoined = useCallback(
    (message) => {
      const docDetails = JSON.parse(message);
      setDetails(docDetails);
      if (!open && role) {
        objConnection
          .invoke(
            "ParticipantJoined",
            JSON.stringify({
              AppointmentId: parseInt(appointmentData.AppointmentId, 10),
              SessionId: appointmentData.RoomSID,
              RoomId: parseInt(roomId, 10),
              ParticipantId: parseInt(appointmentData.PatientId, 10),
              ProfileImage: profileImage,
              Role: role,
              HostName: window.location.hostname.replace(".mediforward.in", ""),
            })
          )
          .catch(function (err) {
            return console.error(err.toString());
          });
      }
    },
    [objConnection, appointmentData, profileImage, roomId, role]
  );

  const TakePhoto = useCallback(
    (res) => {
      const canvas = document.createElement("canvas");
      try {
        const objMessage = JSON.parse(res);
        canvas.width = 700;
        canvas.height = 500;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        const videoElement = document
          .getElementById("local-media")
          .getElementsByClassName("OT_video-element");
        ctx.drawImage(videoElement[0], 0, 0, 700, 500);
        const data = canvas.toDataURL("image/png", 0.5);
        objConnection?.invoke(
          "SendPhoto",
          JSON.stringify({
            Picture: data,
            AppointmentId: appointmentData?.AppointmentId,
            Role: role,
            RoomId: roomId,
            ParticipantId: parseInt(appointmentData.PatientId, 10),
            SenderId: objMessage.SenderId,
            SenderType: objMessage.SenderType,
          })
        );
      } catch (ex) {
      } finally {
        canvas.remove();
      }
    },
    [vidRef2, appointmentData, role, roomId, objPublisher]
  );

  const RecievePhoto = useCallback((res) => {
    const objMessage = JSON.parse(res);
    dispatch(setPatientPicture(objMessage.Picture));
  }, []);

  const AskForScreenShare = useCallback((res) => {
    setOpenScreenShare(true);
  }, []);

  const patientPaymentCallback = useCallback(
    (objResult, payment) => {
      setOpenPatientPayment(true);
      const paymentStatusData = {
        RoomId: roomId,
        AppointmentId: appointmentData.AppointmentId,
        OrderId: payment.Id,
        ProviderId: payment.ProviderId,
      };
      if (!objResult) paymentStatusData.OrderStatus = "Cancelled";
      else if (objResult.error) {
        window.objRazr.close();
        document.getElementsByClassName("razorpay-container")[0].style.display =
          "none";
        paymentStatusData.OrderStatus = "Failed";
        paymentStatusData.Error = objResult.error;
      } else {
        paymentStatusData.RazorPayPaymentId = objResult.razorpay_payment_id;
        paymentStatusData.RazorPaySignature = objResult.razorpay_signature;
        paymentStatusData.OrderStatus = "Successful";
      }
      objConnection?.invoke(
        "UpdatePaymentStatus",
        JSON.stringify(paymentStatusData)
      );
      setPaymentResponse(objResult || { error: "Payment Cancelled" });
    },
    [objConnection, roomId, appointmentData, paymentData]
  );

  const AskforPayment = useCallback(
    (res) => {
      const objPayment = JSON.parse(res);
      const options = {
        key: Env.key2, // Enter the Key ID generated from the Dashboard
        amount: objPayment.Amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "mediforward",
        description: "Test Transaction",
        image: userTheme && `${Env.baseUrl}${userTheme.Logo}`,
        order_id: objPayment.RazorPayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: (data) => patientPaymentCallback(data, objPayment),
        prefill: {
          name: appointmentData.Name,
          email: Email,
        },
        theme: {
          color: theme.color.ThemeColor1,
        },
        notes: {
          address: "home",
        },
        modal: {
          ondismiss: (data) => patientPaymentCallback(data, objPayment),
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", (data) =>
        patientPaymentCallback(data, objPayment)
      );
      rzp1.on("payment.error", (data) =>
        patientPaymentCallback(data, objPayment)
      );
      window.objRazr = rzp1;
      setPaymentData(objPayment);
      setOpenPatientPayment(true);
    },
    [appointmentData]
  );

  const UpdatePaymentStatus = useCallback((res) => {
    const objMessage = JSON.parse(res);
    setPaymentResponse(objMessage);
    setProcessing(false);
  }, []);

  const onDocStatusSchange = useCallback((res) => {
    const objMessage = JSON.parse(res);
    console.log("res", res);
    setDocStatus(objMessage.status);
  }, []);

  useEffect(() => {
    if (
      typeof objConnection?.off === "function" &&
      typeof objConnection?.on === "function"
    ) {
      objConnection?.off("DoctorJoinedCall");
      objConnection?.on("DoctorJoinedCall", doctorJoinedCall);
      objConnection?.off("FileUploaded");
      objConnection?.on("FileUploaded", FileUploaded);
      objConnection?.off("FileUploadedByPatient");
      objConnection?.on("FileUploadedByPatient", FileUploadedByPatient);
      objConnection?.off("FileUploadRequested");
      objConnection?.on("FileUploadRequested", FileUploadRequested);
      objConnection?.off("JoinGroupCall");
      objConnection?.on("JoinGroupCall", JoinGroupCall);
      objConnection?.off("PatientJoined");
      objConnection?.on("PatientJoined", PatientJoined);
      objConnection?.off("ParticipantDisconnected");
      objConnection?.on("ParticipantDisconnected", ParticipantDisconnected);
      objConnection?.off("FileTransferAccepted");
      objConnection?.on("FileTransferAccepted", FileTransferAccepted);
      objConnection?.off("DoctorJoined");
      objConnection?.on("DoctorJoined", DoctorJoined);
      objConnection?.off("TakePhoto");
      objConnection?.on("TakePhoto", TakePhoto);
      objConnection?.off("RecievePhoto");
      objConnection?.on("RecievePhoto", RecievePhoto);
      objConnection?.off("AskForScreenShare");
      objConnection?.on("AskForScreenShare", AskForScreenShare);
      objConnection?.off("AskforPayment");
      objConnection?.on("AskforPayment", AskforPayment);
      objConnection?.off("UpdatePaymentStatus");
      objConnection?.on("UpdatePaymentStatus", UpdatePaymentStatus);
      objConnection?.off("DoctorOnline");
      objConnection?.on("DoctorOnline", DoctorOnline);
      objConnection?.off("DoctorOffline");
      objConnection?.on("DoctorOffline", DoctorOffline);
      objConnection?.off("onDocStatusSchange");
      objConnection?.on("onDocStatusSchange", onDocStatusSchange);
    }
  });

  const NavItems =
    role === "doctor" || role === "admin"
      ? [
          {
            id: 1,
            NavText: "Photo Capture",
            icon: CameraAltIcon,
            onClick: () => {
              objConnection?.invoke(
                "TakePhoto",
                JSON.stringify({
                  SenderId: ProviderProfile.ProviderId,
                  SenderType: role,
                  ParticipantId: CurrentAppointment?.PatientId,
                  RoomId: roomId,
                  AppointmentId: CurrentAppointment?.AppointmentId,
                })
              );
            },
          },
          {
            id: 2,
            NavText: "Group Call",
            icon: GroupAddIcon,
            onClick: () => setGrpOpen(true),
          },
          {
            id: 3,
            NavText: "Screenshare",
            icon: ScreenShareIcon,
            onClick: () => setOpenScreenShare(true),
          },
          {
            id: 4,
            NavText: "Payment",
            icon: PaymentIcon,
            onClick: () => setPaymentOpen(true),
          },
          {
            id: 5,
            NavText: "File Transfer",
            icon: FileCopyIcon,
            onClick: () => setFileTransferPopupStatus(true),
          },
        ]
      : [];

  const onPlay = (e) => {
    let canvas = document.createElement("canvas");
    canvas.width = 165;
    canvas.height = 165;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(vidRef1.current, 0, 0, 165, 165);
    const data = canvas.toDataURL("image/png");
    setImage(data);
    dispatch(setProfileImage(data));
    canvas.remove();
  };

  const gotStream = (stream, allow) => {
    setPermnission(true);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Create an AudioNode from the stream
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to destination to hear yourself
    // or any other node for processing!
    mediaStreamSource.connect(audioContext.destination);
    stream.getAudioTracks()[0].enabled = false;
    const videoTracks = stream.getVideoTracks();
    window.roomStream = stream; // make variable available to browser console
    if (vidRef1.current !== null) {
      vidRef1.current.srcObject = stream;
    } else {
      setTimeout(() => {
        vidRef1.current.srcObject = stream;
      }, 1000);
    }
    if (allow) {
      setTimeout(() => {
        setOpen(false);
      }, 4000);
    }
  };

  const onfail = (error) => {
    console.log(
      `permission not granted or system don't have media devices.${error.name}`
    );
  };

  useEffect(() => {
    if (appointmentToken && permission && appointmentData && objConnection) {
      objConnection
        .invoke(
          "ParticipantJoined",
          JSON.stringify({
            AppointmentId: parseInt(appointmentData.AppointmentId, 10),
            SessionId: appointmentData.RoomSID,
            RoomId: parseInt(roomId, 10),
            ParticipantId: parseInt(appointmentData.PatientId, 10),
            ProfileImage: profileImage,
            Role: role,
            HostName: window.location.hostname.replace(".mediforward.in", ""),
          })
        )
        .catch(function (err) {
          return console.error(err.toString());
        });
    }
  }, [
    appointmentToken,
    permission,
    profileImage,
    appointmentData,
    objConnection,
  ]);

  useEffect(() => {
    if (token) {
      let con;
      if (!conObj) {
        con = new HubConnectionBuilder()
          .withUrl(`${Env.baseUrl}/mediHub`, {
            accessTokenFactory: () => token,
          })
          .withAutomaticReconnect([0, 1000, 5000, null])
          .build();
        con
          .start()
          .then(() => {
            setConnection(con);
            dispatch(setPatientConnection(con));
          })
          .catch((ex) => console.log(ex));
      }

      dispatch(getProviderName({ Id: parseInt(roomId), ProviderId: 0 }));
      dispatch(getRoomDetails({ Id: parseInt(roomId), RoomName: roomName }));
      return () => {
        con?.stop();
        if (window.roomStream) {
          window.roomStream.getTracks().forEach((track) => {
            track.stop();
          });
        }
        dispatch(roomCleanUp());
      };
    }
  }, [token]);

  useEffect(() => {
    if (typeof objConnection?.invoke === "function") {
      if (role === "doctor" || role === "admin") {
        objConnection
          ?.invoke(
            "GetProviderSRClientId",
            JSON.stringify({
              ProviderId: ProviderProfile.ProviderId,
            })
          )
          .then((err, val) => {
            console.log(err, val);
          })
          .catch(function (err) {});
      } else {
        objConnection
          .invoke("GetSRClientId", "test")
          .then((err, val) => {
            console.log(err, val);
          })
          .catch(function (err) {
            return console.error(err.toString());
          });
      }
      if ((role === "doctor" || role === "admin") && CurrentAppointment) {
        import("@opentok/client").then((OT) => {
          const session = OT.initSession(
            Env.key1,
            CurrentAppointment.SessionId
          );
          const publisher = OT.initPublisher(
            "local-media",
            {
              insertMode: "append",
              width: "100%",
              height: "100%",
            },
            (error) => {
              console.error(error);
            }
          );
          if (CurrentAppointment.voiceCall) {
            publisher.publishVideo(false);
          }
          setSession(session);
          setOT(OT);
          setPublisher(publisher);
          session.connect(appointmentToken.AccessToken, (error) => {
            // If the connection is successful, publish to the session
            if (error) {
              console.log(error);
            } else {
              session.publish(publisher, (error1) => {
                console.log(error1);
              });
            }
          });
          session.on("streamCreated", (event) => {
            if (event.stream.videoType === "screen") {
              setShareMyScreen(true);
              session.subscribe(
                event.stream,
                "screen-share",
                {
                  insertMode: "append",
                  width: "100%",
                  height: "100%",
                },
                (error) => {
                  console.log(error);
                }
              );
            } else {
              session.subscribe(
                event.stream,
                "remote-media-div",
                {
                  insertMode: "append",
                  width: "100%",
                  height: "100%",
                },
                (error) => {
                  console.log(error);
                }
              );
            }
          });
          session.on("streamDestroyed", (event) => {
            // The user clicked stop.
            if (event.stream.videoType === "screen") {
              setShareMyScreen(false);
            }
          });
        });
      }
    }
  }, [objConnection]);

  useEffect(() => {
    if (appointmentData) {
      if (permission) setOpen(false);
    }
  }, [appointmentData]);

  useEffect(() => {
    window.onbeforeunload = closeConnection;
    return () => {
      window.onbeforeunload = null;
    };
  }, [
    objConnection,
    patients,
    appointmentData,
    role,
    CurrentAppointment,
    roomId,
  ]);

  useLayoutEffect(() => {
    navigator.permissions
      .query({ name: "camera" })
      .then((permission) => {
        if (permission.state === "granted") {
          navigator.permissions
            .query({ name: "microphone" })
            .then((inputPermission) => {
              if (inputPermission.state === "granted") {
                setPermnission(true);
                setTimeout(() => {
                  navigator.mediaDevices
                    .getUserMedia({ audio: true, video: true })
                    .then((stream) => gotStream(stream))
                    .catch((err) => onfail(err));
                }, 500);
              }
            })
            .catch((error) => {
              console.log("Got error :", error);
            });
        }
      })
      .catch((error) => {
        console.log("Got error :", error);
      });
  }, []);

  useEffect(() => {
    if (
      file &&
      objConnection &&
      (CurrentAppointment || (appointmentData && providerDetails))
    ) {
      const arrfiles = [];
      file?.forEach((objFile) => {
        arrfiles.push(
          role === "doctor" || role === "admin"
            ? {
                AppointmentId: CurrentAppointment.AppointmentId,
                RoomId: roomId,
                ParticipantId: CurrentAppointment.PatientId,
                Role: role,
                Path: objFile.path,
                FileName: objFile.FileName,
                Size: objFile.Size,
                ProviderId: ProviderProfile?.ProviderId,
                HostName: window.location.hostname.replace(
                  ".mediforward.in",
                  ""
                ),
              }
            : {
                AppointmentId: appointmentData.AppointmentId,
                RoomId: roomId,
                ParticipantId: providerDetails.ProviderId,
                Role: role,
                Path: objFile.path,
                FileName: objFile.FileName,
                Size: objFile.Size,
                HostName: window.location.hostname.replace(
                  ".mediforward.in",
                  ""
                ),
              }
        );
      });
      objConnection.invoke("FileUploaded", JSON.stringify(arrfiles));
    }
  }, [
    file,
    objConnection,
    CurrentAppointment,
    roomId,
    role,
    appointmentData,
    providerDetails,
    ProviderProfile,
  ]);

  const handleSubmit = (values) => {
    debugger;
    dispatch(
      checkIfPatientExists({
        ...values,
        show: !permission,
        RoomId: parseInt(roomId),
      })
    );
  };

  const chargeAmount = (values) => {
    objConnection.invoke(
      "AskforPayment",
      JSON.stringify({
        AppointmentId: CurrentAppointment.AppointmentId,
        RoomId: roomId,
        ParticipantId: CurrentAppointment.PatientId,
        Role: role,
        ProviderId: providerDetails.ProviderId,
        Amount: values.amount,
      })
    );
    setProcessing(true);
  };

  const onDisconnectClick = () => {
    objSession.disconnect();
    setCallStatus(false);
    if (role === "doctor" || role === "admin") {
      closeConnection();
      setTimeout(() => {
        dispatch(push("/account/dashboard"));
      }, 100);
    }
    if (role === "patient") {
      dispatch(logout());
      closeConnection();
      setTimeout(() => {
        closeConnection();
        window.location.reload();
      }, 100);
    }
  };

  const navBarDisplay = () => {
    if (role === "patient" && callStarted) return "";
    return (
      <NavBar
        NavItems={NavItems}
        ref={navbarRef}
        hideBg
        section1={
          role &&
          (role !== "patient" ? (
            <CurrentCallDetailsSection />
          ) : (
            <ProviderCallDetailsSection />
          ))
        }
        section3={
          role &&
          role !== "patient" &&
          otherPatients?.length > 0 && (
            <OtherPatientListSection
              patientList={otherPatients}
              clickHandler={() => closeConnection()}
            />
          )
        }
      />
    );
  };

  const groupCallCondition = () => {
    if (patients && CurrentAppointment) {
      const callParticipants = patients.filter(
        (item) => item.AppointmentId !== CurrentAppointment.AppointmentId
      );
      return callParticipants;
    }
    return [];
  };

  const renderCallParticipants = (participants = []) => {
    return (
      <>
        {participants.map((item) => (
          <PatientAppointment
            key={Math.random()}
            patient={item}
            onClick={(patient) => {
              objConnection.invoke(
                "JoinGroupCall",
                JSON.stringify({
                  AppointmentId: patient.AppointmentId,
                  RoomId: roomId,
                  ParticipantId: patient.PatientId,
                  SessionId: CurrentAppointment.SessionId,
                  CurrentAppointmentId: CurrentAppointment.AppointmentId,
                  ProfileImage: patient.ProfileImage,
                  Role: "patient",
                })
              );
              setGrpOpen(false);
            }}
          />
        ))}
      </>
    );
  };

  const readerLoad = (e, name) => {
    dispatch(
      uploadFile({
        name,
        Content: e.target.result,
      })
    );
  };

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
                  {`${file.FileName} sent to ${
                    CurrentAppointment?.Name ||
                    `${providerDetails?.Salutation} ${providerDetails?.FirstName} ${providerDetails?.LastName}`
                  }.`}
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
                    <Trans langKey="sendMore" />
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
                  <Trans langKey="Cancel" />
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
                  {role === "doctor" || role === "admin"
                    ? CurrentAppointment &&
                      `Waiting for ${CurrentAppointment.Name} to start download ...`
                    : providerDetails &&
                      `Waiting for ${providerDetails.Salutation} ${providerDetails.FirstName} to start download...`}
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
            {role === "patient" ? (
              <TextType variant="SubHeader">
                {providerDetails &&
                  `${providerDetails.Salutation} ${providerDetails.FirstName} wants to send you a file.`}
              </TextType>
            ) : (
              <TextType variant="SubHeader">
                {CurrentAppointment &&
                  `${CurrentAppointment.Name} wants to send you a file.`}
              </TextType>
            )}
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
                    AppointmentId:
                      appointmentData?.AppointmentId ||
                      CurrentAppointment?.AppointmentId,
                    RoomId: roomId,
                    ParticipantId:
                      appointmentData?.PatientId ||
                      CurrentAppointment?.PatientId,
                    Role: role,
                  })
                );
              }}
            >
              <Trans langKey="download" />
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
          <TextType variant="Regular">
            <Trans langKey="dnd" />
          </TextType>
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
            <Trans langKey="selectFile" />
          </Button>
        </Box>
      </Flex>
    );
  };

  const renderPaymentPopup = () => {
    if (!isPaymentProcessing) {
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          width="100%"
          flexDirection="column"
        >
          <Flex mx="auto">
            <TextType variant="AmountText">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(paymentData?.Amount)}
            </TextType>
          </Flex>
          <Box width="100%" mx="auto" mt="8px">
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
              onClick={(e) => {
                setOpenPatientPayment(false);
                window.objRazr?.open();
                setProcessing(true);
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              Make Payment
            </Button>
          </Box>
        </Flex>
      );
    }
    if (!paymentResponse) {
      return (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <TextType variant="LargeRegular">Please Wait</TextType>
          <TextType variant="PopupSubHeader">Payment is processing</TextType>
          <Flex>
            <img alt="loader" src="/Spinner.svg" />
          </Flex>
        </Flex>
      );
    }
    if (paymentResponse) {
      return (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box m="auto">
            <TextType
              variant={
                paymentResponse.error ? "AmountTextFailure" : "AmountText"
              }
            >{`Payment ${
              paymentResponse.error ? "Failure!!!" : "Success!!"
            }`}</TextType>
          </Box>
        </Flex>
      );
    }
  };

  return (
    <Flex
      width="100%"
      bg="mainBg"
      flexDirection={["column", "column", "row", "row"]}
      height="100%"
    >
      <audio
        style={{
          display: "none",
        }}
        ref={audioRef}
      >
        <source src="/disconnect.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <Flex>{navBarDisplay()}</Flex>
      <Flex
        flex="1"
        position="relative"
        width="100%"
        height="100%"
        flexDirection="column"
      >
        {callStarted || role === "doctor" || role === "admin" ? (
          <ParentFlex
            position="relative"
            width="100%"
            height="100%"
            id="videos"
          >
            <Flex width="100%" id="remote-media-div" />
            <CallDisconnect onClick={onDisconnectClick} />
            <Hidevideo
              selected={vidStatus}
              setSelected={setVidStatus}
              objPublisher={objPublisher}
            />
            <Mute objPublisher={objPublisher} />
          </ParentFlex>
        ) : (
          <Flex
            flexDirection="column"
            width="100%"
            height="100%"
            pl="20px"
            pt={["0px", "0px", "40px", "40px"]}
            pr="20px"
            style={{
              overflowY: "scroll",
            }}
          >
            {role === "patient" && RoomData?.Elements && (
              <>
                {RoomData.Elements.map((item) => (
                  <RoomElement key={item.id} ElementJson={item} />
                ))}
              </>
            )}
            <Breakpoints xs sm>
              <Flex
                p="16px"
                minHeight="120px"
                width="100%"
                flexDirection="column"
                bg="ThemeColor2"
              >
                <Box mb="25px">
                  <TextType variant="NameHeader">
                    {providerDetails &&
                      `${providerDetails.Salutation} ${providerDetails.FirstName}`}
                  </TextType>
                </Box>
                <Flex
                  minHeight="30px"
                  bg={docStatus}
                  p="3px"
                  width="28%"
                  alignItems="center"
                  justifyContent="center"
                  r="4px"
                  mb="10px"
                >
                  <Box mx="auto">
                    <TextType variant={docStatus}>
                      <Trans langKey={docStatus} />
                    </TextType>
                  </Box>
                </Flex>
                <Flex>
                  <TextType variant="StatusText">
                    Your call will start soon.
                  </TextType>
                </Flex>
              </Flex>
            </Breakpoints>
            <Breakpoints md lg>
              <Flex
                style={{
                  right: 0,
                  top: "40%",
                }}
                bg="ThemeColor2"
                position="absolute"
                width="220px"
                mr="25px"
                flexDirection="column"
                r="4px"
                minWidth="220px"
                p="10px"
              >
                <Box mb="10px">
                  <TextType variant="NameHeader">
                    {providerDetails &&
                      `${providerDetails.Salutation} ${providerDetails.FirstName}`}
                  </TextType>
                </Box>
                <Flex
                  minHeight="30px"
                  bg={docStatus}
                  p="3px"
                  width="30%"
                  alignItems="center"
                  justifyContent="center"
                  r="4px"
                  mb="10px"
                >
                  <Box mx="auto">
                    <TextType variant={docStatus}>
                      <Trans langKey={docStatus} />
                    </TextType>
                  </Box>
                </Flex>
                <Flex>
                  <TextType variant="StatusText">
                    Your call will start soon.
                  </TextType>
                </Flex>
              </Flex>
            </Breakpoints>
          </Flex>
        )}
        {callStarted ? (
          <VideoPreview
            style={{
              right: 0,
              top: 0,
            }}
            callStarted={callStarted}
            ref={vidRef2}
            capturePhoto={(pic) => {
              dispatch(setProfileImage(pic));
              setImage(pic);
            }}
            hideBg
            hideVideo={vidStatus}
            zIndex="2"
            id="local-media"
          />
        ) : (
          <>
            <VideoPreview
              style={{
                right: 0,
                top: 0,
              }}
              hideBg
              callStarted={callStarted}
              ref={vidRef2}
              zIndex="2"
              permissionStatus={permission}
              checkVideoPermission
              hideVideo={vidStatus}
            />
            <HiddenDiv id="local-media" />
          </>
        )}

        <Form
          onSubmit={handleSubmit}
          validate={(values) => {
            const error = {};
            if (values.Email && !ValidateEmail(values.Email)) {
              error.Email = "Please enter a valid email.";
            }
            return error;
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
                <Dialog
                  open={open}
                  variant="outlined"
                  color="primary"
                  scrimClickAction=""
                  escapeKeyAction=""
                  fullWidth="lg"
                >
                  <Flex minHeight="452px" width="100%">
                    <Flex
                      width={["100%", "100%", "64%", "64%"]}
                      flexDirection="column"
                      pb="25px"
                      px="10px"
                    >
                      <DialogTitle id="form-dialog-title">Welcome!</DialogTitle>
                      {appointmentData ? (
                        <>
                          {" "}
                          <DialogContent>
                            <DialogContentText>
                              To have a video call please give us access to your
                              camera and microphone
                            </DialogContentText>
                            <Button
                              onClick={() => {
                                navigator.mediaDevices
                                  .getUserMedia({ audio: true, video: true })
                                  .then((stream) => gotStream(stream, true))
                                  .catch((err) => onfail(err));
                              }}
                              styleProps={{
                                background: theme.color.ThemeColor1,
                                fontFamily: theme.fontFamily,
                                lineHeight: "18.2px",
                                textTransform: "capitalize",
                                boxShadow: "none",
                              }}
                            >
                              Give Access to Mic and Camera
                            </Button>
                          </DialogContent>
                        </>
                      ) : (
                        <>
                          <DialogContent>
                            <DialogContentText>
                              {console.log("errors",errors)}
                              <TextType variant="h1">
                                {providerDetails &&
                                  `Please check in below to let ${providerDetails.Salutation} ${providerDetails.FirstName} know you are here`}
                              </TextType>
                            </DialogContentText>
                            <FormField
                              autoFocus
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
                              notRequired
                              fieldName="Email"
                              placeholder="Email"
                            />
                            <FormField
                              errors={errors}
                              touched={touched}
                              notRequired
                              fieldName="PhoneNumber"
                              placeholder="Phone Number"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Box ml="6px">+91</Box>
                                  </InputAdornment>
                                ),
                              }}
                              maxLength={10}
                            />
                            {RoomData?.UsePasscode && (
                              <FormField
                                errors={errors}
                                touched={touched}
                                fieldName="RoomCode"
                                placeholder="Passcode"
                              />
                            )}
                          </DialogContent>
                          <DialogContent>
                            <Button
                              onClick={(values) => {
                                form.submit(values);
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
                              Check In
                            </Button>
                          </DialogContent>
                        </>
                      )}
                    </Flex>
                    <Breakpoints md lg>
                      <Flex width="50%">
                        {permission ? (
                          <video
                            onCanPlay={onPlay}
                            width="100%"
                            height="100%"
                            style={{
                              objectFit: "cover",
                            }}
                            ref={vidRef1}
                            id="local"
                            autoplay=""
                          ></video>
                        ) : (
                          <Flex
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            height="100%"
                            width="100%"
                            bg="matBlack"
                            color="fillGrey"
                          >
                            <VideocamOffIcon style={{ fontSize: "70px" }} />
                          </Flex>
                        )}
                      </Flex>
                    </Breakpoints>
                  </Flex>
                </Dialog>
              </form>
            );
          }}
        />
      </Flex>
      <Dialog
        open={openGrp}
        variant="outlined"
        color="primary"
        scrimClickAction=""
        escapeKeyAction=""
        fullWidth="lg"
      >
        <Flex flexDirection="column" width="100%" height="100%">
          <DialogTitle id="form-dialog-title">
            <Flex>
              <Box mr="6px">
                <GroupAddIcon />
              </Box>
              <Box>
                <TextType variant="PopupTitle">Group Call</TextType>
              </Box>
            </Flex>
          </DialogTitle>
          <DialogContent>
            <Flex
              flex="1"
              height="200px"
              bg={groupCallCondition().length === 0 ? "mainBg" : "ThemeColor2"}
            >
              {groupCallCondition().length === 0 ? (
                <>No other participants in waiting room.</>
              ) : (
                <>{renderCallParticipants(groupCallCondition())}</>
              )}
            </Flex>
            <Flex>
              <Button onClick={() => setGrpOpen(false)}>Close</Button>
            </Flex>
          </DialogContent>
        </Flex>
      </Dialog>
      <Form
        onSubmit={chargeAmount}
        render={({ form, errors, touched }) => (
          <Dialog
            open={isPaymentOpen}
            variant="outlined"
            color="primary"
            scrimClickAction=""
            escapeKeyAction=""
          >
            <Flex flexDirection="column" width="100%" height="100%">
              {CurrentAppointment && (
                <DialogTitle id="form-dialog-title">
                  <Flex>
                    <Box mr="6px">
                      <PaymentIcon />
                    </Box>
                    <Box>
                      <TextType variant="PopupTitle">{`Payment with ${CurrentAppointment.Name}`}</TextType>
                    </Box>
                  </Flex>
                </DialogTitle>
              )}
              {isPaymentProcessing ? (
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <TextType variant="LargeRegular">Please Wait</TextType>
                  <TextType variant="PopupSubHeader">
                    Payment is processing
                  </TextType>
                  <Flex>
                    <img alt="loader" src="/Spinner.svg" />
                  </Flex>
                  <Button
                    variant="abc"
                    onClick={() => {
                      setPaymentOpen(false);
                      setProcessing(false);
                      setPaymentResponse();
                    }}
                  >
                    Cancel
                  </Button>
                </Flex>
              ) : (
                <DialogContent>
                  {!paymentResponse ? (
                    <>
                      {" "}
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                      >
                        <Box mb="20px">
                          <TextType variant="Regular">
                            How much to charge?
                          </TextType>
                        </Box>
                        <FormField
                          errors={errors}
                          touched={touched}
                          fieldName="amount"
                          placeholder="Enter Amount"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box ml="5px">₹</Box>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Flex>
                      <Flex flexDirection="column">
                        <Button
                          onClick={(values) => {
                            form.submit(values);
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
                          Charge
                        </Button>
                        <Button
                          variant="abc"
                          onClick={() => {
                            setPaymentOpen(false);
                            setProcessing(false);
                            setPaymentResponse();
                          }}
                        >
                          Cancel
                        </Button>
                      </Flex>
                    </>
                  ) : (
                    <>
                      <Flex
                        flexDirection="Column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <TextType variant="AmountText">
                          {`Payment ${paymentResponse?.Status}!!!`}
                        </TextType>
                      </Flex>
                      <Button
                        variant="abc"
                        onClick={() => {
                          setPaymentOpen(false);
                          setProcessing(false);
                          setPaymentResponse();
                        }}
                      >
                        Close
                      </Button>
                    </>
                  )}{" "}
                </DialogContent>
              )}
            </Flex>
          </Dialog>
        )}
      />

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
                {role === "doctor" || role === "admin"
                  ? CurrentAppointment &&
                    `File transfer with ${CurrentAppointment.Name}`
                  : providerDetails &&
                    `File transfer with ${providerDetails.Salutation} ${providerDetails.FirstName}`}
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
          {file || role === "patient" ? (
            <></>
          ) : (
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
                        RoomId: roomId,
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
          )}
        </Flex>
      </Dialog>
      <Dialog
        open={openPatientFile}
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
                {role === "patient"
                  ? providerDetails &&
                    `File transfer with ${providerDetails.Salutation} ${providerDetails.FirstName}`
                  : CurrentAppointment &&
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
              onClick={() => setPatientfileStatus(false)}
            >
              <CloseIcon />
            </Box>
          </Flex>
          <DialogContent>
            <Flex
              flex="1"
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
                {role === "patient" ? (
                  <TextType variant="SubHeader">
                    {providerDetails &&
                      `${providerDetails.Salutation} ${providerDetails.FirstName} wants to send you a file.`}
                  </TextType>
                ) : (
                  <TextType variant="SubHeader">
                    {CurrentAppointment &&
                      `${CurrentAppointment.Name} wants to send you a file.`}
                  </TextType>
                )}
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
                        AppointmentId:
                          appointmentData?.AppointmentId ||
                          CurrentAppointment?.AppointmentId,
                        RoomId: roomId,
                        ParticipantId:
                          appointmentData?.PatientId ||
                          CurrentAppointment?.PatientId,
                        Role: role,
                      })
                    );
                  }}
                >
                  Download
                </Button>
              </Box>
            </Flex>
          </DialogContent>
        </Flex>
      </Dialog>
      <Dialog
        open={showPatientPicture}
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
              <TextType variant="PopupTitle">Patient Image</TextType>
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
                setShowPicture(false);
                dispatch(clearPatientPicture());
              }}
            >
              <CloseIcon />
            </Box>
          </Flex>
          <DialogContent>
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <img
                alt="patient"
                src={patientPicture}
                height="100%"
                width="100%"
              />
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
                  onClick={() => {
                    let blobUrl = patientPicture;
                    const anchor = document.createElement("a");
                    anchor.href = blobUrl;
                    anchor.target = "_blank";
                    anchor.download = "Patient_Image.png";
                    anchor.click();
                    let event = new Event("click");
                    anchor.dispatchEvent(event);
                    anchor.remove();
                  }}
                >
                  Download
                </Button>
              </Box>
            </Flex>
          </DialogContent>
        </Flex>
      </Dialog>
      <Dialog
        open={openScreenShare}
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
              <TextType variant="PopupTitle">Screen Share</TextType>
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
                setOpenScreenShare(false);
              }}
            >
              <CloseIcon />
            </Box>
          </Flex>
          <DialogContent>
            <Box mt="16px">
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
                  const screenSharingPublisher = objOT.initPublisher(
                    "screen-publisher",
                    {
                      videoSource: "screen",
                    },
                    (error) => {
                      if (error) {
                        alert("Something went wrong: ", error.message);
                      } else {
                        objSession.publish(
                          screenSharingPublisher,
                          (publishError) => {
                            if (publishError) {
                              alert("Something went wrong: ", error.message);
                            }
                            setOpenScreenShare(false);
                          }
                        );
                      }
                    }
                  );
                  setOpenScreenShare(false);
                  setScreenPublisher(screenSharingPublisher);
                }}
              >
                Share My Screen
              </Button>
              {CurrentAppointment && (
                <Box mt="16px">
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
                      objConnection.invoke(
                        "AskForScreenShare",
                        JSON.stringify({
                          AppointmentId: CurrentAppointment.AppointmentId,
                          RoomId: roomId,
                          ParticipantId: CurrentAppointment.PatientId,
                        })
                      );
                      setOpenScreenShare(false);
                    }}
                  >
                    {`Request ${CurrentAppointment.Name}'s screen.`}
                  </Button>
                </Box>
              )}
            </Box>
          </DialogContent>
        </Flex>
      </Dialog>
      <Dialog
        open={shareMyScreen}
        variant="outlined"
        color="primary"
        scrimClickAction=""
        escapeKeyAction=""
        fullWidth
        maxWidth="lg"
      >
        <Flex
          color="ThemeColor2"
          py="20px"
          width="100%"
          position="relative"
          bg="ThemeColor1"
          px="16px"
        >
          <Box width="100%">
            <TextType variant="PopupTitle">Screen Share</TextType>
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
              setShareMyScreen(false);
            }}
          >
            <CloseIcon />
          </Box>
        </Flex>
        <Flex
          id="screen-share"
          flexDirection="column"
          width="100%"
          height="615px"
        />
      </Dialog>
      <Dialog
        open={openPatientPayment}
        variant="outlined"
        color="primary"
        scrimClickAction=""
        escapeKeyAction=""
        fullWidth
        maxWidth="sm"
      >
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
                `Payment to ${providerDetails.Salutation} ${providerDetails.LastName}`}
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
              setOpenPatientPayment(false);
              setPaymentData();
              setProcessing(false);
            }}
          >
            <CloseIcon />
          </Box>
        </Flex>
        {renderPaymentPopup()}
      </Dialog>
    </Flex>
  );
};

export default withTheme(Room);
