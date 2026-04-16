import axios from "axios";
const BASE_URL = "https://stark-anchorage-16877-b6be52a435cc.herokuapp.com";

export default axios.create({
  baseURL: BASE_URL,
});
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
