import React, { useState, useEffect } from 'react';
import { Menu, X, Compass, ArrowRight } from 'lucide-react';

export const Navbar = ({ onNavigateApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About Us' },
    { id: 'faq', label: 'FAQ' }
  ];

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
      {/* Scroll Progress Line - Professional Blue */}
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
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={(e) => handleScrollToSection(e, 'top')}
            aria-label="CareerPilot Home"
          >
            <div className="w-8 h-8 rounded bg-[#161B22] border border-[#30363D] flex items-center justify-center">
              <Compass className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white flex items-center gap-1">
              Career<span className="text-blue-500 font-bold">Pilot</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleScrollToSection(e, link.id)}
                  className={`px-3 py-1.5 rounded transition-colors duration-150 ${
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

          {/* Action Button - Professional Blue */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onNavigateApp}
              aria-label="Launch CareerPilot App"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Launch CareerPilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded text-gray-400 hover:text-white hover:bg-[#21262d]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161B22] border-b border-[#30363D] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleScrollToSection(e, link.id)}
                className={`block py-2 px-3 rounded text-sm font-medium transition-colors ${
                  isActive ? 'text-white font-semibold bg-[#21262d]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          <button 
            onClick={() => { setMobileMenuOpen(false); onNavigateApp(); }}
            className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            Launch CareerPilot
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </nav>
  );
};
