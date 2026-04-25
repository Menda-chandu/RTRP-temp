import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Github, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await signup(formData.email, formData.password, formData.name);
    setIsSubmitting(false);
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px]"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block text-2xl font-serif font-bold tracking-tight text-primary mb-8 hover:opacity-80 transition-opacity">
            Campus <span className="italic font-normal">Genie</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-primary mb-3">Create your account</h1>
          <p className="text-muted-foreground font-medium">Join the intelligent KMIT community</p>
        </div>
        
        <div className="bg-card border border-border/80 rounded-2xl p-8 pt-10 shadow-sm relative">
           {error && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-destructive text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                {error}
              </div>
           )}
           
           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                 <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary/30 transition-all font-medium" />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">KMIT Email</label>
                 <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@kmit.in" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary/30 transition-all font-medium" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
                   <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary/30 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Confirm</label>
                   <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary/30 transition-all font-medium" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50 mt-4"
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
              </button>

              <p className="text-center text-sm font-medium text-muted-foreground pt-4">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
              </p>

              <div className="relative flex items-center py-4">
                 <div className="flex-grow border-t border-border"></div>
                 <span className="mx-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Join with</span>
                 <div className="flex-grow border-t border-border"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button type="button" className="flex items-center justify-center gap-3 py-3 border border-border rounded-xl hover:bg-secondary/30 transition-colors font-bold text-sm">
                   Google
                 </button>
                 <button type="button" className="flex items-center justify-center gap-3 py-3 border border-border rounded-xl hover:bg-secondary/30 transition-colors font-bold text-sm">
                    GitHub
                 </button>
              </div>
           </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
