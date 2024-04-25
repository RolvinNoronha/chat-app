import React from "react";
import { Message } from "./Chat";

type ChatBodyPropType = {
  messages: Message[];
};

const ChatBody: React.FC<ChatBodyPropType> = ({ messages }) => {
  return (
    <div className="w-[60%] h-[70%] bg-slate-200 px-8 py-4 rounded-xl">
      {messages.map((message, idx) => {
        if (message.type === "recieve") {
          return (
            <div className="flex flex-col items-start" key={idx}>
              <p className="text-slate-500 text-md">{message.username}</p>
              <p className="text-white bg-slate-600 px-4 py-1 rounded-md text-xl">
                {message.content}
              </p>
            </div>
          );
        } else {
          return (
            <div className="flex flex-col items-end" key={idx}>
              <p className="text-slate-500 text-md">{message.username}</p>
              <p className="text-white bg-blue-600 px-4 py-1 rounded-md text-xl">
                {message.content}
              </p>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ChatBody;
