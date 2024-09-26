interface ISendBirdCreateObj {
  userId: string;
  nickName: string;
  profileUrl: string;
  issueAccessToken: boolean;
  metadata?: object;
}
interface IMessage {
  message: string;
  messageType: string;
  sender: string;
  sendPush: boolean;
  channelUrl: string;
}

interface IUserResponse {
  user_id: string;
  nickname: string;
  profile_url: string;
  access_token: string;
  is_online: boolean;
  is_active: boolean;
  is_created: boolean;
  phone_number: string;
  require_auth_for_profile_image: boolean;
  session_tokens: string[];
  last_seen_at: number;
  discovery_keys: string[];
  preferred_languages: string[];
  has_ever_logged_in: boolean;
  metadata: Record<string, any>;
}

interface IMember {
  user_id: string;
  nickname: string;
  profile_url: string;
  is_active: boolean;
  is_online: boolean;
  last_seen_at: number;
  state: 'invited' | 'joined' | null;
  role: 'operator' | null;
  metadata: Record<string, any>;
}

interface IOperator {
  user_id: string;
  nickname: string;
  profile_url: string;
  is_active: boolean;
  is_online: boolean;
  last_seen_at: number;
  state: '';
  metadata: Record<string, any>;
}

interface IChannel {
  name: string;
  custom_type: string;
  unread_message_count: number;
  data: {
    channel_url: string;
    cover_url: string;
  };
  is_distinct: boolean;
  is_public: boolean;
  is_super: boolean;
  is_ephemeral: boolean;
  is_access_code_required: boolean;
  member_count: number;
  joined_member_count: number;
  unread_mention_count: number;
  created_by: {
    user_id: string;
    nickname: string;
    profile_url: string;
    require_auth_for_profile_image: boolean;
  };
  members: IMember[];
  operators: IOperator[];
  last_message: null | any;
  message_survival_seconds: number;
  max_length_message: number;
  created_at: number;
  freeze: boolean;
  channel: Record<string, any>; // Deprecated key
}

interface IMessageResponse {
  message_type: string;
  user_id: string;
  custom_type: string;
  message: string;
  mention_type: string;
  mentioned_user_ids: string[];
  poll_id: number;
  include_poll_details: boolean;
  sorted_metaarray: {
    key: string;
    value: string[];
  }[];
  push_message_template: {
    title: string;
    body: string;
  };
  apns_bundle_id: string;
  apple_critical_alert_options: {
    sound: string;
    volume: string;
  };
}

export type {
  ISendBirdCreateObj,
  IMessage,
  IChannel,
  IMember,
  IUserResponse,
  IMessageResponse,
};
