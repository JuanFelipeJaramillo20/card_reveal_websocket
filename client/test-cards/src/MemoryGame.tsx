// src/MemoryGame.js
import { useEffect, useState } from "react";

const MemoryGame = ({ socket }) => {
  const [gameState, setGameState] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("gameState", (state) => {
        console.log("gameState", state);

        setGameState(state);
        setGameOver(false); // Reset game over flag on new game state
      });

      socket.on("gameOver", ({ winners, scores }) => {
        setGameOver(true);
        setWinners(winners);
      });

      return () => {
        socket.off("gameState");
        socket.off("gameOver");
      };
    }
  }, [socket]);

  const flipCard = (index) => {
    socket.emit("flipCard", index);
  };

  return (
    <div>
      {gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <p>Winners: {winners.join(", ")}</p>
          <p>Scores: {JSON.stringify(gameState?.scores)}</p>
        </div>
      ) : (
        gameState &&
        gameState.grid.map((card, index) => (
          <button
            key={index}
            onClick={() => flipCard(index)}
            disabled={
              gameState.flippedCards.includes(index) ||
              gameState.matchedPairs?.includes(index)
            }
          >
            {gameState.flippedCards.includes(index) ||
            gameState.matchedPairs?.includes(index)
              ? card
              : "?"}
          </button>
        ))
      )}
      <div>
        <h3>Scores</h3>
        {Object.entries(gameState?.scores || {}).map(([player, score]) => (
          <p key={player}>
            {player}: {score}
          </p>
        ))}
      </div>
      <div>
        <h3>Turn</h3>
        <p>{gameState?.turn}</p>
      </div>
    </div>
  );
};

export default MemoryGame;
