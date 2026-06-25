import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // Handle closing the modal with the Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Optional: Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // If not open, render nothing
  if (!isOpen) return null;

  return (
    // Backdrop / Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      
      {/* Modal Container */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
          aria-label="Close login modal"
        >
          <X size={20} />
        </button>

        {/* Content Wrapper */}
        <div className="p-8">
          {/* The form handles its own state, API calls, and errors.
            It calls `onClose` when auth is entirely successful.
          */}
          <LoginForm onSuccess={onClose} />
        </div>
      </div>

      {/* Invisible Clickable Background to close when clicking outside the card */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={onClose} 
        aria-hidden="true" 
      />
    </div>
  );
};