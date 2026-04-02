/* ══════════════════════════════════════════════════════
   ҚЫЗ ҰЗАТУ — JavaScript
   ══════════════════════════════════════════════════════ */

'use strict';

/* ── КОНФИГУРАЦИЯ ──────────────────────────────────────
   Осы жерді өзіңіздің мәліметтеріңізге ауыстырыңыз
   ────────────────────────────────────────────────────── */
const CONFIG = {
  // Той күні мен уақыты
  weddingDate: new Date('2025-06-20T14:00:00'),

  // Google Apps Script URL (орнатқаннан кейін қойыңыз)
  appsScriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',

  // Той мәліметтері
  venueName: '«Астана» Мейрамханасы',
  venueAddr: 'Алматы қаласы, Абай даңғылы, 150',
};

/* ══════════════════════════════════════════════════════
   1. КОНВЕРТ АНИМАЦИЯСЫ
   ══════════════════════════════════════════════════════ */
function openEnvelope() {
  const envelope = document.getElementById('envelope');
  const letterInside = document.getElementById('letterInside');
  const screen = document.getElementById('envelopeScreen');
  const main = document.getElementById('mainContent');

  if (envelope.classList.contains('opening')) return;

  // Конверт ашылу
  envelope.classList.add('opening');
  envelope.style.animation = 'none'; // Float тоқтату

  // Хат жоғары шығу
  setTimeout(() => {
    letterInside.classList.add('rising');
    letterInside.style.opacity = '1';
  }, 300);

  // Негізгі мазмұнға өту
  setTimeout(() => {
    screen.style.transition = 'opacity 0.8s ease';
    screen.style.opacity = '0';
  }, 1800);

  setTimeout(() => {
    screen.style.display = 'none';
    main.classList.remove('hidden');
    main.style.opacity = '0';
    main.style.transition = 'opacity 0.6s ease';
    setTimeout(() => { main.style.opacity = '1'; }, 50);

    // Инициализация бастау
    initMain();
  }, 2600);
}

/* ══════════════════════════════════════════════════════
   2. НЕГІЗГІ ИНИЦИАЛИЗАЦИЯ
   ══════════════════════════════════════════════════════ */
function initMain() {
  createPetals();
  startCountdown();
  initParallax();
  initScrollReveal();
  initRsvpForm();
}

/* ══════════════════════════════════════════════════════
   3. ГҮЛ ЖАПЫРАҚТАРЫ
   ══════════════════════════════════════════════════════ */
function createPetals() {
  const container = document.getElementById('petals');
  if (!container) return;

  const colors = ['#E8C4B8','#F2D4CC','#DEB8B0','#F5DDD8','#D4AF37','#F0D070','#E8D4A0'];
  const count = window.innerWidth < 600 ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';

    const size = 8 + Math.random() * 14;
    const left = Math.random() * 100;
    const dur  = 6 + Math.random() * 9;
    const delay = -Math.random() * 10; // Бірден ұшып жүрсін
    const color = colors[Math.floor(Math.random() * colors.length)];
    const borderR = `${40 + Math.random() * 20}% ${Math.random() * 15}% ${40 + Math.random() * 20}% ${Math.random() * 15}%`;

    petal.style.cssText = [
      `width:${size}px`,
      `height:${size * 0.65}px`,
      `left:${left}%`,
      `background:${color}`,
      `border-radius:${borderR}`,
      `animation-duration:${dur}s`,
      `animation-delay:${delay}s`,
      `opacity:0`,
    ].join(';');

    container.appendChild(petal);
  }
}

/* ══════════════════════════════════════════════════════
   4. ПАРАЛЛАКС
   ══════════════════════════════════════════════════════ */
function initParallax() {
  const layers = document.querySelectorAll('.parallax-layer');
  if (!layers.length) return;

  // Mobile-да жеңіл параллакс
  const isMobile = window.innerWidth < 600;
  if (isMobile) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const hero = document.getElementById('hero');
        if (!hero) { ticking = false; return; }

        const heroHeight = hero.offsetHeight;
        const progress = Math.min(scrollY / heroHeight, 1);

        layers.forEach(layer => {
          const speed = parseFloat(layer.dataset.speed) || 0.3;
          const offset = scrollY * speed * 0.6;
          layer.style.transform = `translateY(${offset}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════
   5. КЕРІ САНАҚ
   ══════════════════════════════════════════════════════ */
function startCountdown() {
  const elDays  = document.getElementById('t-days');
  const elHours = document.getElementById('t-hours');
  const elMins  = document.getElementById('t-mins');
  const elSecs  = document.getElementById('t-secs');

  if (!elDays) return;

  let prevVals = {};

  function updateNum(el, val) {
    const str = String(Math.floor(val)).padStart(2, '0');
    if (prevVals[el.id] !== str) {
      el.textContent = str;
      el.style.animation = 'none';
      void el.offsetWidth; // reflow
      el.style.animation = 'cdPulse 0.3s ease';
      prevVals[el.id] = str;
    }
  }

  function tick() {
    const diff = CONFIG.weddingDate - new Date();
    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      return;
    }

    updateNum(elDays,  diff / 86400000);
    updateNum(elHours, (diff % 86400000) / 3600000);
    updateNum(elMins,  (diff % 3600000) / 60000);
    updateNum(elSecs,  (diff % 60000) / 1000);
  }

  tick();
  setInterval(tick, 1000);
}

/* ══════════════════════════════════════════════════════
   6. SCROLL REVEAL
   ══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════
   7. RSVP ФОРМА
   ══════════════════════════════════════════════════════ */
function initRsvpForm() {
  const form = document.getElementById('rsvpForm');
  const btn  = document.getElementById('submitBtn');
  const msg  = document.getElementById('formMsg');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Деректерді жинау
    const data = {
      timestamp:  new Date().toLocaleString('kk-KZ'),
      guestName:  form.guestName.value.trim(),
      guestPhone: form.guestPhone.value.trim(),
      status:     form.querySelector('input[name="status"]:checked')?.value || '—',
      guestCount: form.guestCount.value,
      guestWish:  form.guestWish.value.trim(),
    };

    // Тексеру
    if (!data.guestName) {
      showMsg(msg, 'Аты-жөніңізді енгізіңіз', 'error');
      return;
    }
    if (!form.querySelector('input[name="status"]:checked')) {
      showMsg(msg, 'Келу статусын таңдаңыз', 'error');
      return;
    }

    // Жіберу
    btn.disabled = true;
    btn.textContent = 'Жіберілуде...';

    try {
      if (CONFIG.appsScriptUrl && CONFIG.appsScriptUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        await fetch(CONFIG.appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        // Demo режим
        console.log('RSVP (demo):', data);
        await new Promise(r => setTimeout(r, 800));
      }

      showMsg(msg, 'Рахмет! Жауабыңыз қабылданды ✦', 'success');
      form.reset();
    } catch (err) {
      console.error(err);
      showMsg(msg, 'Қате шықты. Қайталап көріңіз.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Растауды жіберу';
    }
  });
}

function showMsg(el, text, type) {
  el.textContent = text;
  el.className = `form-msg ${type}`;
  setTimeout(() => { el.textContent = ''; el.className = 'form-msg'; }, 5000);
}

/* ══════════════════════════════════════════════════════
   8. SCROLL: NAV ЭФФЕКТ (болашақта қажет болса)
   ══════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  // Placeholder nav стикки болса
}, { passive: true });


var isPlaying = false;

function toggleMusic() {
  var audio = document.getElementById('bgMusic');
  var icon  = document.getElementById('musicIcon');
  if (isPlaying) {
    audio.pause();
    icon.textContent = '▶';
    isPlaying = false;
  } else {
    audio.volume = 0.35;
    audio.play();
    icon.textContent = '⏸';
    isPlaying = true;
  }
}