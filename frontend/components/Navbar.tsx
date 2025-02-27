import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-xl border-b border-cyan-500/30 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          NeuroChat
        </Link>
        
        <div className="flex gap-6">
          <Link href="/chat" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Open Chat
          </Link>
          <Link href="#features" className="text-gray-300 hover:text-cyan-300 transition-colors">
            Features
          </Link>
        </div>
      </div>
    </nav>
  );
}