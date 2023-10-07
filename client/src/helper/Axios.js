import axios from "axios";
import { env } from "../env";

const axiosInstance = axios.create({
  baseURL: env.REACT_APP_API_ENDPT || "http://localhost:5000",
})

export default axiosInstance