import React, { useState } from 'react';
import { Lock, User, Loader2, ShieldCheck } from 'lucide-react';
// import { useRouter } from 'next/router'; // If using Next.js
// import { useNavigate } from 'react-router-dom'; // If using React Router

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  // const router = useRouter(); // Next.js
  // const navigate = useNavigate(); // React Router

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Basic Client-Side Validation
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter both your credentials.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 2. ACTUAL API CALL GOES HERE
      // const response = await fetch('/api/auth/login', { ... })
      
      // Simulating network delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 3. MOCK BACKEND RESPONSE
      // Replace this with your actual decoded JWT or response payload
      const mockUser = {
        name: "Wanjiku Marshal",
        role: "MARSHAL" // Change to 'MANAGER' or 'ADMIN' to test routing
      };

      // 4. ROLE-BASED ROUTING
      if (mockUser.role === 'MARSHAL') {
        // router.push('/marshal');
        window.location.href = '/marshal'; // Fallback for demonstration
      } else if (mockUser.role === 'MANAGER') {
        // router.push('/manager');
        window.location.href = '/manager';
      } else if (mockUser.role === 'ADMIN') {
        // router.push('/admin');
        window.location.href = '/admin';
      } else {
        throw new Error("Unauthorized access level.");
      }

      // 5. SUCCESS CALLBACK
      // This closes the modal right before/during the redirect
      onSuccess();

    } catch (err) {
      setError("Invalid credentials. Please try again or contact IT.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Area */}
      <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Login</h2>
        <p className="text-sm text-slate-500 mt-1">Authenticate to access your dashboard</p>
      </div>

      {/* Error Message Banner */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium flex items-center">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Identifier Input */}
        <div className="space-y-1.5">
          <label htmlFor="identifier" className="text-sm font-bold text-slate-700">
            Email or Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User size={18} />
            </div>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all disabled:opacity-60"
              placeholder="e.g., 0712345678 or admin@sacco.com"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-bold text-slate-700">
              Password or PIN
            </label>
            <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Authenticating...
            </>
          ) : (
            "Access Matrix"
          )}
        </button>
      </form>
    </div>
  );
};