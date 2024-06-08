import { createServer } from "http";
import { Server } from "socket.io";
import { MemoryGame } from "./MemoryGame.js";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
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
    game.turn = 0; // Start the game with the first player
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
      socket.emit("gameState", game.getGameState()); // Emit current game state even if no valid flip
    }
  });

  socket.on("getCardValue", (index, callback) => {
    const value = game.getCardValue(index);
    callback(value);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Optionally handle player disconnection (e.g., remove player, end game)
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running!");
});
