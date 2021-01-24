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
} from "@root/src/Components/Atoms";
import RoomElementAdder from "@root/src/Components/Molecules/RoomElementAdder";
import withTheme from "@root/src/Components/Atoms/withTheme";
import { push } from "connected-react-router";
import Card from "@root/src/Components/Molecules/Cards";
import RoomElement from "@root/src/Components/Molecules/RoomElement";
import { saveRoomElements } from "@root/src/Redux/ActionCreators";
import { useTranslation, Trans } from "@root/src/Translation";

const insertAtPosition = (arrItems, objToAdd) => {
  return [
    ...arrItems.slice(0, objToAdd.Position),
    objToAdd,
    ...arrItems.slice(objToAdd.Position),
  ].map((item, index) => ({ ...item, Position: index }));
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ALL_ELEMENTS":
      return {
        ...state,
        items: action.payload,
      };
    case "ADD_AT_POS":
      return {
        ...state,
        items: insertAtPosition(state.items, action.payload),
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.Id === action.payload.Id ? { ...item, ...action.payload } : item
        ),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items
          .filter((item) => item.Id !== action.payload.Id)
          .map((item, Position) => ({ ...item, Position })),
        DeleteElements: Number.isInteger(action.payload.Id)
          ? [...(state.DeleteElements || []), action.payload.Id]
          : state.DeleteElements,
      };
    default:
      return state;
  }
};

const EditWaitingroom = ({ theme }) => {
  const dispatch = useDispatch();
  const { CurrentRoomId, Rooms } = useSelector((state) => state.provider);
  const { imageElements } = useSelector((state) => state.common);
  const [state, stateDispatch] = useReducer(reducer, { items: [] });
  const { items, DeleteElements } = state;
  const CurrentRoom = Rooms?.find((item) => item.Id === CurrentRoomId);
  useEffect(() => {
    if (imageElements) {
      Object.keys(imageElements).map((item) => {
        const elem = items.find((itm) => itm.Id == item);
        stateDispatch({
          type: "UPDATE_ITEM",
          payload: { ...elem, Content: imageElements[item].path },
        });
      });
    }
  }, [imageElements]);

  useEffect(() => {
    if (CurrentRoom?.Elements) {
      stateDispatch({
        type: "SET_ALL_ELEMENTS",
        payload: CurrentRoom?.Elements,
      });
    }
  }, [CurrentRoomId]);

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      pl="20px"
      pt="40px"
      pr="20px"
      style={{
        overflowY: "scroll",
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <Box
        mb="20px"
        style={{
          cursor: "pointer",
        }}
        onClick={() => dispatch(push("/account/dashboard"))}
      >
        <TextType variant="link2">
          <Trans langKey="backToDashboard" />
        </TextType>
      </Box>
      <Card
        width="100%"
        maxWidth="540px"
        height={["auto", "auto", "auto", "auto"]}
        flexDirection="column"
        p="25px"
        mb="20px"
      >
        <Box mb="10px">
          <TextType variant="MainTitle">
            {CurrentRoom && `Waiting Room of /${CurrentRoom.RoomName}`}
          </TextType>
        </Box>
        <Box
          style={{
            opacity: 0.7,
          }}
        >
          <Flex
            pb="15px"
            style={{
              borderBottom: `0.5px solid rgb(95, 106, 125, 0.2)`,
            }}
            flexDirection="flex-start"
          >
            <TextType variant="RegularMedium">
              <Trans langKey="customizeWaitingRoom" />
            </TextType>
          </Flex>
        </Box>
        <Flex pt="10px" flexDirection={["column", "column", "column", "row"]}>
          <Flex>
            <CheckBox />
            <Box ml="5px" pt="5px">
              <TextType variant="RegularMedium">
                <Trans langKey="applyToAll" />
              </TextType>
              <TextType variant="Regular">
                {Rooms && `This will affect ${Rooms.length} rooms.`}
              </TextType>
            </Box>
          </Flex>
          <Flex>
            <Box ml={["0px", "0px", "0px", "16px"]}>
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
              >
                <Trans langKey="revertToDefault" />
              </Button>
            </Box>
            <Box ml="10px">
              <Button
                styleProps={{
                  background: theme.color.ThemeColor1,
                  fontFamily: theme.fontFamily,
                  lineHeight: "18.2px",
                  textTransform: "capitalize",
                  height: "46px",
                  boxShadow: "none",
                }}
                onClick={() =>
                  dispatch(
                    saveRoomElements({ Elements: items, DeleteElements })
                  )
                }
              >
                <Trans langKey="save" />
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Card>
      <RoomElementAdder
        clickHandler={(ElementType, Position) =>
          stateDispatch({
            type: "ADD_AT_POS",
            payload: {
              Id: Math.random(),
              ElementType,
              Position,
              WaitingRoomId: CurrentRoom?.Id,
            },
          })
        }
        objPosition={0}
      />
      {items.map((item) => (
        <RoomElement
          edit
          key={item.id}
          ElementJson={item}
          clickHandler={(ElementType, Position) =>
            stateDispatch({
              type: "ADD_AT_POS",
              payload: {
                Id: Math.random(),
                ElementType,
                Position,
                WaitingRoomId: CurrentRoom?.Id,
              },
            })
          }
          updateHandler={(payload) =>
            stateDispatch({ type: "UPDATE_ITEM", payload })
          }
          removeHandler={(payload) =>
            stateDispatch({ type: "REMOVE_ITEM", payload })
          }
        />
      ))}
    </Flex>
  );
};

export default withTheme(EditWaitingroom);
