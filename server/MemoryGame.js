export class MemoryGame {
  constructor() {
    this.players = [];
    this.grid = this.initializeGrid();
    this.turn = 0;
    this.flippedCards = [];
    this.scores = {};
    this.matchedPairs = new Set();
  }

  initializeGrid() {
    const cards = [];
    for (let i = 1; i <= 10; i++) {
      cards.push(i, i);
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

  addPlayer(playerId) {
    this.players.push(playerId);
    this.scores[playerId] = 0;
  }

  flipCard(playerId, index) {
    if (
      this.players[this.turn] !== playerId ||
      this.flippedCards.length >= 2 ||
      this.matchedPairs.has(index)
    ) {
      return false;
    }

    this.flippedCards.push(index);

    if (this.flippedCards.length === 2) {
      const [first, second] = this.flippedCards;
      if (this.grid[first] === this.grid[second]) {
        this.scores[playerId]++;
        this.matchedPairs.add(first);
        this.matchedPairs.add(second);
        this.flippedCards = [];

        if (this.isGameOver()) {
          return "gameOver";
        }
      } else {
        this.turn = (this.turn + 1) % this.players.length;
        setTimeout(() => {
          this.flippedCards = [];
        }, 1000);
      }
    }

    return true;
  }

  isGameOver() {
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
