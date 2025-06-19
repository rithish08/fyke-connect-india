
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  other_user: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
  last_message?: string;
  unread_count: number;
}

const EnhancedMessaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const mockConversations: Conversation[] = [
    {
      id: '1',
      user1_id: user?.id || '',
      user2_id: '2',
      last_message_at: '2024-01-15T10:30:00Z',
      other_user: {
        id: '2',
        name: 'Rajesh Kumar',
        phone: '+91 9876543210',
        role: user?.role === 'jobseeker' ? 'employer' : 'jobseeker'
      },
      last_message: 'When can you start the work?',
      unread_count: 2
    },
    {
      id: '2',
      user1_id: user?.id || '',
      user2_id: '3',
      last_message_at: '2024-01-15T09:15:00Z',
      other_user: {
        id: '3',
        name: 'Priya Sharma',
        phone: '+91 9123456789',
        role: user?.role === 'jobseeker' ? 'employer' : 'jobseeker'
      },
      last_message: 'Thank you for applying!',
      unread_count: 0
    },
    {
      id: '3',
      user1_id: user?.id || '',
      user2_id: '4',
      last_message_at: '2024-01-14T16:45:00Z',
      other_user: {
        id: '4',
        name: 'Amit Singh',
        phone: '+91 9988776655',
        role: user?.role === 'jobseeker' ? 'employer' : 'jobseeker'
      },
      last_message: 'Location details shared',
      unread_count: 1
    }
  ];

  const mockMessages: { [key: string]: Message[] } = {
    '1': [
      {
        id: '1',
        content: 'Hi! I saw your job posting for construction work. I\'m interested.',
        sender_id: user?.role === 'jobseeker' ? user.id : '2',
        receiver_id: user?.role === 'jobseeker' ? '2' : user.id,
        created_at: '2024-01-15T09:00:00Z',
        read: true
      },
      {
        id: '2',
        content: 'Great! Can you tell me about your experience?',
        sender_id: user?.role === 'jobseeker' ? '2' : user.id,
        receiver_id: user?.role === 'jobseeker' ? user.id : '2',
        created_at: '2024-01-15T09:05:00Z',
        read: true
      },
      {
        id: '3',
        content: 'I have 5 years of experience in construction work. I can handle masonry, painting, and basic electrical work.',
        sender_id: user?.role === 'jobseeker' ? user.id : '2',
        receiver_id: user?.role === 'jobseeker' ? '2' : user.id,
        created_at: '2024-01-15T09:10:00Z',
        read: true
      },
      {
        id: '4',
        content: 'That sounds good. When can you start the work?',
        sender_id: user?.role === 'jobseeker' ? '2' : user.id,
        receiver_id: user?.role === 'jobseeker' ? user.id : '2',
        created_at: '2024-01-15T10:30:00Z',
        read: false
      }
    ],
    '2': [
      {
        id: '5',
        content: 'Thank you for applying to our delivery position!',
        sender_id: user?.role === 'jobseeker' ? '3' : user.id,
        receiver_id: user?.role === 'jobseeker' ? user.id : '3',
        created_at: '2024-01-15T09:15:00Z',
        read: true
      }
    ],
    '3': [
      {
        id: '6',
        content: 'Here are the location details: 123 MG Road, Bangalore',
        sender_id: user?.role === 'jobseeker' ? '4' : user.id,
        receiver_id: user?.role === 'jobseeker' ? user.id : '4',
        created_at: '2024-01-14T16:45:00Z',
        read: false
      }
    ]
  };

  useEffect(() => {
    // Load mock data
    setConversations(mockConversations);
    setLoading(false);
  }, [user]);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setMessages(mockMessages[conversationId] || []);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: user?.id || '',
      receiver_id: conversations.find(c => c.id === selectedConversation)?.other_user.id || '',
      created_at: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // In a real app, this would be sent to Supabase
    console.log('Sending message:', message);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (selectedConversation) {
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return null;

    return (
      <div className="h-full flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedConversation(null)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {conversation.other_user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{conversation.other_user.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{conversation.other_user.role}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="rounded-full w-10 h-10 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <Badge variant="secondary">{conversations.length} conversations</Badge>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-200">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-500">
                {user?.role === 'jobseeker' 
                  ? 'Apply to jobs to start conversations with employers'
                  : 'Post jobs to start conversations with job seekers'
                }
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation.id)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {conversation.other_user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.other_user.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.last_message}
                      </p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {conversation.other_user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EnhancedMessaging;
