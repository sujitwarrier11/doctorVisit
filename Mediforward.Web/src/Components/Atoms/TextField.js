import React from "react";
import Text from "@material-ui/core/TextField";
import styled from "@emotion/styled";

const StyledTextField = styled(Text)`
  border-radius: ${(props) => `${props.br}`};
  display: block;
  width:100%;
  .MuiInputBase-root{
    width: 100%;
  }

  input.MuiInputBase-input.MuiInput-input:focus{
    border: ${(props) =>
      props.error
        ? `1.5px solid ${props.errorColor || "red"}`
        : `1px solid ${props.focusColor}`};
  }
  background: ${(props) => props.bg};
  .MuiFormHelperText-root{
    display: none;
  }
  .MuiInputBase-input {
    border-radius: ${(props) => props.br || "4px"};
    font-size: ${(props) => props.inputFontSize || "14px"};
    line-height: ${(props) => props.inputLineHeight || "1.3"};
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    font-family: ${(props) => props.fontFamily};
    padding-top: 11px;
    padding-left: 16px;
    padding-bottom: 11px;
    height: 46px;
    box-sizing: border-box;
    color: ${(props) => props.fontColor || "black"}
    border: ${(props) =>
      props.error ? `1.5px solid ${props.errorColor || "red"}` : "none"};
    width: 100%;
  }
  .Mui-disabled{
    border-radius: ${(props) => props.br || "4px"};
    font-size: ${(props) => props.inputFontSize || "14px"};
    line-height: ${(props) => props.inputLineHeight || "1.3"};
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    font-family: ${(props) => props.fontFamily};
    padding-top: 11px;
    padding-left: 16px;
    padding-bottom: 11px;
    height: 46px;
    box-sizing: border-box;
    border: ${(props) =>
      props.error ? `1.5px solid ${props.errorColor || "red"}` : "none"};
    width: 100%;
  }
`;

const TextField = ({
  error,
  validationMessage,
  label,
  behaviourProps,
  inputType,
  styleProps,
  input,
  meta,
  ...props
}) => {
  const metaProps = {};
  if (meta && meta.error) {
    if (meta.touched) {
      metaProps.error = true;
      metaProps.helperText = meta.error;
    }
  }

  return (
    <StyledTextField
      {...input}
      label={label}
      InputLabelProps={{
        ...behaviourProps,
      }}
      styleProps={styleProps}
      type={inputType}
      {...metaProps}
      {...props}
    />
  );
};

export default TextField;
