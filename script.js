// VELORA SKYDINING — interactions

// === Loader ===
window.addEventListener('load', () => {
  const l = document.querySelector('.loader');
  if (l) setTimeout(() => l.classList.add('gone'), 600);
});

// === Custom cursor ===
const cursor = document.querySelector('.cursor');
const dot = document.querySelector('.cursor-dot');
const glow = document.querySelector('.mouse-glow');
if (cursor) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    if (glow) { glow.style.left = mx + 'px'; glow.style.top = my + 'px'; }
  });
  const loop = () => {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
    requestAnimationFrame(loop);
  };
  loop();
  document.querySelectorAll('a,button,.dish,.chef,.g-item,.table-opt,.filter,input,select,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// === Navbar scroll ===
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
});

// === Mobile menu ===
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
if (burger) burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// === Active link ===
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

// === Particles ===
const pc = document.querySelector('.particles');
if (pc) {
  const colors = ['#3aa8ff', '#a259ff', '#ff7a1a', '#ff5fa2', '#e9c46a'];
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = (10 + Math.random() * 18) + 's';
    s.style.animationDelay = (Math.random() * -20) + 's';
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    s.style.boxShadow = `0 0 14px ${s.style.background}`;
    s.style.width = s.style.height = (2 + Math.random() * 4) + 'px';
    pc.appendChild(s);
  }
}

// === Reveal on scroll ===
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// === 3D tilt on cards ===
document.querySelectorAll('.dish, .chef, .float-card, .event').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// === Counters ===
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver(es => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const dur = 1600; const start = performance.now();
    const tick = t => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.floor(target * (0.2 + 0.8 * (1 - Math.pow(1 - p, 3)))) + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + (el.dataset.suffix || '');
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cio.observe(c));

// === Menu filters & search ===
const filterBtns = document.querySelectorAll('.filter');
const dishCards = document.querySelectorAll('.dish[data-cat]');
const searchInput = document.querySelector('#menuSearch');
let activeFilter = 'all';
function applyFilters() {
  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
  dishCards.forEach(d => {
    const matchCat = activeFilter === 'all' || d.dataset.cat === activeFilter;
    const matchQ = !q || d.textContent.toLowerCase().includes(q);
    d.style.display = matchCat && matchQ ? '' : 'none';
  });
}
filterBtns.forEach(b => b.addEventListener('click', () => {
  filterBtns.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  activeFilter = b.dataset.filter;
  applyFilters();
}));
if (searchInput) searchInput.addEventListener('input', applyFilters);

// === Add to order toast ===
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<div class="ic">✓</div><span></span>`;
    document.body.appendChild(t);
  }
  t.querySelector('span').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2600);
}
document.addEventListener('click', e => {
  const b = e.target.closest('.add-btn');
  if (b) {
    const name = b.dataset.name || 'Dish';
    toast(`${name} added to your order`);
  }
});

// === Lightbox ===
const lb = document.querySelector('.lightbox');
if (lb) {
  document.querySelectorAll('.g-item').forEach(g => {
    g.addEventListener('click', () => {
      const img = g.querySelector('img');
      lb.querySelector('img').src = img.src;
      lb.classList.add('active');
    });
  });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('close')) lb.classList.remove('active'); });
}

// === Guest counter ===
const gc = document.querySelector('.guest-counter');
if (gc) {
  const val = gc.querySelector('span');
  let n = 2;
  gc.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    n = Math.max(1, Math.min(20, n + (b.dataset.act === 'plus' ? 1 : -1)));
    val.textContent = n + (n === 1 ? ' guest' : ' guests');
  }));
}
document.querySelectorAll('.table-opt').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.table-opt').forEach(x => x.classList.remove('selected'));
    t.classList.add('selected');
  });
});

// === Reservation submit ===
const resForm = document.querySelector('#resForm');
if (resForm) resForm.addEventListener('submit', e => {
  e.preventDefault();
  toast('Reservation confirmed — see you soon ✨');
  resForm.reset();
});

// === Contact form ===
const cForm = document.querySelector('#contactForm');
if (cForm) cForm.addEventListener('submit', e => {
  e.preventDefault();
  toast('Message sent — we\'ll reply within 24h');
  cForm.reset();
});

// === Newsletter ===
document.querySelectorAll('.news-form').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  toast('Welcome to the Velora circle ✦');
  f.reset();
}));

// === Countdown ===
document.querySelectorAll('.countdown').forEach(cd => {
  const target = new Date(cd.dataset.target).getTime();
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const boxes = cd.querySelectorAll('.cd-n');
    if (boxes.length === 4) { boxes[0].textContent = d; boxes[1].textContent = h; boxes[2].textContent = m; boxes[3].textContent = s; }
  };
  tick(); setInterval(tick, 1000);
});

// === Hero parallax ===
const visual = document.querySelector('.hero-visual');
if (visual) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    visual.querySelectorAll('.float-card, .float-badge').forEach((el, i) => {
      const f = (i + 1) * 0.4;
      el.style.translate = `${x * f}px ${y * f}px`;
    });
  });
}

// === AI chat ===
const aiFab = document.querySelector('.ai-fab');
const aiPanel = document.querySelector('.ai-panel');
if (aiFab) {
  aiFab.addEventListener('click', () => aiPanel.classList.toggle('open'));
  const input = aiPanel.querySelector('input');
  const msgs = aiPanel.querySelector('.ai-msgs');
  const send = aiPanel.querySelector('button');
  const replies = [
    "Our signature tasting menu pairs beautifully with the rooftop sunset view ✨",
    "We have rooftop tables open this Friday at 8pm — shall I hold one?",
    "Tonight's chef special is Wagyu A5 with truffle foam and yuzu pearls.",
    "Yes — we host private events for up to 60 guests in the Skylight Lounge.",
    "Smart casual works perfectly. Our crowd dresses sharp but relaxed."
  ];
  const handle = () => {
    const v = input.value.trim(); if (!v) return;
    const u = document.createElement('div'); u.className = 'msg me'; u.textContent = v; msgs.appendChild(u);
    input.value = '';
    setTimeout(() => {
      const b = document.createElement('div'); b.className = 'msg bot';
      b.textContent = replies[Math.floor(Math.random() * replies.length)];
      msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight;
    }, 600);
    msgs.scrollTop = msgs.scrollHeight;
  };
  send.addEventListener('click', handle);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handle(); });
}
