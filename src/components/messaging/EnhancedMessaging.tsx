
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, MoreVertical, Phone, MessageCircle } from 'lucide-react';
import { useGlobalToast } from '@/hooks/useGlobalToast';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: 'worker' | 'employer';
  status: 'online' | 'offline';
}

const EnhancedMessaging = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess } = useGlobalToast();

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'chat-1',
      name: 'Rajesh Kumar',
      lastMessage: 'I can start tomorrow morning',
      timestamp: '2 min ago',
      unread: 2,
      type: 'worker',
      status: 'online'
    },
    {
      id: 'chat-2',
      name: 'Priya Construction Co.',
      lastMessage: 'When can you visit the site?',
      timestamp: '1 hour ago',
      unread: 0,
      type: 'employer',
      status: 'offline'
    }
  ]);

  // Check if opening chat from URL params
  useEffect(() => {
    const chatWith = searchParams.get('chatWith');
    const name = searchParams.get('name');
    const type = searchParams.get('type');
    const context = searchParams.get('context');

    if (chatWith && name) {
      // Create new chat or find existing
      const existingChat = chats.find(chat => chat.id === chatWith);
      if (!existingChat) {
        const newChat: Chat = {
          id: chatWith,
          name: name,
          lastMessage: context ? `New conversation about ${context}` : 'New conversation',
          timestamp: 'now',
          unread: 0,
          type: (type as 'worker' | 'employer') || 'worker',
          status: 'online'
        };
        setChats(prev => [newChat, ...prev]);
      }
      setSelectedChat(chatWith);
      
      // Load initial messages
      setMessages([
        {
          id: '1',
          senderId: 'system',
          text: context ? `Conversation started about ${context}` : 'Conversation started',
          timestamp: new Date(),
          type: 'system'
        }
      ]);
    }
  }, [searchParams]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || 'current-user',
      text: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update chat last message
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat 
        ? { ...chat, lastMessage: newMessage, timestamp: 'now' }
        : chat
    ));

    // Simulate response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedChat,
        text: 'Thanks for your message! I\'ll get back to you soon.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handlePhoneCall = () => {
    showSuccess('Voice call feature coming soon!');
  };

  const ChatList = () => (
    <div className="w-full lg:w-1/3 border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <div className="overflow-y-auto h-full">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {chat.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                    {chat.unread > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  <Badge variant="outline" className="text-xs ml-2">
                    {chat.type}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatWindow = () => {
    const currentChat = chats.find(chat => chat.id === selectedChat);
    
    if (!selectedChat || !currentChat) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChat(null)}
                className="lg:hidden"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  {currentChat.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-900">{currentChat.name}</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${currentChat.status === 'online' ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  {currentChat.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handlePhoneCall}>
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === user?.id ? 'justify-end' : 
                message.type === 'system' ? 'justify-center' : 'justify-start'
              }`}
            >
              {message.type === 'system' ? (
                <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                  {message.text}
                </div>
              ) : (
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex bg-white">
      <div className={`${selectedChat ? 'hidden lg:block' : 'block'} w-full lg:w-auto`}>
        <ChatList />
      </div>
      <div className={`${selectedChat ? 'block' : 'hidden lg:block'} flex-1`}>
        <ChatWindow />
      </div>
    </div>
  );
};

export default EnhancedMessaging;
