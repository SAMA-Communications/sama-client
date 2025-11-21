export interface User {
  _id: string;
  organization_id: string;
  recent_activity?: number;
  login: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  avatar_object?: {
    file_id: string;
    file_name: string;
    file_blur_hash: string;
  };
  updated_at: string;
  created_at: string;
}

export interface MessageAttachment {
  file_id: string;
  file_name: string;
  file_blur_hash?: string;
  file_content_type: string;
  file_width?: number;
  file_height?: number;
  file_size?: number;
}

export interface MessageX {
  type: string;
  user?: any;
}

export interface Message {
  _id: string;
  organization_id: string;
  cid: string;
  body?: string;
  attachments?: MessageAttachment[];
  x?: MessageX;
  status?: MessageStatusType;
  forwarded_message_id?: string;
  deleted_for?: string[];
  from: string;
  t: number;
  created_at: string;
  updated_at: string;
}

export type MessageStatusType = "sent" | "read" | string;

export interface MessageStatus {
  _id: string;
  mid: string;
  status: MessageStatusType;
  cid: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  _id: string;
  organization_id: string;
  name?: string;
  description?: string;
  type: "g" | "u"; // "c";
  image_object?: {
    file_id: string;
    file_name: string;
    file_blur_hash: string;
  };
  image_url?: string;
  owner_id: string;
  opponent_id?: string;
  subscribers_count?: string;
  typing_users?: string[];
  draft: any; //todo: add more
  last_message: any; //tode: add more
  unread_messages_count: number;
  created_at: string;
  updated_at: string;
}
