"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import ErrorDisplay from "../components/ErrorDisplay";
import { useChat } from "../hooks/useChat";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function ChatBot() {
  const initialMessages: Message[] = [
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ];

  const { messages, isLoading: isChatLoading, error, sendMessage } = useChat(initialMessages);
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading) return;

    // Send message using the custom hook
    await sendMessage(input, user?.username || 'user');

    // Clear the input field after sending
    setInput("");
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  if (isAuthLoading || !user) {
    // You can render a loading spinner or a blank page while checking auth
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '8s' }}></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader 
          title="AI Chat Assistant" 
          subtitle="Powered by modern AI technology" 
        />
        
        <ErrorDisplay error={error} />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <MessageList 
            messages={messages} 
            isLoading={isChatLoading} 
          />
        </div>
        <div className="shrink-0">
          <ChatInput
            value={input}
            isLoading={isChatLoading}
            onInputChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
