// Lumina — fictional landing page interactions.
// Principles: feedback on press, 1:1 tracking, calm motion, reduced-motion respected.

const root = document.documentElement;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

/* Brightness: a direct-manipulation control. Every input event maps the
   value 1:1 onto the lamp's glow — no easing, no debounce, continuous. */
const scene = document.querySelector(".scene");
const slider = document.querySelector("#brightness");

function setGlow(value) {
  const g = Math.min(Math.max(value, 0), 100) / 100;
  root.style.setProperty("--glow", g.toFixed(3));
  slider.style.setProperty("--pct", value + "%");
}
slider.addEventListener("input", () => setGlow(+slider.value));
setGlow(+slider.value);

/* Color mood: retarget the shared hue; registered @property interpolation
   carries every tinted surface at once. */
const swatches = [...document.querySelectorAll(".swatch")];
swatches.forEach((sw) => {
  sw.addEventListener("click", () => {
    root.style.setProperty("--hue", sw.dataset.hue);
    for (const s of swatches) {
      const active = s === sw;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-pressed", String(active));
    }
  });
});

/* Scroll reveal: fade-and-rise once, no overshoot, staggered slightly. */
const reveals = [...document.querySelectorAll("[data-reveal]")];
if (reducedMotion.matches) {
  reveals.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el, i) => {
    el.style.setProperty("--rd", `${Math.min(i * 60, 240)}ms`);
    io.observe(el);
  });
}

/* Nav hairline only appears once content actually scrolls underneath. */
const nav = document.querySelector(".nav");
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 4);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Fake order button: acknowledge the press, then release the state. */
const buyBtn = document.querySelector("#buy-btn");
let resetTimer;
buyBtn.addEventListener("click", () => {
  if (buyBtn.classList.contains("done")) return;
  const original = buyBtn.textContent;
  buyBtn.textContent = "Reserved ✓";
  buyBtn.classList.add("done");
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    buyBtn.textContent = original;
    buyBtn.classList.remove("done");
  }, 2200);
});
