export const FaceBookButton = withStyles((theme) => ({
    root: {
     
      backgroundColor: "#3b5998",
      fontWeight: "500",
      textTransform: "capitalize",
      width: "100%",
      "&:hover": {
        backgroundColor: "#2d4373",
      },
    },
  }))(Button);