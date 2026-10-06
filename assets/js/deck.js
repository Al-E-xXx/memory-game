import { DATA } from "./data.js";
import { shuffle } from "./utils.js";

export function createDeck() {
  const deck = DATA.map((card) => ({ ...card }));
  return shuffle(deck);
}
