import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  offlineMessages: [], // To store messages locally when offline
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, offlineMessages } = get();
    const authUserId = useAuthStore.getState().authUser._id; // Get the authenticated user's ID
    const text = messageData.get("text");
    const image = messageData.get("image");

    // Generate a temporary ID for the message
    const tempId = Date.now().toString();
    const tempMessage = {
      tempId,
      senderId: authUserId, // Set the sender to the authenticated user
      receiverId: selectedUser._id, // Assuming the receiver is selectedUser
      status: "sending", // Temporarily set status to "sending"
      text,
      image, // Attach image if exists
    }; // Destructure messageData to extract text and image
  
    // Add the temporary message to the state
    set({ messages: [...messages, tempMessage] });
  
    try {
      // Send the message to the server
      
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData,{headers:{'Content-Type':'multipart/form-data'}});
  
      // Update message status to "sent" once server responds
      set({
        messages: get().messages.map((msg) =>
          msg.tempId === tempId ? { ...res.data, status: "sent" } : msg
        ),
      });
  
      // Emit the message to the receiver via socket
      const socket = useAuthStore.getState().socket;
      socket.emit("newMessage", res.data);
  
    } catch (error) {
      // Handle failed messages as before
      const updatedOfflineMessages = [...offlineMessages, tempMessage];
      set({ offlineMessages: updatedOfflineMessages });
      localStorage.setItem("offlineMessages", JSON.stringify(updatedOfflineMessages));
    }
  },
  
  syncOfflineMessages: async () => {
    const { offlineMessages } = get();
    if (offlineMessages.length === 0) return;
  
    try {
      // Group messages by receiverId for batch processing
      const groupedMessages = offlineMessages.reduce((groups, msg) => {
        (groups[msg.receiverId] = groups[msg.receiverId] || []).push(msg);
        return groups;
      }, {});
  
      // Send each group of messages
      for (const [receiverId, messages] of Object.entries(groupedMessages)) {
        await axiosInstance.post(`/messages/send/batch`, { receiverId, messages });
      }
  
      set({ offlineMessages: [] });
      localStorage.removeItem("offlineMessages");
    } catch (error) {
      console.error("Failed to sync offline messages:", error);
    }
  }, 

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

