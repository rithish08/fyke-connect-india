
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'BuildPro Construction',
      role: 'Employer',
      lastMessage: 'When can you start the construction work?',
      time: '2 min ago',
      unread: 2,
      avatar: '🏗️',
      online: true
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Job Seeker',
      lastMessage: 'Thank you for considering my application',
      time: '1 hour ago',
      unread: 0,
      avatar: '👷',
      online: false
    },
    {
      id: 3,
      name: 'QuickDelivery Services',
      role: 'Employer',
      lastMessage: 'We have reviewed your profile',
      time: '2 hours ago',
      unread: 1,
      avatar: '🚚',
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'BuildPro Construction',
      message: 'Hi! We reviewed your application for the construction worker position.',
      time: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      message: 'Thank you for reviewing my application. I am very interested in this position.',
      time: '10:32 AM',
      isOwn: true
    },
    {
      id: 3,
      sender: 'BuildPro Construction',
      message: 'Great! Do you have experience with cement work?',
      time: '10:35 AM',
      isOwn: false
    },
    {
      id: 4,
      sender: 'You',
      message: 'Yes, I have 2 years of experience in construction and cement work.',
      time: '10:36 AM',
      isOwn: true
    },
    {
      id: 5,
      sender: 'BuildPro Construction',
      message: 'Perfect! When can you start the construction work?',
      time: '10:40 AM',
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  const ChatList = () => (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card 
          key={conversation.id}
          className={`p-4 cursor-pointer transition-colors ${
            selectedChat === conversation.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
          }`}
          onClick={() => setSelectedChat(conversation.id)}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                {conversation.avatar}
              </div>
              {conversation.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                <span className="text-xs text-gray-500">{conversation.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                {conversation.unread > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs mt-1">
                {conversation.role}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const ChatWindow = () => {
    const currentChat = conversations.find(c => c.id === selectedChat);
    
    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChat(null)}
              className="p-2"
            >
              ←
            </Button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {currentChat?.avatar}
                </div>
                {currentChat?.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{currentChat?.name}</h3>
                <p className="text-xs text-gray-500">
                  {currentChat?.online ? 'Online' : 'Last seen 1 hour ago'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.isOwn ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-600">Connect with employers and job seekers</p>
      </div>

      <div className="h-[calc(100vh-8rem)]">
        {selectedChat ? (
          <ChatWindow />
        ) : (
          <div className="p-4">
            <ChatList />
            {conversations.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
                <p className="text-gray-600">Start applying to jobs or posting job requirements to begin conversations</p>
              </div>
            )}
          </div>
        )}
      </div>

      {!selectedChat && <BottomNavigation />}
    </div>
  );
};

export default Messaging;
