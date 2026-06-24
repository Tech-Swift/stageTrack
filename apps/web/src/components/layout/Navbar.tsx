import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bus } from 'lucide-react';

interface NavLink {
  label: string;
  targetId: string;
}

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { label: 'Features', targetId: 'features' },
    { label: 'How It Works', targetId: 'how-it-works' },
    { label: 'Benefits', targetId: 'benefits' },
    { label: 'About', targetId: 'about' },
  ];

  const handleNavClick = (targetId: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled || location.pathname !== '/'
          ? 'bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 shadow-lg'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200/50'
      }`}
    >
      {/* CONTAINER FLUID: Left-to-right edge padding */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Now clean Cobalt Blue */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-[#2563EB] p-2 rounded-xl text-white flex items-center justify-center shadow-sm">
              <Bus size={22} />
            </div>
            <span className={`text-xl font-black tracking-tight transition-colors duration-300 ${
              isScrolled || location.pathname !== '/' ? 'text-white' : 'text-[#0F172A]'
            }`}>
              Stage<span className="text-[#2563EB]">Track</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.targetId}
                onClick={() => handleNavClick(link.targetId)}
                className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                  isScrolled || location.pathname !== '/' 
                    ? 'text-slate-300 hover:text-white' 
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA - Changed from Orange to Blue hover configurations */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-95 cursor-pointer"
            >
              Book a Demo
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none p-2 rounded-lg ${
                isScrolled || location.pathname !== '/' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className={`md:hidden px-4 pt-4 pb-6 space-y-3 absolute w-full left-0 border-b shadow-xl ${
          isScrolled || location.pathname !== '/' 
            ? 'bg-[#0F172A] border-slate-800' 
            : 'bg-white border-slate-200'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.targetId}
              onClick={() => handleNavClick(link.targetId)}
              className={`block w-full text-left text-base font-medium py-2 transition-colors ${
                isScrolled || location.pathname !== '/' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className={`pt-4 border-t ${isScrolled || location.pathname !== '/' ? 'border-slate-800' : 'border-slate-100'}`}>
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate('/register');
              }}
              className="w-full text-center bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Book a Demo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};