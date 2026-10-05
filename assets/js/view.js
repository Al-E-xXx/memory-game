import { buildElement } from "./utils.js";
import { CONFIG } from "./config.js";
import { getCards } from "./state.js";

let onCardClick = null;

const dom = {
  root: null,
  movesValue: null,
  pairsValue: null,
  board: null,
  newGameBtn: null,
  leadersBtn: null,
};

function buildButton(text, modifier) {
  const classes = modifier ? ["button", `button--${modifier}`] : ["button"];
  return buildElement("button", classes, { type: "button" }, text);
}

function buildStat(label, value) {
  const stat = buildElement("div", ["stat"]);
  buildElement("span", ["stat__label"], {}, label, stat);
  const valueEl = buildElement("span", ["stat__value"], {}, value, stat);
  return { element: stat, valueEl };
}

function buildLayout() {
  const root = buildElement("div", ["game"]);

  // Header
  const header = buildElement("header", ["game__header"], {}, "", root);
  buildElement("h1", ["game__title"], {}, "Memory Game", header);
  const controls = buildElement("div", ["game__controls"], {}, "", header);
  const newGameBtn = buildButton("New Game", "primary");
  const leadersBtn = buildButton("Leaderboard", "secondary");
  controls.append(newGameBtn, leadersBtn);

  // Stats
  const stats = buildElement("div", ["game__stats"], {}, "", root);
  const movesStat = buildStat("Movies: ", "0");
  const pairsStat = buildStat("Pairs: ", `0 / ${CONFIG.totalPairs}`);
  stats.append(movesStat.element, pairsStat.element);

  // Board
  const board = buildElement("div", ["game__board"], {}, "", root);

  // Save refs
  dom.root = root;
  dom.movesValue = movesStat.valueEl;
  dom.pairsValue = pairsStat.valueEl;
  dom.board = board;
  dom.newGameBtn = newGameBtn;
  dom.leadersBtn = leadersBtn;

  document.body.prepend(root);
}

function createCardElement(card) {
  const cardEl = buildElement("button", ["card", `card--${card.status}`], {
    type: "button",
    "data-id": String(card.id),
  });

  const inner = buildElement("span", ["card__inner"], {}, "", cardEl);

  const front = buildElement(
    "span",
    ["card__face", "card__face--front"],
    {},
    "",
    inner,
  );
  buildElement("img", ["card__image"], { alt: "" }, "", front);

  buildElement("span", ["card__face", "card__face--back"], {}, "", inner);

  return cardEl;
}

function handleBoardClick(event) {
  const cardEl = event.target.closest(".card");
  if (!cardEl) return;

  const id = Number(cardEl.dataset.id);
  onCardClick(id);
}

export function renderBoard() {
  dom.board.replaceChildren();

  const cards = getCards();
  const fragment = document.createDocumentFragment();

  cards.forEach((card) => {
    fragment.append(createCardElement(card));
  });

  dom.board.append(fragment);
}

export function initView(handlers) {
  onCardClick = handlers.onCardClick;
  buildLayout();
  dom.board.addEventListener("click", handleBoardClick);
}

export function updateCard(card) {
  const cardEl = dom.board.querySelector(`.card[data-id="${card.id}"]`);
  if (!cardEl) return;

  cardEl.classList.remove("card--closed", "card--opened", "card--matched");
  cardEl.classList.add(`card--${card.status}`);

  const img = cardEl.querySelector(".card__image");

  if (card.status === "closed") {
    img.removeAttribute("src");
  } else {
    img.src = card.image;
  }
}
