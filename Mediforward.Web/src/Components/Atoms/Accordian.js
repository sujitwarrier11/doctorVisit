import React from "react";
import MUAccordion from "@material-ui/core/Accordion";
import styled from "@emotion/styled";

const StyledAccordian = styled(MUAccordion)`
  width: 100%;
  background-color: ${(props) => props.bg};
`;

const Accordion = (props) => {
  return <StyledAccordian {...props} />;
};

export default Accordion;
