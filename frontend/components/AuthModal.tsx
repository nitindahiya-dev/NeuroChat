// components/AuthModal.tsx
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRef } from 'react';

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  activeTab: 'login' | 'signup';
  setActiveTab: (tab: 'login' | 'signup') => void;
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
}

export default function AuthModal({
  show,
  onClose,
  activeTab,
  setActiveTab,
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
}: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl min-h-screen flex items-center justify-center z-50"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-gray-900/80 border border-cyan-500/30 rounded-xl w-96 p-8 backdrop-blur-2xl"
      >
        {/* Blur background layer */}
        <div className="absolute inset-0 -z-10 bg-gray-900/50 backdrop-blur-3xl rounded-xl" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
        >
          <X className="w-5 h-5 text-cyan-400" />
        </button>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'login'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'signup'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {activeTab === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500/90 hover:bg-cyan-500 rounded-lg text-gray-900 font-semibold transition-all flex items-center justify-center gap-2"
          >
            {activeTab === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}