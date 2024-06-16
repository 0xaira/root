"use client";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  const handleSendMessage = useCallback(() => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
    }
  }, [message, sendMessage]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      document.documentElement.style.setProperty("--viewport-height", `${viewportHeight}px`);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-[var(--viewport-height)] justify-between bg-black text-white">
      <div className="flex-grow p-6 overflow-y-auto">
        <ul className="space-y-4">
          {messages.map((e, index) => (
            <li
              key={index}
              className="bg-gray-800 p-4 rounded shadow-md border border-gray-700"
            >
              {e}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-900 p-4 shadow-md">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-700 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-gray-700 text-white rounded-md shadow hover:bg-gray-600 transition duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
