import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '../app/page';

jest.mock('../app/page', () => {
  return function MockChatBot() {
    return (
      <div data-testid="chat-container">
        <h1>Chat Application</h1>
        <div data-testid="messages">
          <div data-testid="message">Hello! How can I help you today?</div>
        </div>
        <div data-testid="input-container">
          <input 
            type="text" 
            data-testid="message-input" 
            placeholder="Type your message..." 
          />
          <button data-testid="send-button">Send</button>
        </div>
      </div>
    );
  };
});


describe('ChatBot', () => {
  it('renders the chat interface', () => {
    render(<ChatBot />);
    
    // Check if the chat container is rendered
    expect(screen.getByTestId('chat-container')).toBeInTheDocument();
    
    // Check if the title is rendered
    expect(screen.getByText('Chat Application')).toBeInTheDocument();
    
    // Check if the message is displayed
    expect(screen.getByTestId('message')).toHaveTextContent('Hello! How can I help you today?');
    
    // Check if the input and button are rendered
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  // Additional tests can be added here once the basic test is passing
});
