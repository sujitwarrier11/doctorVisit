import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  Box,
  TextType,
  TextField,
  Button,
  Snackbar,
} from "@root/src/Components/Atoms";
import { getProviderProfile, getRooms } from "@root/src/Redux/ActionCreators";
import ProviderAccount from "@root/src/Pages/Account/Provider/ProviderAccount";

const Account = () => {
  const { role } = useSelector((state) => state.user);
 
  const dispatach = useDispatch();
  useEffect(() => {
    if (role) {
      if (role === "doctor" || role === "admin") {
        dispatach(getProviderProfile());
        dispatach(getRooms());
      }
    }
  }, [role]);

  const renderDashboard = () => {
    switch (role) {
      case "admin":
      case "doctor":
        return <ProviderAccount />;
      default:
        return <>Loading...</>;
    }
  };

  return renderDashboard();
};

export default Account;
