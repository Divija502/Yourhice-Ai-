import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
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
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div 
            layout
            className="relative flex items-end gap-2 p-2 rounded-3xl bg-surface/80 border border-zinc-700/50 backdrop-blur-xl shadow-2xl ring-1 ring-white/5"
        >
          <div className="flex-1 min-w-0">
             <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="w-full bg-transparent text-zinc-200 placeholder-zinc-500 text-base p-3 resize-none focus:outline-none max-h-[120px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent rounded-xl"
                disabled={isLoading}
              />
          </div>
          
          <div className="flex-shrink-0 pb-1 pr-1">
            <AnimatePresence mode="wait">
                {input.trim() ? (
                     <motion.button
                     key="send"
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.8, opacity: 0 }}
                     onClick={() => handleSubmit()}
                     disabled={isLoading}
                     className="p-3 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-200 group"
                   >
                     {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                        <Send size={20} className="ml-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                     )}
                   </motion.button>
                ) : (
                    <motion.div
                        key="sparkle"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="p-3 text-zinc-500"
                    >
                         <Sparkles size={20} />
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <div className="text-center mt-2">
            <p className="text-[10px] text-zinc-500 font-medium">
                Powered by Gemini 1.5 Flash • Designed for Speed
            </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;