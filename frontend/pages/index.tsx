import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaRocket, FaComments, FaShieldAlt, FaBrain } from 'react-icons/fa';


const AnimatedBackgroundSVG = () => {
  return (
    <svg className="absolute top-0" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
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

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Animated SVG Background */}
      <AnimatedBackgroundSVG />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center h-screen px-4 text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-6 py-3 rounded-full border border-cyan-400/30 shadow-lg mb-8">
            <span className="text-cyan-400 text-lg font-medium">v2.0.1 BETA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            SECURE <br /> NEUROCHAT
          </h1>

          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-cyan-400"></span> Immerse in quantum-encrypted communication powered by blockchain neural networks <span className="text-purple-400">◼◼◼</span>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
          transition={{ delay: 0.8 }}
        >
          <Link href="/chat" passHref>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,211,238,0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2"
            >
              <FaRocket className="text-xl animate-pulse" />
              INITIALIZE CHAT PROTOCOL
            </motion.button>
          </Link>
          <button className="border-2 border-cyan-500 text-cyan-400 px-8 py-4 rounded-xl text-lg font-bold hover:bg-cyan-500/10 transition-colors">
            WATCH DEMO
          </button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center text-cyan-400 mb-16"
          >
            CORE SYSTEMS
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <FaShieldAlt className="text-4xl" />,
                title: "QUANTUM ENCRYPTION",
                description: [
                  "256-bit AES-GCM encryption",
                  "Post-quantum cryptography",
                  "Zero-knowledge proofs"
                ]
              },
              {
                icon: <FaBrain className="text-4xl" />,
                title: "NEURAL FILTERING",
                description: [
                  "GPT-4 content analysis",
                  "Real-time toxicity detection",
                  "Context-aware moderation"
                ]
              },
              {
                icon: <FaComments className="text-4xl" />,
                title: "HYPER-TRANSMISSION",
                description: [
                  "WebSocket 2.0 protocol",
                  "＜1ms latency clusters",
                  "E2E encrypted channels"
                ]
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-lg hover:border-cyan-500/40 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-cyan-400 mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <ul className="space-y-2">
                    {feature.description.map((item, i) => (
                      <li key={i} className="text-gray-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-8"
          >
            INITIALIZE CHAT SEQUENCE
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Join 500,000+ users in the most secure communication network ever created
          </motion.p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/chat" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/30"
              >
                <FaRocket className="text-xl" />
                BEGIN TRANSMISSION
              </motion.button>
            </Link>
            <button className="border-2 border-cyan-500 text-cyan-400 px-8 py-4 rounded-xl font-bold hover:bg-cyan-500/10 transition-colors">
              WATCH DEMO
            </button>
          </div>
        </div>
      </section>

      {/* Animated Footer */}
      <footer className="bg-gray-900/80 py-12 px-4 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              NEUROCHAT
            </h3>
            <p className="text-gray-400">v2.0.1 - Quantum Protocol</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white">NETWORK STATUS</h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-cyan-400">ALL SYSTEMS NOMINAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}