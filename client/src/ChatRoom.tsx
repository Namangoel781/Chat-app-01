"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: string;
}

interface ChatRoomProps {
  roomId: string;
  username: string;
}

export default function ChatRoom({ roomId, username }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({ type: "join", payload: { roomId, username } })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: data.message, sender: data.sender },
      ]);
    };

    return () => {
      socket.close();
    };
  }, [roomId, username]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: { message: inputMessage, sender: username },
        })
      );
      setInputMessage("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold">Room: {roomId}</h2>
        <p className="text-gray-500">User: {username}</p>
      </div>
      <div className="flex-grow overflow-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-lg max-w-[70%] ${
              msg.sender === username
                ? "ml-auto bg-purple-500 text-white"
                : "mr-auto bg-gray-200 text-gray-800"
            }`}
          >
            <strong>{msg.sender}</strong>: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded-md"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
