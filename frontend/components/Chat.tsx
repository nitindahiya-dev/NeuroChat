import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface Message {
  room: string;
  content: string;
  sender: string;
  timestamp: number;
}


const AnimatedBackgroundSVG = () => {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bgGradient)" />
      {/* Animated circles */}
      <motion.circle
        cx="400" cy="300" r="50"
        fill="rgba(34,211,238,0.3)"
        animate={{ r: [40, 60, 40], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="200" cy="150" r="30"
        fill="rgba(168,85,247,0.3)"
        animate={{ r: [20, 40, 20], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.circle
        cx="600" cy="450" r="40"
        fill="rgba(96,165,250,0.3)"
        animate={{ r: [30, 50, 30], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </svg>
  );
};

export default function Chat({ room }: { room: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const websocket = new WebSocket(`ws://localhost:8080/ws`);
    websocket.onopen = () => console.log('Connected to WebSocket');
    websocket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      if (message.room === room) {
        setMessages((prev) => [...prev, message]);
      }
    };
    setWs(websocket);
    return () => websocket.close();
  }, [room]);

  const { user } = useAuth();

  const sendMessage = () => {
    if (ws && input.trim() && user) {
      const message = { 
        room, 
        content: input,
        sender: user.username,
        timestamp: Date.now()
      };
      ws.send(JSON.stringify(message));
      setInput('');
    }
  };

  return (
    <div className="relative h-[85vh] w-full flex">
      {/* SVG Background */}
      <AnimatedBackgroundSVG />

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col backdrop-blur-xl bg-gradient-to-br from-gray-900/80 to-cyan-900/20 border border-cyan-500/30 rounded-xl m-4 shadow-2xl shadow-cyan-500/20">
        {/* Chat Header */}
        <div className="p-4 border-b border-cyan-500/30">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {room} Channel
          </h2>
          <p className="text-cyan-400 text-sm">Active Users: 42</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, x: msg.sender === user?.username ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      className={`group relative flex gap-3 ${msg.sender === user?.username ? 'justify-end' : ''}`}
    >
      {msg.sender !== user?.username && (
        <div className="absolute -left-8 top-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
          {msg.sender[0]}
        </div>
      )}
      <div className={`bg-gray-800/50 p-4 rounded-2xl backdrop-blur-sm border ${
        msg.sender === user?.username 
          ? 'border-blue-500/20 group-hover:border-blue-500/40' 
          : 'border-cyan-500/20 group-hover:border-cyan-500/40'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-bold ${
            msg.sender === user?.username ? 'text-blue-400' : 'text-cyan-400'
          }`}>
            {msg.sender}
          </span>
          <span className="text-xs text-cyan-500">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-gray-100">{msg.content}</p>
      </div>
    </motion.div>
  ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-cyan-500/30">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-gray-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl px-4 py-3 text-gray-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-500/60 transition-all"
              placeholder="Type your message in the matrix..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
            >
              Send ⚡
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
