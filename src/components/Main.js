import React, { useMemo } from "react";
import { getIsMobileView } from "../store/IsMobileView";
import { history } from "../_helpers/history";
import { useSelector } from "react-redux";

import ChatForm from "./screens/chat/ChatForm";
import ChatInfoPage from "./screens/info/ChatInfoPage";
import ChatList from "./screens/chat/ChatList";

import { default as UserGuestProfile } from "./screens/info/UserGuestProfile";
import UserProfile from "./screens/info/UserProfile";
import UserSearch from "./screens/info/UserSearch";

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
    const { pathname, hash } = history.location;
    const allBlocks = [];

    if (pathname.includes("/search")) {
      allBlocks.push(<UserSearch key="/search" />);
    }

    if (pathname.includes("/user")) {
      allBlocks.push(<UserProfile key="/user" />);
    }

    if (hash.includes("/chatinfo") && !hash.includes("/opponentinfo")) {
      allBlocks.push(<ChatInfoPage key="/chatinfo" />);
    }

    if (hash.includes("/opponentinfo")) {
      allBlocks.push(<UserGuestProfile key="/opponentinfo" />);
    }

    return allBlocks;
  }, [history.location]);

  return (
    <main>
      {mainContent}
      {additionalContent}
    </main>
  );
}
