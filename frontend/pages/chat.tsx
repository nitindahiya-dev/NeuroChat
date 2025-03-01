// pages/index.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Chat from '../components/Chat';


export default function Home() {  // Rename from Chat to Home
  const [room, setRoom] = useState('general');
  const rooms = ['cyberpunk', 'neon-city', 'hackers', 'developers', 'Need Help'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-cyan-900/10">
    

      {/* Main Content */}
      <div className="pt-20 pb-8 px-8 flex gap-8">
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
