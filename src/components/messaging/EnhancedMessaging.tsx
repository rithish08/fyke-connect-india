
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Phone, Video, MoreVertical, Send, Paperclip, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  typing: boolean;
  messages: Message[];
  jobTitle?: string;
}

const EnhancedMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'BuildPro Construction',
      role: 'Employer',
      lastMessage: 'When can you start the construction work?',
      time: '2 min ago',
      unread: 2,
      avatar: '🏗️',
      online: true,
      typing: false,
      jobTitle: 'Construction Worker',
      messages: [
        {
          id: 'msg-1',
          senderId: 'emp-1',
          senderName: 'BuildPro Construction',
          message: 'Hi! We reviewed your application for the construction worker position.',
          timestamp: '10:30 AM',
          isOwn: false,
          type: 'text',
          status: 'read'
        },
        {
          id: 'msg-2',
          senderId: user?.id || 'user-1',
          senderName: 'You',
          message: 'Thank you for reviewing my application. I am very interested in this position.',
          timestamp: '10:32 AM',
          isOwn: true,
          type: 'text',
          status: 'read'
        }
      ]
    },
    {
      id: 2,
      name: 'Quick Delivery Services',
      role: 'Employer',
      lastMessage: 'Are you available for delivery today?',
      time: '1 hour ago',
      unread: 0,
      avatar: '🚚',
      online: false,
      typing: false,
      jobTitle: 'Delivery Driver',
      messages: [
        {
          id: 'msg-3',
          senderId: 'emp-2',
          senderName: 'Quick Delivery Services',
          message: 'Are you available for delivery today?',
          timestamp: '9:15 AM',
          isOwn: false,
          type: 'text',
          status: 'read'
        }
      ]
    }
  ]);

  // Check for URL parameters to open specific chat
  useEffect(() => {
    const chatWith = searchParams.get('chatWith');
    const name = searchParams.get('name');
    const type = searchParams.get('type');
    
    if (chatWith && name && type) {
      // Create or find conversation
      const existingConv = conversations.find(conv => 
        conv.name.toLowerCase().includes(name.toLowerCase())
      );
      
      if (existingConv) {
        setSelectedChat(existingConv.id);
      } else {
        // Create new conversation
        const newConv: Conversation = {
          id: conversations.length + 1,
          name: name,
          role: type === 'worker' ? 'Job Seeker' : 'Employer',
          lastMessage: 'Start your conversation',
          time: 'now',
          unread: 0,
          avatar: type === 'worker' ? '👷' : '🏢',
          online: true,
          typing: false,
          messages: [],
          jobTitle: type === 'worker' ? 'Worker' : undefined
        };
        
        setConversations(prev => [...prev, newConv]);
        setSelectedChat(newConv.id);
      }
      
      // Clear URL parameters
      setSearchParams({});
    }
  }, [searchParams, conversations]);

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, conversations]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: user?.id || 'user-1',
        senderName: 'You',
        message: newMessage.trim(),
        timestamp: currentTime,
        isOwn: true,
        type: 'text',
        status: 'sent'
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedChat) {
          return {
            ...conv,
            messages: [...conv.messages, newMsg],
            lastMessage: newMessage.trim(),
            time: 'now',
            unread: 0
          };
        }
        return conv;
      }));

      setNewMessage('');
      
      // Simulate message delivery and read status
      setTimeout(() => {
        setConversations(prev => prev.map(conv => {
          if (conv.id === selectedChat) {
            return {
              ...conv,
              messages: conv.messages.map(msg => 
                msg.id === newMsg.id ? { ...msg, status: 'delivered' } : msg
              )
            };
          }
          return conv;
        }));
      }, 1000);

      toast({
        title: "Message sent",
        description: "Your message has been delivered",
      });
    }
  };

  const getCurrentChat = () => {
    return conversations.find(c => c.id === selectedChat);
  };

  const ChatHeader = ({ chat }: { chat: Conversation }) => (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedChat(null)}
          className="p-2 lg:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="relative">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
            {chat.avatar}
          </div>
          {chat.online && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{chat.name}</h3>
          <p className="text-xs text-gray-500">
            {chat.typing ? 'Typing...' : chat.online ? 'Online' : 'Last seen 1 hour ago'}
          </p>
          {chat.jobTitle && (
            <p className="text-xs text-blue-600">{chat.jobTitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Voice call", description: "Feature coming soon" })}>
          <Phone className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Video call", description: "Feature coming soon" })}>
          <Video className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        message.isOwn
          ? 'bg-blue-600 text-white rounded-br-md'
          : 'bg-gray-100 text-gray-900 rounded-bl-md'
      }`}>
        <p className="text-sm">{message.message}</p>
        <div className="flex items-center justify-between mt-1">
          <p className={`text-xs ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp}
          </p>
          {message.isOwn && (
            <span className={`text-xs ml-2 ${
              message.status === 'read' ? 'text-blue-200' : 
              message.status === 'delivered' ? 'text-blue-200' : 'text-blue-300'
            }`}>
              {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const ChatWindow = () => {
    const currentChat = getCurrentChat();
    if (!currentChat) return null;
    
    return (
      <div className="flex flex-col h-full">
        <ChatHeader chat={currentChat} />
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {currentChat.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p>Start your conversation with {currentChat.name}</p>
              </div>
            </div>
          ) : (
            currentChat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => toast({ title: "File upload", description: "Feature coming soon" })}>
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const ConversationList = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="font-semibold mb-2">No conversations yet</h3>
              <p className="text-sm">Your messages will appear here</p>
            </div>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id}
              className={`m-2 p-4 cursor-pointer transition-colors border ${
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
                  {conversation.jobTitle && (
                    <p className="text-xs text-blue-600 mt-1">{conversation.jobTitle}</p>
                  )}
                  <Badge variant="outline" className="text-xs mt-1">
                    {conversation.role}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex">
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full">
        <div className="w-1/3 border-r bg-gray-50">
          <ConversationList />
        </div>
        <div className="flex-1">
          {selectedChat ? <ChatWindow /> : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden w-full">
        {selectedChat ? <ChatWindow /> : <ConversationList />}
      </div>
    </div>
  );
};

export default EnhancedMessaging;
