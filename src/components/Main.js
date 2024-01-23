import React, { useMemo } from "react";
import { getIsMobileView } from "@store/IsMobileView";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import ChatForm from "@screens/chat/ChatForm";
import ChatInfoPage from "@screens/info/ChatInfoPage";
import ChatList from "@screens/chat/ChatList";

import NavigationLine from "@components/navigation/NavigationLine";
import ModalWindow from "@screens/chat/ModalWindow";
import ParticipantProfile from "@screens/info/ParticipantProfile";
import UserProfile from "@screens/info/UserProfile";
import UserSearch from "@screens/info/UserSearch";

import "@styles/Main.css";
import EmptyHub from "./hub/EmptyHub";

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

    const blockMap = {
      "/search": <UserSearch type={"create_group_chat"} />,
      "/addparticipants": <UserSearch type={"add_participants"} />,
      "/user": <UserProfile />,
      "/info": <ChatInfoPage />,
      "/opponentinfo": <ParticipantProfile />,
      "/participant": <ParticipantProfile />,
      "/modal": <ModalWindow />,
    };

    const allBlocks = Object.entries(blockMap)
      .filter(([key, component]) => {
        if (key === "/info") {
          return hash.includes(key) && !hash.includes("/opponentinfo");
        }
        return pathname.includes(key) || hash.includes(key);
      })
      .map(([key, component]) => React.cloneElement(component, { key }));

    return allBlocks;
  }, [location]);

  return (
    <>
      <NavigationLine />
      <EmptyHub />
      {/* {mainContent} */}
      {additionalContent}
    </>
  );
}
