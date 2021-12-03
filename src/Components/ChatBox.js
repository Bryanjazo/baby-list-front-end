import React, { useEffect, useState } from "react";
import { API_URL, webSocketUrl } from "../global";
import RenderChatRoom from "./RenderChatRoom";
import RenderMessage from "./RenderMessage";
import { Link } from "react-router-dom";

export default function ChatBox() {
  const [chatName, setChatName] = useState("");
  const [chatRoom, setChatRoom] = useState([]);
  console.log(chatRoom);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/chat_rooms`)
      .then((response) => response.json())
      .then((chatRoomsObject) => {
        setChatRoom(chatRoomsObject);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/v1/chat_rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: chatName,
        user_id: 1,
      }),
    })
      .then((response) => response.json())
      .then((chatRoomObject) =>
        setChatRoom((chatRoom) => [...chatRoom, chatRoomObject])
      );

    setChatName("");
  };

  return (
    <div>
      <div className="chatRoom">
        <form id="new-chat-room-form" onSubmit={handleSubmit}>
          <h3>Create a New Chat Room:</h3>
          <label>Chat Room Name: </label>
          <input
            type="text"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
          <br />
          <button type="submit">Create New Chat Room</button>
          <br />
        </form>
        <h3>All Chat Rooms:</h3>
        <div id="chat-rooms-list">
          {chatRoom.map((room) => (
            <div>
              <p>
                {room.name}{" "}
                <Link
                  to={{
                    pathname: `/chat_room/${room.id}`,
                    state: { names: room.name, ids: room.id },
                  }}
                >
                  <button class="join-chat-room-button">Join</button>
                </Link>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
