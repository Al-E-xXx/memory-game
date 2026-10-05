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
