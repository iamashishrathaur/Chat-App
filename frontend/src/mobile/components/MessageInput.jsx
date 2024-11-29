import { useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from 'browser-image-compression'

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      
      const formData = new FormData();
      formData.append("text", text.trim());
      if (fileInputRef.current?.files[0]) {
        const imageFile = fileInputRef.current.files[0];
        const compressedFile = await imageCompression(imageFile, options);
    
        formData.append("image", compressedFile);  
      }
      setText("");
      setImagePreview(null);
      await sendMessage(formData);
  

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  return (
    <div className="p-4 w-full bg-base-100 border-t border-gray-200 fixed bottom-0"
      style={{ zIndex: 10 }}>
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2" encType="multipart/form-data">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered h-10 rounded-lg input-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
      
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button> */}
        </div>
        {/* <button
           type="submit"
           className={`hidden sm:flex btn btn-circle
                    ${text.trim() ? "text-emerald-500" : "text-zinc-400"}`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button> */}
        <button className="btn btn-primary h-10 min-h-0">
           <Send size={18} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
