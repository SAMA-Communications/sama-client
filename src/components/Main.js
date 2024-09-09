import { cloneElement, useMemo } from "react";
import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { selectConversationsEntities } from "@store/values/Conversations";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import ChatForm from "@components/hub/ChatForm";
import ChatInfo from "@components/info/ChatInfo";
import ChatList from "@components/hub/ChatList";

import AttachHub from "@components/attach/AttachHub";
import EditModalHub from "@components/modals/EditModalHub";
import EmptyHub from "@components/hub/EmptyHub";
import MediaHub from "@components/attach/MediaHub";
import NavigationLine from "@components/navigation/NavigationLine";
import OtherUserProfile from "@components/info/OtherUserProfile";
import UserProfile from "@components/info/UserProfile";
import UsersSelectModalHub from "@components/modals/UsersSelectModalHub";

import SHub from "@skeletons/hub/SHub";

import "react-loading-skeleton/dist/skeleton.css";

const blockMap = {
  "/info": <ChatInfo />,
  "/user": <OtherUserProfile />,
  "/add": <UsersSelectModalHub type={"add_participants"} />,
  "/create": <UsersSelectModalHub />,
  "/create_encrypted": <UsersSelectModalHub isEncrypted={true} />,
  "/attach": <AttachHub />,
  "/media": <MediaHub />,
  "/edit": <EditModalHub />,
};

export default function Main() {
  const isMobileView = useSelector(getIsMobileView);
  const isTabletView = useSelector(getIsTabletView);
  const location = useLocation();

  const conversations = useSelector(selectConversationsEntities);
  const conversationsArray = conversations && Object.values(conversations);

  const additionalContainerRight = useMemo(() => {
    const { pathname, hash } = location;

    const allBlocks = Object.entries(blockMap)
      .filter(([key, _]) => pathname.includes(key) || hash.includes(key))
      .map(([key, component]) => cloneElement(component, { key }));

    return isMobileView ? allBlocks.slice(-2) : allBlocks;
  }, [location, isMobileView]);

  const hubContainer = useMemo(() => {
    if (!conversations) {
      return <SHub />;
    }

    if (
      !location.hash &&
      !conversationsArray?.filter((obj) => obj.type === "g" || obj.last_message)
        .length
    ) {
      if (isMobileView) {
        return location.pathname.includes("/profile") ? null : <EmptyHub />;
      }
      return <EmptyHub />;
    }

    if (isMobileView) {
      const keys = additionalContainerRight.map((el) => el.key);

      return !!location.hash ? (
        keys.includes("/user") || keys.includes("/info") ? null : (
          <ChatForm />
        )
      ) : location.pathname.includes("/profile") ? null : (
        <ChatList />
      );
    }

    if (isTabletView) {
      return !!location.hash ? <ChatForm /> : <ChatList />;
    }

    return (
      <section className="hub">
        {location.pathname.includes("/profile") ? null : <ChatList />}
        <ChatForm />
      </section>
    );
  }, [location, isMobileView, isTabletView, conversations]);

  const additionalContainerLeft = useMemo(() => {
    return location.pathname.includes("/profile") ? <UserProfile /> : null;
  }, [location]);

  return (
    <>
      {isMobileView ? null : <NavigationLine />}
      {additionalContainerLeft}
      {hubContainer}
      {additionalContainerRight}
    </>
  );
}
