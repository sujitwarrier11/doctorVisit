const errorMessages = {
  "0000": "There seems to be a glitch, please try again later.",
  "0001": "Username or password incorrect.",
  "0002": "This is an invalid account.",
  "0003": "This is an invalid account.",
  "0004": "This account is already registered.",
  "0005": "Incorrect code. Access denied.",
  "0006": "This account is unauthorized to be here.",
  "0007": "Could not send email.",
  "0008": "Could not register this account",
  "0009": "Username or password incorrect.",
  "0010": "Cannot remove room owner.",
};

const getErrorMessage = (code) => errorMessages[code] || code;

export default getErrorMessage;
