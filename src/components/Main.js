import React, { useMemo } from "react";
import { getIsMobileView } from "../store/IsMobileView";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import ChatForm from "./screens/chat/ChatForm";
import ChatInfoPage from "./screens/info/ChatInfoPage";
import ChatList from "./screens/chat/ChatList";

import ParticipantProfile from "./screens/info/ParticipantProfile";
import UserProfile from "./screens/info/UserProfile";
import UserSearch from "./screens/info/UserSearch";

import "../styles/Main.css";

export default function Main() {
  const isMobileView = useSelector(getIsMobileView);
  const location = useLocation();

  const mainContent = useMemo(
    () =>
      !isMobileView ? (
        <>
          <ChatList />
          <ChatForm />
        </>
      ) : !!location.hash ? (
        <ChatForm />
      ) : (
        <ChatList />
      ),
    [location, isMobileView]
  );

  const additionalContent = useMemo(() => {
    const { pathname, hash } = location;
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
      allBlocks.push(<ParticipantProfile key="/opponentinfo" />);
    }

    return allBlocks;
  }, [location]);

  return (
    <main>
      {mainContent}
      {additionalContent}
    </main>
  );
}
