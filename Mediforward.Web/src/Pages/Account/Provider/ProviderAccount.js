import React, { useState, useEffect, useCallback, useRef } from "react";
import { Flex } from "@root/src/Components/Atoms";
import NavBar from "@root/src/Components/Molecules/Navbar";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import Route from "@root/src/Components/Molecules/ProtectedRoute";
import Dashboard from "@root/src/Pages/Account/Provider/ProviderDashboard";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useSelector, useDispatch } from "react-redux";
import Env from "@root/Env";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import SettingsIcon from "@material-ui/icons/Settings";
import PatientListSection from "@root/src/Components/Molecules/Navbar/Sections/PatientListSection";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {
  logout,
  setPatients,
  removePatient,
  setCurrentRoom,
  getMeetingHistory,
  setConnectionObject,
  setMessageRead,
  setCurrentPatient,
} from "@root/src/Redux/ActionCreators";
import EditWaitingroom from "@root/src/Pages/Account/Provider/EditWaitingRoom";
import HistoryIcon from "@material-ui/icons/History";
import MeetingHistory from "@root/src/Pages/Account/Provider/MeetingHistory";
import AccountSettings from "@root/src/Pages/Account/Provider/AccountSettings";
import { useTranslation, Trans } from "@root/src/Translation";

const ProviderAccount = () => {
  const [selected, setSelected] = useState(0);

  const {
    ProviderProfile,
    Rooms,
    patients,
    objConnection,
    CurrentRoomId,
  } = useSelector((state) => state.provider);
  const CurrentRoom = Rooms?.find((item) => item.Id === CurrentRoomId);
  const { role, token } = useSelector((state) => state.user);
  const [profileImage, setImage] = useState("");
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const con = new HubConnectionBuilder()
      .withUrl(`${Env.baseUrl}/mediHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 1000, 5000, null])
      .build();
    dispatch(setConnectionObject(con));
    return () => {};
  }, []);

  const initSocket = () => {
    objConnection
      .invoke(
        "GetProviderSRClientId",
        JSON.stringify({
          ProviderId: ProviderProfile.ProviderId,
        })
      )
      .then((err, val) => {
        console.log(err, val);
      })
      .catch(function (err) {
        return console.error(err.toString());
      });

    if (objConnection && Rooms && Rooms.length > 0) {
      objConnection
        .invoke(
          "ParticipantJoined",
          JSON.stringify({
            ParticipantId: parseInt(ProviderProfile.ProviderId, 10),
            ProfileImage: profileImage,
            Role: role,
            RoomId: CurrentRoom?.Id,
          })
        )
        .catch(function (err) {
          return console.error(err.toString());
        });
    }
  };

  const PatientJoined = useCallback(
    (res) => {
      const patientDetails = JSON.parse(res);
      dispatch(setPatients({ ...patientDetails, TimeStamp: new Date() }));
      objConnection?.invoke(
        "RegisterForAppointment",
        JSON.stringify({
          AppointmentId: patientDetails?.AppointmentId,
          RoomId: patientDetails?.RoomId,
        })
      );
      audioRef.current.play();
    },
    [objConnection, audioRef]
  );

  const ParticipantDisconnected = useCallback((res) => {
    const participantDetails = JSON.parse(res);
    dispatch(removePatient(participantDetails));
  }, []);

  const GetProviderSRClientId = useCallback((a, b) => {
    console.log("a", a);
    console.log("b", b);
  }, []);

  const t = useTranslation();

  useEffect(() => {
    if (
      typeof objConnection?.off === "function" &&
      typeof objConnection?.on === "function"
    ) {
      objConnection?.off("PatientJoined");
      objConnection?.on("PatientJoined", PatientJoined);
      objConnection?.off("ParticipantDisconnected");
      objConnection?.on("ParticipantDisconnected", ParticipantDisconnected);
      objConnection?.off("GetProviderSRClientId");
      objConnection?.on("GetProviderSRClientId", GetProviderSRClientId);
    }
  });

  useEffect(() => {
    if (objConnection !== null && ProviderProfile && objConnection.state) {
      if (objConnection.state === "Disconnected")
        objConnection
          .start()
          .then(() => initSocket())
          .catch((err) => console.log("connection error:", err));
    }
  }, [objConnection, ProviderProfile, Rooms, profileImage, patients]);

  const NavItems = [
    {
      id: 1,
      NavText: t("dashboard"),
      icon: DashboardOutlinedIcon,
      path: "/account/dashboard",
      toolTipText: t("startPoint"),
    },
    {
      id: 2,
      NavText: t("editWaitingRoom"),
      icon: MeetingRoomIcon,
      path: "/account/EditWaitingRoom",
      onClick: () => dispatch(setCurrentRoom(CurrentRoom)),
      toolTipText: t("editToolTip"),
    },
    {
      id: 3,
      NavText: t("accountSettings"),
      icon: SettingsIcon,
      path: "/account/settings",
      toolTipText: t("accountToolTip"),
    },
    {
      id: 4,
      NavText: t("meetingHistory"),
      icon: HistoryIcon,
      path: "/account/MeetingHistory",
      onClick: () => {
        dispatch(getMeetingHistory(1));
      },
      toolTipText: t("meetingToolTip"),
    },
    {
      id: 5,
      NavText: t("logout"),
      icon: ExitToAppIcon,
      path: "/",
      onClick: () => {
        dispatch(logout());
        if (window.stream) {
          window.stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
      },
      toolTipText: t("logoutToolTip"),
    },
  ];

  return (
    <Flex
      width="100%"
      bg="mainBg"
      flexDirection={["column", "column", "row", "row"]}
      height="100%"
      style={{
        overflow: "auto",
      }}
    >
      <audio
        style={{
          display: "none",
        }}
        ref={audioRef}
      >
        <source src="/patientJoin.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <Flex>
        <NavBar
          NavItems={NavItems}
          selected={selected}
          section1={
            <PatientListSection
              patientList={patients}
              clickHandler={(patient) => {
                const { PatientId, AppointmentId, voiceCall } = patient;
                dispatch(setMessageRead({ AppointmentId }));
                dispatch(setCurrentPatient(patient));
                objConnection.invoke(
                  "DoctorJoinedCall",
                  JSON.stringify({
                    ParticipantId: PatientId,
                    AppointmentId,
                    Role: role,
                    RoomId: CurrentRoom?.Id,
                    VoiceCall: voiceCall,
                  })
                );
              }}
            />
          }
          ItemSectionHeader="Account"
        />
      </Flex>
      <Flex flex="1">
        <Route
          path="/account/dashboard"
          render={(props) => (
            <Dashboard
              {...props}
              setImage={setImage}
              objConnection={objConnection}
              profileImage={profileImage}
            />
          )}
        />
        <Route
          path="/account/EditWaitingRoom"
          render={() => <EditWaitingroom />}
        />
        <Route
          path="/account/MeetingHistory"
          render={() => <MeetingHistory />}
        />
        <Route path="/account/settings" render={() => <AccountSettings />} />
      </Flex>
    </Flex>
  );
};

export default ProviderAccount;
