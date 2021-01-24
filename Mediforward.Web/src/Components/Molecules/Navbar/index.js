import React, { useState, useImperativeHandle, forwardRef } from "react";
import Drawer from "@material-ui/core/Drawer";
import Breakpoints from "@root/src/Components/Atoms/Breakpoints";
import { Flex, Box, TextType } from "@root/src/Components/Atoms";
import { useSelector, useDispatch } from "react-redux";
import withTheme from "@root/src/Components/Atoms/withTheme";
import styled from "@emotion/styled";
import { useLocation, useHistory } from "react-router-dom";

import Env from "@root/Env";
import { push } from "connected-react-router";
import MenuIcon from "@material-ui/icons/Menu";

const SpeechBubble = styled(Box)`
  color: ${(props) => props.theme.color.ThemeColor2};
  background-color: ${(props) => props.theme.color.ThemeColor1};
  position: absolute;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 14px;
  min-width: 170px;
  max-width: 170px;
  work-break: break-all;
  z-index: 120;
  display: none;
  border-radius: 4px;
  padding: 4px;
  padding-left: 15px;
  transition: display 500ms ease;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-right-color: ${(props) => props.theme.color.ThemeColor1};
    border-left: 0;
    border-bottom: 0;
    margin-top: -2.5px;
    margin-left: -5px;
  }
`;

const LinkBox = styled(Flex)`
  position: relative;
  color: ${(props) =>
    props.selected
      ? props.theme.color.ThemeColor1
      : props.theme.color.RegularTextColor};
  &:hover {
    color: ${(props) => props.theme.color.ThemeColor1};
  }
  &:hover ${SpeechBubble} {
    display: inherit;
  }
  cursor: pointer;
`;

const NavBarLink = withTheme(
  ({ NavText, NavIcon, onClick, theme, selected, toolTipText }) => {
    return (
      <LinkBox
        selected={selected}
        theme={theme}
        width="100%"
        flexDirection="column"
        onClick={onClick}
      >
        <Flex>
          <Box mt="6px">{NavIcon && <NavIcon />}</Box>
          <Box pl="5px">
            <TextType variant="NavLink">{NavText}</TextType>
          </Box>
        </Flex>
        {toolTipText && (
          <SpeechBubble
            style={{
              right: "-201px",
            }}
            theme={theme}
          >
            {toolTipText}
          </SpeechBubble>
        )}
      </LinkBox>
    );
  }
);

const NavBarBox = ({
  theme,
  NavItems,
  section1,
  ItemSectionHeader,
  onClose,
  isDrawer,
  section3,
}) => {
  const { userTheme } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  return (
    <Flex
      width="217px"
      height="100%"
      flexDirection="column"
      bg="ThemeColor2"
      zIndex="4"
      pt="20px"
      style={{
        overflowY: "visible",
      }}
    >
      <Box px="39px" mb="10px">
        {userTheme && (
          <img
            alt="logo"
            height="95px"
            width="100%"
            src={`${Env.baseUrl}${userTheme.Logo}`}
          />
        )}
      </Box>
      <Box py="10px" px="20px">
        {section1}
        <Box>
          {ItemSectionHeader && (
            <Box
              borderBottom={`1px solid ${theme.color.ThemeColor1}`}
              width="100%"
              pb="4px"
              mb="6px"
            >
              <TextType variant="NavHeaders">{ItemSectionHeader}</TextType>
            </Box>
          )}
          <Box>
            {NavItems &&
              NavItems.map((item, index) => (
                <NavBarLink
                  key={item.id}
                  NavText={item.NavText}
                  NavIcon={item.icon}
                  toolTipText={item.toolTipText}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    }
                    if (item.path) dispatch(push(item.path));
                    if (isDrawer && onClose) onClose();
                  }}
                  selected={item.path === location.pathname}
                />
              ))}
          </Box>
        </Box>
        {section3}
      </Box>
    </Flex>
  );
};

const NavBar = ({ makeDrawer, hideBg, ...props }, ref) => {
  const { userTheme } = useSelector((state) => state.user);
  const [isOpen, setOpen] = useState(makeDrawer);
  const Wrapper = makeDrawer ? Drawer : React.Fragment;

  useImperativeHandle(
    ref,
    () => ({
      toggleNavBar: () => setOpen(!isOpen),
    }),
    [isOpen, setOpen]
  );

  return (
    <>
      <Breakpoints md lg>
        <Wrapper anchor="left" open={isOpen} onClose={() => setOpen(!isOpen)}>
          <NavBarBox
            onClose={() => setOpen(!isOpen)}
            {...props}
            isDrawer={makeDrawer}
          />
        </Wrapper>
      </Breakpoints>
      <Breakpoints xs sm>
        <Flex width="100%" height="56px" bg={!hideBg && "ThemeColor2"}>
          <Flex
            position="relative"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Flex
              position="absolute"
              style={{
                left: 0,
                top: 0,
              }}
              pt="11px"
              color="ThemeColor1"
              pl="13px"
              onClick={() => setOpen(!isOpen)}
            >
              <MenuIcon
                style={{
                  fontSize: "29px",
                }}
              />
            </Flex>
            {userTheme && !hideBg && (
              <img
                alt="logo"
                height="100%"
                width="80px"
                src={`${Env.baseUrl}${userTheme.Logo}`}
              />
            )}
          </Flex>
        </Flex>
        <Drawer anchor="left" open={isOpen} onClose={() => setOpen(!isOpen)}>
          <NavBarBox onClose={() => setOpen(!isOpen)} {...props} isDrawer />
        </Drawer>
      </Breakpoints>
    </>
  );
};

export default withTheme(forwardRef(NavBar));
