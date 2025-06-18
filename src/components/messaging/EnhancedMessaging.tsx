import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  isMe: boolean;
}

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string;
  messages: Message[];
}

const EnhancedMessaging = () => {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Mock conversations - replace with actual data fetching
    const mockConversations: Conversation[] = [
      {
        userId: 'user1',
        userName: 'John Doe',
        userAvatar: '/placeholder.svg',
        messages: [
          { id: '1', text: 'Hello!', isMe: false },
          { id: '2', text: 'Hi there!', isMe: true },
        ],
      },
      {
        userId: 'user2',
        userName: 'Jane Smith',
        userAvatar: '/placeholder.svg',
        messages: [
          { id: '3', text: 'How are you?', isMe: false },
          { id: '4', text: 'I am good, thanks!', isMe: true },
        ],
      },
    ];
    setConversations(mockConversations);
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      isMe: true,
    };

    // Update the selected conversation with the new message
    setSelectedConversation((prevConversation) => {
      if (!prevConversation) return null;
      return {
        ...prevConversation,
        messages: [...prevConversation.messages, newMessage],
      };
    });

    // Update the conversations state
    setConversations((prevConversations) => {
      return prevConversations.map((conversation) => {
        if (conversation.userId === selectedConversation.userId) {
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage],
          };
        }
        return conversation;
      });
    });

    setMessageInput('');
  };

  // Fix: Prevent duplicate conversations with same userId
  const uniqueConversations = useMemo(() => {
    const seen = new Set();
    return conversations.filter((c) => {
      if (seen.has(c.userId)) return false;
      seen.add(c.userId);
      return true;
    });
  }, [conversations]);

  // Also align the chat screen properly (justify chat bubble, fix spacing)
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Sidebar */}
      <aside className="w-full sm:w-80 border-r border-gray-100 bg-gray-50 h-full overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
        </div>
        <ul>
          {uniqueConversations.map((conversation) => (
            <li
              key={conversation.userId}
              onClick={() => handleSelectConversation(conversation)}
              className={`cursor-pointer px-4 py-3 flex items-center gap-2 hover:bg-blue-50 ${selectedConversation?.userId === conversation.userId ? "bg-blue-100 font-semibold" : ""}`}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={conversation.userAvatar} alt={conversation.userName} />
                <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{conversation.userName}</span>
            </li>
          ))}
        </ul>
      </aside>
      {/* Chat Main Section */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        {selectedConversation && (
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{selectedConversation.userName}</h3>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-gray-50">
          {/* Conversation messages (align bubbles) */}
          {selectedConversation ? (
            <div className="flex flex-col gap-2">
              {selectedConversation.messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.isMe ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"} shadow`}>
                    <span className="text-sm">{msg.text}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-400">
              Select a chat to start messaging.
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
