import ChatForm from "./screens/chat/ChatForm";
import ChatList from "./screens/chat/ChatList";
import React, { useMemo } from "react";
import UserSearch from "./screens/chat/UserSearch";
import { getIsMobileView } from "../store/IsMobileView";
import { history } from "../_helpers/history";
import { useSelector } from "react-redux";

import "../styles/Main.css";

export default function Main() {
  const isMobileView = useSelector(getIsMobileView);

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
