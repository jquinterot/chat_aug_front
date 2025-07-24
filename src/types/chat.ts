export interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  user?: string;
}

export interface ChatResponse {
  id: number;
  user: string;
  message: string; // This is the AI's response
  timestamp: string;
}

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, user: string) => Promise<void>;
  clearMessages: () => void;
}

export type MessageRole = 'user' | 'assistant';
