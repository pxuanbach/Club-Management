import {createContext} from 'react';
import io from "socket.io-client";
import { ENDPT } from "./helper/Helper";

export const socket = io.connect(ENDPT);
export const SocketContext = createContext();