import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Updated CommunityForm interface
interface CommunityForm {
  name: string;
  description: string;
}

export default function CreateCommunityModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (community: CommunityForm) => void;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState<CommunityForm>({ name: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check that both name and description are provided
    if (form.name && form.description) {
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
          {/* Community Name Input */}
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

          {/* Description Input */}
          <div>
            <label className="block text-cyan-300 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter community description"
              rows={3}
              required
            />
          </div>

          {/* Form Buttons */}
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