import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "../../components/skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils";

const Chats = ({ onBack }) => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        await getMessages(selectedUser._id);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id,getMessages,unsubscribeFromMessages,subscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });  
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader onBack={onBack} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader onBack={onBack} />

      <div className="flex-1 overflow-y-auto p-4 my-[70px] space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.tempId || message._id || Math.random()}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {message.createdAt ? formatMessageTime(message.createdAt) : ""}
                </time>
              </div>

              <div
                className={`chat-bubble max-w-[80%] flex flex-col ${
                  message.senderId === authUser._id
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content"
                }`}
              >
                {message.text && <p>{message.text}</p>}

                {message.image && (
                  <img
                    src={
                      message.status === "sending"
                        ? URL.createObjectURL(message.image)
                        : message.image
                    }
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
              </div>

              {message.senderId === authUser._id && (
                <span className="chat-footer text-base-content/50">
                  {message.status === "sending" && "Sending..."}
                  {message.status === "sent" && "Sent"}
                  {message.status === "failed" && "Failed to send"}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="h-full mt-20 file:justify-center text-center text-zinc-500 flex flex-col items-center">
            <p>No messages yet</p>
          </div>
        )}

        <div ref={messageEndRef}></div>
      </div>

      <MessageInput />
    </div>
  );
};

export default Chats;
