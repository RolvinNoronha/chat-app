import { useContext, useEffect, useState } from "react";
import { Auth } from "../context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

type RoomsType = { id: string; name: string };

const Rooms = () => {
  const {
    userState: { isAuthenticated, userInfo },
    connDispatch,
    userDispatch,
  } = useContext(Auth);
  const [rooms, setRooms] = useState<RoomsType[]>([]);
  const [newRoom, setNewRoom] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user") === null) {
      return navigate("/");
    } else {
      const value = localStorage.getItem("user");
      if (value != null) {
        const user = JSON.parse(value);
        userDispatch({ type: "ADD_USER", payload: user });
      }
      getRooms();
    }
  }, [isAuthenticated]);

  const getRooms = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/ws/get-rooms`,
        headers: {
          // "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setRooms(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createNewRoom = async () => {
    try {
      const postData = JSON.stringify({
        id: uuidv4(),
        name: newRoom,
      });
      setNewRoom("");
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/ws/create-room`,
        headers: {
          // "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        data: postData,
      });

      console.log(response);
      if (response.status === 200) {
        getRooms();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const joinRoom = (roomId: string) => {
    const ws = new WebSocket(
      `ws://localhost:8080/ws/join-room/${roomId}?userId=${userInfo?.id}&username=${userInfo?.username}`
    );
    if (ws.OPEN) {
      connDispatch({ type: "CONNECTED", payload: ws });
      return navigate("/chat");
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    const response = await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/logout`,
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      navigate("/");
    } else {
      alert("Could not logout");
    }
  };

  return (
    <div className="h-lvh w-full flex items-center justify-start flex-col">
      <div className="mt-24 w-full flex justify-center items-center mb-8">
        <input
          className="w-[40%] mr-8 px-3 py-1 rounded-md border-slate-300 border-2"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          type="text"
          placeholder="Enter room name here"
        />
        <button
          className="bg-blue-600 px-5 py-2 text-white mr-4 rounded-xl"
          type="button"
          onClick={createNewRoom}
        >
          Create Room
        </button>
        <button
          className="bg-red-600 px-5 py-2 text-white mr-4 rounded-xl"
          type="button"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <h1 className="text-2xl mb-8">Available Rooms</h1>
      <div className="flex justify-start w-full px-32 flex-wrap">
        {rooms.length > 0
          ? rooms.map((room) => {
              return (
                <div
                  className="w-32 h-28 bg-slate-200 mr-8 mb-8 rounded-xl flex justify-between items-center flex-col"
                  key={room.id}
                >
                  <h3 className="text-xl mx-2 my-2">{room.name}</h3>
                  <button
                    className="bg-blue-600 w-full text-white rounded-b-xl py-1"
                    onClick={() => joinRoom(room.id)}
                  >
                    Join
                  </button>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Rooms;
