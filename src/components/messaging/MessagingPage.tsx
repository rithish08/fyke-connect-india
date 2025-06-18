
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Phone, Video, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantName: 'QuickDeliver',
    participantRole: 'Employer',
    lastMessage: 'Can you start tomorrow?',
    lastMessageTime: new Date(Date.now() - 10 * 60 * 1000),
    unreadCount: 2
  },
  {
    id: '2',
    participantName: 'Rajesh Kumar',
    participantRole: 'Job Seeker',
    lastMessage: 'I have 5 years experience in construction',
    lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
    unreadCount: 0
  },
  {
    id: '3',
    participantName: 'CleanHome Services',
    participantRole: 'Employer',
    lastMessage: 'What are your available timings?',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 1
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'employer1',
    senderName: 'QuickDeliver',
    content: 'Hi! I saw your application for the delivery partner position.',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    read: true
  },
  {
    id: '2',
    senderId: 'user',
    senderName: 'You',
    content: 'Yes, I am very interested in this position.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: true
  },
  {
    id: '3',
    senderId: 'employer1',
    senderName: 'QuickDeliver',
    content: 'Great! Can you start tomorrow? We need someone urgently.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false
  }
];

const MessagingPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const { userProfile } = useAuth();

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
      read: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (selectedConversation) {
    return (
      <div className="h-screen flex flex-col bg-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {selectedConv?.participantName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{selectedConv?.participantName}</h3>
              <p className="text-sm text-gray-500">{selectedConv?.participantRole}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderId === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm border-b p-4">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>

        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {conversation.participantName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{conversation.participantName}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {conversation.participantRole}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{conversation.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatTime(conversation.lastMessageTime)}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="inline-block w-5 h-5 bg-blue-600 text-white text-xs rounded-full text-center mt-1">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">Start applying to jobs to begin conversations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
