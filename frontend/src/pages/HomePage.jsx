// import { useChatStore } from "../store/useChatStore";

// import Sidebar from "../components/Sidebar";
// import NoChatSelected from "../components/NoChatSelected";
// import ChatContainer from "../components/ChatContainer";

// const HomePage = () => {
//   const { selectedUser } = useChatStore();

//   return (
//     <div className="h-screen bg-base-200">
//       <div className="flex items-center justify-center pt-20 px-4">
//         <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
//           <div className="flex h-full rounded-lg overflow-hidden">
//             <Sidebar />

//             {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default HomePage;



import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const [activeView, setActiveView] = useState("contacts"); // "contacts" or "chat"

  // Check if the device is mobile
  const isMobile = window.innerWidth < 768;

  // Handlers
  const handleContactClick = (user) => {
    setSelectedUser(user);
    if (isMobile) {
      setActiveView("chat"); // Switch to chat view on mobile
    }
  };

  const handleBackClick = () => {
    if (isMobile) {
      setActiveView("contacts"); // Switch back to contacts view on mobile
    }
    setSelectedUser(null);
  };

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Desktop View */}
            {!isMobile && (
              <>
                <Contacts onContactSelect={handleContactClick} />
                {selectedUser ? (
                  <ChatContainer onBack={handleBackClick} />
                ) : (
                  <NoChatSelected/>
                )}
              </>
            )}

            {/* Mobile View */}
            {isMobile && (
              <>
                {activeView === "contacts" ? (
                  <Contacts onContactSelect={handleContactClick} />
                ) : (
                  <ChatContainer onBack={handleBackClick} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
