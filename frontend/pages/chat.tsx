import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import CreateCommunityModal from '../components/CreateCommunityModal';

interface Group {
  id: string;
  name: string;
  members: string[];
}

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [group, setGroup] = useState('general');
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Dummy initial groups
  const initialGroups: Group[] = [
    { id: '1', name: 'general', members: ['1', '2', '3'] },
    { id: '2', name: 'developers', members: ['1', '4'] },
    { id: '3', name: 'designers', members: ['2', '5'] },
  ];

  useEffect(() => {
    // Simulated API call
    setGroups(initialGroups);
  }, []);

  const createCommunity = async (form: { name: string; members: string[] }) => {
    // Simulated API response
    const newCommunity: Group = {
      id: String(groups.length + 1),
      name: form.name,
      members: [...form.members, user?.id || '']
    };
    
    setGroups(prev => [...prev, newCommunity]);
    setGroup(newCommunity.name);
  };

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-20 pb-8 px-8 flex gap-8">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-cyan-400">Communities</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 hover:bg-gray-700/50 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          <ul className="space-y-2">
            {groups.map((g) => (
              <li
                key={g.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  group === g.name ? 'bg-cyan-500/20' : 'hover:bg-cyan-500/10'
                }`}
                onClick={() => setGroup(g.name)}
              >
                <div className="flex items-center">
                  <span className="text-cyan-400"># {g.name}</span>
                  <span className="ml-auto text-xs text-cyan-500/80">
                    {g.members.length} members
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat */}
        <Chat room={group} />

        {showCreateModal && (
          <CreateCommunityModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createCommunity}
          />
        )}
      </div>
    </div>
  );
}