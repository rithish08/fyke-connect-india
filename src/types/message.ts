export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id?: string;
  conversation: string;
  created_at: string;
  read: boolean;
  type?: 'user' | 'system';
}

// Alternative for system messages
export interface SystemMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  type: string;
  conversation?: string; // Made optional for compatibility
}

export interface ConversationWithDetails {
  conversation_id: string;
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_at: string;
  last_message_sender_id: string;
  unread_messages_count: number;
  job_title: string;
  job_id: string;
  job_status?: string;
  phone_shared?: boolean;
  other_phone_shared?: boolean;
}