import { useSelector } from "react-redux";

import { SocketConnectingLine } from "@sama-communications.ui-kit";

import { getNetworkState } from "@store/values/NetworkState.js";

export default function ConnectingLine() {
  const isSocketConnected = useSelector(getNetworkState);

  return <SocketConnectingLine isSocketConnected={isSocketConnected} />;
}
