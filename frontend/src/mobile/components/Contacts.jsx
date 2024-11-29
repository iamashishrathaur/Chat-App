import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Users, PhoneCall, VideoIcon } from "lucide-react";
import ContactsSkeleton from "./skeletons/ContactsSkeleton";
import Search from "./Search";

const Contacts = ({onContactSelect}) => {
  const { getUsers, users, selectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getUsers();
    
  }, [getUsers]);

  const filteredUsers = searchQuery
  ? users.filter((user) =>user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
  : users; 


  if (isUsersLoading) return <ContactsSkeleton />;

  return (
    <aside className="h-full w-full border-r border-base-300 flex flex-col">
      {/* Header Section */}
      <Search onSearch={(query) => setSearchQuery(query)} />

      {/* Contacts List */}
      <div className="overflow-y-auto py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => onContactSelect(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-100 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info */}
            <div className="text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex-1 flex w-full justify-end items-center space-x-3">
            <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              <PhoneCall className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            <VideoIcon className="h-4 w-4" />
            </button>
            </div>
          </button>
        ))}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Contacts;
