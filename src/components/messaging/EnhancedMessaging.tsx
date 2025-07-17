import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Search, Share, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobContext';
import ShareNumberModal from '@/components/communication/ShareNumberModal';
import CallConfirmModal from '@/components/communication/CallConfirmModal';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useConversations, ConversationWithDetails } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { Message } from '@/types/message';
import { formatDistanceToNow } from 'date-fns';
import { notificationService } from '@/services/notificationService';


const EnhancedMessaging = () => {
  const { user } = useAuth();
  const { sharePhoneNumber, acceptApplication, finishJob, addPendingRating } = useJobs();
  const { toast } = useToast();
  const { conversations, loading: conversationsLoading, error: conversationsError, refreshConversations } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { messages, loading: messagesLoading, error: messagesError, sendMessage, setMessages } = useMessages(selectedConversationId);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [blockConfirmed, setBlockConfirmed] = useState(false);
  const { t } = useLocalization();
  // --- Accept Job Confirmation ---
  const [showAcceptJobConfirm, setShowAcceptJobConfirm] = useState(false);
  // --- Finish Job Confirmation ---
  const [showFinishJobConfirm, setShowFinishJobConfirm] = useState(false);

  useEffect(() => {
    // Auto-select first conversation if none is selected
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].conversation_id);
    }
  }, [conversations, selectedConversationId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Send notification to the other user
    try {
      await notificationService.sendMessageNotification(
        user?.name || 'Someone',
        newMessage.trim().substring(0, 50) + (newMessage.length > 50 ? '...' : '')
      );
    } catch (notificationError) {
      console.warn('Could not send message notification:', notificationError);
    }
    
    // Send the message using the hook's sendMessage function
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (err: any) {
      toast({ title: 'Failed to send message', variant: 'destructive' });
    }
  };
  
  // Using conversation_id for selection
  const selectedConversation = conversations.find(c => c.conversation_id === selectedConversationId);

  const filteredConversations = conversations.filter(c =>
    c.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAcceptJob = async () => {
    setShowAcceptJobConfirm(false);
    if (!selectedConversation) return;
    const conversation = conversations.find(c => c.conversation_id === selectedConversationId);
    if (!conversation?.job_id) return;
    const { success } = await acceptApplication(conversation.job_id, conversation.other_user_id);
    if (success) {
      await refreshConversations();
      const systemMessage: Message = {
        id: Date.now().toString(),
        content: t('chat.jobAcceptedSystemMsg', 'Job has been accepted! You can now share contact details for coordination.'),
        sender_id: 'system',
        conversation: conversation.conversation_id,
        created_at: new Date().toISOString(),
        read: true,
        type: 'system',
        application_id: conversation.job_id,
        job_id: conversation.job_id
      };
      setMessages(prev => [...prev, systemMessage]);
      toast({
        title: t('chat.jobAcceptedToastTitle', 'Job Accepted!'),
        description: t('chat.jobAcceptedToastDesc', 'You can now coordinate directly with the other party.')
      });
    }
  };

  const handleFinishJob = async () => {
    setShowFinishJobConfirm(false);
    if (!selectedConversation) return;
    const conversation = conversations.find(c => c.conversation_id === selectedConversationId);
    if (!conversation?.job_id) return;
      const { success } = await finishJob(conversation.job_id);
      if (success) {
        await refreshConversations();
        toast({
          title: t('chat.jobCompletedToastTitle', 'Job Completed!'),
          description: t('chat.jobCompletedToastDesc', 'Please rate your experience when prompted.')
        });
      await addPendingRating(conversation.job_id);
        
        // Show rating blocker
        const systemMessage: Message = {
          id: Date.now().toString(),
          content: t('chat.ratingRequiredMsg', 'Please rate your experience to continue using the app'),
          sender_id: 'system',
          conversation: conversation.conversation_id,
          created_at: new Date().toISOString(),
          read: true,
          type: 'system',
          application_id: conversation.job_id,
          job_id: conversation.job_id
        };
        setMessages(prev => [...prev, systemMessage]);
      }
  };

  const handleShareNumber = async () => {
    if (!selectedConversation) return;
    
    const conversation = conversations.find(c => c.conversation_id === selectedConversationId);
    if (!conversation?.job_id) return;

    const { success } = await sharePhoneNumber(conversation.job_id, conversation.other_user_id);
    
    if (success) {
      // Update conversation
      await refreshConversations();

      // Add system message
      const systemMessage: Message = {
        id: Date.now().toString(),
        content: `You have shared your phone number: ${user?.phone}`,
        sender_id: 'system',
        conversation: conversation.conversation_id,
        created_at: new Date().toISOString(),
        read: true,
        type: 'number_shared',
        phone_number: user?.phone,
        application_id: conversation.job_id,
        job_id: conversation.job_id
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

  // Utility functions for local persistence
  function getBlockedUsers() {
    return JSON.parse(localStorage.getItem('fyke_blocked_users') || '[]');
  }
  function addBlockedUser(userId: string) {
    const blocked = getBlockedUsers();
    if (!blocked.includes(userId)) {
      blocked.push(userId);
      localStorage.setItem('fyke_blocked_users', JSON.stringify(blocked));
    }
  }
  function getReportedUsers() {
    return JSON.parse(localStorage.getItem('fyke_reported_users') || '[]');
  }
  function addReportedUser(userId: string) {
    const reported = getReportedUsers();
    if (!reported.includes(userId)) {
      reported.push(userId);
      localStorage.setItem('fyke_reported_users', JSON.stringify(reported));
    }
  }

  if (conversationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-500">{t('messaging.loading', 'Loading conversations...')}</p>
        </div>
      </div>
    );
  }

  if (conversationsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('messaging.loadErrorTitle', 'Failed to load messages')}</h2>
          <p className="text-gray-500">{t('messaging.loadErrorDesc', 'We could not load your conversations. Please try again.')}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">{t('messaging.retry', 'Retry')}</Button>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('messaging.noConversationsTitle', 'No Conversations Yet')}</h2>
          <p className="text-gray-500">{t('messaging.noConversationsDesc', 'You have not started any conversations yet.')}</p>
          <Button onClick={() => window.location.href = '/search'} className="mt-4">{t('messaging.startConversation', 'Find Jobs or Workers')}</Button>
        </div>
      </div>
    );
  }

  if (selectedConversationId && !selectedConversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('messaging.conversationNotFoundTitle', 'Conversation Not Found')}</h2>
          <p className="text-gray-500">{t('messaging.conversationNotFoundDesc', 'The conversation you are looking for does not exist or could not be loaded.')}</p>
          <Button onClick={() => setSelectedConversationId(null)} className="mt-4">{t('messaging.backToList', 'Back to Conversations')}</Button>
        </div>
      </div>
    );
  }

  if (selectedConversation) {
    // Directly use selectedConversation instead of refetching
    const conversation = selectedConversation;
    const isBlocked = getBlockedUsers().includes(conversation.other_user_id);
    if (isBlocked) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('chat.blockedUserTitle', 'User Blocked')}</h2>
            <p className="text-gray-600 mb-4">{t('chat.blockedUserDesc', 'You have blocked this user. You can unblock them from your settings.')}</p>
          </div>
        </div>
      );
    }

    // These properties are not available in ConversationWithDetails
    // Using default values for now to unblock development
    const canCall = false;
    const canShareNumber = false;
    const canAcceptJob = false;
    const canFinishJob = false;
    /*
    Original implementation:
    const canCall = conversation.phone_shared && conversation.other_phone_shared;
    const canShareNumber = conversation.job_status === 'accepted' && !conversation.phone_shared;
    const canAcceptJob = user?.role === 'employer' && conversation.job_status === 'applied';
    const canFinishJob = conversation.job_status === 'accepted';
    */

    return (
      <>
        <div className="flex flex-col h-full w-full max-w-full p-2 sm:p-4 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversationId(null)}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {conversation.other_user_name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{conversation.other_user_name}</h3>
                <div className="flex items-center space-x-2">
                {/* Role information not available in ConversationWithDetails */}
                <Badge variant="outline" className="text-xs capitalize">
                  {user?.role === 'employer' ? 'worker' : 'employer'}
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
                    {t('chat.shareNumber', 'Share Number')}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCallModal(true)}
                  disabled={!canCall}
                  className="p-2"
                  title={!canCall ? t('chat.callDisabledHint', 'Both parties must share numbers to enable calling') : t('chat.call', 'Call')}
                >
                  <Phone className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2"
                      aria-label={t('chat.moreOptions', 'More options')}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowReportDialog(true)}>{t('chat.reportUser', 'Report User')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowBlockDialog(true)}>{t('chat.blockUser', 'Block User')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Job Actions */}
            {(canAcceptJob || canFinishJob) && (
              <div className="mt-3 flex space-x-2">
                {canAcceptJob && (
                  <>
                    <Button
                      onClick={() => setShowAcceptJobConfirm(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      aria-label={t('chat.acceptJob', 'Accept Job')}
                    >
                      {t('chat.acceptJob', 'Accept Job')}
                    </Button>
                    <Dialog open={showAcceptJobConfirm} onOpenChange={setShowAcceptJobConfirm}>
                      <div className="p-6 max-w-md w-full space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">{t('chat.acceptJobConfirmTitle', 'Accept Job?')}</h2>
                        <p className="text-gray-700 text-sm mb-2">{t('chat.acceptJobConfirmPrompt', 'You are about to accept this job. This action is final and will notify the other party. Proceed professionally.')}</p>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" onClick={() => setShowAcceptJobConfirm(false)}>{t('common.cancel', 'Cancel')}</Button>
                          <Button onClick={handleAcceptJob} className="bg-green-600 hover:bg-green-700 text-white">{t('chat.acceptJob', 'Accept Job')}</Button>
                        </div>
                      </div>
                    </Dialog>
                  </>
                )}
                {canFinishJob && (
                  <>
                    <Button
                      onClick={() => setShowFinishJobConfirm(true)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      aria-label={t('chat.finishJob', 'Finish Job')}
                    >
                      {t('chat.finishJob', 'Finish Job')}
                    </Button>
                    <Dialog open={showFinishJobConfirm} onOpenChange={setShowFinishJobConfirm}>
                      <div className="p-6 max-w-md w-full space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">{t('chat.finishJobConfirmTitle', 'Finish Job?')}</h2>
                        <p className="text-gray-700 text-sm mb-2">{t('chat.finishJobConfirmPrompt', 'You are about to mark this job as finished. Both parties will be required to rate each other before continuing to use the app. This action is final.')}</p>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" onClick={() => setShowFinishJobConfirm(false)}>{t('common.cancel', 'Cancel')}</Button>
                          <Button onClick={handleFinishJob} className="bg-blue-600 hover:bg-blue-700 text-white">{t('chat.finishJob', 'Finish Job')}</Button>
                        </div>
                      </div>
                    </Dialog>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messagesLoading && <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>}
            {messagesError && <div className="text-red-500">{messagesError}</div>}
            <div className="space-y-4">
              {messages.map((message) => {
                if ((message as any).type === 'system') {
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

                if ((message as any).type === 'number_shared') {
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
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('chat.inputPlaceholder', 'Type a message...')}
                className="flex-1 rounded-full"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                variant="ghost"
                size="icon"
                className="p-2"
                aria-label={t('chat.sendMessage', 'Send message')}
                onClick={handleSendMessage}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ShareNumberModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          onConfirm={handleShareNumber}
          recipientName={conversation.other_user_name}
          jobTitle={conversation.job_title}
        />

        <CallConfirmModal
          open={showCallModal}
          onClose={() => setShowCallModal(false)}
          onConfirm={() => {}}
          recipientName={conversation.other_user_name}
          phoneNumber={''} // Phone number not available in ConversationWithDetails
          jobTitle={conversation.job_title}
        />

        {/* Report Dialog */}
        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <div className="p-6 max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t('chat.reportTitle', 'Report User')}</h2>
            <p className="text-gray-700 text-sm mb-2">{t('chat.reportPrompt', 'You are about to report this user for unprofessional or inappropriate behavior. Please provide a reason below. This action is confidential and will be reviewed by our team.')}</p>
            <Input
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
              placeholder={t('chat.reportPlaceholder', 'Describe the issue...')}
              className="w-full"
            />
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
              <Button
                onClick={() => {
                  setShowReportDialog(false);
                  setReportReason('');
                  addReportedUser(conversation?.other_user_id);
                  toast({
                    title: t('chat.reportedTitle', 'User Reported'),
                    description: t('chat.reportedDesc', 'Thank you for helping us maintain a professional community.'),
                  });
                  setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    content: t('chat.reportedSystemMsg', 'You have reported {0}.', [conversation?.other_user_name]),
                    sender_id: 'system',
                    conversation: conversation.conversation_id,
                    created_at: new Date().toISOString(),
                    read: true,
                    type: 'system',
                  }]);
                }}
                disabled={!reportReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {t('chat.report', 'Report')}
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Block Dialog */}
        <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
          <div className="p-6 max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t('chat.blockTitle', 'Block User')}</h2>
            <p className="text-gray-700 text-sm mb-2">{t('chat.blockPrompt', 'Blocking this user will prevent them from contacting you further. This action is final and cannot be undone. Are you sure you want to continue?')}</p>
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowBlockDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
              <Button
                onClick={() => {
                  setShowBlockDialog(false);
                  setBlockConfirmed(true);
                  addBlockedUser(conversation?.other_user_id);
                  toast({
                    title: t('chat.blockedTitle', 'User Blocked'),
                    description: t('chat.blockedDesc', '{0} has been blocked.', [conversation?.other_user_name]),
                  });
                  setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    content: t('chat.blockedSystemMsg', 'You have blocked {0}.', [conversation?.other_user_name]),
                    sender_id: 'system',
                    conversation: conversation.conversation_id,
                    created_at: new Date().toISOString(),
                    read: true,
                    type: 'system',
                  }]);
                }}
                className="bg-gray-700 hover:bg-gray-800 text-white"
              >
                {t('chat.block', 'Block')}
              </Button>
            </div>
          </div>
        </Dialog>
      </>
    );
  }

  // Conversations List View
  return (
    <div className="flex h-full border border-gray-200 rounded-lg bg-white">
      {/* Sidebar with conversations */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">{t('messaging.title', 'Messages')}</h2>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder={t('messaging.search', 'Search messages...')}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {conversationsLoading && <div className="p-4"><Loader2 className="animate-spin" /></div>}
          {conversationsError && <div className="p-4 text-red-500">{conversationsError}</div>}
              {filteredConversations.map((conv) => {
                // Use available properties from ConversationWithDetails
                const initials = conv.other_user_name?.split(' ').map(n => n[0]).join('') || 'U';
                const lastMessageTime = conv.last_message_at 
                  ? formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })
                  : 'No messages';
                  
                return (
                  <div
                    key={conv.conversation_id}
                    className={`p-4 cursor-pointer border-b flex items-start gap-4 ${selectedConversationId === conv.conversation_id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedConversationId(conv.conversation_id)}
                  >
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{conv.other_user_name}</h3>
                        <span className="text-xs text-gray-500">{lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.last_message || 'Start a conversation'}
                      </p>
                    </div>
                  </div>
                );
              })}
        </ScrollArea>
      </div>

      {/* Main chat window */}
      <div className={`w-full flex-col ${selectedConversationId ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversationId(null)}>
                <ArrowLeft />
              </Button>
            <Avatar>
              <AvatarFallback>
                {selectedConversation.other_user_name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold">{selectedConversation.other_user_name}</h3>
                <span className="text-xs text-green-500">Online</span>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              {messagesLoading && <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>}
              {messagesError && <div className="text-red-500">{messagesError}</div>}
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t bg-white">
              <div className="relative">
                <Input
                  placeholder={t('messaging.typeMessage', 'Type a message...')}
                  className="pr-12 h-12"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleSendMessage}>
                  <Send />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center text-gray-500 bg-gray-50">
            {t('messaging.selectConversation', 'Select a conversation to start chatting')}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMessaging;
