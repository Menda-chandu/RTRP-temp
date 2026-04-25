import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Send, Sparkles, Book, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const { sendMessage } = useChat();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (user) {
      sendMessage(message);
      navigate('/chat');
    } else {
      navigate('/login', { state: { message } });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-20 pb-32">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Simple Hero */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={14} className="text-primary/60" /> Intelligent Campus Partner
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-serif mb-8 text-primary leading-[1.1]">
            Build your future <br /> with <span className="italic">clarity</span>.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans mb-12">
            Campus Genie is a sophisticated AI assistant designed specifically for the KMIT community. 
            From academic insights to daily logistics, find what you need instantly.
          </p>

          {/* Search/Input Area */}
          <div className="max-w-xl mx-auto">
             <form onSubmit={handleSubmit} className="relative group">
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can I help you today?"
                  className="w-full bg-card border border-border shadow-sm rounded-2xl px-6 py-5 text-lg font-medium focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-30 transition-all"
                >
                  <ArrowRight size={20} />
                </button>
             </form>
             <div className="flex justify-center gap-6 mt-6">
                {['Attendance status', 'Next Tech Fest', 'Lab schedules'].map(tag => (
                   <button 
                      key={tag}
                      onClick={() => setMessage(tag)}
                      className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
                    >
                      {tag}
                   </button>
                ))}
             </div>
          </div>
        </div>

        {/* Minimal Feature Cards */}
        <div className="grid md:grid-cols-3 gap-12 mt-32 px-4">
           {[
             { 
               title: "Institutional Depth", 
               desc: "Understands the nuances of KMIT curricula and campus regulations.",
               icon: Book
             },
             { 
               title: "Reliable Insights", 
               desc: "Synthesizes data from verified college sources to give you accurate answers.",
               icon: Shield
             },
             { 
               title: "Real-time Ready", 
               desc: "Synchronized with active placement drives and campus events.",
               icon: Zap
             }
           ].map((feature, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="space-y-4"
             >
               <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary/70">
                  <feature.icon size={20} />
               </div>
               <h3 className="text-xl font-serif font-bold text-primary">{feature.title}</h3>
               <p className="text-sm text-muted-foreground leading-loose">{feature.desc}</p>
             </motion.div>
           ))}
        </div>

        {/* Campus Context section */}
        <div className="mt-40 border-t border-border pt-32">
           <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                 <h2 className="text-4xl font-serif text-primary mb-6">Designed for the <span className="italic">modern student</span>.</h2>
                 <p className="text-muted-foreground text-lg leading-loose mb-8">
                    We believe AI should be a quiet, helpful companion. Campus Genie is built on the philosophy of 
                    **minimalism and utility**, ensuring you get the information you need without the noise.
                 </p>
                 <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                       <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1"><div className="w-2 h-2 rounded-full bg-primary" /></div>
                       <p className="text-sm font-medium">Privacy-first interaction models</p>
                    </div>
                    <div className="flex gap-4 items-start">
                       <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1"><div className="w-2 h-2 rounded-full bg-primary" /></div>
                       <p className="text-sm font-medium">Direct sync with JNTUH regulations</p>
                    </div>
                 </div>
              </div>
              <div className="bg-muted/30 rounded-[2rem] p-12 border border-border/50">
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0" />
                       <div className="p-4 bg-card rounded-2xl border border-border shadow-sm text-sm font-medium">
                          What's the placement eligibility for Microsoft?
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
                       <div className="p-5 bg-secondary/20 rounded-2xl text-sm leading-loose">
                          For Microsoft's upcoming drive at KMIT, the eligibility criteria typically include a minimum CGPA of 7.0 for CSE/IT students, with no active backlogs.
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
