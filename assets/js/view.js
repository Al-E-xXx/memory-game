import { buildElement, formatDate } from "./utils.js";
import { CONFIG } from "./config.js";
import { getCards, getMoves, getMatchedPairs } from "./state.js";

let onCardClick = null;
let onRestart = null;
let onLeaders = null;

const dom = {
  root: null,
  movesValue: null,
  pairsValue: null,
  board: null,
  newGameBtn: null,
  leadersBtn: null,
  modal: null,
  modalTitle: null,
  modalText: null,
  modalBody: null,
  modalActions: null,
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

  // Modal
  const modal = buildElement("dialog", ["modal"], { id: "modal" }, "", root);
  const modalContent = buildElement("div", ["modal__content"], {}, "", modal);
  const modalTitle = buildElement("h2", ["modal__title"], {}, "", modalContent);
  const modalText = buildElement("p", ["modal__text"], {}, "", modalContent);
  const modalBody = buildElement("div", ["modal__body"], {}, "", modalContent);
  const modalActions = buildElement(
    "div",
    ["modal__actions"],
    {},
    "",
    modalContent,
  );

  // Save refs
  dom.root = root;
  dom.movesValue = movesStat.valueEl;
  dom.pairsValue = pairsStat.valueEl;
  dom.board = board;
  dom.newGameBtn = newGameBtn;
  dom.leadersBtn = leadersBtn;
  dom.modal = modal;
  dom.modalTitle = modalTitle;
  dom.modalText = modalText;
  dom.modalBody = modalBody;
  dom.modalActions = modalActions;

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

function clearModal() {
  dom.modalTitle.textContent = "";
  dom.modalText.textContent = "";
  dom.modalBody.replaceChildren();
  dom.modalActions.replaceChildren();
}

function handleModalBackdropClick(event) {
  if (event.target === dom.modal) {
    closeModal();
  }
}

function buildLeadersTable(leaders) {
  const table = buildElement("table", ["leaders"]);
  const thead = buildElement("thead", [], {}, "", table);
  const headRow = buildElement("tr", [], {}, "", thead);
  buildElement("th", [], {}, "#", headRow);
  buildElement("th", [], {}, "Moves", headRow);
  buildElement("th", [], {}, "Date", headRow);

  const tbody = buildElement("tbody", [], {}, "", table);
  leaders.forEach((leader, index) => {
    const row = buildElement("tr", [], {}, "", tbody);
    buildElement("td", [], {}, String(index + 1), row);
    buildElement("td", [], {}, String(leader.moves), row);
    buildElement("td", [], {}, formatDate(leader.date), row);
  });

  return table;
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
  onRestart = handlers.onRestart;
  onLeaders = handlers.onLeaders;
  buildLayout();
  dom.board.addEventListener("click", handleBoardClick);
  dom.newGameBtn.addEventListener("click", onRestart);
  dom.leadersBtn.addEventListener("click", onLeaders);
  dom.modal.addEventListener("click", handleModalBackdropClick);
}

export function updateCardView(card) {
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

export function updateStats() {
  dom.movesValue.textContent = String(getMoves());
  dom.pairsValue.textContent = `${getMatchedPairs()} из ${CONFIG.totalPairs}`;
}

export function openModal() {
  dom.modal.showModal();
}

export function closeModal() {
  dom.modal.close();
}

export function showWinModal() {
  clearModal();

  dom.modalTitle.textContent = "You win!";
  dom.modalText.textContent = `You found all pairs in ${getMoves()} moves.`;

  const restartBtn = buildButton("New game", "primary");
  restartBtn.addEventListener("click", () => {
    closeModal();
    onRestart();
  });

  const closeBtn = buildButton("Close", "secondary");
  closeBtn.addEventListener("click", closeModal);

  dom.modalActions.append(restartBtn, closeBtn);

  openModal();
}

export function showLeadersModal(leaders) {
  clearModal();

  dom.modalTitle.textContent = "Leaders";

  if (leaders.length === 0) {
    dom.modalText.textContent = "No results yet";
  } else {
    dom.modalBody.append(buildLeadersTable(leaders));
  }

  const closeBtn = buildButton("Close", "secondary");
  closeBtn.addEventListener("click", closeModal);
  dom.modalActions.append(closeBtn);

  openModal();
}
