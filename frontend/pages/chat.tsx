// frontend/pages/ChatPage.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import CreateCommunityModal from '../components/CreateCommunityModal';
import EditCommunityModal from '../components/EditCommunityModal';
import { dummyUsers } from '../data/dummyUsers';

export interface Group {
  id: string;
  name: string;
  description: string;
  members?: string[];
  owner: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [group, setGroup] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<Group | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/groups")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching groups: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Group[]) => {
        setGroups(data);
        if (data.length > 0) setGroup(data[0].name);
      })
      .catch(error => console.error("Failed to fetch groups:", error));
  }, []);

  // Call update endpoint when community is edited.
  const handleSaveCommunity = async (updatedCommunity: Group) => {
    const response = await fetch("http://localhost:8080/update-group", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCommunity),
    });
    if (response.ok) {
      setGroups(prev =>
        prev.map(g => g.id === updatedCommunity.id ? updatedCommunity : g)
      );
    } else {
      console.error("Failed to update community");
    }
  };

  // Delete community via the DELETE endpoint.
  const deleteCommunity = async (communityId: string) => {
    console.log("deleteCommunity called with id:", communityId);
    try {
      const response = await fetch(`http://localhost:8080/groups/${communityId}`, {
        method: 'DELETE',
      });
      console.log("DELETE response status:", response.status);
      if (response.ok) {
        console.log("Group deleted successfully");
        setGroups(prev => {
          const updatedGroups = prev.filter(g => g.id !== communityId);
          console.log("Updated groups:", updatedGroups);
          return updatedGroups;
        });
        if (groups.find(g => g.id === communityId)?.name === group) {
          setGroup('');
        }
      } else {
        const errorText = await response.text();
        console.error("Failed to delete community, status:", response.status, "error:", errorText);
      }
    } catch (error) {
      console.error("Error deleting community:", error);
    }
  };


  const createCommunity = async (form: { name: string; description?: string; members?: string[] }) => {
    if (!user) return;
    const response = await fetch("http://localhost:8080/create-group", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description || "",
        owner: user.id,
        members: form.members || [],
      }),
    });
    if (response.ok) {
      const newCommunity: Group = await response.json();
      setGroups(prev => [...prev, newCommunity]);
      setGroup(newCommunity.name);
    } else {
      console.error("Failed to create community");
    }
  };


  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  const CommunityListItem = ({ g }: { g: Group }) => (
    <li
      className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${group === g.name ? 'bg-cyan-500/20' : 'hover:bg-cyan-500/10'}`}
      onClick={() => setGroup(g.name)}
    >
      <div className="flex items-center">
        <span className="text-cyan-400"># {g.name}</span>
        <span className="ml-auto text-xs text-cyan-500/80">
          {(g.members || []).length} members
        </span>
      </div>
    </li>
  );

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
            {groups.map(g => (
              <CommunityListItem key={g.id} g={g} />
            ))}
          </ul>
        </div>

        {/* Chat Component */}
        <Chat
          room={group}
          currentGroup={groups.find(g => g.name === group)}
          onSaveCommunity={handleSaveCommunity}
          onDeleteCommunity={deleteCommunity} // Added
        />

        {/* Create Community Modal */}
        {showCreateModal && (
          <CreateCommunityModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createCommunity}
          />
        )}

        {/* Edit Community Modal */}
        {editingCommunity && (
          <EditCommunityModal
            community={editingCommunity}
            onClose={() => setEditingCommunity(null)}
            onSave={handleSaveCommunity}
            onDelete={deleteCommunity}
            allUsers={dummyUsers}
          />
        )}
      </div>
    </div>
  );
}
