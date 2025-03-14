import { motion } from 'framer-motion';
import { useState } from 'react';
import { User } from '../data/dummyUsers';

export interface Community {
  id: string;
  name: string;
  description: string;
  members?: string[];
  owner: string;
}

interface EditCommunityModalProps {
  community: Community;
  onClose: () => void;
  onSave: (updatedCommunity: Community) => void;
  onDelete?: (communityId: string) => void;
  allUsers: User[];
}

export default function EditCommunityModal({
  community,
  onClose,
  onSave,
  onDelete = () => {}, // default no-op if not provided
  allUsers,
}: EditCommunityModalProps) {
  const [editedName, setEditedName] = useState(community.name);
  const [editedDescription, setEditedDescription] = useState(community.description || "");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(community.members || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filteredUsers = allUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedMembers.includes(user.id)
  );

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...community,
      name: editedName,
      description: editedDescription,
      members: selectedMembers,
    });
    onClose();
  };

  const handleDelete = () => {
    console.log("handleDelete triggered"); // Debug log
    setConfirmDelete(true);
  };

  const confirmDeletion = () => {
    console.log("confirmDeletion triggered for community id:", community.id);
    onDelete(community.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-2xl w-full max-w-lg border border-cyan-500/30 backdrop-blur-lg"
      >
        <div className="p-6 border-b border-cyan-500/30 flex justify-between items-center">
          <h3 className="text-xl font-bold text-cyan-400">Edit Community</h3>
          <button
            onClick={handleDelete}
            className="text-rose-400 hover:text-rose-300 transition-colors"
          >
            Delete Community
          </button>
        </div>

        {confirmDelete ? (
          <div className="p-6">
            <p className="text-cyan-300 mb-4">Are you sure you want to delete this community?</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { console.log("Deletion canceled"); setConfirmDelete(false); }}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletion}
                className="px-6 py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-white font-semibold transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-cyan-300 mb-3">Community Name</label>
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full bg-gray-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-cyan-300 mb-3">Description</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full bg-gray-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
                placeholder="Enter community description..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-cyan-300">Members</label>
                <span className="text-cyan-500/80 text-sm">
                  {selectedMembers.length} members selected
                </span>
              </div>

              <div className="mb-4 relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Add members..."
                  className="w-full bg-gray-900/40 rounded-xl px-4 py-2 text-cyan-100 placeholder-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                />
                <svg
                  className="absolute right-2 top-2.5 w-5 h-5 text-cyan-500/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedMembers.map((memberId) => {
                  const user = allUsers.find((u) => u.id === memberId);
                  return user ? (
                    <div key={user.id} className="flex items-center p-3 bg-gray-700/20 rounded-lg">
                      <span className="mr-3">{user.avatar}</span>
                      <span className="text-cyan-300">{user.username}</span>
                      <button
                        type="button"
                        onClick={() => toggleMember(user.id)}
                        className="ml-auto text-rose-400/80 hover:text-rose-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null;
                })}

                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => toggleMember(user.id)}
                    className="flex items-center p-3 hover:bg-gray-700/20 rounded-lg cursor-pointer transition-colors"
                  >
                    <span className="mr-3">{user.avatar}</span>
                    <span className="text-cyan-300">{user.username}</span>
                    <span className="ml-auto text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
                      Add
                    </span>
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
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
