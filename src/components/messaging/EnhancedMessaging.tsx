
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Search, Share, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobContext';
import ShareNumberModal from '@/components/communication/ShareNumberModal';
import CallConfirmModal from '@/components/communication/CallConfirmModal';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  type: 'text' | 'system' | 'number_shared';
  phone_number?: string;
}

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  job_id?: string;
  job_title?: string;
  job_status?: string;
  last_message_at: string;
  other_user: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
  last_message?: string;
  unread_count: number;
  phone_shared?: boolean;
  other_phone_shared?: boolean;
}

const EnhancedMessaging = () => {
  const { user } = useAuth();
  const { sharePhoneNumber, acceptApplication, finishJob } = useJobs();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  // Mock data with enhanced job lifecycle support
  const mockConversations: Conversation[] = [
    {
      id: '1',
      user1_id: user?.id || '',
      user2_id: '2',
      job_id: 'job1',
      job_title: 'Construction Worker Position',
      job_status: 'accepted',
      last_message_at: '2024-01-15T10:30:00Z',
      other_user: {
        id: '2',
        name: 'Rajesh Kumar',
        phone: '+91 9876543210',
        role: user?.role === 'jobseeker' ? 'employer' : 'jobseeker'
      },
      last_message: 'Job has been accepted. You can now communicate directly.',
      unread_count: 0,
      phone_shared: true,
      other_phone_shared: true
    },
    {
      id: '2',
      user1_id: user?.id || '',
      user2_id: '3',
      job_id: 'job2',
      job_title: 'Delivery Driver',
      job_status: 'applied',
      last_message_at: '2024-01-15T09:15:00Z',
      other_user: {
        id: '3',
        name: 'Priya Sharma',
        phone: '+91 9123456789',
        role: user?.role === 'jobseeker' ? 'employer' : 'jobseeker'
      },
      last_message: 'Application submitted. Waiting for response.',
      unread_count: 1,
      phone_shared: false,
      other_phone_shared: false
    }
  ];

  const mockMessages: { [key: string]: Message[] } = {
    '1': [
      {
        id: '1',
        content: 'Hi! I saw your job posting for construction work. I\'m interested and have 5 years of experience.',
        sender_id: user?.role === 'jobseeker' ? user.id : '2',
        receiver_id: user?.role === 'jobseeker' ? '2' : user.id,
        created_at: '2024-01-15T09:00:00Z',
        read: true,
        type: 'text'
      },
      {
        id: '2',
        content: 'Great! Your application has been accepted. Let\'s coordinate the work details.',
        sender_id: user?.role === 'jobseeker' ? '2' : user.id,
        receiver_id: user?.role === 'jobseeker' ? user.id : '2',
        created_at: '2024-01-15T09:05:00Z',
        read: true,
        type: 'text'
      },
      {
        id: '3',
        content: 'Job has been accepted. You can now share contact details for better coordination.',
        sender_id: 'system',
        receiver_id: '',
        created_at: '2024-01-15T09:06:00Z',
        read: true,
        type: 'system'
      },
      {
        id: '4',
        content: 'Rajesh has shared their phone number: +91 9876543210',
        sender_id: 'system',
        receiver_id: '',
        created_at: '2024-01-15T09:10:00Z',
        read: true,
        type: 'number_shared',
        phone_number: '+91 9876543210'
      }
    ],
    '2': [
      {
        id: '5',
        content: 'Thank you for applying to our delivery position! We\'ll review your application.',
        sender_id: user?.role === 'jobseeker' ? '3' : user.id,
        receiver_id: user?.role === 'jobseeker' ? user.id : '3',
        created_at: '2024-01-15T09:15:00Z',
        read: true,
        type: 'text'
      }
    ]
  };

  useEffect(() => {
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
      read: false,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleAcceptJob = async () => {
    if (!selectedConversation) return;
    
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation?.job_id) return;

    const { success } = await acceptApplication(conversation.job_id, conversation.other_user.id);
    
    if (success) {
      // Update conversation status
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, job_status: 'accepted' }
          : conv
      ));

      // Add system message
      const systemMessage: Message = {
        id: Date.now().toString(),
        content: 'Job has been accepted! You can now share contact details for coordination.',
        sender_id: 'system',
        receiver_id: '',
        created_at: new Date().toISOString(),
        read: true,
        type: 'system'
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
      toast({
        title: "Job Accepted!",
        description: "You can now coordinate directly with the other party."
      });
    }
  };

  const handleFinishJob = async () => {
    if (!selectedConversation) return;
    
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation?.job_id) return;

    const { success } = await finishJob(conversation.job_id);
    
    if (success) {
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, job_status: 'completed' }
          : conv
      ));

      toast({
        title: "Job Completed!",
        description: "Please rate your experience when prompted."
      });
    }
  };

  const handleShareNumber = async () => {
    if (!selectedConversation) return;
    
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation?.job_id) return;

    const { success } = await sharePhoneNumber(conversation.job_id, conversation.other_user.id);
    
    if (success) {
      // Update conversation
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, phone_shared: true }
          : conv
      ));

      // Add system message
      const systemMessage: Message = {
        id: Date.now().toString(),
        content: `You have shared your phone number: ${user?.phone}`,
        sender_id: 'system',
        receiver_id: '',
        created_at: new Date().toISOString(),
        read: true,
        type: 'number_shared',
        phone_number: user?.phone
      };
      
      setMessages(prev => [...prev, systemMessage]);
    }
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

    const canCall = conversation.phone_shared && conversation.other_phone_shared;
    const canShareNumber = conversation.job_status === 'accepted' && !conversation.phone_shared;
    const canAcceptJob = user?.role === 'employer' && conversation.job_status === 'applied';
    const canFinishJob = conversation.job_status === 'accepted';

    return (
      <>
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
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {conversation.other_user.role}
                  </Badge>
                  {conversation.job_title && (
                    <span className="text-xs text-gray-500 truncate">
                      {conversation.job_title}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {canShareNumber && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareModal(true)}
                    className="px-3"
                  >
                    <Share className="w-4 h-4 mr-1" />
                    Share Number
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCallModal(true)}
                  disabled={!canCall}
                  className="p-2"
                  title={!canCall ? "Both parties must share numbers to enable calling" : "Call"}
                >
                  <Phone className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Job Actions */}
            {(canAcceptJob || canFinishJob) && (
              <div className="mt-3 flex space-x-2">
                {canAcceptJob && (
                  <Button
                    onClick={handleAcceptJob}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept Job
                  </Button>
                )}
                {canFinishJob && (
                  <Button
                    onClick={handleFinishJob}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Finish Job
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                if (message.type === 'system') {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                          <p className="text-sm text-blue-800">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (message.type === 'number_shared') {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          <p className="text-sm text-green-800">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                }

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

        {/* Modals */}
        <ShareNumberModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          onConfirm={handleShareNumber}
          recipientName={conversation.other_user.name}
          jobTitle={conversation.job_title}
        />

        <CallConfirmModal
          open={showCallModal}
          onClose={() => setShowCallModal(false)}
          onConfirm={() => {}}
          recipientName={conversation.other_user.name}
          phoneNumber={conversation.other_user.phone}
          jobTitle={conversation.job_title}
        />
      </>
    );
  }

  // Conversations List View
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
                  : 'Job applications will appear here as conversations'
                }
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation.id)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors bg-white"
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
                    
                    {conversation.job_title && (
                      <p className="text-sm text-blue-600 truncate mb-1">
                        {conversation.job_title}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.last_message}
                      </p>
                      <div className="flex items-center space-x-1 ml-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            conversation.job_status === 'accepted' ? 'border-green-500 text-green-700' :
                            conversation.job_status === 'completed' ? 'border-blue-500 text-blue-700' :
                            'border-gray-300 text-gray-600'
                          }`}
                        >
                          {conversation.job_status}
                        </Badge>
                      </div>
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
