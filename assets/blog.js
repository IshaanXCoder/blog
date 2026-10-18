import { headingId, readingState } from "./reading-state.mjs";

const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
function updateThemeLabel() {
  themeButton?.setAttribute("aria-label", root.dataset.theme === "light" ? "Switch to dark theme" : "Switch to light theme");
}
updateThemeLabel();
themeButton?.addEventListener("click", () => {
  const theme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = theme;
  try { localStorage.setItem("ishaan-blog-theme", theme); } catch { /* Reading works with storage disabled. */ }
  updateThemeLabel();
});

const article = document.querySelector("article");
const headings = article ? [...article.querySelectorAll("h2, h3, h4")] : [];
const toc = document.querySelector(".toc");
const list = toc?.querySelector("ul");
const used = new Set([...document.querySelectorAll("[id]")].map((element) => element.id));
const links = headings.map((heading) => {
  if (!heading.id) heading.id = headingId(heading.textContent, used);
  const item = document.createElement("li");
  item.className = `level-${heading.tagName.slice(1)}`;
  const link = document.createElement("a");
  link.href = `#${heading.id}`;
  link.textContent = heading.textContent;
  item.append(link);
  list?.append(item);
  return link;
});

const desktop = matchMedia("(min-width: 1100px)");
if (toc) {
  toc.hidden = headings.length === 0;
  toc.open = desktop.matches;
  desktop.addEventListener("change", () => { toc.open = desktop.matches; });
  toc.addEventListener("click", (event) => {
    if (!desktop.matches && event.target.closest("a")) toc.open = false;
  });
}

if (location.hash) {
  try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(); }
  catch { /* Ignore malformed bookmarks. */ }
}

const progressBar = document.querySelector(".reading-progress");
let frame = 0;
let activeIndex = -1;
function updateReading() {
  frame = 0;
  const state = readingState(scrollY, root.scrollHeight, innerHeight,
    headings.map((heading) => heading.getBoundingClientRect().top + scrollY));
  progressBar.style.transform = `scaleX(${state.progress})`;
  progressBar.setAttribute("aria-valuenow", Math.round(state.progress * 100));
  if (state.active !== activeIndex) {
    links[activeIndex]?.removeAttribute("aria-current");
    links[state.active]?.setAttribute("aria-current", "location");
    activeIndex = state.active;
  }
}
function scheduleReading() {
  if (!frame) frame = requestAnimationFrame(updateReading);
}
addEventListener("scroll", scheduleReading, { passive: true });
addEventListener("resize", scheduleReading);
addEventListener("load", scheduleReading);
addEventListener("pageshow", scheduleReading);
new ResizeObserver(scheduleReading).observe(document.body);
updateReading();
