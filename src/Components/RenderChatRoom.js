import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { API_URL, webSocketUrl } from "../global";
import RenderMessage from "./RenderMessage";

function createChatRoomWebsocketConnection(chatRoomId, setM, m) {
  // Creates the new websocket connection
  let socket = new WebSocket(webSocketUrl);

  // When the connection is 1st created, this code runs subscribing the clien to a specific chatroom stream in the ChatRoomChannel
  socket.onopen = function (event) {
    console.log("WebSocket is connected.");

    const msg = {
      command: "subscribe",
      identifier: JSON.stringify({
        id: chatRoomId,
        channel: "ChatRoomChannel",
      }),
    };

    socket.send(JSON.stringify(msg));
  };

  // When the connection is closed, this code is run
  socket.onclose = function (event) {
    console.log("WebSocket is closed.");
  };

  // When a message is received through the websocket, this code is run
  socket.onmessage = function (event) {
    const response = event.data;
    const msg = JSON.parse(response);

    // Ignores pings
    if (msg.type === "ping") {
      return;
    }

    console.log("FROM RAILS: ", msg);

    // Renders any newly c  reated messages onto the page
    if (msg.message) {
      setM((m) => [...m, msg.message]);
    }
  };

  // When an error occurs through the websocket connection, this code is run printing the error message
  socket.onerror = function (error) {
    console.log("WebSocket Error: " + error);
  };
}

export default function RenderChatRoom(props) {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState([]);
  const [m, setM] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/chat_rooms/${location.state.ids}`)
      .then((response) => response.json())
      .then((chatRoomObject) => {
        setM(chatRoomObject);
      });
    createChatRoomWebsocketConnection(location.state.ids, setM, m);
  }, []);

  console.log(m, "test1 ");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        content: message,
        username: "bjazo",
        chat_room_id: location.state.ids,
        sender_id: 1,
      }),
    });

    setMessage("");
  };
  return (
    <div>
      <div id="chat-room-div">
        <h3>Rroom: {location.state.data}</h3>
        <form id="new-message-form" onSubmit={handleSubmit}>
          <label>New Message: </label>
          <br />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send Message</button>
          <br />
        </form>
        <Link to={"/"}>
          <button>Exit</button>
        </Link>
        <div id="messages-list">
          {m.map((list) => (
            <>
              <p>{list.content}</p>
              <p>From: {list.username}</p>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
