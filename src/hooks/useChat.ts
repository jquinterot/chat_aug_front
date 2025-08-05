import { useState, useCallback } from 'react';
import type { Message, ChatResponse, UseChatReturn } from '../types';
import { useAuth } from '../context/AuthContext';

// Use environment variable with fallback to production URL
const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL || 'https://chataugbackcontinerized-b0bbemakhucrhzdh.canadacentral-01.azurewebsites.net';

// Log the API base URL being used (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Using API Base URL:', API_BASE_URL);
}

export function useChat(initialMessages: Message[] = []): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const sendMessage = useCallback(async (message: string): Promise<void> => {
    if (!message.trim()) return;

    console.log('Auth User:', user); // Debug log
    
    if (!isAuthenticated || !user) {
      console.error('User not authenticated');
      setError('Please log in to send messages');
      return;
    }
    
    if (!user.token) {
      console.error('No authentication token found');
      setError('Authentication token missing');
      return;
    }
    
    const username = user.username || user.email || 'user';
    console.log('Using username:', username);

    // Clear any previous errors
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      user: username,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const requestBody = {
        user: username,
        message: message.trim()
      };
      
      console.log('Sending request to chat API with body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          user: user.username || user.email || 'user',
          message: message.trim()
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
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!isAuthenticated || !user) {
      setError('User not authenticated');
      return Promise.reject('User not authenticated');
    }
    return sendMessage(message);
  }, [isAuthenticated, user, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage: handleSendMessage,
    clearMessages,
  };
}
