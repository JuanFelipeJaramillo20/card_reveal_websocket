import { createServer } from "http";
import { Server } from "socket.io";
import { MemoryGame } from "./MemoryGame.js";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let playerScores = [];
const game = new MemoryGame();

io.on("connection", (socket) => {
  socket.on("scores", (scores) => {
    game.addPlayer(socket.id);

    socket.emit("gameState", game.getGameState());

    socket.on("flipCard", (index) => {
      const result = game.flipCard(socket.id, index);

      if (result === "gameOver") {
        const winners = game.getWinner();
        io.emit("gameOver", { winners, scores: game.scores });
      } else if (result) {
        io.emit("gameState", game.getGameState());
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      // TODO: Optionally handle player disconnection (e.g., remove player, end game)
    });
  });

  setInterval(() => {
    socket.emit("gameState", game.getGameState());
  }, 5000);
});

httpServer.listen(3000, () => {
  console.log("Server is running!");
});
