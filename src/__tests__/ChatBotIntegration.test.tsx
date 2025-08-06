import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '../app/page';

// Mock child components with simple implementations
jest.mock('../components/ChatHeader', () => ({
  __esModule: true,
  default: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="chat-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}));

jest.mock('../components/MessageList', () => ({
  __esModule: true,
  default: ({ messages }: { messages: Array<{ id: string; content: string }> }) => (
    <div data-testid="message-list">
      {messages.map((msg) => (
        <div key={msg.id} data-testid={`message-${msg.id}`}>
          {msg.content}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../components/ChatInput', () => ({
  __esModule: true,
  default: ({ onInputChange, onKeyDown, onSubmit, value, isLoading }: {
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onSubmit: (e: React.FormEvent) => void;
    value: string;
    isLoading: boolean;
  }) => (
    <form onSubmit={onSubmit}>
      <textarea
        data-testid="message-input"
        value={value}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Type your message..."
      />
      <button 
        data-testid="send-button" 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  ),
}));

// Mock the hooks
const mockUser = {
  id: 'user123', 
  username: 'testuser',
  email: 'test@example.com'
};

const mockLogout = jest.fn();

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}));

jest.mock('../hooks/useChat', () => ({
  useChat: () => ({
    messages: [
      {
        id: '1',
        content: "Hello! I'm your ISTQB AI assistant. How can I help you today?",
        role: 'assistant',
        timestamp: new Date(),
      },
    ],
    isLoading: false,
    error: null,
    sendMessage: jest.fn(),
  }),
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => '/',
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock useCurrentUser
jest.mock('../hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({
    user: mockUser,
    loading: false,
  }),
}));

describe('ChatBot Component', () => {
  it('renders the chat interface with initial message when authenticated', async () => {
    render(<ChatBot />);
    
    // Check if the chat header is rendered with correct props
    const header = screen.getByTestId('chat-header');
    expect(header).toBeInTheDocument();
    
    // Check if the initial message is displayed
    await waitFor(() => {
      expect(screen.getByText("Hello! I'm your ISTQB AI assistant. How can I help you today?"))
        .toBeInTheDocument();
    });
    
    // Check if the input and send button are rendered
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });
});
