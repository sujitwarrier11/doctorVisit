import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  Box,
  TextType,
  TextField,
  Button,
  Snackbar,
  CheckBox,
} from "@root/src/Components/Atoms";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import withTheme from "@root/src/Components/Atoms/withTheme";
import styled from "@emotion/styled";
import DeleteIcon from "@material-ui/icons/Delete";
import RoomElementAdder from "@root/src/Components/Molecules/RoomElementAdder";
import { uploadImageElement } from "@root/src/Redux/ActionCreators";

const ElementFlex = styled(Flex)`
  &:hover {
    border: ${(props) => (props.edit ? "2px" : "0px")} solid
      ${(props) => (props.edit ? props.borderColor : "transparent")};
  }
`;

const ButtonFlex = styled(Flex)`
  display: none;
  box-sizing: border-box;
  cursor: pointer;
  border: ${(props) => props.border};
  background-color: ${(props) => props.bg || "white"};
  ${ElementFlex}:hover & {
    border: 2px solid ${(props) => props.borderColor};
    display: ${(props) => (props.edit ? "flex" : "none")};
  }
`;

const ButtonFlexRight = styled(Flex)`
  display: none;
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${(props) => props.bg || "white"};
  ${ElementFlex}:hover & {
    border-top: 2px solid ${(props) => props.borderColor};
    border-right: 2px solid ${(props) => props.borderColor};
    border-bottom: 2px solid ${(props) => props.borderColor};
    display: ${(props) => (props.edit ? "flex" : "none")};
  }
`;

const StyledEditable = styled(Flex)`
  overflow-x: hidden;
  overflow-y: hidden;
  display: block;
  outline: 0px solid transparent;
  line-break: after-white-space;
  font-family: ${(props) => props.fontFamily};
  font-size: 20.4px;
  color: ${(props) => props.fontColor};
  opacity: 0.8;
  overflow-wrap: break-word;
`;

const VideoElement = withTheme(({ theme, ElementJson, updateHandler }) => {
  const checkVideoUrl = (url) => {
    const regExpYouTube = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const regExpVimeo = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/;
    return url.match(regExpYouTube) || url.match(regExpVimeo);
  };

  const processUrl = (url) => {
    if (url.indexOf("youtube") > -1) {
      return url.replace(/watch\?v=/g, "embed/").split("&")[0];
    }
    if (url.indexOf("youtu.be") > -1) {
      return `https://youtube.com/embed/${url.replace(
        /https:\/\/youtu.be\//g,
        ""
      )}`;
    }
    const parts = url.split("/");
    return `https://player.vimeo.com/video/${parts[parts.length - 1]}`;
  };

  return (
    <Flex
      maxWidth="540px"
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {ElementJson?.Content && checkVideoUrl(ElementJson?.Content?.trim()) ? (
        <>
          <iframe
            width="100%"
            height="315"
            src={processUrl(ElementJson?.Content)}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </>
      ) : (
        <>
          <TextField
            placeholder="Enter your Youtube or Vimeo video URL here."
            meta={{}}
            br="5px"
            fullWidth
            bg={theme.color.mainBg}
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
            onChange={(e) =>
              updateHandler({ ...ElementJson, Content: e.target.value })
            }
          />
        </>
      )}
    </Flex>
  );
});

const ImageElement = withTheme(({ theme, ElementJson }) => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const onFileChange = (file) => {
    dispatch(
      uploadImageElement({
        id: ElementJson?.Id,
        file,
      })
    );
  };

  return (
    <Flex
      maxWidth="540px"
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {ElementJson?.Content ? (
        <>
          <img
            style={{
              width: "100%",
            }}
            alt="img"
            src={ElementJson.Content}
          />
        </>
      ) : (
        <>
          <input
            type="file"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={(e) => onFileChange(e.target.files[0])}
          />
          <Button
            variant="outlined"
            aria-haspopup="true"
            aria-controls="customized-menu"
            styleProps={{
              color: theme.color.ThemeColor1,
              fontFamily: theme.fontFamily,
              lineHeight: "18.2px",
              textTransform: "capitalize",
              height: "46px",
              border: `1px solid ${theme.color.ThemeColor1}`,
            }}
            onClick={() => fileRef.current.click()}
          >
            Click to choose a file
          </Button>
        </>
      )}
    </Flex>
  );
});

const RoomElement = ({
  theme,
  ElementJson,
  edit,
  clickHandler,
  updateHandler,
  removeHandler,
}) => {
  const [draggable, setDrag] = useState(false);

  const divRef = useRef(null);

  const renderElement = () => {
    switch (ElementJson?.ElementType) {
      case "Text":
        return (
          <StyledEditable
            dangerouslySetInnerHTML={{
              __html: ElementJson?.Content,
            }}
            onBlur={(e) => {
              updateHandler({ ...ElementJson, Content: e.target.innerHTML });
            }}
            maxWidth="540px"
            width="100%"
            height="100%"
            contentEditable={edit}
            fontFamily={theme.fontFamily}
            fontColor={theme.color.RegularTextColor}
          />
        );
      case "Image":
        return <ImageElement ElementJson={ElementJson} />;
      default:
        return (
          <VideoElement
            ElementJson={ElementJson}
            updateHandler={updateHandler}
          />
        );
    }
  };

  return (
    <Flex ref={divRef} flexDirection="column">
      <ElementFlex
        minHeight="207px"
        maxWidth="540px"
        bg="ThemeColor2"
        position="relative"
        r="5px"
        borderColor={theme.color.ThemeColor1}
        mb="20px"
        mt="20px"
        draggable={edit && draggable}
        px={["10px", "30px", "30px", "30px"]}
        pt="30px"
        pb="45px"
        edit={edit}
        onDragEnd={() => setDrag(false)}
      >
        <Flex
          height="61px"
          position="absolute"
          style={{
            bottom: "-2px",
            right: "-2px",
          }}
          color="ThemeColor1"
        >
          <ButtonFlex
            edit={edit}
            bg={theme.color.ThemeColor2}
            borderColor={theme.color.ThemeColor1}
            width="67px"
            alignItems="center"
            justifyContent="center"
            onMouseDown={() => setDrag(true)}
          >
            <OpenWithIcon
              style={{
                fontSize: "30px",
              }}
            />
          </ButtonFlex>
          <ButtonFlexRight
            edit={edit}
            bg={theme.color.ThemeColor2}
            borderColor={theme.color.ThemeColor1}
            width="67px"
            alignItems="center"
            justifyContent="center"
            onClick={() => removeHandler(ElementJson)}
          >
            <DeleteIcon
              style={{
                fontSize: "30px",
              }}
            />
          </ButtonFlexRight>
        </Flex>
        {renderElement()}
      </ElementFlex>
      {edit && (
        <RoomElementAdder
          clickHandler={clickHandler}
          objPosition={(ElementJson?.Position || 0) + 1}
        />
      )}
    </Flex>
  );
};

export default withTheme(RoomElement);
