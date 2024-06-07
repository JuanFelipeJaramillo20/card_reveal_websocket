import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import MemoryGame from "./MemoryGame";

function App() {
  const socket = io("localhost:3000");

  function connectSocket() {
    socket.on("connection", (socket) => {
      console.log(socket);
    });

    socket.on("gameState", (state) => {
      console.log("gameState", state);
    });
  }

  useEffect(() => {
    connectSocket();
  }, []);
  return (
    <>
      <MemoryGame socket={socket}></MemoryGame>
    </>
  );
}

export default App;
