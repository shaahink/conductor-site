/* The theme toggle's behaviour. The *choice* is made before first paint by the
   one-line inline snippet in Base.astro; this file only runs after, and only
   does what needs a click.

   The split matters. The inline snippet writes `data-theme` on <html> ONLY
   when the visitor has chosen explicitly, so a visitor who has not chosen
   keeps following `prefers-color-scheme` through the media query in
   tokens.css — including when they change their system setting mid-visit.
   Painting the attribute unconditionally would look identical on the first
   visit and quietly freeze everyone else's system preference at whatever it
   was the first time they arrived. */

const KEY = "theme";
const root = document.documentElement;
const prefersLight = window.matchMedia("(prefers-color-scheme: light)");

/* localStorage throws outright in a partitioned or blocked context — not a
   returned null, an exception — so every read and write is wrapped. A theme
   toggle is not worth an unhandled error on someone's page. */
function stored() {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function effective() {
  return stored() ?? (prefersLight.matches ? "light" : "dark");
}

/* The words the button can show, as a map rather than a ternary, because
   `TopBar.astro` has to size the button to the widest of them before any of
   them is chosen — otherwise painting the real label shifts the whole nav row.
   `test/theme-toggle.test.mjs` reads this object and the markup's sizer list
   and fails when they disagree, so a third state cannot be added here alone. */
const LABEL = { dark: "Dark", light: "Light" };

/* The button says what it will do, not what is currently true: a control
   labelled with its own current state is the oldest ambiguity in toggles. */
function paint(button) {
  const next = effective() === "dark" ? "light" : "dark";
  button.setAttribute("aria-label", `Switch to the ${next} theme`);
  const label = button.querySelector("[data-theme-label]");
  if (label) label.textContent = LABEL[next];
}

export function installThemeToggle() {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;

  paint(button);

  button.addEventListener("click", () => {
    const next = effective() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* The theme still flips for this page; it just will not be remembered. */
    }
    paint(button);
  });

  /* Someone who has not chosen is following the system, so the label has to
     follow it too — otherwise it offers to switch to the theme they are
     already looking at. */
  prefersLight.addEventListener("change", () => {
    if (!stored()) paint(button);
  });
}
