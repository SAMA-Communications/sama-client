import { cloneElement, useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { AnimatePresence, motion as m, useAnimate } from "framer-motion";

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

import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { selectConversationsEntities } from "@store/values/Conversations";

import SHub from "@skeletons/hub/SHub";

import "react-loading-skeleton/dist/skeleton.css";

const blockMap = {
  "/info": <ChatInfo key="chatInfo" />,
  "/user": <OtherUserProfile key="otherUserProfile" />,
  "/add": (
    <UsersSelectModalHub type={"add_participants"} key="usersSelectModalHub" />
  ),
  "/create": <UsersSelectModalHub key="usersSelectModalHub" />,
  "/attach": <AttachHub key="attachHub" />,
  "/media": <MediaHub key="mediaHub" />,
  "/edit": <EditModalHub key="editModalHub" />,
};

export default function Main({ isNeedToAnimate }) {
  const location = useLocation();

  const isMobileView = useSelector(getIsMobileView);
  const isTabletView = useSelector(getIsTabletView);

  const conversations = useSelector(selectConversationsEntities);
  const conversationsArray = conversations && Object.values(conversations);

  const additionalContainerRight = useMemo(() => {
    const { pathname, hash } = location;

    const allBlocks = Object.entries(blockMap)
      .filter(([key, _]) => pathname.includes(key) || hash.includes(key))
      .map(([key, component]) => cloneElement(component, { key }));

    return isMobileView ? allBlocks.slice(-2) : allBlocks;
  }, [location, isMobileView]);

  const [mainContainerRef, animateMainContainer] = useAnimate();

  useEffect(() => {
    if (!isNeedToAnimate || !mainContainerRef.current) return;
    animateMainContainer([
      [
        mainContainerRef.current,
        { scale: [0.6, 1.01, 1], opacity: [0, 0.3, 1] },
        { duration: 0.8 },
      ],
    ]);
  }, []);

  const triggerExitAnimation = () => {
    if (!mainContainerRef.current) return;
    animateMainContainer([
      [
        mainContainerRef.current,
        { scale: [1, 1.02, 0.8], opacity: [1, 0.3, 0] },
        { duration: 0.4 },
      ],
    ]);
  };

  const hubContainer = useMemo(() => {
    if (!conversations) return <SHub />;

    if (
      !location.hash &&
      !conversationsArray?.filter((obj) => obj.type === "g" || obj.last_message)
        .length
    ) {
      if (isMobileView)
        return location.pathname.includes("/profile") ? null : <EmptyHub />;
      return <EmptyHub />;
    }

    if (isMobileView) {
      const keys = additionalContainerRight.map((el) => el.key);
      if (!!location.hash) {
        return keys.includes("/user") || keys.includes("/info") ? null : (
          <ChatForm />
        );
      }
      return location.pathname.includes("/profile") ? null : <ChatList />;
    }

    if (isTabletView) {
      return !!location.hash ? <ChatForm /> : <ChatList />;
    }

    return (
      <>
        {!location.pathname.includes("/profile") && <ChatList />}
        <ChatForm />
      </>
    );
  }, [location, isMobileView, isTabletView, conversations]);

  const mainContent = useMemo(() => {
    const shouldRenderContent = isMobileView
      ? !(!!location.hash
          ? additionalContainerRight.some(
              (el) => el.key === "/user" || el.key === "/info"
            )
          : location.pathname.includes("/profile"))
      : true;

    if (!shouldRenderContent) return null;

    return (
      <AnimatePresence initial={isNeedToAnimate}>
        <m.section
          ref={mainContainerRef}
          className="max-xl:p-[20px] p-[30px] md:mr-[20px] md:my-[20px] flex flex-1 flex-row justify-center gap-[15px] md:rounded-[48px] bg-(--color-bg-light) overflow-hidden"
          initial={{ opacity: isMobileView || !isNeedToAnimate ? 1 : 0 }}
        >
          <AnimatePresence>{hubContainer}</AnimatePresence>
        </m.section>
      </AnimatePresence>
    );
  }, [hubContainer]);

  const additionalContainerLeft = useMemo(() => {
    return location.pathname.includes("/profile") ? (
      <UserProfile
        key="userProfile"
        triggerMainExitEvent={triggerExitAnimation}
      />
    ) : null;
  }, [location]);

  return (
    <>
      <AnimatePresence>
        {isMobileView ? null : (
          <NavigationLine
            key="navigationLine"
            disableAnimation={true}
            triggerMainExitEvent={triggerExitAnimation}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">{additionalContainerLeft}</AnimatePresence>
      <AnimatePresence>{mainContent}</AnimatePresence>
      <AnimatePresence mode="wait">{additionalContainerRight}</AnimatePresence>
    </>
  );
}
