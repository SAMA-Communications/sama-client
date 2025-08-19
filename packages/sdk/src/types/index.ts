export type UserId = string | number

export interface ISocketRequest<T> {
  request: {
    [key: string]: any;
    id: string;
  };
}

export interface IMessageCreateAck {
  mid: string
  server_mid?: string
  t: number
}

export interface IMessage {
  id: string;
  body: string;
  cid: string;
  attachments?: any[];
  from?: UserId;
  error?: any;
}

export interface IConversation {
  id: string;
  name: string;
  description?: string;
  is_encrypted?: boolean;
  participants?: UserId[];
  image_object?: any;
}

export interface IUser {
  id: UserId;
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
  user_id?: UserId;
  created_at?: string;
  updated_at?: string;
}

export interface IResponsePromise {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
  resObjKey?: string | string[];
}