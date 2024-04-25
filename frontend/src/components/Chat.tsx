import { useContext, useEffect, useState } from "react";
import { Auth } from "../context/Context";
import { useNavigate } from "react-router-dom";
import ChatBody from "./ChatBody";
import axios from "axios";

export type Message = {
  content: string;
  clientId: string;
  username: string;
  roomId: string;
  type: "recieve" | "send";
};

type Users = {
  username: string;
};

const Chat = () => {
  const {
    userState: { userInfo },
    connState,
    connDispatch,
  } = useContext(Auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [users, setUsers] = useState<Users[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user") === null || connState?.conn === null) {
      return navigate("/rooms");
    } else {
      getClients();
    }
  }, []);

  useEffect(() => {
    if (connState === null || localStorage.getItem("user") === null) {
      return navigate("/rooms");
    }

    // @ts-ignore
    connState.conn.onmessage = (message) => {
      const m: Message = JSON.parse(message.data);

      if (m.content === "A new user has joined the room") {
        setUsers((prevUsers) => [...prevUsers, { username: m.username }]);
      }

      if (m.content === "User left the chat") {
        const filteredUsers = users.filter((u) => u.username !== m.username);
        setUsers([...filteredUsers]);
        setMessages([...messages, m]);
        return;
      }

      userInfo?.username === m.username
        ? (m.type = "send")
        : (m.type = "recieve");
      setMessages([...messages, m]);
    };

    //@ts-ignore
    connState.conn.onclose = () => {
      connDispatch({ type: "DISCONNECTED", payload: null });
      navigate("/rooms");
    };
    // connState?.conn?.onopen;
    // connState?.conn?.onerror;
  }, [users, connState?.conn, messages]);

  const getClients = async () => {
    const value = connState?.conn?.url.split("/")[5];
    const roomId = value?.split("?")[0];

    try {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/ws/get-clients/${roomId}`,
        headers: {
          // "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = () => {
    if (connState?.conn === null) {
      return navigate("/rooms");
    } else {
      //@ts-ignore
      connState.conn?.send(newMessage);
      setNewMessage("");
    }
  };

  const leaveRoom = () => {
    // @ts-ignore
    connState.conn.close();
  };

  return (
    <div className="h-lvh w-full flex items-center justify-center flex-col">
      <ChatBody messages={messages} />
      <div className="w-full flex justify-center items-center mt-6">
        <input
          className="w-[40%] px-3 py-1 rounded-md mr-4 border-slate-300 border-2"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
          type="text"
          placeholder="type your message here"
        />
        <button
          className="bg-blue-600 px-5 py-2 text-white mr-4 rounded-xl"
          type="button"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      <button
        className="bg-red-600 px-5 py-2 text-white mr-4 rounded-xl"
        type="button"
        onClick={leaveRoom}
      >
        Leave Room
      </button>
    </div>
  );
};

export default Chat;
