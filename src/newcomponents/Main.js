import { cloneElement, useMemo } from "react";
import { getIsMobileView } from "@store/values/IsMobileView";
import { selectConversationsEntities } from "@store/values/Conversations";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import ChatForm from "@newcomponents/hub/ChatForm";
import ChatInfo from "@newcomponents/info/ChatInfo";
import ChatList from "@newcomponents/hub/ChatList";

import EditModalHub from "@newcomponents/modals/EditModalHub";
import EmptyHub from "@newcomponents/hub/EmptyHub";
import NavigationLine from "@newcomponents/navigation/NavigationLine";
import OtherUserProfile from "@newcomponents/info/OtherUserProfile";
import UserProfile from "@newcomponents/info/UserProfile";
import UsersSelectModalHub from "./modals/UsersSelectModalHub";

import SHub from "@skeletons/hub/SHub";

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
      "/add": <UsersSelectModalHub type={"add_participants"} />,
      "/create": <UsersSelectModalHub />,
      "/edit": <EditModalHub />,
      "/info": <ChatInfo />,
      "/user": <OtherUserProfile />,
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
