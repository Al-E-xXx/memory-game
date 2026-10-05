import { buildElement } from "./utils.js";
import { CONFIG } from "./config.js";

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

export function initView() {
  buildLayout();
}
