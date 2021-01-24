import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  Box,
  TextType,
  TextField,
  Button,
  Snackbar,
} from "@root/src/Components/Atoms";
import { uploadFile, getFiles } from "@root/src/Redux/ActionCreators";

const Profile = () => {
  const ref = useRef(null);

  const [currImage, setCurrentImage] = useState("");
  const [currFileName, setFileName] = useState("");
  const [currDoc, setDoc] = useState("");
  const [openSnackbar, setSnackBarStatus] = useState(false);
  const [upload, setUpload] = useState(true);
  const dispatch = useDispatch();
  const { status, files } = useSelector((state) => state.user);

  useEffect(() => {}, []);

  const handleSubmit = () => {
    console.log("currImage", currImage);
    //    dispatch(uploadFile({
    //        image: currImage.split(',')[1],
    //        name: currFileName
    //    }));
    //    else
    //    alert("select a document to upload");
  };

  const readerLoad = (e) => {
    setCurrentImage(e.target.result);
  };

  const fileUploadChange = (e) => {
    const reader = new FileReader();
    reader.addEventListener("load", readerLoad);
    setFileName(e.target.files[0].name);
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Flex
      width="100%"
      height="100%"
      flexDirection="column"
      bg="bgBlue"
      alignItems="center"
    >
      {upload ? (
        <Box
          m="auto"
          r="15px"
          bg="white"
          width={["95%", "95%", "45%", "45%"]}
          alignItems="center"
          px={["25px", "25px", "25px", "25px"]}
          py="50px"
        >
          <Box mb="40px">
            <Flex flexDirection="column" alignItems="center">
              <TextType variant="header">Profile</TextType>
              <TextType variant="normal">
                Upload your relevant documents for verification.
              </TextType>
            </Flex>
          </Box>
          <input
            ref={ref}
            type="file"
            style={{
              display: "none",
            }}
            onChange={fileUploadChange}
          />
          <Flex
            style={{
              cursor: "pointer",
              borderStyle: "dashed",
            }}
            mx="auto"
            onClick={() => ref.current.click()}
            alignItems="center"
            width={["90%", "90%", "70%", "70%"]}
            height={["70px", "70px", "400px", "400px"]}
          >
            {currImage ? (
              <img
                src={currImage}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <Box m="auto">
                <TextType variant="normal">Click to Upload</TextType>
              </Box>
            )}
          </Flex>
          <Flex alignItems="center" flexDirection="column" mt="25px">
            <Button
              buttonType="button"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
              }}
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button
              buttonType="button"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "16px",
              }}
              onClick={() => setUpload(false)}
            >
              View Documents
            </Button>
          </Flex>
          <Snackbar
            open={openSnackbar}
            snackbarText={status && status.description}
            variant={status && status.type}
            onClose={() => setSnackBarStatus(false)}
          />
        </Box>
      ) : (
        <Box
          m="auto"
          r="15px"
          bg="white"
          width={["95%", "95%", "45%", "45%"]}
          alignItems="center"
          px={["25px", "25px", "25px", "25px"]}
          py="50px"
        >
          <Box mb="40px">
            <Flex flexDirection="column" alignItems="center">
              <TextType variant="header">View Documents</TextType>
            </Flex>
            <Box
              style={{
                cursor: "pointer",
              }}
              onClick={() => setUpload(true)}
            >
              <TextType variant="link">&#8592; Upload</TextType>
            </Box>
            <Flex flexDirection="column" alignItems="flex-start" pl="20px">
              <ul>
                {files &&
                  files.map((item) => (
                    <Box
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => setDoc(item.fileName)}
                    >
                      <TextType variant="link">{item.displayName}</TextType>
                    </Box>
                  ))}
              </ul>
            </Flex>
          </Box>
          {console.log("curDoc", currDoc)}
          <Box></Box>
        </Box>
      )}
    </Flex>
  );
};

export default Profile;
