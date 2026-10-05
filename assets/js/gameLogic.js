export function canOpenCard(card, state) {
  if (!card) return false;
  if (card.status !== "closed") return false;
  if (state.isLocked) return false;
  if (state.gameStatus === "won") return false;
  return true;
}

export function isMatch(cardA, cardB) {
  return cardA.pairId === cardB.pairId;
}

export function isWin(matchedPairs, totalPairs) {
  return matchedPairs === totalPairs;
}
