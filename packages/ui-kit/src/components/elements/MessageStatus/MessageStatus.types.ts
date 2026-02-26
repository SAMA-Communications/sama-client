import { Message } from "types/samaWssModels";

export interface MessageStatusProps {
  status?: "sent" | "read";
  message?: Message;
  color?: "accent" | "white";
}
