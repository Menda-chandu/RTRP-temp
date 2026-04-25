import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, LogOut, User, LayoutDashboard, History, Calendar, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { name: 'Chat', path: '/chat', icon: Sparkles, protected: true },
    { name: 'Timetable', path: '/timetable', icon: Calendar, protected: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="text-xl font-serif font-bold tracking-tight text-primary">
            Campus <span className="italic font-normal">Genie</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <div className="hidden md:flex items-center gap-1">
            {navItems.filter(item => !item.protected || user).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-secondary text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-border mx-2 hidden sm:block" />

          {/* User Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
               <div className="flex items-center gap-3 ml-2">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-all"
                  >
                    <User size={16} />
                    <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
               </div>
            ) : (
                <div className="flex items-center gap-2 ml-2">
                    <Link to="/login" className="text-sm font-medium px-3 py-1.5 hover:text-primary transition-colors">Sign in</Link>
                    <Link to="/signup" className="text-sm font-medium px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Get Started</Link>
                </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
