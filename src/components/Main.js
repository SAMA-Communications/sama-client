import ChatForm from "./screens/chat/ChatForm";
import ChatList from "./screens/chat/ChatList";
import React, { useMemo, useState } from "react";
import UserSearch from "./screens/chat/UserSearch";
import globalConstants from "../_helpers/constants";
import { history } from "../_helpers/history";

import "../styles/Main.css";

export default function Main() {
  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth <= globalConstants.windowChangeWitdh
  );
  //move to redux

  window.addEventListener("resize", () =>
    setIsMobileView(window.innerWidth <= globalConstants.windowChangeWitdh)
  );

  const mainContent = useMemo(
    () =>
      !isMobileView ? (
        <>
          <ChatList />
          <ChatForm />
        </>
      ) : !!history.location.hash ? (
        <ChatForm />
      ) : (
        <ChatList />
      ),
    [history.location.hash, isMobileView]
  );

  const additionalContent = useMemo(() => {
    const allBlocks = [];

    history.location.pathname.includes("/search") &&
      allBlocks.push(<UserSearch key={"/search"} />);

    return allBlocks;
  }, [history.location.pathname]);

  return (
    <main>
      {mainContent}
      {additionalContent}
    </main>
  );
}
