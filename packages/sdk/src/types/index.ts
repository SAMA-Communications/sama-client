export interface ISocketRequest<T> {
  request: {
    [key: string]: T;
    id: string;
  };
}

export interface IMessage {
  id: string;
  body: string;
  cid: string;
  attachments?: any[];
  from?: string;
  error?: any;
}

export interface IConversation {
  id: string;
  name: string;
  description?: string;
  is_encrypted?: boolean;
  participants?: string[];
  image_object?: any;
}

export interface IUser {
  id: string;
  login: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IFile {
  id: string;
  name: string;
  size: number;
  content_type: string;
  upload_url?: string;
}

export interface ISubscription {
  id: string;
  platform: string;
  web_endpoint: string;
  web_key_auth: string;
  web_key_p256dh: string;
  device_udid: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
