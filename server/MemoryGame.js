export class MemoryGame {
  constructor() {
    this.players = [];
    this.grid = this.initializeGrid();
    this.turn = 0;
    this.flippedCards = [];
    this.scores = {};
    this.matchedPairs = new Set();
    this.movesCount = 0;
  }

  restart() {
    this.players = [];
    this.grid = this.initializeGrid();
    this.turn = 0;
    this.flippedCards = [];
    this.scores = {};
    this.matchedPairs = new Set();
    this.movesCount = 0;
  }

  initializeGrid() {
    const emojis = [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "🥵",
      "😈",
      "🙈",
      "🍆",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
    ];
    const cards = [];
    for (let emoji of emojis) {
      cards.push(
        { symbol: emoji, found: false },
        { symbol: emoji, found: false }
      );
    }
    return this.shuffle(cards);
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  addPlayer(username) {
    this.players.push(username);
    this.scores[username] = 0;
  }

  flipCard(playerId, index) {
    if (
      this.players[this.turn] !== playerId ||
      this.flippedCards.length >= 2 ||
      this.grid[index].found
    ) {
      return false;
    }

    this.flippedCards.push(index);
    this.movesCount++;
    console.log(
      "flipped cards",
      this.flippedCards,
      this.getCardValue(this.flippedCards[0]),
      this.getCardValue(this.flippedCards[1]),
      this.players,
      this.turn
    );

    if (this.flippedCards.length === 2) {
      const [first, second] = this.flippedCards;
      if (this.grid[first].symbol === this.grid[second].symbol) {
        this.scores[playerId]++;
        this.matchedPairs.add(first);
        this.matchedPairs.add(second);
        this.grid[first].found = true;
        this.grid[second].found = true;
        this.flippedCards = [];
        this.movesCount = 0;

        if (this.isGameOver()) {
          return "gameOver";
        }
      } else {
        setTimeout(() => {
          this.flippedCards = [];
          this.changeTurn();
        }, 1000);
      }
    }
    return true;
  }

  changeTurn() {
    this.turn = (this.turn + 1) % this.players.length;
    this.movesCount = 0;
  }

  isGameOver() {
    console.log("ENCONTRADAS", this.matchedPairs, "TOTAL", this.grid.length);
    return this.matchedPairs.size === this.grid.length;
  }

  getGameState() {
    return {
      grid: this.grid,
      scores: this.scores,
      turn: this.players[this.turn],
      flippedCards: this.flippedCards,
    };
  }

  getWinner() {
    const maxScore = Math.max(...Object.values(this.scores));
    return Object.keys(this.scores).filter(
      (playerId) => this.scores[playerId] === maxScore
    );
  }

  getCardValue(index) {
    return this.grid[index];
  }
}
