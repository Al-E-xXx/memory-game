// Build Element
export function buildElement(
  tag = "div",
  classes = [],
  attributes = {},
  text = "",
  parent = null,
) {
  const element = document.createElement(tag);

  if (typeof classes === "string") {
    classes.split(" ").forEach(function (cls) {
      if (cls.trim()) element.classList.add(cls.trim());
    });
  } else if (Array.isArray(classes)) {
    classes.forEach(function (cls) {
      if (cls) element.classList.add(cls);
    });
  }

  if (attributes && typeof attributes === "object") {
    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (text) {
    element.textContent = text;
  }

  if (parent) {
    parent.append(element);
  }

  return element;
}

// Shuffle Array
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Format Date
export function formatDate(isoString) {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}
