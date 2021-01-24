import React, { useEffect, useState, useCallback, createRef } from "react";
import { Flex, Box, TextType } from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";
import styled from "@emotion/styled";
import AddIcon from "@material-ui/icons/Add";
import Card from "@root/src/Components/Molecules/Cards";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { FaPlus } from "react-icons/fa";
import ImageIcon from "@material-ui/icons/Image";
import PlayCircleOutlineOutlinedIcon from "@material-ui/icons/PlayCircleOutlineOutlined";

const StyledFlex = styled(Flex)`
  border: 1px dashed ${(props) => props.normalColor};
  color: ${(props) => props.normalColor};
  cursor: pointer;
  &:hover {
    border: 1px dashed ${(props) => props.hovercolor};
    color: ${(props) => props.hovercolor};
  }
`;

const HoverFlex = styled(Flex)`
  color: ${(props) => props.defColor};
  font-weight: 400;
  &:hover {
    color: ${(props) => props.hoverColor};
    opacity: 0.6;
  }
`;
const BorderFlex = styled(Flex)`
  color: ${(props) => props.defColor};
  border: 2.5px solid ${(props) => props.defColor};
  transition: color 0.1s ease-in-out, border 0.1s;
  width: 66px;
  height: 49px;
  border-radius: 6px;
  ${HoverFlex}:hover & {
    color: ${(props) => props.hoverColor};
    border: 2.5px solid ${(props) => props.hoverColor};
  }
`;

const IconWithText = withTheme(({ theme, IcontToDisplay, text, onClick }) => {
  return (
    <HoverFlex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      defColor={theme.color.RegularTextColor}
      hoverColor={theme.color.deepCream}
      mx="16.5px"
      onClick={onClick}
>
      <BorderFlex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        defColor={theme.color.RegularTextColor}
        hoverColor={theme.color.deepCream}
        mb="16px"
      >
        <IcontToDisplay
          style={{
            fontSize: "30px",
          }}
        />
      </BorderFlex>
      <Box m="auto">
        <TextType variant="IconCaption">{text}</TextType>
      </Box>
    </HoverFlex>
  );
});

class RoomElementAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTypes: false,
    };
    this.onClick = this.onClick.bind(this);
    this.onClickAway = this.onClickAway.bind(this);
    this.ref = createRef();
  }

  componentDidMount() {
    document.addEventListener("click", this.onClickAway);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onClickAway, true);
  }

  onClickAway() {
    this.setState({ showTypes: false });
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ showTypes: true });
  }

  render() {
    const { showTypes } = this.state;
    const { theme, clickHandler, objPosition } = this.props;

    return (
      <>
        {showTypes ? (
          <Card
            width="100%"
            maxWidth="540px"
            minHeight="130px"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            ref={this.divRef}
          >
            <Flex alignItems="center" justifyContent="center">
              <IconWithText
                IcontToDisplay={CreateOutlinedIcon}
                text="Text"
                onClick={() => clickHandler("Text", objPosition)}
              />
              <IconWithText
                IcontToDisplay={ImageIcon}
                text="Image"
                onClick={() => clickHandler("Image", objPosition)}
              />
              <IconWithText
                IcontToDisplay={PlayCircleOutlineOutlinedIcon}
                text="Video"
                onClick={() => clickHandler("Video", objPosition)}
              />
            </Flex>
          </Card>
        ) : (
          <StyledFlex
            normalColor={theme.color.borderCream}
            hovercolor={theme.color.ThemeColor1}
            flexDirection="column"
            width="100%"
            maxWidth="540px"
            minHeight="78px"
            alignItems="center"
            justifyContent="center"
            onClick={this.onClick}
            r="4px"
          >
            <Box>
              <FaPlus
                style={{
                  fontSize: "37px",
                }}
              />
            </Box>
          </StyledFlex>
        )}
      </>
    );
  }
}

export default withTheme(RoomElementAdder);
