import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = activeTab === 'login' ? '/login' : '/signup';
      const res = await fetch(`http://localhost:8080${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Ensure cookies are sent
        body: JSON.stringify({
          email,
          password,
          ...(activeTab === 'signup' && { username }),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await res.json();
      login(data); // Store user in context
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showAuthModal ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [showAuthModal]);

  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-xl border-b border-cyan-500/30 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          NeuroChat
        </Link>

        <div className="flex gap-6 items-center">
          {/* Show Chats only if the user is logged in */}
          {user && (
            <Link href="/chat">
              <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg border border-cyan-500/30 text-cyan-400 transition-all">
                Chats 💬
              </button>
            </Link>
          )}

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                  <span className="font-bold text-gray-900">{user.username[0]}</span>
                </div>
                <span className="text-cyan-400">{user.username}</span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all border border-cyan-500/30">
                <Link href="/profile" className="block px-4 py-3 text-cyan-400 hover:bg-cyan-500/10">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-cyan-400 hover:bg-cyan-500/10"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg border border-cyan-500/30 text-cyan-400 transition-all"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            show={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            username={username}
            setUsername={setUsername}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
