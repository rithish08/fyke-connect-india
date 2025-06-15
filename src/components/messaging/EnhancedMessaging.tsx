
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles?: {
    name: string;
  };
}

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  user1?: {
    name: string;
    email: string;
  };
  user2?: {
    name: string;
    email: string;
  };
  messages?: Message[];
}

const EnhancedMessaging = () => {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabaseService.getConversations(user.id);
      if (error) {
        console.error('Error loading conversations:', error);
        toast.error('Failed to load conversations');
        return;
      }
      
      setConversations(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('conversation-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          const newMessage = payload.new as Message;
          
          // If this message is for the currently selected conversation, add it
          if (selectedConversation && newMessage.conversation_id === selectedConversation.id) {
            setMessages(prev => [...prev, newMessage]);
          }
          
          // Update last message time for the conversation
          setConversations(prev => 
            prev.map(conv => 
              conv.id === newMessage.conversation_id 
                ? { ...conv, last_message_at: newMessage.created_at }
                : conv
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    try {
      const { data, error } = await supabaseService.getConversationMessages(conversation.id);
      if (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
        return;
      }
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation || !user) return;

    try {
      const { error } = await supabaseService.sendMessage(
        selectedConversation.id,
        user.id,
        messageInput.trim()
      );

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return;
      }

      setMessageInput('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message');
    }
  };

  const getOtherUser = (conversation: Conversation) => {
    if (!user) return null;
    return conversation.user1_id === user.id ? conversation.user2 : conversation.user1;
  };

  const uniqueConversations = useMemo(() => {
    const seen = new Set();
    return conversations.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [conversations]);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Sidebar */}
      <aside className="w-full sm:w-80 border-r border-gray-100 bg-gray-50 h-full overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        {uniqueConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet</p>
            <p className="text-sm">Start applying to jobs to connect with employers</p>
          </div>
        ) : (
          <ul>
            {uniqueConversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              return (
                <li
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`cursor-pointer px-4 py-3 flex items-center gap-2 hover:bg-blue-50 ${
                    selectedConversation?.id === conversation.id ? "bg-blue-100 font-semibold" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" alt={otherUser?.name || 'User'} />
                    <AvatarFallback>{otherUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {otherUser?.name || 'Unknown User'}
                    </span>
                    <p className="text-xs text-gray-500 truncate">{otherUser?.email}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      {/* Chat Main Section */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        {selectedConversation && (
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {getOtherUser(selectedConversation)?.name || 'Unknown User'}
            </h3>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-gray-50">
          {selectedConversation ? (
            <div className="flex flex-col gap-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.sender_id === user?.id 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-900"
                    } shadow`}
                  >
                    <span className="text-sm">{msg.content}</span>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-400">
              <div className="text-center">
                <p>Select a conversation to start messaging</p>
                {uniqueConversations.length === 0 && (
                  <p className="text-sm mt-2">Apply to jobs to connect with employers</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        {selectedConversation && (
          <form onSubmit={sendMessage} className="p-3 bg-white flex gap-2 border-t border-gray-100">
            <Input
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              className="flex-1"
              placeholder="Type a message..."
            />
            <Button type="submit" className="bg-blue-600 text-white">Send</Button>
          </form>
        )}
      </main>
    </div>
  );
};

export default EnhancedMessaging;
