(function () {
  const config = window.GH_REPOS_CONFIG;
  if (!config) return;

  const CACHE_KEY = `gh-repos-cache:${config.username}`;
  const CACHE_TTL_MS = 60 * 60 * 1000;

  const LANGUAGE_COLORS = {
    Python: "#3572A5",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    "Jupyter Notebook": "#DA5B0B",
    HTML: "#e34c26",
    CSS: "#663399",
    Java: "#b07219",
    PHP: "#4F5D95",
    "C#": "#178600",
    "C++": "#f34b7d",
    C: "#555555",
    Shell: "#89e051",
    Go: "#00ADD8",
    Rust: "#dea584",
  };
  const langColor = (lang) => LANGUAGE_COLORS[lang] || "#8b949e";

  const featured = (config.featured || []).flat();
  const featuredNames = new Set(featured.map((r) => r.name.toLowerCase()));

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function relativeTime(iso) {
    if (!iso) return "";
    const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
    const units = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
    ];
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    for (const [unit, size] of units) {
      if (seconds >= size) return rtf.format(-Math.floor(seconds / size), unit);
    }
    return "just now";
  }

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
    return res.json();
  }

  async function loadData() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) return cached;
    } catch (_) {
      /* ignore corrupt cache */
    }

    const [user, repos] = await Promise.all([
      fetchJson(`https://api.github.com/users/${config.username}`),
      fetchJson(`https://api.github.com/users/${config.username}/repos?per_page=100&sort=pushed`),
    ]);
    const data = { user, repos, savedAt: Date.now() };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (_) {
      /* storage full or disabled */
    }
    return data;
  }

  function renderHero(user, repos) {
    const set = (key, value) => {
      const el = $(`[data-gh="${key}"]`);
      if (el && value !== undefined && value !== null && value !== "") el.textContent = value;
    };
    set("name", user.name || user.login);
    set("bio", user.bio);
    set("repos", user.public_repos);
    set("followers", user.followers);
    set("stars", repos.reduce((sum, r) => sum + r.stargazers_count, 0));

    const avatar = $(".gh-hero__avatar");
    if (avatar && user.avatar_url) avatar.src = user.avatar_url;

    const latest = repos.reduce((a, b) => (new Date(a.pushed_at) > new Date(b.pushed_at) ? a : b), repos[0]);
    if (latest) set("pushed", relativeTime(latest.pushed_at));

    const counts = {};
    repos.forEach((r) => {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    const langs = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    set("languages", langs.length);
    renderLangBar(langs);
  }

  function renderLangBar(langs) {
    const bar = $('[data-gh="langbar"]');
    if (!bar || !langs.length) return;
    const total = langs.reduce((s, [, n]) => s + n, 0);
    const track = $(".gh-langbar__track", bar);
    const legend = $(".gh-langbar__legend", bar);
    track.replaceChildren();
    legend.replaceChildren();

    langs.forEach(([lang, n]) => {
      const pct = (n / total) * 100;
      const seg = document.createElement("span");
      seg.style.width = `${pct}%`;
      seg.style.background = langColor(lang);
      seg.title = `${lang} · ${n} repo${n > 1 ? "s" : ""}`;
      track.appendChild(seg);

      const item = document.createElement("li");
      const dot = document.createElement("span");
      dot.className = "gh-card__dot";
      dot.style.background = langColor(lang);
      item.append(dot, `${lang} `);
      const share = document.createElement("span");
      share.className = "gh-langbar__pct";
      share.textContent = `${Math.round(pct)}%`;
      item.appendChild(share);
      legend.appendChild(item);
    });
    bar.hidden = false;
  }

  function fillCardMeta(card, repo) {
    const stars = $('[data-field="stars"]', card);
    if (stars) stars.textContent = repo.stargazers_count;
    const updated = $('[data-field="updated"]', card);
    if (updated) updated.textContent = `Updated ${relativeTime(repo.pushed_at)}`;
    if (repo.language) {
      const lang = $(".gh-card__lang", card);
      $(".gh-card__lang-text", lang).textContent = repo.language;
      $(".gh-card__dot", lang).style.background = langColor(repo.language);
      lang.hidden = false;
    }
  }

  function renderFeatured(repos) {
    const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
    $$(".gh-card--featured").forEach((card) => {
      const repo = byName.get(card.dataset.repo.toLowerCase());
      if (repo) fillCardMeta(card, repo);
    });
  }

  function buildCompactCard(repo) {
    const card = document.createElement("article");
    card.className = "gh-card gh-card--compact";

    const top = document.createElement("div");
    top.className = "gh-card__top";
    const name = document.createElement("a");
    name.className = "gh-card__name";
    name.href = repo.html_url;
    name.target = "_blank";
    name.rel = "noopener noreferrer";
    repo.name.split(/(?<=[_-])/).forEach((part, i) => {
      if (i) name.appendChild(document.createElement("wbr"));
      name.append(part);
    });
    top.appendChild(name);

    const lang = document.createElement("span");
    lang.className = "gh-card__lang";
    lang.hidden = true;
    lang.innerHTML = '<span class="gh-card__dot"></span><span class="gh-card__lang-text"></span>';
    top.appendChild(lang);

    const desc = document.createElement("p");
    desc.className = "gh-card__desc";
    if (repo.description) {
      desc.textContent = repo.description;
    } else {
      desc.textContent = "No description yet.";
      desc.classList.add("gh-card__desc--muted");
    }

    const footer = document.createElement("footer");
    footer.className = "gh-card__footer";
    footer.innerHTML =
      '<span class="gh-card__meta">' +
      '<span class="gh-card__stat" title="Stars"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg><span data-field="stars"></span></span>' +
      '<span class="gh-card__updated" data-field="updated"></span>' +
      "</span>";

    card.append(top, desc, footer);
    fillCardMeta(card, repo);
    return card;
  }

  function setupMore(repos) {
    const grid = $('[data-gh="more-grid"]');
    const search = $(".gh-search");
    const sort = $(".gh-sort");
    const filters = $(".gh-filters");
    const count = $('[data-gh="more-count"]');
    if (!grid) return;

    const others = repos.filter((r) => !featuredNames.has(r.name.toLowerCase()) && !r.fork);
    const state = { query: "", lang: "All", sort: "updated" };

    const langs = ["All", ...new Set(others.map((r) => r.language).filter(Boolean))];
    filters.replaceChildren(
      ...langs.map((lang) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "gh-chip";
        chip.dataset.lang = lang;
        if (lang !== "All") {
          const dot = document.createElement("span");
          dot.className = "gh-card__dot";
          dot.style.background = langColor(lang);
          chip.appendChild(dot);
        }
        chip.append(lang);
        chip.setAttribute("aria-pressed", String(lang === state.lang));
        chip.addEventListener("click", () => {
          state.lang = lang;
          $$(".gh-chip", filters).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.lang === lang)));
          render();
        });
        return chip;
      })
    );

    function render() {
      const q = state.query.trim().toLowerCase();
      const list = others
        .filter((r) => state.lang === "All" || r.language === state.lang)
        .filter((r) => !q || `${r.name} ${r.description || ""} ${(r.topics || []).join(" ")}`.toLowerCase().includes(q))
        .sort((a, b) => {
          if (state.sort === "stars") return b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name);
          if (state.sort === "name") return a.name.localeCompare(b.name);
          return new Date(b.pushed_at) - new Date(a.pushed_at);
        });

      count.textContent = `(${list.length})`;
      if (!list.length) {
        const empty = document.createElement("p");
        empty.className = "gh-empty";
        empty.textContent = "No repositories match your search.";
        grid.replaceChildren(empty);
        return;
      }
      grid.replaceChildren(...list.map(buildCompactCard));
    }

    search.addEventListener("input", (e) => {
      state.query = e.target.value;
      render();
    });
    sort.addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });
    render();
  }

  function renderError() {
    const grid = $('[data-gh="more-grid"]');
    if (!grid) return;
    const msg = document.createElement("p");
    msg.className = "gh-empty";
    msg.append("Couldn't reach GitHub right now (the public API is rate-limited). ");
    const link = document.createElement("a");
    link.href = `https://github.com/${config.username}?tab=repositories`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Browse all repositories on GitHub →";
    msg.appendChild(link);
    grid.replaceChildren(msg);
    $$(".gh-card--featured [data-field='stars']").forEach((el) => (el.textContent = "–"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadData()
      .then(({ user, repos }) => {
        renderHero(user, repos);
        renderFeatured(repos);
        setupMore(repos);
      })
      .catch((err) => {
        console.error(err);
        renderError();
      });
  });
})();
