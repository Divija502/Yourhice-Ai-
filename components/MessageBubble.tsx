import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { User, Sparkles } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
          isUser 
            ? 'bg-white text-black' 
            : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
        }`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-5 py-3.5 rounded-2xl text-[15px] leading-7 shadow-sm backdrop-blur-md
            ${isUser
              ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm border border-zinc-700/50'
              : 'bg-zinc-900/60 text-zinc-200 rounded-tl-sm border border-zinc-800/50 shadow-inner ring-1 ring-white/5'
            }
          `}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap font-medium">{message.text}</div>
          ) : (
             <ReactMarkdown 
                className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1 prose-code:rounded"
                components={{
                    code({node, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match && !String(children).includes('\n');
                        return isInline ? (
                            <code className="bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200 font-mono text-xs border border-indigo-500/20" {...props}>
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
          <div className={`text-[10px] mt-1.5 opacity-40 font-medium flex items-center gap-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {message.isStreaming && (
                 <motion.div
                 className="flex gap-0.5"
                 >
                    <motion.span animate={{opacity: [0.2, 1, 0.2]}} transition={{duration: 1, repeat: Infinity, delay: 0}} className="w-1 h-1 bg-indigo-400 rounded-full" />
                    <motion.span animate={{opacity: [0.2, 1, 0.2]}} transition={{duration: 1, repeat: Infinity, delay: 0.2}} className="w-1 h-1 bg-indigo-400 rounded-full" />
                    <motion.span animate={{opacity: [0.2, 1, 0.2]}} transition={{duration: 1, repeat: Infinity, delay: 0.4}} className="w-1 h-1 bg-indigo-400 rounded-full" />
                 </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;