export function getInitials(name?: string, fallback = "?") {
  if (!name?.trim()) return fallback;
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
