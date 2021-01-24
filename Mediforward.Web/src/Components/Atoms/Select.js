import React from "react";
import MUSelect from "@material-ui/core/Select";
import styled from "@emotion/styled";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

const StyledSelect = styled(MUSelect)`
  width: 100%;
  height: 46px;
  padding-top: 0;
  marign-top: 0px;
  .MuiSelect-root {
    border-radius: 4px;
  }
  .MuiSelect-select {
    width: 100%;
    height: 100%;
  }

  .MuiSelect-selectMenu {
    width: 100%;
  }
  &:before {
    border: none;
  }

  &:hover:before {
    border: none;
  }

  label + & {
    margin-top: 0;
  }
  .MuiInput-formControl {
    margin-top: 0;
  }
  .MuiInput-underline:hover:not(.Mui-disabled):before {
    border: none;
  }
  .MuiInput-underline:before {
    border: none;
  }
`;

const StyledLabel = styled(InputLabel)`
  top: -11px;
  left: 13px;
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
  background-color: ${(props) => props.bg};
  margin-top: 0;
  border-radius: 4px;
  .MuiInput-formControl {
    margin-top: 0;
  }
  label + & {
    margin-top: 0;
  }
  label & {
    margin-top: 0;
  }
  .MuiInputLabel-formControl {
    top: -11px;
    left: 16px;
  }
  border: none;
  &:hover {
    border: none;
  }
  .MuiSelect-select {
    padding-top: 31px;
    padding-left: 16px;
    border: none;
  }
  .MuiSelect-select:focus {
    background-color: transparent;
    border: none;
  }
  .MuiInput-underline:after {
    border: none;
  }
  .MuiInput-underline:hover:before {
    border: none;
  }
`;

const Select = (props) => {
  return (
    <StyledFormControl {...props}>
      <StyledLabel {...props} shrink={false}>
        {!props.value && props.label}
      </StyledLabel>
      <StyledSelect {...props} />
    </StyledFormControl>
  );
};

export default Select;
