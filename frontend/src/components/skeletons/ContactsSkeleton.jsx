import { Users } from "lucide-react";

const ContactsSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-full md:w-[32%] lg:w-72 border-r border-base-300 
     flex flex-col transition-all duration-200"
      aria-hidden="true"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-gray-400" />
          <span className="font-medium text-gray-400">Contacts</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-not-allowed flex items-center gap-2">
            <input
              type="checkbox"
              checked={false}
              className="checkbox checkbox-sm pointer-events-none"
              disabled
            />
            <span className="text-sm text-gray-400">Show online only</span>
          </label>
          <span className="text-xs text-gray-400">(0 online)</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto py-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-3 flex items-center gap-3 animate-pulse"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="bg-gray-300 w-12 h-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="text-left min-w-0 flex-1">
              <div className="bg-gray-300 h-4 w-32 rounded mb-2" />
              <div className="bg-gray-300 h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Fallback text for screen readers */}
      <span className="sr-only">Loading contacts...</span>
    </aside>
  );
};

export default ContactsSkeleton;
