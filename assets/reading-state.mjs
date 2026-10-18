export function readingState(scrollTop, pageHeight, viewportHeight, headings) {
  const distance = Math.max(0, pageHeight - viewportHeight);
  const position = Math.min(distance, Math.max(0, scrollTop));
  const progress = distance ? position / distance : 0;
  let active = headings.length ? 0 : -1;
  headings.forEach((top, index) => { if (top <= position + Math.min(180, viewportHeight * .25)) active = index; });
  return { progress, active };
}

export function headingId(text, used) {
  const base = text.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "section";
  let id = base;
  let suffix = 2;
  while (used.has(id)) id = `${base}-${suffix++}`;
  used.add(id);
  return id;
}
