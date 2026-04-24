import React from "react";
import "../styles/Message.css";

const Message = ({ text, sender, isOwn }) => {
  return (
    <div className={`message ${isOwn ? "own" : ""}`}>
      <div className="message-content">
        <span className="sender">{sender}</span>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Message;