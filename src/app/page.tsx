"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useChat } from "@/hooks/useChat";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

function ChatBot() {
  const initialMessages: Message[] = [
    {
      id: "1",
      content: "Hello! I'm your ISTQB AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ];

  const { messages, isLoading: isChatLoading, error, sendMessage } = useChat(initialMessages);
  const { user } = useAuth();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading || !user) return;
    
    try {
      await sendMessage(input, user.username);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '8s' }}></div>
        
        <div className="flex flex-col h-full">
          <ChatHeader 
            title="AI Chat Assistant" 
            subtitle="Ask me anything" 
          />
          
          <main className="flex-1 overflow-y-auto p-4">
            <MessageList 
              messages={messages} 
              isLoading={isChatLoading} 
            />
          </main>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <ChatInput
              value={input}
              onInputChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onSubmit={handleSubmit}
              isLoading={isChatLoading}
            />
            <ErrorDisplay error={error} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ChatBot;
