import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [room, setRoom] = useState('general');
  const rooms = ['cyberpunk', 'neon-city', 'hackers', 'developers', 'Need Help'];

  // 🔥 Redirect to "/" if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null; // Prevents rendering before redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-cyan-900/10">
      <div className="pt-20 pb-8 px-8 flex gap-8">
        {/* Sidebar for Chat Rooms */}
        <div className="w-64 backdrop-blur-xl bg-gray-900/50 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10 p-4">
          <h2 className="text-lg font-bold text-cyan-400 mb-4">Channels</h2>
          <ul className="space-y-2">
            {rooms.map((roomName) => (
              <li
                key={roomName}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  room === roomName 
                    ? 'bg-cyan-500/20 border border-cyan-500/30'
                    : 'hover:bg-cyan-500/10'
                }`}
                onClick={() => setRoom(roomName)}
              >
                <span className="text-gray-200"># </span>
                <span className="text-cyan-400 capitalize">{roomName}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Component */}
        <Chat room={room} />
      </div>
    </div>
  );
}
