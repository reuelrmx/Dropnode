/* ══════════════════════════════════════════════════════
   VAULT.SYS — vanilla js
   boot · clocks · search/filter/sort · accordion · fx
   ══════════════════════════════════════════════════════ */
"use strict";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── boot sequence ─────────────────────────────────────── */
(function boot() {
  const overlay = $("#boot");
  const log = $("#boot-log");
  const fill = $("#boot-fill");
  const skip = $("#boot-skip");

  // only play once per browser session ("?noboot" in URL skips it)
  if (REDUCED || location.search.includes("noboot") || sessionStorage.getItem("vault_booted")) {
    overlay.classList.add("done");
    return;
  }
  document.body.style.overflow = "hidden";

  const lines = [
    "> run Dropnode.sys",
    "> mounting archive .......... OK",
    "> indexing " + FILES.length + " objects .... OK",
    "> verifying mirrors ......... OK",
    "> establishing uplink ....... OK",
    "",
    "ACCESS GRANTED",
  ];

  let li = 0, ci = 0, pct = 0, finished = false;
  const totalChars = lines.join("").length;

  function finish() {
    if (finished) return;
    finished = true;
    sessionStorage.setItem("vault_booted", "1");
    overlay.classList.add("done");
    document.body.style.overflow = "";
  }

  function tick() {
    if (finished) return;
    if (li >= lines.length) { setTimeout(finish, 350); return; }
    const line = lines[li];
    if (ci <= line.length) {
      log.textContent = lines.slice(0, li).join("\n") + (li ? "\n" : "") + line.slice(0, ci);
      ci++;
      pct = Math.min(100, Math.round((log.textContent.length / totalChars) * 100));
      fill.style.width = pct + "%";
      setTimeout(tick, 8);
    } else {
      li++; ci = 0;
      setTimeout(tick, 90);
    }
  }

  skip.addEventListener("click", finish);
  setTimeout(tick, 250);
  setTimeout(finish, 6000); // hard cap
})();

/* ── header clock + session uptime ─────────────────────── */
(function clocks() {
  const clock = $("#hud-clock");
  const uptime = $("#uptime");
  const t0 = Date.now();
  const pad = (n) => String(n).padStart(2, "0");
  setInterval(() => {
    const d = new Date();
    clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const s = Math.floor((Date.now() - t0) / 1000);
    uptime.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
  }, 1000);
  $("#year").textContent = new Date().getFullYear();
})();

/* ── hero typing ───────────────────────────────────────── */
(function typing() {
  const el = $("#typed");
  const phrases = [
    "pull files at wire speed.",
    "direct links. zero friction.",
    "mirrors when the pipe is hot.",
    "missing something? request it.",
  ];
  if (REDUCED) { el.textContent = phrases[0]; return; }
  let p = 0, c = 0, deleting = false;
  (function step() {
    const phrase = phrases[p];
    el.textContent = phrase.slice(0, c);
    let delay = deleting ? 26 : 52;
    if (!deleting && c === phrase.length) { deleting = true; delay = 2100; }
    else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 500; }
    else c += deleting ? -1 : 1;
    setTimeout(step, delay);
  })();
})();

/* ── stats ─────────────────────────────────────────────── */
(function stats() {
  $("#stat-count").textContent = String(FILES.length).padStart(3, "0");
  const gb = FILES.reduce((a, f) => a + f.sizeMB, 0) / 1024;
  $("#stat-size").textContent = gb >= 1 ? gb.toFixed(1) + " GB" : Math.round(gb * 1024) + " MB";
  const latest = FILES.map(f => f.date).sort().pop();
  $("#stat-sync").textContent = latest ? latest.slice(5).replace("-", ".") : "--";
})();

/* ── icons (inline svg, no emoji) ──────────────────────── */
const ICONS = {
  download: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 19h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>',
  mirror: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>',
  file: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 3h9l5 5v13H5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 3v5h5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};

/* ── size formatting ───────────────────────────────────── */
const fmtSize = (mb) =>
  mb >= 1024 ? (mb / 1024).toFixed(1) + " GB"
  : mb >= 1 ? mb.toFixed(mb < 10 ? 1 : 0) + " MB"
  : Math.round(mb * 1024) + " KB";

const catLabel = (id) => (CATEGORIES.find(c => c.id === id) || {}).label || id.toUpperCase();

/* ── state ─────────────────────────────────────────────── */
const state = { query: "", category: "all", sort: "newest", open: null };

/* ── render category chips ─────────────────────────────── */
(function renderChips() {
  const wrap = $("#chips");
  CATEGORIES.forEach(({ id, label }) => {
    const n = id === "all" ? FILES.length : FILES.filter(f => f.category === id).length;
    if (id !== "all" && n === 0) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (id === "all" ? " active" : "");
    btn.dataset.cat = id;
    btn.innerHTML = `${label}<span class="chip-n">${String(n).padStart(2, "0")}</span>`;
    btn.addEventListener("click", () => {
      state.category = id;
      state.open = null;
      $$(".chip", wrap).forEach(c => c.classList.toggle("active", c === btn));
      renderList();
    });
    wrap.appendChild(btn);
  });
})();

/* ── filtering pipeline ────────────────────────────────── */
function visibleFiles() {
  const q = state.query.trim().toLowerCase();
  let list = FILES.filter(f => {
    const inCat = state.category === "all" || f.category === state.category;
    const inQuery = !q ||
      f.name.toLowerCase().includes(q) ||
      f.desc.toLowerCase().includes(q) ||
      catLabel(f.category).toLowerCase().includes(q);
    return inCat && inQuery;
  });
  if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  else if (state.sort === "size") list.sort((a, b) => b.sizeMB - a.sizeMB);
  else list.sort((a, b) => b.date.localeCompare(a.date));
  return list;
}

/* ── render list ───────────────────────────────────────── */
function renderList() {
  const ol = $("#file-list");
  const list = visibleFiles();
  ol.innerHTML = "";

  $("#result-count").textContent = String(list.length).padStart(2, "0") + " RESULTS";
  $("#empty-state").hidden = list.length > 0;
  $("#clear-filters").hidden = !(state.query || state.category !== "all");

  list.forEach((f, i) => {
    const li = document.createElement("li");
    li.className = "file-item" + (state.open === f.name ? " open" : "");

    const row = document.createElement("button");
    row.type = "button";
    row.className = "file-row";
    row.setAttribute("aria-expanded", state.open === f.name);
    row.innerHTML = `
      <span class="file-id">${String(i + 1).padStart(3, "0")}</span>
      <span class="file-name">${ICONS.file ? "" : ""}${f.name}</span>
      <span class="file-meta">
        <span class="file-cat">${catLabel(f.category)}</span>
        ${fmtSize(f.sizeMB)} · ${f.date}
      </span>`;
    row.addEventListener("click", () => {
      state.open = state.open === f.name ? null : f.name;
      $$(".file-item", ol).forEach(item => {
        const isOpen = item === li && state.open === f.name;
        item.classList.toggle("open", isOpen);
        $(".file-row", item).setAttribute("aria-expanded", isOpen);
      });
    });

    const body = document.createElement("div");
    body.className = "file-body";
    const actions = [];
    if (f.direct) {
      actions.push(`<a class="btn btn-primary" href="${f.direct}" download data-toast="TRANSFER INITIATED — ${f.name}">${ICONS.download} DOWNLOAD</a>`);
    }
    if (f.mirror) {
      actions.push(`<a class="btn btn-mirror" href="${f.mirror}" target="_blank" rel="noopener">${ICONS.mirror} CLOUD MIRROR</a>`);
    }
    body.innerHTML = `
      <div class="file-body-inner">
        <p class="file-desc">${f.desc}</p>
        <div class="file-actions">${actions.join("")}</div>
      </div>`;

    li.append(row, body);
    ol.appendChild(li);
  });
}

/* ── controls ──────────────────────────────────────────── */
$("#search-input").addEventListener("input", (e) => {
  state.query = e.target.value;
  state.open = null;
  renderList();
});
$("#sort-select").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderList();
});
$("#clear-filters").addEventListener("click", () => {
  state.query = "";
  state.category = "all";
  state.open = null;
  $("#search-input").value = "";
  $$(".chip").forEach(c => c.classList.toggle("active", c.dataset.cat === "all"));
  renderList();
});

renderList();

/* ── toast ─────────────────────────────────────────────── */
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-toast]");
  if (a) toast(a.dataset.toast);
});

/* ── copy telegram handle ──────────────────────────────── */
$("#copy-handle").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("@" + TELEGRAM_HANDLE);
    toast("HANDLE COPIED — @" + TELEGRAM_HANDLE.toUpperCase());
  } catch {
    toast("@" + TELEGRAM_HANDLE.toUpperCase());
  }
});

/* ── scroll reveals ────────────────────────────────────── */
(function reveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => io.observe(el));
})();

/* ── rewind ────────────────────────────────────────────── */
$("#rewind").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
  toast("REWINDING TAPE...");
});
