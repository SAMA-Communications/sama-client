import { SocketConnectingLineProps } from "./SocketConnectingLine.types";

export const SocketConnectingLine = ({ isSocketConnected, message = "Connecting..." }: SocketConnectingLineProps) => {
  return isSocketConnected ? null : (
    <div className="ui:absolute ui:top-0 ui:z-100 ui:flex ui:h-7 ui:w-full ui:items-center ui:justify-center ui:bg-accent-500 ui:shadow-md">
      <p className="ui:text-center ui:text-[18px] ui:font-light ui:text-white">{message}</p>
    </div>
  );
};
