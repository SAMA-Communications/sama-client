import AuthApi from "./auth";
import ChatApi from "./chat";

export default {
  auth: new AuthApi(process.env.REACT_APP_BASE_URL),
  chat: new ChatApi(process.env.REACT_APP_SOCKET_CONNECT),
};
