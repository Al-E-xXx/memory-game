import { CONFIG } from "./config.js";
import { createDeck } from "./deck.js";
import {
  setCards,
  resetState,
  getCardById,
  updateCard,
  addOpenedCardId,
  getOpenedCardIds,
  clearOpenedCardIds,
  incrementMoves,
  incrementMatchedPairs,
  getMatchedPairs,
  getMoves,
  setLocked,
  setGameStatus,
  getGameStatus,
  getStateSnapshot,
  getTimeoutId,
  setTimeoutId,
  clearTimeoutId,
} from "./state.js";
import { canOpenCard, isMatch, isWin } from "./gameLogic.js";
import {
  initView,
  renderBoard,
  updateCardView,
  updateStats,
  showWinModal,
  showLeadersModal,
} from "./view.js";
import { loadLeaders, saveLeader } from "./storage.js";

// Init
export function init() {
  clearPendingTimeout();
  setGameStatus("idle");
  setLocked(false);
  clearOpenedCardIds();

  initView({
    onCardClick: handleCardClick,
    onRestart: restartGame,
    onLeaders: handleLeadersClick,
  });
  setCards(createDeck());
  renderBoard();
  updateStats();
}

// Click
function handleCardClick(id) {
  const card = getCardById(id);
  if (!canOpenCard(card, getStateSnapshot())) return;

  if (getGameStatus() === "idle") setGameStatus("playing");

  openCard(card);

  const openedIds = getOpenedCardIds();
  if (openedIds.length === 1) {
    handleFirstCard(card);
  } else if (openedIds.length === 2) {
    handleSecondCard();
  }
}

// Open/Close
function openCard(card) {
  updateCard(card.id, { status: "opened" });
  updateCardView(card);
  addOpenedCardId(card.id);
}

function closeCard(card) {
  updateCard(card.id, { status: "closed" });
  updateCardView(card);
}

// Turn sequence
function handleFirstCard(card) {
  //
}

function handleSecondCard() {
  incrementMoves();
  updateStats();
  setLocked(true);

  const [idA, idB] = getOpenedCardIds();
  const cardA = getCardById(idA);
  const cardB = getCardById(idB);

  if (isMatch(cardA, cardB)) {
    handleMatch(cardA, cardB);
  } else {
    handleMismatch(cardA, cardB);
  }
}

function handleMatch(cardA, cardB) {
  updateCard(cardA.id, { status: "matched" });
  updateCard(cardB.id, { status: "matched" });
  updateCardView(cardA);
  updateCardView(cardB);

  clearOpenedCardIds();
  incrementMatchedPairs();
  updateStats();
  setLocked(false);

  checkWin();
}

function handleMismatch(cardA, cardB) {
  const id = setTimeout(() => {
    closeCard(cardA);
    closeCard(cardB);
    clearOpenedCardIds();
    setLocked(false);
    clearTimeoutId();
  }, CONFIG.mismatchDelay);

  setTimeoutId(id);
}

function checkWin() {
  if (isWin(getMatchedPairs(), CONFIG.totalPairs)) {
    if (getGameStatus() !== "won") {
      saveLeader({
        moves: getMoves(),
        date: new Date().toISOString(),
      });
    }
    setGameStatus("won");
    showWinModal();
  }
}

function clearPendingTimeout() {
  const id = getTimeoutId();
  if (id !== null) {
    clearTimeout(id);
    clearTimeoutId();
  }
}

function restartGame() {
  clearPendingTimeout();
  resetState();
  setCards(createDeck());
  renderBoard();
  updateStats();
  setGameStatus("idle");
}

function handleLeadersClick() {
  showLeadersModal(loadLeaders());
}
