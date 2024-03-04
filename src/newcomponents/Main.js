import { cloneElement, useMemo } from "react";
import { getIsMobileView } from "@store/values/IsMobileView";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectConversationsEntities } from "@store/values/Conversations";

import ChatForm from "@newcomponents/hub/ChatForm";
import ChatInfo from "@newcomponents/info/ChatInfo";
import ChatList from "@newcomponents/hub/ChatList";

import EmptyHub from "@newcomponents/hub/EmptyHub";
import NavigationLine from "@newcomponents/navigation/NavigationLine";
import ModalWindow from "@screens/chat/ModalWindow";
import OtherUserProfile from "@newcomponents/info/OtherUserProfile";
import UserProfile from "@newcomponents/info/UserProfile";
import UserSearch from "@screens/info/UserSearch";

import SHub from "@skeletons/hub/SHub";

import "@styles/Main.css";
import "@newstyles/hub/MainHub.css";
import "react-loading-skeleton/dist/skeleton.css";

export default function Main() {
  const isMobileView = useSelector(getIsMobileView);
  const location = useLocation();

  const conversations = useSelector(selectConversationsEntities);
  const conversationsArray = conversations && Object.values(conversations);

  const hubContainer = useMemo(() => {
    if (!conversations) {
      return <SHub />;
    }

    if (
      !location.hash &&
      !conversationsArray?.filter((obj) => obj.type === "g" || obj.last_message)
        .length
    ) {
      return <EmptyHub />;
    }

    if (isMobileView) {
      return !!location.hash ? <ChatForm /> : <ChatList />;
    }

    return (
      <section className="hub">
        {location.pathname.includes("/profile") ? null : <ChatList />}
        <ChatForm />
      </section>
    );
  }, [location, isMobileView, conversations]);

  const additionalContainerLeft = useMemo(() => {
    return location.pathname.includes("/profile") ? <UserProfile /> : null;
  }, [location]);

  const additionalContainerRight = useMemo(() => {
    const { pathname, hash } = location;

    const blockMap = {
      // "/create": <UserSearch type={"create_group_chat"} />,
      // "/add": <UserSearch type={"add_participants"} />,
      "/info": <ChatInfo />,
      "/user": <OtherUserProfile />,
      // "/participant": <OtherUserProfile />,
      // "/modal": <ModalWindow />,
    };

    const allBlocks = Object.entries(blockMap)
      .filter(
        ([key, component]) => pathname.includes(key) || hash.includes(key)
      )
      .map(([key, component]) => cloneElement(component, { key }));

    return allBlocks;
  }, [location]);

  return (
    <>
      <NavigationLine />
      {additionalContainerLeft}
      {hubContainer}
      {additionalContainerRight}
    </>
  );
}
