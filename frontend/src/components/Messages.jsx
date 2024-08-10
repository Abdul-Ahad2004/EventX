import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const Messages = () => {
  const location = useLocation();
  const { senderId, senderModel, receiverId, receiverModel } = location.state;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState(receiverId);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/messages/get-messages/${senderId}/${selectedReceiverId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const fetchChatUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/messages/get-chat-users/${senderId}`
        );
        setChatUsers(response.data);
      } catch (error) {
        console.error("Error fetching chat users:", error);
      }
    };

    fetchMessages();
    fetchChatUsers();

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, selectedReceiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      senderId,
      senderModel,
      receiverId: selectedReceiverId,
      receiverModel,
      content: newMessage,
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-gray-200 p-4 overflow-y-auto">
        <h1 className="text-2xl text-blue-600 font-bold">Chats</h1>
        {chatUsers.length === 0 ? (
          <div className="text-xl text-blue-600 font-bold">
            No Previous Chats
          </div>
        ) : (
          chatUsers.map((user, index) => (
            <div
              key={index}
              onClick={() => setSelectedReceiverId(user.id)}
              className={`p-4 my-2 cursor-pointer rounded-lg ${
                selectedReceiverId === user.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {user.username}
            </div>
          ))
        )}
      </div>
      {selectedReceiverId && (
        <div className="w-2/3 flex flex-col bg-gray-100">
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender.id === senderId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 my-1 rounded-lg ${
                    msg.sender.id === senderId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="fixed bottom-0 left-1/3 w-2/3 p-4 bg-gray-100 flex items-center">
            <input
              type="text"
              value={newMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
