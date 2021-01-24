import React from "react";
import MUIMenu from "@material-ui/core/Menu";
import withTheme from "@root/src/Components/Atoms/withTheme";
import styled from "@emotion/styled";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const StyledMenu = styled(MUIMenu)``;

const StyledMenuItem = styled(MenuItem)`
  color: ${(props) => props.color};
  background-color: ${(props) => props.bg};
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

const StyledListIcon = styled(ListItemIcon)`
  color: ${(props) => props.color};
`;

const Menu = ({ theme, items, color, hoverColor, bg, ...props }) => {
  return (
    <StyledMenu
      id="customized-menu"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      getContentAnchorEl={null}
      {...props}
    >
      {items &&
        items.map((Item) => (
          <StyledMenuItem
            bg={bg}
            color={color}
            hoverColor={hoverColor}
            key={Item.key}
            onClick={Item.click}
          >
            <StyledListIcon color={hoverColor}>
              {Item.Icon && (
                <div
                  style={{
                    color: hoverColor,
                  }}
                >
                  <Item.Icon />
                </div>
              )}
            </StyledListIcon>
            <ListItemText primary={Item.text} />
          </StyledMenuItem>
        ))}
    </StyledMenu>
  );
};

export default withTheme(Menu);
