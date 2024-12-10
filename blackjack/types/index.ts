export type Card = {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  value: number | string;
  hidden: boolean;
  dealing?: boolean;
};

export type Player = {
  id: string;
  name: string;
  hand: Card[];
  bet: number;
  balance: number;
  score: number;
  isPlaying: boolean;
};

export type GameState = "betting" | "dealing" | "playerTurn" | "dealerTurn" | "gameOver"; 