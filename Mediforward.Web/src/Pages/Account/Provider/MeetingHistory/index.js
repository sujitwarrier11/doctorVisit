import React, { useRef, useState, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  Box,
  TextType,
  TextField,
  Button,
  Snackbar,
  CheckBox,
  Accordian,
  Breakpoints,
  Select,
} from "@root/src/Components/Atoms";
import withTheme from "@root/src/Components/Atoms/withTheme";
import { push } from "connected-react-router";
import Card from "@root/src/Components/Molecules/Cards";
import Accordion from "@root/src/Components/Atoms/Accordian";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import dayJs from "dayjs";
import styled from "@emotion/styled";
import {
  getMeetingHistory,
  sendDoctorNotes,
} from "@root/src/Redux/ActionCreators";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";

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

const Row = withTheme(({ item, theme, addNoteClick, readNoteClick }) => {
  const renderFiles = () => {
    return (
      <>
        {item?.Files?.length > 0 ? (
          item.Files.map((file, index) => (
            <Flex
              key={file.Id}
              width="100%"
              minHeight="25px"
              pl="16px"
              bg={index % 2 !== 0 ? "Themecolor2" : "mainBg"}
            >
              <Flex
                width="100%"
                style={{
                  wordBreak: "break-all",
                }}
                pt="11px"
              >
                <TextType variant="RegularMedium">
                  <strong>{file.FileName}</strong>
                  {` shared by ${file.SharedBy}.`}
                </TextType>
              </Flex>
              <Flex flexDirection="row-reverse" width="65%">
                <Button
                  onClick={() => {
                    fetch(file?.Path, {})
                      .then((response) => response.blob())
                      .then((blob) => {
                        let blobUrl = window.URL.createObjectURL(blob);
                        const anchor = document.createElement("a");
                        anchor.href = blobUrl;
                        anchor.target = "_blank";
                        anchor.download = file?.FileName;
                        anchor.click();
                        let event = new Event("click");
                        anchor.dispatchEvent(event);
                        anchor.remove();
                      })
                      .catch((e) => console.error(e));
                  }}
                  variant="abc"
                >
                  Download
                </Button>
              </Flex>
            </Flex>
          ))
        ) : (
          <TextType variant="Regular">No files shared.</TextType>
        )}{" "}
        <></>
      </>
    );
  };

  const Status = {
    Success: "Successful",
    Successfull: "Successful",
  };
  const renderPaymentDetails = () => {
    return item?.PaymentAttemptInformation?.map((PaymentAttempt, index) => (
      <Flex
        key={item.Id}
        width="100%"
        bg={index % 2 === 0 ? "mainBg" : "ThemeColor2"}
        pl="16px"
        py="4px"
      >
        <TextType variant="RegularMedium">
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(PaymentAttempt?.Amount)}
          </strong>
          {` payment ${
            Status[PaymentAttempt?.PaymentStatus] ||
            PaymentAttempt?.PaymentStatus
          }`}
        </TextType>
      </Flex>
    ));
  };

  const renderNotes = () => {
    if (item?.Notes) {
      return (
        <Box mt="20px">
          <Flex mb="25px" width="100%">
            <TextType variant="LargeRegular">Doctor's Notes</TextType>
          </Flex>
          {item?.Notes.length > 0 ? (
            item.Notes.map((note, index) => (
              <Flex
                key={note.Id}
                width="100%"
                minHeight="25px"
                pl="16px"
                bg={index % 2 !== 0 ? "Themecolor2" : "mainBg"}
              >
                <Flex
                  width="100%"
                  style={{
                    wordBreak: "break-all",
                  }}
                  pt="11px"
                >
                  <TextType variant="RegularMedium">
                    {`Note sent on ${dayJs(note.AddedDate).format(
                      "DMMMM D, YYYY h:mm A"
                    )}`}
                  </TextType>
                </Flex>
                <Flex flexDirection="row-reverse" width="65%">
                  <Button
                    onClick={() => readNoteClick({ ...note, Name: item.Name })}
                    variant="abc"
                  >
                    Read
                  </Button>
                </Flex>
              </Flex>
            ))
          ) : (
            <TextType variant="Regular">No files shared.</TextType>
          )}{" "}
          <></>
        </Box>
      );
    }
  };

  const { rowItem } = item;
  const keys = Object.keys(rowItem);
  return (
    <Accordion bg={theme.color.ThemeColor2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {keys.map((key) => (
          <Flex
            key={key}
            flexDirection="flex-start"
            width={`${(1 / keys.length) * 100}%`}
            style={{
              wordBreak: "break-all",
            }}
          >
            <TextType variant="Regular">
              {`${rowItem[key]?.toString().substring(0, 14)}${
                rowItem[key]?.toString().length > 13 ? "..." : ""
              }`}
            </TextType>
          </Flex>
        ))}
      </AccordionSummary>
      <AccordionDetails>
        <Flex width="100%" flexDirection="column">
          <Flex flexDirection="row-reverse">
            <Button onClick={() => addNoteClick(item)} variant="abc">
              Add Note
            </Button>
          </Flex>
          {item?.PaymentAttemptInformation &&
            item.PaymentAttemptInformation.length > 0 && (
              <>
                <Flex mb="25px" width="100%">
                  <TextType variant="LargeRegular">Payment Details</TextType>
                </Flex>
                {renderPaymentDetails()}
              </>
            )}
          <Flex my="25px" width="100%">
            <TextType variant="LargeRegular">Files</TextType>
          </Flex>
          {renderFiles()}
          {renderNotes()}
        </Flex>
      </AccordionDetails>
    </Accordion>
  );
});

const PaginationButtons = styled(Flex)`
  background-color: ${(props) => props.bgClr};
  color: ${(props) => props.fontColor};
  width: 38px;
  height: 38px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0.3px solid ${(props) => props.borderColor};
  border-radius: ${(props) => props.brd};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.hoverColor};
  }
`;

const Pagination = withTheme(
  ({ theme, totalPages, currentPage, setCurrentPage }) => {
    const pages = totalPages || 1;
    const handleBack = () => {
      setCurrentPage(currentPage - 1 > 1 ? currentPage - 1 : 1);
    };

    const getBRD = (idx) => {
      if (pages === 1) return "4px";
      if (idx === 0) return "4px 0px 0px 4px";
      if (idx === pages - 1) return "0px 4px 4px 0px";
      return "0px";
    };
    const handleForward = () => {
      setCurrentPage(currentPage + 1 > pages ? pages : currentPage + 1);
    };

    const handlePageClick = (num) => {
      setCurrentPage(num);
    };

    return (
      <Flex width="100%">
        <PaginationButtons
          fontColor={theme.color.ThemeColor1}
          bgClr={theme.color.ThemeColor2}
          borderColor={theme.color.paginationBorder}
          hoverColor={theme.color.transparentGreen}
          mr="10px"
          brd="4px"
          onClick={handleBack}
        >
          <ChevronLeftIcon />
        </PaginationButtons>
        <Breakpoints lg md sm>
          <Flex>
            {pages < 18 ? (
              new Array(pages).fill(1).map((item, idx) => (
                <PaginationButtons
                  key={item}
                  brd={getBRD(idx)}
                  fontColor={
                    currentPage === idx + 1
                      ? theme.color.ThemeColor2
                      : theme.color.ThemeColor1
                  }
                  bgClr={
                    currentPage === idx + 1
                      ? theme.color.ThemeColor1
                      : theme.color.ThemeColor2
                  }
                  borderColor={theme.color.paginationBorder}
                  hoverColor={
                    currentPage === idx + 1
                      ? theme.color.ThemeColor1
                      : theme.color.transparentGreen
                  }
                  onClick={() => handlePageClick(idx + 1)}
                >
                  {idx + 1}
                </PaginationButtons>
              ))
            ) : (
              <Select
                br="5px"
                fullWidth
                label="Page No"
                value={currentPage}
                bg={theme.color.mainBg}
                errorColor={theme.color.errorBorder}
                InputLabelProps={{ shrink: true }}
                focusColor={theme.color.RegularTextColor}
                InputProps={{
                  disableUnderline: true,
                  disableLabel: true,
                  shrink: true,
                }}
                SelectDisplayProps={{
                  color: theme.color.RegularTextColor,
                }}
                behaviourProps={{
                  isRemoveSecondaryLabelDiv: true,
                }}
                onChange={(e) => handlePageClick(e.target.value)}
              >
                {new Array(pages).fill(1).map((item, idx) => (
                  <MenuItem key={item} value={idx + 1}>
                    {idx + 1}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Flex>
        </Breakpoints>
        <PaginationButtons
          fontColor={theme.color.ThemeColor1}
          bgClr={theme.color.ThemeColor2}
          borderColor={theme.color.paginationBorder}
          hoverColor={theme.color.transparentGreen}
          onClick={handleForward}
          ml="10px"
          brd="4px"
        >
          <ChevronRightIcon />
        </PaginationButtons>
      </Flex>
    );
  }
);

const MeetingTable = ({
  headers,
  rows,
  totalPages,
  addNoteClick,
  readNoteClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  return (
    <Flex flexDirection="column" width="100%">
      <Flex pl="16px" mb="10px" width="100%">
        <Flex width={["80%", "92%", "92%", "92%"]}>
          {headers?.map((header) => (
            <Flex
              key={header}
              flexDirection="flex-start"
              width={`${(1 / headers?.length) * 100}%`}
            >
              <TextType variant="RegularMedium">{header}</TextType>
            </Flex>
          ))}
        </Flex>
        <Flex width="24px" />
      </Flex>
      <Flex minHeight="450px" mb="30px" flexDirection="column" width="100%">
        {rows?.map((objrow) => (
          <Row
            key={objrow.id}
            item={objrow}
            addNoteClick={addNoteClick}
            readNoteClick={readNoteClick}
          />
        ))}
      </Flex>
      <Flex width="100%">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={(pageNo) => {
            setCurrentPage(pageNo);
            dispatch(getMeetingHistory(pageNo));
          }}
        />
      </Flex>
    </Flex>
  );
};

const MeetingHistory = ({ theme }) => {
  const { MeetingData } = useSelector((state) => state.provider);
  const { Appointments, TotalPages } = MeetingData || {};
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState();
  const noteRef = useRef(null);
  const [openReadNotePopup, setOpenReadNote] = useState(false);
  const [currentNote, setCurrentNote] = useState();

  const formatToTwoDigits = (num) => `0${num}`.slice(-2);

  const getDurationString = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const remainingSec = seconds % 3600;
    const min = Math.floor(remainingSec / 60);
    const sec = remainingSec % 60;
    return `${formatToTwoDigits(hrs)}:${formatToTwoDigits(
      min
    )}:${formatToTwoDigits(sec)}`;
  };

  const processAppointments = (arrAppointments) => {
    return arrAppointments.map((item) => {
      return {
        ...item,
        id: Math.random(),
        rowItem: {
          patientNamep: item.Name,
          date: dayJs(item.StartTime).format("DD/MM/YYYY"),
          startTime: dayJs(item.StartTime).format("hh:mm A"),
          endTime: dayJs(item.EndTime).format("hh:mm A"),
          duration: getDurationString(
            dayJs(item.EndTime).diff(dayJs(item.StartTime), "second")
          ),
        },
      };
    });
  };

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      px={["10px", "20px", "20px", "20px"]}
      pt="40px"
      style={{
        overflowY: "scroll",
      }}
    >
      <Box
        mb="20px"
        style={{
          cursor: "pointer",
        }}
        onClick={() => dispatch(push("/account/dashboard"))}
      >
        <TextType variant="link2">← Back To Dashboard</TextType>
      </Box>
      <Card
        maxWidth="768px"
        pt={["15px", "15px", "35px", "35px"]}
        pb="25px"
        px={["10px", "25px", "25px", "25px"]}
        flexDirection="column"
        width={["100%", "100%", "auto", "auto"]}
        minWidth={["auto", "auto", "768px", "768px"]}
        mb="20px"
      >
        <Flex mb="40px">
          <TextType variant="MainTitle">Meeting History</TextType>
        </Flex>
        <MeetingTable
          headers={["Name", "Date", "Start Time", "End Time", "Duration"]}
          rows={processAppointments(Appointments || [])}
          totalPages={TotalPages}
          addNoteClick={(selectedAppointment) => {
            setOpen(true);
            setCurrentAppointment(selectedAppointment);
          }}
          readNoteClick={(note) => {
            setCurrentNote(note);
            setOpenReadNote(true);
          }}
        />
      </Card>
      <Dialog
        open={open}
        variant="outlined"
        color="primary"
        scrimClickAction=""
        escapeKeyAction=""
        fullWidth
        maxWidth="lg"
      >
        <Flex
          color="ThemeColor2"
          py="20px"
          width="100%"
          position="relative"
          bg="ThemeColor1"
          px="16px"
        >
          <Box width="100%">
            <TextType variant="PopupTitle">Send Note to Patient</TextType>
          </Box>
          <Box
            mt="5px"
            mr="5px"
            position="absolute"
            style={{
              top: 0,
              right: 0,
              cursor: "pointer",
            }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </Box>
        </Flex>
        <StyledEditable
          p="10px"
          width="100%"
          height="100%"
          minHeight="560px"
          contentEditable="true"
          ref={noteRef}
        />
        <Button
          styleProps={{
            background: theme.color.ThemeColor1,
            fontFamily: theme.fontFamily,
            lineHeight: "18.2px",
            textTransform: "capitalize",
            height: "46px",
            boxShadow: "none",
          }}
          onClick={() => {
            dispatch(
              sendDoctorNotes({
                AppointmentId: currentAppointment.AppointmentId,
                NoteContent: noteRef.current.innerHTML,
                PatientId: currentAppointment.PatientId,
              })
            );
            setOpen(false);
          }}
        >
          Send Note
        </Button>
      </Dialog>
      <Dialog
        open={openReadNotePopup}
        variant="outlined"
        color="primary"
        scrimClickAction=""
        escapeKeyAction=""
        fullWidth
        maxWidth="lg"
      >
        <Flex
          color="ThemeColor2"
          py="20px"
          width="100%"
          position="relative"
          bg="ThemeColor1"
          px="16px"
        >
          <Box width="100%">
            <TextType variant="PopupTitle">{`Note sent to ${
              currentNote?.Name || "petient"
            } ${
              currentNote
                ? `at ${dayJs(currentNote.AddedDate).format(
                    "MMMM D, YYYY h:mm A"
                  )}`
                : ""
            }`}</TextType>
          </Box>
          <Box
            mt="5px"
            mr="5px"
            position="absolute"
            style={{
              top: 0,
              right: 0,
              cursor: "pointer",
            }}
            onClick={() => setOpenReadNote(false)}
          >
            <CloseIcon />
          </Box>
        </Flex>
        <StyledEditable
          p="10px"
          width="100%"
          height="100%"
          minHeight="560px"
          dangerouslySetInnerHTML={{ __html: currentNote?.NoteContent || "" }}
        />
      </Dialog>
    </Flex>
  );
};

export default withTheme(MeetingHistory);
