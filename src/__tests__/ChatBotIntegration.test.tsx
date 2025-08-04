import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '../app/page';

// Mock child components with simple implementations
jest.mock('../components/ChatHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-header">Chat Header</div>,
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
  default: ({ onSend }: { onSend: (message: string) => void }) => (
    <div>
      <input
        data-testid="message-input"
        type="text"
        placeholder="Type your message..."
      />
      <button 
        data-testid="send-button" 
        onClick={() => onSend('Test message')}
      >
        Send
      </button>
    </div>
  ),
}));

// Mock the hooks
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user123', name: 'Test User' },
    isLoading: false,
  }),
}));

jest.mock('../hooks/useChat', () => ({
  useChat: () => ({
    messages: [
      {
        id: '1',
        content: 'Hello! How can I help you today?',
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
const mockPrefetch = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
  }),
  usePathname: () => '/',
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe('ChatBot Component', () => {
  it('renders the chat interface with initial message', () => {
    render(<ChatBot />);
    
    // Check if the chat header is rendered
    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    
    // Check if the initial message is displayed
    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    
    // Check if the input and send button are rendered
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });
});
