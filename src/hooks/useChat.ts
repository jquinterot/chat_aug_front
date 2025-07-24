import { useState, useCallback } from 'react';
import type { Message, ChatResponse, UseChatReturn } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your backend URL

export function useChat(initialMessages: Message[] = []): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, user: string): Promise<void> => {
    if (!message.trim()) return;

    // Clear any previous errors
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      user,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          user,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Extract the AI response from the backend response
      const responseContent = data.message || 'Sorry, I received an empty response.';

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to send message: ${errorMessage}`);
      
      // Add error message as assistant response
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${errorMessage}. Please check if the backend server is running on ${API_BASE_URL}.`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
