const state = {
  cards: [],
  openedCardIds: [],
  moves: 0,
  matchedPairs: 0,
  elapsedSeconds: 0,
  timeoutId: null,
  isLocked: false,
  gameStatus: "idle",
};

// Cards
export function setCards(cards) {
  state.cards = cards;
}

export function getCards() {
  return state.cards;
}

export function getCardById(id) {
  return state.cards.find((card) => card.id === id) ?? null;
}

export function updateCard(id, patch) {
  const card = state.cards.find((card) => card.id === id);
  if (card) Object.assign(card, patch);
}

// Open Cards
export function addOpenedCardId(id) {
  state.openedCardIds.push(id);
}

export function getOpenedCardIds() {
  return state.openedCardIds;
}

export function clearOpenedCardIds() {
  state.openedCardIds = [];
}

// Counters
export function incrementMoves() {
  state.moves += 1;
}

export function getMoves() {
  return state.moves;
}

export function incrementMatchedPairs() {
  state.matchedPairs += 1;
}

export function getMatchedPairs() {
  return state.matchedPairs;
}

// Time
export function setElapsedSeconds(seconds) {
  state.elapsedSeconds = seconds;
}

export function getElapsedSeconds() {
  return state.elapsedSeconds;
}

// Flags
export function setLocked(value) {
  state.isLocked = value;
}

export function getLocked() {
  return state.isLocked;
}

export function setGameStatus(status) {
  state.gameStatus = status;
}

export function getGameStatus() {
  return state.gameStatus;
}

// Mismatch Timer
export function setTimeoutId(id) {
  state.timeoutId = id;
}

export function getTimeoutId() {
  return state.timeoutId;
}

export function clearTimeoutId() {
  state.timeoutId = null;
}

// Reset
export function resetState() {
  state.openedCardIds = [];
  state.moves = 0;
  state.matchedPairs = 0;
  state.elapsedSeconds = 0;
  state.timeoutId = null;
  state.isLocked = false;
  state.gameStatus = "idle";
}

export function getStateSnapshot() {
  return {
    isLocked: state.isLocked,
    gameStatus: state.gameStatus,
  };
}
