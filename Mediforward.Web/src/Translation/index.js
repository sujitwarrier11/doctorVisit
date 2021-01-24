import React from "react";
import { useSelector } from "react-redux";

const translation = {
  eng: {
    dashboard: "Your Dashboard",
    editWaitingRoom: "Edit Waiting Room",
    accountSettings: "Account Settings",
    meetingHistory: "Meeting History",
    logout: "Logout",
    welcome: "Welcome",
    roomLinkMessage: "To invite someone to your waiting room, share this link:",
    inviteVia: "Invite Via",
    backToDashboard: "← Back To Dashboard",
    customizeWaitingRoom: "Customize your waiting room with our simple editor",
    applyToAll: " Apply to all clinic waiting rooms",
    revertToDefault: "Revert To Default",
    text: "Text",
    image: "Image",
    video: "Video",
    videoUrlDesc: "Enter your Youtube or Vimeo video URL here.",
    chooseFile: "Click to choose a file",
    room: "room",
    sharedBy: "shared by",
    download: "Download",
    noFiles: "No files shared.",
    name: "Name",
    date: "Date",
    startTime: "Start Time",
    endTime: "End Time",
    duration: "duration",
    noCheckin: "No one has checked in yet",
    settings: "Settings",
    notifications: "Notifications",
    clinicSettings: "Clinic Settings",
    personalInfo: "Personal Info",
    personalInfoDesc: "Change your personal information.",
    roomSettings: "Room Settings",
    roomSettingsDesc: "View and edit your room settings.",
    loginCredentials: "Login Credentials",
    loginCredentialsDesc: "Change Email,Password",
    desktopAlert: "Desktop Alert",
    emailAlert: "Email Alert",
    update: "Update",
    manageUsers: "Manage Users",
    manageUsersDesc: "Add or remove users to the clinic",
    languageSettings: "Language Settings",
    languageSettingsDesc: "Set language for your account.",
    noParticipants: "No other participants in waiting room.",
    groupCall: "Group Call",
    close: "Close",
    photoCapture: "Photo Capture",
    payment: "Payment",
    fileTransfer: "File Transfer",
    sendMore: "Send More",
    dragDrop: "Drag & Drop File Here to Share",
    selectFile: " Select File to Share",
    checkIn: "Check In",
    requestFile: "Request file from Patient",
    patientImage: "Patient Image",
    Cancel: "Cancel",
    dnd: "Drag & Drop File Here to Share",
    copy: "Copy",
    startPoint: "Your starting point",
    editToolTip: "Edit what your patient sees while they wait for you",
    accountToolTip: "Control your account settings",
    meetingToolTip: "Keep track of your meetings",
    logoutToolTip: "Logout of your account",
    save: "Save",
    offlineRed: "Offline",
    onlineGreen: "Available",
    onCallOrange: "On Call",
  },
  kan: {
    dashboard: "ನಿಮ್ಮ ತಡೆಹಲಗೆ",
    editWaitingRoom: "ನಿರೀಕ್ಷಣಾ ಕೋಣೆ ಪರಿಷ್ಕರಿಸಿ",
    accountSettings: "ಖಾತೆ ಸಂಯೋಜನೆಗಳು",
    meetingHistory: "Meeting History",
    logout: "ಲಾಗ್ ಔಟ್",
    welcome: "ಸ್ವಾಗತ",
  },
};

export const useTranslation = () => {
  const { currentLanguage } = useSelector((state) => state.common);
  const translate = (langKey) =>
    translation[currentLanguage || "eng"][langKey] ||
    translation["eng"][langKey] ||
    langKey;
  return translate;
};

export const Trans = ({ langKey }) => {
  const { currentLanguage } = useSelector((state) => state.common);
  return (
    <>
      {translation[currentLanguage || "eng"][langKey] ||
        translation["eng"][langKey] ||
        langKey}
    </>
  );
};
