import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-tr from-primary to-secondary text-white' 
            : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg backdrop-blur-sm
            ${isUser
              ? 'bg-primary/90 text-white rounded-tr-sm'
              : 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-100 rounded-tl-sm'
            }
          `}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.text}</div>
          ) : (
             <ReactMarkdown 
                className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-700/50 prose-pre:rounded-lg"
                components={{
                    code({node, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match && !String(children).includes('\n');
                        return isInline ? (
                            <code className="bg-zinc-700/50 px-1 py-0.5 rounded text-pink-300 font-mono text-xs" {...props}>
                                {children}
                            </code>
                        ) : (
                             <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}
             >
                {message.text}
             </ReactMarkdown>
          )}
          
          {/* Timestamp/Status */}
          <div className={`text-[10px] mt-1 opacity-50 flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {message.isStreaming && (
                 <motion.span
                 initial={{ opacity: 0 }}
                 animate={{ opacity: [0, 1, 0] }}
                 transition={{ repeat: Infinity, duration: 1 }}
                 className="inline-block w-1.5 h-1.5 rounded-full bg-current"
               />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;