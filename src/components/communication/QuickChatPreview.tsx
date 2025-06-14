
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Phone, Video, Send, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  sender: 'user' | 'other';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'location';
}

interface QuickChatPreviewProps {
  contactName: string;
  contactRole: 'employer' | 'worker';
  isOnline: boolean;
  lastSeen: string;
  unreadCount: number;
}

const QuickChatPreview = ({ 
  contactName, 
  contactRole, 
  isOnline, 
  lastSeen, 
  unreadCount 
}: QuickChatPreviewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'other',
      content: 'Hi! Are you available for the construction job today?',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: '2',
      sender: 'user',
      content: 'Yes, I can start in 30 minutes. Where is the location?',
      timestamp: '10:32 AM',
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  if (!isExpanded) {
    return (
      <Card 
        className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {contactName[0].toUpperCase()}
                </span>
              </div>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">{contactName}</h4>
                <Badge variant="outline" className="text-xs">
                  {contactRole}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {messages[messages.length - 1]?.content}
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{isOnline ? 'Online' : `Last seen ${lastSeen}`}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
            <MessageCircle className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden border-l-4 border-l-green-500">
      {/* Chat Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/20 rounded-full p-1"
            >
              ←
            </button>
            <div>
              <h4 className="font-semibold">{contactName}</h4>
              <p className="text-sm opacity-90">
                {isOnline ? '🟢 Online' : `Last seen ${lastSeen}`}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuickChatPreview;
