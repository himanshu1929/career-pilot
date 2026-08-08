import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Compass, 
  ArrowRight, 
  LogOut, 
  LayoutDashboard, 
  User as UserIcon, 
  Settings, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';

import { CareerPilotLogo } from '../common/CareerPilotLogo';

export const Navbar = ({ onNavigateApp }) => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const { profile } = useWorkspace();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const dropdownRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScrollProgress = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScrollProgress, { passive: true });
    handleScrollProgress();

    const sections = ['features', 'how-it-works', 'about', 'faq'];
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -20% 0px',
      threshold: 0.4
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScrollProgress);
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (activeSection === sectionId) return;

    setMobileMenuOpen(false);

    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('');
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await login();
    if (result?.success) {
      if (profile?.completedOnboarding) {
        navigate('/app/dashboard');
      } else {
        navigate('/welcome');
      }
    }
  };

  const handleGoToDashboard = () => {
    if (profile?.completedOnboarding) {
      navigate('/app/dashboard');
    } else {
      navigate('/welcome');
    }
  };

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About Us' },
    { id: 'faq', label: 'FAQ' }
  ];

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Account';

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-150 ${
        isScrolled 
          ? 'bg-[#0D1117]/95 backdrop-blur-md border-b border-[#30363D]' 
          : 'bg-[#0D1117]/80 border-b border-transparent'
      }`} 
      role="navigation" 
      aria-label="Main Navigation"
    >
      {/* Scroll Progress Line */}
      <div 
        className="h-[2px] bg-blue-600 transition-all duration-150 ease-out" 
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <CareerPilotLogo 
            size={40} 
            onClick={(e) => handleScrollToSection(e, 'top')} 
            wordmarkClassName="text-xl font-bold tracking-tight"
          />

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleScrollToSection(e, link.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-white font-semibold bg-[#21262d] border border-[#30363D]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Action Area / User Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-[#161B22] hover:bg-[#21262d] border border-[#30363D] hover:border-gray-600 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                  aria-label="User Profile Menu"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={displayName} className="w-5 h-5 rounded-full object-cover border border-blue-500/40" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-gray-200 truncate max-w-[120px]">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl p-1.5 text-xs z-50 animate-fadeIn">
                    {/* User Header */}
                    <div className="px-3 py-2.5 border-b border-[#30363D] mb-1">
                      <p className="text-xs font-bold text-white truncate">{displayName}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => { setDropdownOpen(false); handleGoToDashboard(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#21262d] rounded-lg transition-colors cursor-pointer text-left font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => { setDropdownOpen(false); handleGoToDashboard(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#21262d] rounded-lg transition-colors cursor-pointer text-left font-medium"
                    >
                      <Settings className="w-4 h-4 text-amber-400" />
                      <span>Settings</span>
                    </button>

                    <div className="my-1 border-t border-[#30363D]" />

                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={handleGoogleLogin}
                  className="px-3.5 py-1.5 bg-[#161B22] hover:bg-[#21262d] border border-[#30363D] hover:border-blue-500/50 text-white text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button 
                  onClick={onNavigateApp}
                  aria-label="Launch CareerPilot App"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Launch CareerPilot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161B22] border-b border-[#30363D] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleScrollToSection(e, link.id)}
                className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white font-semibold bg-[#21262d]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          {user ? (
            <div className="pt-3 border-t border-[#30363D] space-y-2">
              <div className="px-3 py-2 bg-[#0D1117] rounded-lg border border-[#30363D] flex items-center gap-2.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={displayName} className="w-7 h-7 rounded-full border border-blue-500/40" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => { setMobileMenuOpen(false); handleGoToDashboard(); }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard</span>
              </button>
              
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="w-full py-2 text-rose-400 hover:bg-[#21262d] text-xs font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#30363D] space-y-2">
              <button
                onClick={() => { setMobileMenuOpen(false); handleGoogleLogin(); }}
                className="w-full py-2.5 bg-[#21262d] hover:bg-[#30363D] border border-[#30363D] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button 
                onClick={() => { setMobileMenuOpen(false); onNavigateApp(); }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch CareerPilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
