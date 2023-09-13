import ChatForm from "./screens/chat/ChatForm";
import ChatList from "./screens/chat/ChatList";
import React, { useMemo, useState } from "react";
import globalConstants from "../_helpers/constants";
import { history } from "../_helpers/history";

import "../styles/Main.css";

export default function Main() {
  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth <= globalConstants.windowChangeWitdh
  );

  window.addEventListener("resize", () =>
    setIsMobileView(window.innerWidth <= globalConstants.windowChangeWitdh)
  );

  const mainContent = useMemo(() => {
    if (!isMobileView) {
      return (
        <>
          <ChatList />
          <ChatForm />
        </>
      );
    }

    return !!history.location.hash ? <ChatForm /> : <ChatList />;
  }, [history.location, isMobileView]);

  return <main>{mainContent}</main>;
}
