import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Github, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);
    if (result.success) navigate(location.state?.message ? '/chat' : '/');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px]"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block text-2xl font-serif font-bold tracking-tight text-primary mb-8 hover:opacity-80 transition-opacity">
            Campus <span className="italic font-normal">Genie</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-primary mb-3">Sign in to your account</h1>
          <p className="text-muted-foreground font-medium">Continue to the KMIT assistant</p>
        </div>
        
        <div className="bg-card border border-border/80 rounded-2xl p-8 pt-10 shadow-sm relative">
           {error && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-destructive text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                {error}
              </div>
           )}
           
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Work Email</label>
                 <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@kmit.in"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary/30 transition-all font-medium"
                 />
              </div>
              
              <div className="space-y-2">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Password</label>
                    <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>
                 </div>
                 <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary/30 transition-all font-medium"
                 />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : <>Continue <ArrowRight size={20} /></>}
              </button>

              <p className="text-center text-sm font-medium text-muted-foreground pt-4">
                No account? <Link to="/signup" className="text-primary font-bold hover:underline">Create one</Link>
              </p>

              <div className="relative flex items-center py-6">
                 <div className="flex-grow border-t border-border"></div>
                 <span className="mx-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Social login</span>
                 <div className="flex-grow border-t border-border"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button type="button" className="flex items-center justify-center gap-3 py-3 border border-border rounded-xl hover:bg-secondary/30 transition-colors font-bold text-sm">
                   <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                   Google
                 </button>
                 <button type="button" className="flex items-center justify-center gap-3 py-3 border border-border rounded-xl hover:bg-secondary/30 transition-colors font-bold text-sm">
                    <Github size={20} /> GitHub
                 </button>
              </div>
           </form>
        </div>
        
        <p className="text-center text-[10px] text-muted-foreground/40 mt-12 uppercase tracking-[0.2em] font-medium">&copy; 2026 KMIT Academic Systems. All Rights Reserved.</p>
      </motion.div>
    </div>
  );
};

export default Login;
