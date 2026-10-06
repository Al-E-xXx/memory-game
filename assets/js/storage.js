const KEY = "memory-game:leaders";
const MAX_LEADERS = 10;

export function loadLeaders() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const leaders = JSON.parse(raw);
    return sortLeaders(leaders);
  } catch {
    return [];
  }
}

export function saveLeader(record) {
  const leaders = loadLeaders();
  leaders.push(record);
  const trimmed = sortLeaders(leaders).slice(0, MAX_LEADERS);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
}

export function clearLeaders() {
  localStorage.removeItem(KEY);
}

function sortLeaders(leaders) {
  return [...leaders].sort((a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return a.date.localeCompare(b.date);
  });
}
