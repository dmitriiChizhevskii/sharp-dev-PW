import axios, { AxiosError } from 'axios';

const appAxious = axios.create({
  baseURL: process.env.REACT_APP_ENDPOINT
});

appAxious.defaults.headers.common['Authorization'] = `Bearer ${localStorage.accessToken}`;

export { AxiosError };
export default appAxious;