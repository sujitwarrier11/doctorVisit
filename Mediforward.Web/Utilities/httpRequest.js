import axios from 'axios';

const axiosHeader = {};
const httpRequest = axios.create({
  headers: axiosHeader
});

export default httpRequest;