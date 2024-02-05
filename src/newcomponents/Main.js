import React, { useMemo } from "react";
import { getIsMobileView } from "@store/values/IsMobileView";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllConversations } from "@store/values/Conversations";

import ChatForm from "@newcomponents/hub/ChatForm";
import ChatInfoPage from "@screens/info/ChatInfoPage";
import ChatList from "@newcomponents/hub/ChatList";

import EmptyHub from "@newcomponents/hub/EmptyHub";
import NavigationLine from "@newcomponents/navigation/NavigationLine";
import ModalWindow from "@screens/chat/ModalWindow";
import ParticipantProfile from "@screens/info/ParticipantProfile";
import UserProfile from "@screens/info/UserProfile";
import UserSearch from "@screens/info/UserSearch";

import "@styles/Main.css";
import "@newstyles/hub/MainHub.css";

export default function Main() {
  const isMobileView = useSelector(getIsMobileView);
  const location = useLocation();

  const conversations = useSelector(selectAllConversations);

  const hubContainer = useMemo(() => {
    if (!conversations.length) {
      return <EmptyHub />;
    }

    if (isMobileView) {
      return !!location.hash ? <ChatForm /> : <ChatList />;
    }

    return (
      <section className="hub">
        <ChatList />
        <ChatForm />
      </section>
    );
  }, [location, isMobileView, conversations]);

  const additionalContainer = useMemo(() => {
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
      {/* left  side */}
      {hubContainer}
      {/* right side */}
      {additionalContainer}
    </>
  );
}
