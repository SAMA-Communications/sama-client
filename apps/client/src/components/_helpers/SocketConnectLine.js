import { useSelector } from "react-redux";

import { ConnectLine } from "@sama-communications.ui-kit";

import { getNetworkState } from "@store/values/NetworkState.js";

export default function SocketConnectLine() {
  const isSocketConnected = useSelector(getNetworkState);

  return <ConnectLine isSocketConnected={isSocketConnected} />;
}
