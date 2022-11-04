import axios from 'axios';

const baseUrl = process.env.SERVER;

const app = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
export default app;
