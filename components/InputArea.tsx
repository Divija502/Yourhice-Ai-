import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-[#0f0f12] via-[#0f0f12]/90 to-transparent z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div 
            layout
            className="relative flex items-end gap-3 p-2.5 rounded-[24px] bg-zinc-900/50 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex-1 min-w-0 pl-2">
             <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask FlashChat..."
                rows={1}
                className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-[16px] leading-normal p-3 resize-none focus:outline-none max-h-[120px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent rounded-xl font-medium"
                disabled={isLoading}
              />
          </div>
          
          <div className="flex-shrink-0 pb-0.5 pr-0.5">
            <AnimatePresence mode="wait">
                {input.trim() ? (
                     <motion.button
                     key="send"
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.8, opacity: 0 }}
                     onClick={() => handleSubmit()}
                     disabled={isLoading}
                     className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95 transition-all duration-200"
                   >
                     {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                     ) : (
                        <ArrowUp size={20} strokeWidth={2.5} />
                     )}
                   </motion.button>
                ) : (
                    <motion.div
                        key="sparkle"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="w-10 h-10 flex items-center justify-center text-zinc-600"
                    >
                         <Sparkles size={20} />
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InputArea;