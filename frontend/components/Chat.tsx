import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface Message {
  room: string;
  content: string;
  sender: string;
  timestamp: number;
}

function FloatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

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
      const message = JSON.parse(event.data);
      if (message.room === room) {
        setMessages((prev) => [...prev, message]);
      }
    };
    setWs(websocket);
    return () => websocket.close();
  }, [room]);

  const sendMessage = () => {
    if (ws && input.trim()) {
      const message = { room, content: input };
      ws.send(JSON.stringify(message));
      setInput('');
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingSphere />
          <OrbitControls enableZoom={false} autoRotate={true} />
        </Canvas>
      </div>

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
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring' }}
              className="group relative flex gap-3"
            >
              <div className="absolute -left-8 top-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div className="bg-gray-800/50 p-4 rounded-2xl backdrop-blur-sm border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-cyan-400 font-bold">{msg.sender}</span>
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
              Send ⚡[]
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}