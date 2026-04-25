import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, RefreshCw, Trash2, User, ChevronRight } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => scrollToBottom(), [messages]);
  useEffect(() => inputRef.current?.focus(), []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    try {
      await sendMessage(input);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderMessageContent = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
      parts.push(
        <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline decoration-primary/40 hover:decoration-primary">
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return parts.length ? parts : text;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background max-w-4xl mx-auto w-full">
      {/* Thread Header */}
      <div className="flex items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-serif text-primary truncate max-w-sm">
             {messages.length > 0 ? messages[0].text.substring(0, 40) + '...' : 'New Conversation'}
          </h1>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/5"
          title="Clear thread"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto px-6 space-y-12 pb-20 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-start justify-center pb-20">
            <h2 className="text-4xl font-serif text-primary mb-8 animate-soft-reveal">
               Good afternoon, <span className="italic">{user?.name?.split(' ')[0]}</span>.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
               {[
                 { q: "What's my attendance status?", i: "Check my records" },
                 { q: "When is the next placement drive?", i: "Career updates" },
                 { q: "How to register for Tech Fest?", i: "Events & Festivals" },
                 { q: "Show me the 3rd year CSE timetable", i: "Schedules" }
               ].map((item, i) => (
                 <button 
                   key={i}
                   onClick={() => setInput(item.q)}
                   className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/30 transition-all text-left text-sm group"
                 >
                    <div>
                       <p className="font-bold text-primary">{item.q}</p>
                       <p className="text-muted-foreground text-xs">{item.i}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
               ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex gap-6 ${message.sender === 'user' ? 'justify-start' : 'justify-start'}`}
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 mt-1 flex items-center justify-center font-bold text-xs ${
                    message.sender === 'user' ? 'bg-secondary text-primary' : 'bg-primary text-white'
                  }`}>
                    {message.sender === 'user' ? user?.name?.charAt(0) : 'G'}
                  </div>
                  
                  <div className="flex-1 space-y-2 group">
                     {message.sender === 'user' && <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{user?.name}</p>}
                     {message.sender === 'bot' && <p className="text-xs font-bold text-primary uppercase tracking-widest">Campus Genie</p>}
                     
                     <div className={`text-[17px] leading-relaxed text-foreground/90 font-sans ${message.isLoading ? 'animate-pulse' : ''}`}>
                        {message.isLoading ? (
                           <div className="flex gap-1 py-1">
                              {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-border rounded-full animate-bounce" style={{ animationDelay: i*150+'ms' }} />)}
                           </div>
                        ) : renderMessageContent(message.text)}
                     </div>

                     {message.sender === 'bot' && !message.isLoading && (
                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity pt-4">
                           <button 
                             onClick={() => navigator.clipboard.writeText(message.text)}
                             className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                           >
                              <Copy size={14} /> Copy response
                           </button>
                        </div>
                     )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-10" />
          </div>
        )}
      </div>

      {/* Minimal Input Bar */}
      <div className="p-6 bg-background">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <div className="relative paper-secondary p-1 border-border/80 focus-within:border-primary/30 transition-colors">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                    handleSubmit(e);
                 }
              }}
              placeholder="Reply to Genie..."
              className="w-full bg-transparent border-none outline-none px-4 py-4 text-base font-medium resize-none max-h-48 scrollbar-hide"
            />
            <div className="flex justify-between items-center px-4 pb-3">
               <p className="text-[10px] font-bold text-muted-foreground/50 italic capitalize">Shift + Enter for new lines</p>
               <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary text-white p-2 rounded-lg disabled:opacity-20 transition-all hover:opacity-90"
               >
                  {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
               </button>
            </div>
          </div>
        </form>
        <p className="text-center text-[10px] text-muted-foreground/40 mt-4 uppercase tracking-[0.2em] font-medium">Verified using KMIT institutional archives</p>
      </div>
    </div>
  );
};

export default Chat;
