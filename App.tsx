import React, { useState, useEffect, useRef } from 'react';
import { createChatSession, sendMessageStream } from './services/geminiService';
import { Message } from './types';
import Background from './components/Background';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import { Chat } from '@google/genai';
import { Bot, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'model',
  text: "Hello! I'm your FlashChat assistant. I'm optimized for speed and fluidity. How can I help you today?",
  timestamp: Date.now(),
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session once
  useEffect(() => {
    const chat = createChatSession();
    if (chat) {
      chatSessionRef.current = chat;
    } else {
        // Handle missing API key gracefully in UI if needed, currently logs error
        setMessages(prev => [...prev, {
            id: 'error-init',
            role: 'model',
            text: 'Error: API Key is missing. Please check your configuration.',
            timestamp: Date.now()
        }]);
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!chatSessionRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    const botMessagePlaceholder: Message = {
      id: botMessageId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, botMessagePlaceholder]);

    try {
      await sendMessageStream(chatSessionRef.current, text, (streamedText) => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { ...msg, text: streamedText } 
              : msg
          )
        );
        // Force scroll on new content chunks
        scrollToBottom('auto'); 
      });

      // Streaming finished
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
        )
      );

    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: "I'm sorry, I encountered an error. Please try again.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="relative min-h-screen text-zinc-100 font-sans selection:bg-primary/30 selection:text-primary-100">
      <Background />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-white/5 z-20 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">FlashChat</h1>
            <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
        <div className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-zinc-400 hover:text-white">
            <Info size={20} />
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="relative z-10 w-full max-w-3xl mx-auto pt-24 pb-32 px-4 md:px-0">
        <div className="flex flex-col min-h-[calc(100vh-14rem)]">
            {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-500 space-y-4 opacity-50">
                    <Bot size={48} />
                    <p>Start a conversation...</p>
                </div>
            )}
            
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} className="h-1" />
        </div>
      </main>

      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}