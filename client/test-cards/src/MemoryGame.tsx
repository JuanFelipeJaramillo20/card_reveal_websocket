import { useEffect, useState } from "react";

const MemoryGame = ({ socket }) => {
  const [gameState, setGameState] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winners, setWinners] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("gameState", (state) => {
        console.log("gameState", state);
        setGameState(state);
        setGameOver(false);
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

  const getCardValue = (index) => {
    socket.emit("getCardValue", index, (value) => {
      console.log(`Card value at index ${index}:`, value);
    });
  };

  const handleRegister = () => {
    if (username.trim() !== "") {
      socket.emit("register", username);
    }
  };

  const handleRestart = () => {
    socket.emit("restart");
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
            disabled={card.found || gameState.flippedCards.includes(index)}
          >
            {card.found || gameState.flippedCards.includes(index)
              ? card.symbol
              : "?"}
          </button>
        ))
      )}
      <div>
        <h2>Register</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleRestart}>Restart</button>
        <button
          onClick={() => {
            socket.emit("start");
          }}
        >
          Start Game
        </button>
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
