import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import MobileHome from "../mobile/Home";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handlers
  const handleContactClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  // Update `isMobile` state on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render based on screen size
  return (
    <div className="h-screen bg-base-200">
      {isMobile ? (
        // Mobile View
        <MobileHome/>
      ) : (
        // Desktop View
        <div className="flex items-center justify-center md:pt-20 md:px-4">
          <div className="bg-base-100 md:rounded-lg shadow-cl w-full max-w-6xl h-screen md:h-[calc(100vh-8rem)]">
            <div className="flex h-full md:rounded-lg overflow-hidden">
              <Contacts onContactSelect={handleContactClick} />
              {selectedUser ? (
                <ChatContainer onBack={handleBackClick} />
              ) : (
                <NoChatSelected />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
