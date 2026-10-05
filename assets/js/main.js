import { initView, renderBoard, updateCard } from "./view.js";
import { createDeck } from "./deck.js";
import { setCards, getCardById } from "./state.js";

initView({
  onCardClick(id) {
    const card = getCardById(id);
    if (!card) return;

    // временная логика: просто переключаем статус
    card.status = card.status === "closed" ? "opened" : "closed";
    updateCard(card);
  },
});

setCards(createDeck());
renderBoard();
