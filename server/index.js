import { createServer } from "http";
import { Server } from "socket.io";
import { MemoryGame } from "./MemoryGame.js";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const game = new MemoryGame();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register", (username) => {
    if (game.players.length < 2) {
      game.addPlayer(username);
      io.emit("gameState", game.getGameState());
    }
  });

  socket.on("start", () => {
    game.turn = 0;
  });

  socket.on("restart", () => {
    game.restart();
    io.emit("gameState", game.getGameState());
  });

  socket.emit("gameState", game.getGameState());

  socket.on("flipCard", (index) => {
    const currentPlayer = game.players[game.turn];
    const result = game.flipCard(currentPlayer, index);
    if (result === "gameOver") {
      const winners = game.getWinner();
      io.emit("gameOver", { winners, scores: game.scores });
    } else if (result) {
      io.emit("gameState", game.getGameState());
    } else {
      socket.emit("gameState", game.getGameState());
    }
  });

  socket.on("getCardValue", (index, callback) => {
    const value = game.getCardValue(index);
    callback(value);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(3000, "0.0.0.0", () => {
  console.log("Server is running!");
});
