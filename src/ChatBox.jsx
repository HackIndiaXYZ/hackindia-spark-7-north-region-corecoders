import React from "react";
import Message from "./Message";
import "../styles/ChatBox.css";

const ChatBox = ({ messages, username }) => {
  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h2>💬 Live Chat Room</h2>
      </div>

      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <Message
            key={index}
            text={msg.text}
            sender={msg.sender}
            isOwn={msg.sender === username}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
