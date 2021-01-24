import React from "react";
import { TextType } from "@root/src/Components/Atoms";

const ErrorMessaging = ({ message }) => {
  return <TextType variant="ErrorMessaging">{message}</TextType>;
};

export default ErrorMessaging;