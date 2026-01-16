"use strict";

// ========== NAV (biar index.html ringkas) ==========
function injectNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  nav.innerHTML = `
    <div class="nav-inner">
      <div class="brand">
        <span class="dot"></span>
        <b>Explore Kendari</b>
      </div>

      <a href="#wisata"><span class="nav-ico">🏝️</span><span class="nav-txt">Wisata</span></a>
      <a href="#hotel"><span class="nav-ico">🏨</span><span class="nav-txt">Hotel</span></a>
      <a href="#kuliner"><span class="nav-ico">🍽️</span><span class="nav-txt">Rumah Makan</span></a>
      <a href="#budaya"><span class="nav-ico">💃</span><span class="nav-txt">Budaya</span></a>
      <a href="#about"><span class="nav-ico">ℹ️</span><span class="nav-txt">About</span></a>

      <div class="spacer"></div>
    </div>
  `;
}

// ========== UTIL ==========
function escapeHtml(s) {
  return (s ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function cardTemplate(x) {
  const img = x.img || "";
  const fallback = x.fallback || "https://source.unsplash.com/1200x800/?blue,abstract&sig=99";

  return `
    <article class="card reveal">
      <div class="thumb">
        <img loading="lazy" src="${img}" alt="${escapeHtml(x.title)}"
             onerror="this.onerror=null; this.src='${fallback}';" />
      </div>
      <div class="content">
        <div class="badge"><i></i>${escapeHtml(x.badge)}</div>
        <h3 class="title">${escapeHtml(x.title)}</h3>
        <p class="desc">${escapeHtml(x.desc)}</p>
        <div class="meta">
          <span>${escapeHtml(x.metaL || "")}</span>
          <span>${escapeHtml(x.metaR || "")}</span>
        </div>
      </div>
    </article>
  `;
}

function renderCards(mountId, items) {
  const el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = (items || []).map(cardTemplate).join("");
}

// ========== RENDER SEMUA ==========
function renderAll() {
  const d = window.DATA || {};
  renderCards("ikonGrid", d.ikon);
  renderCards("wisataGrid", d.wisata);
  renderCards("hotelGrid", d.hotel);
  renderCards("kulinerGrid", d.kuliner);
  renderCards("budayaGrid", d.budaya);
}

// ========== SCROLL UI (progress, nav show, topbtn) ==========
function setupScrollUI() {
  const nav = document.getElementById("nav");
  const topbtn = document.getElementById("topbtn");
  const progress = document.getElementById("progress");

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("show", y > 120);
    if (topbtn) topbtn.classList.toggle("show", y > 700);

    if (progress) {
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const p = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = p.toFixed(2) + "%";
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ========== REVEAL ON SCROLL ==========
function setupReveal() {
  const revealEls = [...document.querySelectorAll(".reveal")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.14 });

  revealEls.forEach((el) => io.observe(el));
}

// ========== STEPPER ACTIVE ==========
function setupStepper() {
  const steps = [...document.querySelectorAll(".stepper .step")];
  const targets = ["wisata","hotel","kuliner","budaya"].map(id => document.getElementById(id)).filter(Boolean);

  const setActive = (id) => {
    steps.forEach(s => s.classList.toggle("active", s.dataset.target === id));
  };

  const sio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
  }, { threshold: 0.35 });

  targets.forEach(sec => sio.observe(sec));
}

// ========== YEAR ==========
function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  injectNav();
  renderAll();
  setupScrollUI();
  setupReveal();
  setupStepper();
  setYear();
});
