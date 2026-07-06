import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:2000';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load chat history when user logs in
  useEffect(() => {
    if (user) {
      fetchChatHistory();
    } else {
      // Clear messages when user logs out
      setMessages([]);
    }
  }, [user]);

  const fetchChatHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch chat history from the backend with user ID
      const response = await axios.get(`${PYTHON_API_URL}/api/chat/history/${user?._id}`);
      setMessages(response.data.messages || []); // Ensure messages are an array
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
      setError('Failed to load chat history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message to the chat
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    const botMessageId = `${Date.now() + 1}`;
    const botMessage = {
      id: botMessageId,
      text: '',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${PYTHON_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: text,
          userId: user?._id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect to chatbot service');
      }

      setIsLoading(false); // Disable spinner once stream begins
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let botText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') break;

            try {
              const data = JSON.parse(dataStr);
              if (data.token) {
                botText += data.token;
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg.id === botMessageId ? { ...msg, text: botText } : msg
                  )
                );
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (jsonErr) {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');

      setMessages((prevMessages) => {
        const filtered = prevMessages.filter((msg) => msg.id !== botMessageId);
        const errorMessage = {
          id: botMessageId,
          text: 'Sorry, I encountered an error while processing your request. Please try again.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isError: true,
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]); // Clear local messages

    // If user is logged in, also clear chat history on the server
    if (user) {
      clearChatHistory();
    }
  };

  const clearChatHistory = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${PYTHON_API_URL}/api/chat/history/${user?._id}`);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const rateMessage = async (messageId, rating) => {
    try {
      // Send the rating to the backend with user ID
      await axios.post(`${PYTHON_API_URL}/api/rate`, { 
        messageId, 
        rating,
        userId: user?._id 
      });

      // Update the message in the local state
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg))
      );
    } catch (err) {
      console.error('Failed to rate message:', err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat,
        rateMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};