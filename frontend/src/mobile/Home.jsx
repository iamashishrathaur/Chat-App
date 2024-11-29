import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
// import Chats from "./Chats";
import Contacts from "./components/Contacts";
import Navbar from "./components/Navbar";
import Chats from "./components/Chats";
// // import ChatHeader from "../../components/ChatHeader";
// const Contacts = () => <div>Contacts Component</div>;
const Home = () => {
  const { selectedUser, setSelectedUser } = useChatStore(); 
  const [view, setView] = useState("contacts");

  const handleContactClick = (user) => {
    setSelectedUser(user);
    setView("chat");
  };
  const handleChatBack =()=>{
    setView('contacts')
  }

  return (
    <div className="h-screen bg-base-100">
      {view === "contacts" && (
         <>
         <Navbar/>
         <div className="h-screen bg-base-100">
         <div className="mt-20 bg-base-100 w-full h-full">
           <div className="flex h-full rounded-lg overflow-hidden">
             <Contacts onContactSelect={handleContactClick} />
           </div>
         </div>
       </div>
         </>
      ) }
      {view === "chat" && <Chats onBack={handleChatBack}/>}
    </div>
  );
};


export default Home;
