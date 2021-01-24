import React, { useEffect } from "react";
import Flex from "@root/src/Components/Atoms/Flex";
import TextType from "@root/src/Components/Atoms/TextType";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, useDispatch } from "react-redux";
import withTheme from "@root/src/Components/Atoms/withTheme";
import { snackBarConfig as setSnackBarConfig } from "@root/src/Redux/ActionCreators";

const SnackBar = ({ theme }) => {
  const styleprops = {};
  const dispatch = useDispatch();

  const { snackbarConfig } = useSelector((state) => state.ui);

  const { open, snackbarText, variant, onClose } = snackbarConfig || {};

  useEffect(() => {
    if (snackbarConfig?.open) {
      setTimeout(() => {
        dispatch(setSnackBarConfig({ open: false }));
      }, 6000);
    }
  }, [snackbarConfig]);

  styleprops.bg = variant;
  styleprops.height = "50px";
  styleprops.width = "100%";

  const closeHandler = () => dispatch(setSnackBarConfig({ open: false }));

  return (
    <>
      {" "}
      {open && (
        <Flex
          {...styleprops}
          position="fixed"
          style={{
            top: "0",
            zIndex: 1301,
            boxShadow: "0 0 10 px 0 rgba(0, 0, 0, 0.4)",
          }}
        >
          <Flex justifyContent="center" alignItems="center" flex="1" mx="auto">
            <TextType variant="status">{snackbarText}</TextType>
          </Flex>
          <Flex
            color="white"
            style={{
              cursor: "pointer",
            }}
            onClick={onClose || closeHandler}
            justifyContent="center"
            alignItems="center"
          >
            <CloseIcon
              style={{
                fontSize: "30px",
              }}
            />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default withTheme(SnackBar);
