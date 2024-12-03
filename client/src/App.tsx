"use client";

import { useState } from "react";
import ChatRoom from "./ChatRoom";

export default function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [inputRoomId, setInputRoomId] = useState<string>("");

  const handleJoinRoom = () => {
    if (inputRoomId.trim() && username.trim()) {
      setRoomId(inputRoomId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      {!roomId ? (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Join a Chat Room
          </h1>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Enter Room ID"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleJoinRoom}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <ChatRoom roomId={roomId} username={username} />
      )}
    </div>
  );
}
