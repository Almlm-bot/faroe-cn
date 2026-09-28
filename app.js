const SEARCH_INDEX = [
  { title: "徒步须知", type: "旅行指南", href: "plan.html#hiking-notes", keywords: "徒步 远足 登山 hiking 灯塔 Kallur" },
  { title: "峡湾与海洋", type: "自然", href: "nature.html#fjord", keywords: "海 船 观鸟 峡湾 海洋" },
  { title: "山峦与绿野", type: "自然", href: "nature.html#mountains", keywords: "山 草地 悬崖 景点" },
  { title: "海鸟与野生动物", type: "自然", href: "nature.html#wildlife", keywords: "海鸟 羊 野生动物 海鹦" },
  { title: "沿山径徒步", type: "自然", href: "nature.html#hiking", keywords: "徒步 山径 hiking" },
  { title: "法罗建筑", type: "人文", href: "culture.html#architecture", keywords: "建筑 草顶 托尔斯港 Tinganes" },
  { title: "传统与节庆", type: "人文", href: "culture.html#traditions", keywords: "节庆 链舞 奥拉夫斯节 Ólavsøka" },
  { title: "音乐与舞蹈", type: "人文", href: "culture.html#music", keywords: "音乐 舞蹈 北欧之家" },
  { title: "Heim 体验", type: "美食", href: "food.html#heim", keywords: "Heim 餐桌 当地 家庭" },
  { title: "海鲜与羊肉", type: "美食", href: "food.html", keywords: "美食 餐厅 海鲜 羊肉" },
  { title: "乘飞机抵达", type: "旅行指南", href: "plan.html#air", keywords: "飞机 机场 航班 Vágar FAE" },
  { title: "乘渡轮抵达", type: "旅行指南", href: "plan.html#sea", keywords: "渡轮 海运 ferry" },
  { title: "住宿", type: "旅行指南", href: "plan.html#stay", keywords: "酒店 旅馆 露营 民宿" },
  { title: "岛上交通", type: "旅行指南", href: "plan.html#around", keywords: "租车 公交 自行车 隧道" },
  { title: "安全旅行", type: "旅行指南", href: "plan.html#safe", keywords: "安全 徒步费 责任 天气" },
  { title: "行前准备", type: "旅行指南", href: "plan.html#pack", keywords: "行李 打包 装备" },
  { title: "72小时旅行指南", type: "旅行指南", href: "plan.html#72h", keywords: "行程 三天 指南 72" },
  { title: "活动日历", type: "活动", href: "whats-on.html", keywords: "活动 节日 音乐会 徒步" },
  { title: "关于法罗", type: "关于", href: "about.html", keywords: "天气 气候 地理 语言 历史" },
];

const FAV_KEY = "faroe-cn-favs";

function getFavs() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

function setFavs(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
  syncFavUI();
}

function toggleFav(item) {
  const list = getFavs();
  const idx = list.findIndex((f) => f.id === item.id);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(item);
  setFavs(list);
}

function syncFavUI() {
  const list = getFavs();
  const count = document.getElementById("favCount");
  if (count) {
    count.hidden = list.length === 0;
    count.textContent = String(list.length);
  }

  document.querySelectorAll("[data-fav-id]").forEach((el) => {
    const id = el.getAttribute("data-fav-id");
    const btn = el.querySelector("[data-fav]");
    const active = list.some((f) => f.id === id);
    if (btn) {
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      if (btn.classList.contains("inline")) {
        btn.textContent = active ? "♥ 已收藏" : "♡ 收藏";
      } else {
        btn.textContent = active ? "♥" : "♡";
        btn.setAttribute("aria-label", active ? "已收藏" : "收藏");
      }
    }
  });

  const favList = document.getElementById("favList");
  if (!favList) return;
  if (!list.length) {
    favList.innerHTML =
      '<li class="fav-empty">还没有收藏内容。<a href="index.html">去探索法罗 →</a></li>';
    return;
  }
  favList.innerHTML = list
    .map(
      (f) => `
      <li>
        <div>
          <strong>${escapeHtml(f.title)}</strong>
          <small>${escapeHtml(f.type || "收藏")}</small>
        </div>
        <button type="button" data-remove-fav="${escapeHtml(f.id)}" aria-label="移除">移除</button>
      </li>`
    )
    .join("");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initHeader() {
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initParallax() {
  const img = document.querySelector(".hero-img");
  if (!img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const onScroll = () => {
    const y = Math.min(window.scrollY, 600);
    img.style.transform = `scale(1.04) translate3d(0, ${y * 0.12}px, 0)`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initDrawers() {
  const menuToggle = document.getElementById("menuToggle");
  const navDrawer = document.getElementById("navDrawer");
  const favToggle = document.getElementById("favToggle");
  const favDrawer = document.getElementById("favDrawer");
  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  const siteSearch = document.getElementById("siteSearch");

  const open = (el) => {
    if (!el) return;
    el.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const close = (el) => {
    if (!el) return;
    el.hidden = true;
    if (
      (!navDrawer || navDrawer.hidden) &&
      (!favDrawer || favDrawer.hidden) &&
      (!searchPanel || searchPanel.hidden)
    ) {
      document.body.style.overflow = "";
    }
  };

  menuToggle?.addEventListener("click", () => {
    const openNow = navDrawer?.hidden;
    if (openNow) open(navDrawer);
    else close(navDrawer);
    menuToggle.setAttribute("aria-expanded", openNow ? "true" : "false");
  });

  favToggle?.addEventListener("click", () => {
    if (favDrawer?.hidden) {
      syncFavUI();
      open(favDrawer);
    } else close(favDrawer);
  });

  searchToggle?.addEventListener("click", () => {
    if (!searchPanel) return;
    const willOpen = searchPanel.hidden;
    searchPanel.hidden = !willOpen;
    if (willOpen) {
      siteSearch?.focus();
    } else if ((!navDrawer || navDrawer.hidden) && (!favDrawer || favDrawer.hidden)) {
      document.body.style.overflow = "";
    }
  });

  document.querySelectorAll("[data-close-drawer]").forEach((el) =>
    el.addEventListener("click", () => {
      close(navDrawer);
      menuToggle?.setAttribute("aria-expanded", "false");
    })
  );
  document.querySelectorAll("[data-close-fav]").forEach((el) =>
    el.addEventListener("click", () => close(favDrawer))
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close(navDrawer);
      close(favDrawer);
      if (searchPanel) searchPanel.hidden = true;
      document.body.style.overflow = "";
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });
}

function initSearch() {
  const input = document.getElementById("siteSearch");
  const results = document.getElementById("searchResults");
  if (!input || !results) return;

  const render = (q) => {
    const query = q.trim().toLowerCase();
    if (!query) {
      results.innerHTML = "";
      return;
    }
    const hits = SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.keywords.toLowerCase().includes(query)
    );
    if (!hits.length) {
      results.innerHTML = "<li><span>没有找到相关内容</span></li>";
      return;
    }
    results.innerHTML = hits
      .map(
        (h) =>
          `<li><a href="${h.href}"><strong>${escapeHtml(h.title)}</strong><small>${escapeHtml(
            h.type
          )}</small></a></li>`
      )
      .join("");
  };

  input.addEventListener("input", () => render(input.value));
}

function initFavButtons() {
  document.body.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove-fav]");
    if (removeBtn) {
      const id = removeBtn.getAttribute("data-remove-fav");
      setFavs(getFavs().filter((f) => f.id !== id));
      return;
    }

    const btn = e.target.closest("[data-fav]");
    if (!btn) return;
    const host = btn.closest("[data-fav-id]");
    if (!host) return;
    toggleFav({
      id: host.getAttribute("data-fav-id"),
      title: host.getAttribute("data-fav-title") || "未命名",
      type: host.getAttribute("data-fav-type") || "收藏",
    });
  });
}

function initReveal() {
  const nodes = document.querySelectorAll(
    ".section, .quote-band, .topic, .place-item, .event-item, .fact-strip, .story-card, .content-block"
  );
  nodes.forEach((n) => n.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  nodes.forEach((n) => io.observe(n));
}

function initFilters() {
  const chips = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll("[data-category]");
  if (!chips.length || !items.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.getAttribute("data-filter");
      items.forEach((item) => {
        const show = filter === "all" || item.getAttribute("data-category") === filter;
        item.hidden = !show;
      });
    });
  });
}

function initActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-desktop a, .drawer-panel nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("#")[0];
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
}

const TILT_ASSETS = [
  {
    src: "https://images.unsplash.com/photo-1769921546096-7a648d953a3e?q=80&w=500&auto=format&fit=crop",
    title: "urban exploration",
  },
  {
    src: "https://images.unsplash.com/photo-1777726515600-65be20641e1b?q=80&w=500&auto=format&fit=crop",
    title: "night scene",
  },
  {
    src: "https://images.unsplash.com/photo-1776582929657-9710d9cfa46a?q=80&w=500&auto=format&fit=crop",
    title: "yellow wildflowers",
  },
  {
    src: "https://images.unsplash.com/photo-1776582929656-78ad8b515d75?q=80&w=500&auto=format&fit=crop",
    title: "street with mount fuji",
  },
  {
    src: "https://images.unsplash.com/photo-1775990630948-3c1f696f4ab1?q=80&w=500&auto=format&fit=crop",
    title: "bridgestone bicycle shop",
  },
  {
    src: "https://images.unsplash.com/photo-1775380744191-8fbff371c40b?q=80&w=500&auto=format&fit=crop",
    title: "train window view",
  },
  {
    src: "https://images.unsplash.com/photo-1774775479879-082fd47d41e1?q=80&w=500&auto=format&fit=crop",
    title: "train tracks",
  },
  {
    src: "https://images.unsplash.com/photo-1773544517453-95c148cb42b7?q=80&w=500&auto=format&fit=crop",
    title: "lawson convenience store",
  },
  {
    src: "https://images.unsplash.com/photo-1771385809377-9b0348e1f8dc?q=80&w=500&auto=format&fit=crop",
    title: "street scene",
  },
  {
    src: "https://images.unsplash.com/photo-1775990631076-f6f208079475?q=80&w=500&auto=format&fit=crop",
    title: "japanese culture",
  },
];

function initTiltCarousel() {
  const row = document.querySelector("[data-tilt-carousel]");
  if (!row) return;

  const track = row.querySelector(".tilt-track");
  const dots = row.querySelector(".tilt-dots");
  const prev = row.querySelector("[data-tilt-prev]");
  const next = row.querySelector("[data-tilt-next]");
  let active = 3;

  track.innerHTML = TILT_ASSETS.map(
    (item, i) => `
      <button type="button" class="tilt-slide" data-tilt-index="${i}" style="--i:${i}">
        <span class="tilt-face">
          <img src="${item.src}" alt="${item.title}" />
        </span>
        <span class="tilt-caption">${item.title}</span>
      </button>`
  ).join("");

  dots.innerHTML = TILT_ASSETS.map(
    (_, i) =>
      `<button type="button" class="tilt-dot" data-tilt-index="${i}" aria-label="第 ${i + 1} 张"></button>`
  ).join("");

  function render() {
    row.style.setProperty("--active", String(active));
    track.querySelectorAll(".tilt-slide").forEach((el, i) => {
      const on = i === active;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-current", on ? "true" : "false");
    });
    dots.querySelectorAll(".tilt-dot").forEach((el, i) => {
      const on = i === active;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-current", on ? "true" : "false");
    });
    prev.disabled = active === 0;
    next.disabled = active === TILT_ASSETS.length - 1;
  }

  function go(index) {
    active = Math.max(0, Math.min(TILT_ASSETS.length - 1, index));
    render();
  }

  prev.addEventListener("click", () => go(active - 1));
  next.addEventListener("click", () => go(active + 1));
  row.addEventListener("click", (event) => {
    const target = event.target.closest("[data-tilt-index]");
    if (!target || !row.contains(target)) return;
    go(Number(target.getAttribute("data-tilt-index")));
  });

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initParallax();
  initDrawers();
  initSearch();
  initFavButtons();
  initReveal();
  initFilters();
  initActiveNav();
  syncFavUI();
  initTiltCarousel();
});
