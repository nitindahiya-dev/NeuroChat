import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, dummyUsers } from '../data/dummyUsers';


interface User {
  id: string;
  username: string;
  avatar: string;
}

interface CommunityForm {
  name: string;
  members: string[];
}

const dummyUsers: User[] = [
  { id: '1', username: 'Neo', avatar: '👨💻' },
  { id: '2', username: 'Trinity', avatar: '🕶️' },
  { id: '3', username: 'Morpheus', avatar: '🧔' },
  { id: '4', username: 'Oracle', avatar: '🔮' },
  { id: '5', username: 'Cypher', avatar: '🕵️' },
];

export default function CreateCommunityModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (community: CommunityForm) => void;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState<CommunityForm>({ name: '', members: [] });
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = dummyUsers.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    u.id !== user?.id
  );

  const toggleMember = (userId: string) => {
    setForm(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.members.length > 0) {
      onCreate(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-2xl w-full max-w-md border border-cyan-500/30"
      >
        <div className="p-6 border-b border-cyan-500/30">
          <h3 className="text-xl font-bold text-cyan-400">Create Community</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-cyan-300 mb-2">Community Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter community name"
              required
            />
          </div>

          <div>
            <label className="block text-cyan-300 mb-2">Add Members</label>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-2"
              placeholder="Search users..."
            />
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => toggleMember(user.id)}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${
                    form.members.includes(user.id)
                      ? 'bg-cyan-500/20'
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <span className="mr-3">{user.avatar}</span>
                  <span className="text-white">{user.username}</span>
                  {form.members.includes(user.id) && (
                    <span className="ml-auto text-cyan-400">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-semibold transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}