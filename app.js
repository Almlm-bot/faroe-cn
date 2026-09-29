const SEARCH_INDEX = [
  { title: "徒步须知", type: "旅行指南", href: "hiking.html", keywords: "徒步 远足 登山 hiking 灯塔 Kallur 安全" },
  { title: "峡湾与海洋", type: "自然", href: "nature.html#fjord", keywords: "海 船 观鸟 峡湾 海洋" },
  { title: "山峦与绿野", type: "自然", href: "nature.html#mountains", keywords: "山 草地 悬崖 景点" },
  { title: "海鸟与野生动物", type: "自然", href: "nature.html#wildlife", keywords: "海鸟 羊 野生动物 海鹦" },
  { title: "沿山径徒步", type: "自然", href: "nature.html#hiking", keywords: "徒步 山径 hiking" },
  { title: "法罗建筑", type: "人文", href: "culture.html#architecture", keywords: "建筑 草顶 托尔斯港 Tinganes" },
  { title: "传统与节庆", type: "人文", href: "culture.html#traditions", keywords: "节庆 链舞 奥拉夫斯节 Ólavsøka" },
  { title: "音乐与舞蹈", type: "人文", href: "culture.html#music", keywords: "音乐 舞蹈 北欧之家" },
  { title: "Heimablídni 体验", type: "美食", href: "food.html#heim", keywords: "Heimablídni 餐桌 当地 家庭" },
  { title: "海鲜与羊肉", type: "美食", href: "food.html", keywords: "美食 餐厅 海鲜 羊肉" },
  { title: "乘飞机抵达", type: "旅行指南", href: "plan.html#air", keywords: "飞机 机场 航班 Vágar FAE" },
  { title: "乘渡轮抵达", type: "旅行指南", href: "plan.html#sea", keywords: "渡轮 海运 ferry" },
  { title: "住宿", type: "旅行指南", href: "plan.html#stay", keywords: "酒店 旅馆 露营 民宿" },
  { title: "岛上交通", type: "旅行指南", href: "plan.html#around", keywords: "租车 公交 自行车 隧道" },
  { title: "走进法罗", type: "旅行指南", href: "plan.html#safe", keywords: "安全 徒步费 责任 天气 走进法罗" },
  { title: "认识法罗", type: "旅行指南", href: "discover.html", keywords: "简介 法罗群岛 地图 位置 托尔斯港 认识法罗" },
  { title: "走近法罗", type: "人文", href: "culture.html", keywords: "人文 走近法罗 传统 村落" },
  { title: "安全徒步指南", type: "旅行指南", href: "hiking.html", keywords: "徒步 安全 天气 装备 悬崖 向导 预报" },
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
      chips.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");
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
    src: "assets/discover-culture.webp",
    title: "村落里的人们",
  },
  {
    src: "assets/culture-festival.webp",
    title: "节庆与传统",
  },
  {
    src: "assets/discover-events.webp",
    title: "奥拉夫斯节",
  },
  {
    src: "assets/arrive-by-ferry.webp",
    title: "峡湾与渡轮",
  },
  {
    src: "assets/culture-stage.avif",
    title: "舞台与音乐",
  },
  {
    src: "assets/home-culture.jpg",
    title: "山坡上的村落",
  },
  {
    src: "assets/whats-on-concert.webp",
    title: "岛上音乐会",
  },
  {
    src: "assets/heimablidni.jpg",
    title: "Heimablídni",
  },
  {
    src: "assets/sea-taste.jpg",
    title: "海上风味",
  },
  {
    src: "assets/arrive-by-air.webp",
    title: "从空中看见法罗",
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

  const caption = row.querySelector("[data-tilt-caption]");

  track.innerHTML = TILT_ASSETS.map(
    (item, i) => `
      <button type="button" class="tilt-slide" data-tilt-index="${i}">
        <span class="tilt-face">
          <img src="${item.src}" alt="${item.title}" />
        </span>
      </button>`
  ).join("");

  dots.innerHTML = TILT_ASSETS.map(
    (_, i) =>
      `<button type="button" class="tilt-dot" data-tilt-index="${i}" aria-label="第 ${i + 1} 张"></button>`
  ).join("");

  function render(animate) {
    const total = TILT_ASSETS.length;
    caption.textContent = TILT_ASSETS[active].title;
    track.querySelectorAll(".tilt-slide").forEach((el, i) => {
      let offset = i - active;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      const previous = Number(el.dataset.offset);
      const jump = !animate || (Number.isFinite(previous) && Math.abs(offset - previous) > 1);
      el.dataset.offset = String(offset);
      el.style.setProperty("--offset", String(offset));
      el.style.zIndex = String(30 - Math.abs(offset));
      el.classList.toggle("is-active", offset === 0);
      el.classList.toggle("is-far", Math.abs(offset) > 4);
      el.classList.toggle("is-jump", jump);
      el.setAttribute("aria-current", offset === 0 ? "true" : "false");
      if (jump) requestAnimationFrame(() => el.classList.remove("is-jump"));
    });
    dots.querySelectorAll(".tilt-dot").forEach((el, i) => {
      const on = i === active;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-current", on ? "true" : "false");
    });
  }

  function go(index) {
    const total = TILT_ASSETS.length;
    active = ((index % total) + total) % total;
    render(true);
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

function weatherLabel(code) {
  const n = Number(code);
  if (n === 0) return "晴朗";
  if (n <= 3) return "多云";
  if (n === 45 || n === 48) return "有雾";
  if (n <= 57) return "毛毛雨";
  if (n <= 67) return "降雨";
  if (n <= 77) return "降雪";
  if (n <= 82) return "阵雨";
  if (n <= 86) return "阵雪";
  if (n <= 99) return "雷雨";
  return "多变";
}

function formatFaroeTime(iso) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Atlantic/Faroe",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function weekdayLabel(dateStr) {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return days[new Date(`${dateStr}T12:00:00`).getDay()];
}

async function loadHikingWeather(lat, lon, place) {
  const nowBox = document.getElementById("weatherNow");
  const weekBox = document.getElementById("weatherWeek");
  if (!nowBox || !weekBox) return;
  nowBox.textContent = "正在获取实时天气……";
  weekBox.innerHTML = "";
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,precipitation,cloud_cover,relative_humidity_2m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
    wind_speed_unit: "ms",
    timezone: "Atlantic/Faroe",
    forecast_days: "7",
  });
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!res.ok) throw new Error("weather");
    const data = await res.json();
    const c = data.current;
    nowBox.innerHTML = `
      <div class="weather-main">
        <p class="weather-place">${place}</p>
        <p class="weather-temp">${Math.round(c.temperature_2m)}°</p>
        <p class="weather-desc">${weatherLabel(c.weather_code)}</p>
      </div>
      <ul class="weather-meta">
        <li>体感 ${Math.round(c.apparent_temperature)}°</li>
        <li>风力 ${Math.round(c.wind_speed_10m)} m/s</li>
        <li>阵风 ${Math.round(c.wind_gusts_10m)} m/s</li>
        <li>湿度 ${Math.round(c.relative_humidity_2m)}%</li>
        <li>云量 ${Math.round(c.cloud_cover)}%</li>
        <li>降水 ${Number(c.precipitation).toFixed(1)} mm</li>
      </ul>
      <p class="weather-updated">更新于法罗时间 ${formatFaroeTime(c.time)}</p>
    `;
    weekBox.innerHTML = data.daily.time
      .map((day, i) => {
        const today = i === 0 ? "今天" : weekdayLabel(day);
        return `
          <article class="forecast-card">
            <p class="forecast-day">${today}</p>
            <p class="forecast-desc">${weatherLabel(data.daily.weather_code[i])}</p>
            <p class="forecast-temp">${Math.round(data.daily.temperature_2m_max[i])}° / ${Math.round(data.daily.temperature_2m_min[i])}°</p>
            <p>降水概率 ${data.daily.precipitation_probability_max[i] ?? 0}%</p>
            <p>风力 ${Math.round(data.daily.wind_speed_10m_max[i])} m/s</p>
          </article>
        `;
      })
      .join("");
  } catch {
    nowBox.innerHTML = `
      <p>暂时无法获取实时天气。请改看官方预报
        <a class="text-link" href="https://www.vedur.fo" target="_blank" rel="noopener">vedur.fo</a>
        或
        <a class="text-link" href="https://www.yr.no" target="_blank" rel="noopener">yr.no</a>。
      </p>
    `;
  }
}

function initHikingWeather() {
  const nowBox = document.getElementById("weatherNow");
  if (!nowBox) return;
  const buttons = [...document.querySelectorAll("#weatherPlaces [data-place]")];
  const loadActive = () => {
    const btn = buttons.find((el) => el.classList.contains("active")) || buttons[0];
    loadHikingWeather(btn.dataset.lat, btn.dataset.lon, btn.dataset.place);
  };
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((el) => el.classList.remove("active"));
      btn.classList.add("active");
      loadActive();
    });
  });
  loadActive();
  setInterval(loadActive, 15 * 60 * 1000);
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
  initHikingWeather();
});
