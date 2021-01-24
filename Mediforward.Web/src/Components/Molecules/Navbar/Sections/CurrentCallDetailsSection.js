import React, { useEffect, useState } from "react";
import {
  Flex,
  Button,
  TextType,
  Breakpoints,
  Box,
} from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";
import { useSelector } from "react-redux";

const CurrentCallDetailsSection = ({ theme }) => {
  const { CurrentAppointment } = useSelector((state) => state.provider);
  const [timeDisplay, setTimeDisplay] = useState("0:00");
  const calculateTime = (sec) => {
    let time = "";
    const h = Math.trunc(sec / 3600);
    let remaining = sec % 3600;
    const m = Math.trunc(remaining / 60);
    remaining %= 60;
    if (h > 0) time += `${("0" + h.toString()).slice(-2)}:`;
    time += `${("0" + m.toString()).slice(-2)}:${("0" + remaining.toString()).slice(-2)}`;
    return time;
  };

  useEffect(() => {
    let seconds = 0;
    const countDown = setInterval(() => {
      seconds += 1;
      setTimeDisplay(calculateTime(seconds + 1));
    }, 1000);
    return () => clearInterval(countDown);
  }, []);
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
                src={CurrentAppointment?.ProfileImage || "/avatar.jpg"}
              />
            </Box>
          </Flex>
          <Flex flexDirection="column">
            <TextType variant="PatientListUserName">{`${CurrentAppointment?.Name?.substring(
              0,
              8
            )}${CurrentAppointment?.Name?.length > 8 ? "..." : ""}`}</TextType>
            <TextType variant="PatientListUserName">{timeDisplay}</TextType>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default withTheme(CurrentCallDetailsSection);
