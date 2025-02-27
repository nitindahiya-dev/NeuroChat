// pages/index.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Chat from '../components/Chat';

export default function Chat() {
  const [room, setRoom] = useState('general');
  const rooms = ['cyberpunk', 'neon-city', 'hackers', 'developers'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-cyan-900/10">
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50 backdrop-blur-xl bg-gray-900/80 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            NeuroChat
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-cyan-400">Online</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-8 flex gap-8">
        {/* Holographic Room Selector */}
        <motion.div 
          className="w-64 backdrop-blur-xl bg-gray-900/50 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10 p-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h2 className="text-lg font-bold text-cyan-400 mb-4">Channels</h2>
          <ul className="space-y-2">
            {rooms.map((roomName) => (
              <motion.li
                key={roomName}
                whileHover={{ x: 10 }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  room === roomName 
                    ? 'bg-cyan-500/20 border border-cyan-500/30'
                    : 'hover:bg-cyan-500/10'
                }`}
                onClick={() => setRoom(roomName)}
              >
                <span className="text-gray-200"># </span>
                <span className="text-cyan-400 capitalize">{roomName}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Chat Container */}
        <Chat room={room} />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 -z-10">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite`
            }}
          />
        ))}
      </div>
    </div>
  );
}