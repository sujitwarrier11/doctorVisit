import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Flex,
  TextType,
  Box,
  TextField,
  Button,
  Menu,
  Breakpoints,
} from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import styled from "@emotion/styled";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import { useDispatch, useSelector } from "react-redux";
import { enableDisableAudio } from "@root/src/Redux/ActionCreators";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { useBreakpoints } from "@root/src/Components/Atoms/Breakpoints";

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

const StyledFlex = styled(Flex)`
  display: ${(props) => (props.hideVideo ? "none" : "flex")};
`;

const Mute = withTheme(({ theme, onClick, stream }) => {
  const { stopAudioPublish } = useSelector((state) => state.common);
  const dispatch = useDispatch();
  return (
    <AnimatedFlex
      time="800m"
      bg={stopAudioPublish ? "red" : "rgba(0, 0, 0, 0.2)"}
      position="absolute"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="35px"
      width="35px"
      r="50%"
      style={{
        cursor: "pointer",
        right: 0,
        top: 0,
        marginRight: "5px",
        marginTop: "5px",
      }}
      onClick={() => {
        dispatch(enableDisableAudio(!stopAudioPublish));
      }}
    >
      <Box m="auto" color="white">
        {stopAudioPublish ? (
          <MicOffIcon
            style={{
              fontSize: "30px",
            }}
          />
        ) : (
          <MicIcon
            style={{
              fontSize: "30px",
            }}
          />
        )}
      </Box>
    </AnimatedFlex>
  );
});

const MoreOptions = withTheme(({ theme, onClick, stream }) => {
  const { stopAudioPublish } = useSelector((state) => state.common);
  const dispatch = useDispatch();
  return (
    <AnimatedFlex
      time="800m"
      bg={stopAudioPublish ? "red" : "rgba(0, 0, 0, 0.2)"}
      position="absolute"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="35px"
      width="35px"
      r="50%"
      style={{
        cursor: "pointer",
        left: 0,
        top: 0,
        marginLeft: "5px",
        marginTop: "5px",
      }}
      onClick={() => {}}
    >
      <Box position="relative" m="auto" color="white">
        <MoreHorizIcon />
      </Box>
    </AnimatedFlex>
  );
});

const VideoPreview = (
  {
    theme,
    id,
    checkVideoPermission,
    hideVideo,
    isNotAbsoulte,
    capturePhoto,
    permissionStatus,
    hideBg,
    ...props
  },
  ref
) => {
  const [permission, setPermission] = useState(permissionStatus);
  const vidRef1 = useRef(null);
  const [vidStream, setVidStream] = useState();
  const size = useBreakpoints();
  const gotStream = (stream, allow) => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Create an AudioNode from the stream
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to destination to hear yourself
    // or any other node for processing!
    mediaStreamSource.connect(audioContext.destination);
    stream.getAudioTracks()[0].enabled = false;
    const videoTracks = stream.getVideoTracks();
    setPermission(true);
    if (vidRef1.current !== null) {
      vidRef1.current.srcObject = stream;
    } else {
      setTimeout(() => {
        vidRef1.current.srcObject = stream;
      }, 1000);
    }
    setVidStream(stream);
  };
  const onfail = (error) => {
    console.log(
      `permission not granted or system don't have media devices.${error.name}`
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      takePhoto: (quality = "0.5") => {
        let canvas = document.createElement("canvas");
        canvas.width = 500;
        canvas.height = 300;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(vidRef1.current, 0, 0, 500, 300);
        const data = canvas.toDataURL("image/png", quality);
        canvas.remove();
        return data;
      },
    }),
    [vidRef1.current, checkVideoPermission, permission]
  );

  const onPlay = useCallback(
    (e) => {
      let canvas = document.createElement("canvas");
      canvas.width = 165;
      canvas.height = 165;
      document.body.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(vidRef1.current, 0, 0, 165, 165);
      const data = canvas.toDataURL("image/png");
      if (capturePhoto) {
        capturePhoto(data);
      }
      canvas.remove();
    },
    [capturePhoto]
  );
  useLayoutEffect(() => {
    if (permissionStatus) {
      navigator.permissions
        .query({ name: "camera" })
        .then((permission) => {
          if (permission.state === "granted") {
            navigator.permissions
              .query({ name: "microphone" })
              .then((inputPermission) => {
                if (inputPermission.state === "granted") {
                  setPermission(true);
                  setTimeout(() => {
                    navigator.mediaDevices
                      .getUserMedia({
                        audio: true,
                        video: { facingMode: "user" },
                      })
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
    }
  }, [permissionStatus]);
  useLayoutEffect(() => {
    navigator.permissions
      .query({ name: "camera" })
      .then((permission) => {
        if (permission.state === "granted") {
          navigator.permissions
            .query({ name: "microphone" })
            .then((inputPermission) => {
              if (inputPermission.state === "granted") {
                setPermission(true);
                setTimeout(() => {
                  navigator.mediaDevices
                    .getUserMedia({
                      audio: true,
                      video: { facingMode: "user" },
                    })
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
    return () => {
      if (vidStream) {
        vidStream?.getTracks()?.forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);
  return (
    <>
      <StyledFlex
        position={!isNotAbsoulte && "absolute"}
        height={["92px", "92px", "220px", "220px"]}
        width={["92px", "92px", "220px", "220px"]}
        mt={
          hideBg
            ? ["15px", "15px", "25px", "25px"]
            : ["0px", "0px", "25px", "25px"]
        }
        mr={
          hideBg
            ? ["30px", "30px", "25px", "25px"]
            : ["0px", "0px", "25px", "25px"]
        }
        hideVideo={hideVideo}
        {...props}
        onClick={() => {
          if (size?.breakSize === "xs" || size?.breakSize === "sm") {
            navigator.mediaDevices
              .getUserMedia({
                audio: true,
                video: { facingMode: "user" },
              })
              .then((stream) => gotStream(stream))
              .catch((err) => console.log(err));
          }
        }}
      >
        <Box position="relative">
          <Mute stream={vidStream} />
          <MoreOptions />
          {checkVideoPermission && !permission ? (
            <Flex
              flexDirection="column"
              width="100%"
              height="100%"
              bg="matBlack"
              color="fillGrey"
              pt="25px"
              px="10px"
            >
              <Flex mb="25px" alignItems="center" justifyContent="center">
                <VideocamOffIcon style={{ fontSize: "40px" }} />
              </Flex>
              <Flex
                px="10px"
                mb="30px"
                alignItems="center"
                justifyContent="center"
              >
                <TextType variant="WhiteText">
                  Your webcam isn't enabled yet.
                </TextType>
              </Flex>
              <Breakpoints lg md>
                <Button
                  onClick={() => {
                    navigator.mediaDevices
                      .getUserMedia({
                        audio: true,
                        video: { facingMode: "user" },
                      })
                      .then((stream) => gotStream(stream))
                      .catch((err) => console.log(err));
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
                  Enable Camera
                </Button>
              </Breakpoints>
            </Flex>
          ) : (
            <Box
              id={id}
              style={{
                overflow: "hidden",
              }}
              width="100%"
              height="100%"
            >
              <video
                onCanPlay={onPlay}
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  display: hideVideo ? "none" : "inherit",
                }}
                ref={vidRef1}
                id="local"
                autoplay=""
                muted
              />
            </Box>
          )}
        </Box>
      </StyledFlex>
      {hideVideo && (
        <Flex
          position={!isNotAbsoulte && "absolute"}
          height={["92px", "92px", "220px", "220px"]}
          width={["92px", "92px", "220px", "220px"]}
          mt={["0px", "0px", "25px", "25px"]}
          mr={["0px", "0px", "25px", "25px"]}
          {...props}
        >
          <img alt="avatar" height="100%" width="100%" src="/avatar.jpg" />
        </Flex>
      )}
    </>
  );
};

export default withTheme(forwardRef(VideoPreview));
