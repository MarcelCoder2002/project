import {createContext} from "react";
import Request from "../utils/config/Request.js";
import User from "../utils/config/User.js";
import Domain from "../utils/config/Domain.js";

export const RequestContext = createContext(new Request(new User({}), new Domain('')));
