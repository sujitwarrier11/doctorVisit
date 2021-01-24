import React from "react";
import MatButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";

const StyledButton = styled(MatButton)((props) => props.styleProps || {});

const Button = ({
  variant,
  size,
  color,
  buttonType,
  styleProps,
  ...props
}) => (
  <StyledButton
    {...props}
    variant={variant || "contained"}
    color={color || "primary"}
    size={size}
    type={buttonType || "submit"}
    style={styleProps}
  />
);

export default Button;
