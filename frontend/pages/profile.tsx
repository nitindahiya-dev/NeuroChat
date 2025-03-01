import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaRocket, FaShieldAlt, FaBrain, FaSatelliteDish } from 'react-icons/fa';

const ProfileBackground = () => (
  <svg className="absolute inset-0" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="profileGradient" x1="0" y1="0" x2="800" y2="600">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="50%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" result="noise" />
        <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
      </filter>
    </defs>
    <rect width="800" height="600" fill="url(#profileGradient)" filter="url(#noise)" />
    <motion.path
      d="M-50 300 Q 200 50 400 300 T 800 300"
      stroke="rgba(34,211,238,0.1)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 8, repeat: Infinity }}
    />
  </svg>
);

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gray-900">
        <ProfileBackground />
        <div className="relative z-10 flex flex-col items-center justify-center h-screen text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="inline-block bg-red-500/20 px-6 py-3 rounded-full border border-red-400/30 mb-8">
              <span className="text-red-400 text-lg">⚠️ UNAUTHORIZED ACCESS</span>
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              ACCESS DENIED
            </h2>
            <p className="text-xl text-gray-300 max-w-xl">
              Authentication protocols failed to verify user credentials
            </p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,211,238,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white flex items-center gap-2 mx-auto"
              >
                <FaSatelliteDish className="animate-pulse" />
                RETURN TO HUB
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      <ProfileBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/20"
        >
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              className="relative w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 p-1 shadow-lg"
            >
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-4xl font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping" />
            </motion.div>

            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center space-y-2"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {user.username}
              </h1>
              <p className="text-cyan-300/80 font-mono">{user.email}</p>
              <div className="flex justify-center items-center gap-2 text-sm text-cyan-400">
                <FaShieldAlt className="text-cyan-400 animate-pulse" />
                <span>ID VERIFIED • SECURITY LEVEL 3</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 my-8">
            {[
              { label: "CHATS", value: "2.1K", color: "from-cyan-500 to-blue-500" },
              { label: "CONNECTIONS", value: "142", color: "from-purple-500 to-pink-500" },
              { label: "ACTIVE", value: "24H", color: "from-green-500 to-emerald-500" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-xl`}
              >
                <div className="bg-gray-900/90 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            className="grid gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34,211,238,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <FaRocket className="text-xl animate-pulse" />
                RESUME CHAT PROTOCOL
              </motion.button>
            </Link>

            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(239,68,68,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-red-600 to-purple-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <FaSatelliteDish className="text-xl" />
              TERMINATE SESSION
            </motion.button>
          </motion.div>

          {/* Security Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-cyan-500/20"
          >
            <div className="flex items-center gap-4">
              <div className="text-cyan-400">
                <FaShieldAlt className="text-3xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold">SECURITY STATUS</h3>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    />
                  </div>
                  <span className="text-cyan-400 text-sm">75%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}