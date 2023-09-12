import ChatForm from "./screens/chat/ChatForm";
import ChatList from "./screens/chat/ChatList";
import React, { useState } from "react";

import "../styles/Main.css";

// import { ReactComponent as CloseChatList } from "./../assets/icons/CloseChatList.svg";

export default function Main() {
  // const [asideDisplayStyle, setAsideDisplayStyle] = useState("none");
  // const [chatFormBgDisplayStyle, setChatFormBgDisplayStyle] = useState("none");

  // const closeChatList = () => {
  //   setAsideDisplayStyle("none");
  //   setChatFormBgDisplayStyle("none");
  // };

  return (
    <div>
      {/* <div
        style={{ display: chatFormBgDisplayStyle }}
        className="chat-menu-bg"
        onClick={closeChatList}
      >
        <CloseChatList />
      </div> */}
      <main>
        <ChatList
        // asideDisplayStyle={asideDisplayStyle}
        // setAsideDisplayStyle={setAsideDisplayStyle}
        // setChatFormBgDisplayStyle={setChatFormBgDisplayStyle}
        />
        {/* <ChatForm
        // setAsideDisplayStyle={setAsideDisplayStyle}
        // setChatFormBgDisplayStyle={setChatFormBgDisplayStyle}
        /> */}
      </main>
    </div>
  );
}
