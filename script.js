'use strict';

/* ══════════════════════════════════════════════════════
   КОНФИГУРАЦИЯ — осыны өзіңіздің мәліметтеріңізге өзгертіңіз
   ══════════════════════════════════════════════════════ */
var CONFIG = {
  weddingDate:    new Date('2025-06-20T14:00:00'),
  appsScriptUrl:  'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
};

/* ══════════════════════════════════════════════════════
   МУЗЫКА
   ══════════════════════════════════════════════════════ */
var isPlaying = false;

function playMusic() {
  var audio = document.getElementById('bgMusic');
  if (!audio) return;
  audio.volume = 0.32;
  var p = audio.play();
  if (p !== undefined) {
    p.then(function() {
      isPlaying = true;
      updateMusicBtn(true);
    }).catch(function(e) {
      console.log('Музыка қосылмады:', e);
    });
  }
}

function toggleMusic() {
  var audio = document.getElementById('bgMusic');
  if (!audio) return;
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    updateMusicBtn(false);
  } else {
    playMusic();
  }
}

function updateMusicBtn(playing) {
  var btn       = document.getElementById('musicBtn');
  var iconPlay  = document.getElementById('iconPlay');
  var iconBars  = document.getElementById('iconBars');
  if (!btn) return;
  if (playing) {
    btn.classList.add('playing');
    if (iconPlay) iconPlay.style.display = 'none';
    if (iconBars) iconBars.style.display = 'flex';
  } else {
    btn.classList.remove('playing');
    if (iconPlay) iconPlay.style.display = 'block';
    if (iconBars) iconBars.style.display = 'none';
  }
}

/* ══════════════════════════════════════════════════════
   КОНВЕРТ АШУ
   ══════════════════════════════════════════════════════ */
function openEnvelope() {
  var envelope     = document.getElementById('envelope');
  var letterInside = document.getElementById('letterInside');
  var screen       = document.getElementById('envelopeScreen');
  var main         = document.getElementById('mainContent');

  if (!envelope || envelope.classList.contains('opening')) return;

  // Конверт ашылу анимациясы
  envelope.classList.add('opening');
  envelope.style.animation = 'none';

  // Хат жоғары шығу
  setTimeout(function() {
    if (letterInside) {
      letterInside.classList.add('rising');
      letterInside.style.opacity = '1';
    }
  }, 300);

  // Экран жасырылу
  setTimeout(function() {
    if (screen) {
      screen.style.transition = 'opacity 0.8s ease';
      screen.style.opacity = '0';
    }
  }, 1800);

  // Негізгі мазмұн ашылу
  setTimeout(function() {
    if (screen) screen.style.display = 'none';
    if (main) {
      main.classList.remove('hidden');
      main.style.opacity = '0';
      main.style.transition = 'opacity 0.6s ease';
      setTimeout(function() { main.style.opacity = '1'; }, 50);
    }

    // Конверт ашылған соң музыка қосылу
    setTimeout(playMusic, 600);

    // Негізгі функциялар іске қосылу
    initMain();
  }, 2600);
}

/* ══════════════════════════════════════════════════════
   НЕГІЗГІ ИНИЦИАЛИЗАЦИЯ
   ══════════════════════════════════════════════════════ */
function initMain() {
  createPetals();
  startCountdown();
  initParallax();
  initScrollReveal();
  initRsvpForm();
}

/* ══════════════════════════════════════════════════════
   ГҮЛ ЖАПЫРАҚТАРЫ
   ══════════════════════════════════════════════════════ */
function createPetals() {
  var container = document.getElementById('petals');
  if (!container) return;

  var colors = ['#E8C4B8','#F2D4CC','#DEB8B0','#F5DDD8','#D4AF37','#F0D070','#E8D4A0'];
  var count  = window.innerWidth < 600 ? 10 : 18;

  for (var i = 0; i < count; i++) {
    var petal = document.createElement('div');
    petal.className = 'petal';
    var size  = 8 + Math.random() * 13;
    var left  = Math.random() * 100;
    var dur   = 6 + Math.random() * 9;
    var delay = -Math.random() * 10;
    var color = colors[Math.floor(Math.random() * colors.length)];
    var br    = (40 + Math.random()*18)+'% '+(Math.random()*14)+'% '+(40+Math.random()*18)+'% '+(Math.random()*14)+'%';
    petal.style.cssText = [
      'width:'+size+'px',
      'height:'+(size*0.65)+'px',
      'left:'+left+'%',
      'background:'+color,
      'border-radius:'+br,
      'animation-duration:'+dur+'s',
      'animation-delay:'+delay+'s',
      'opacity:0'
    ].join(';');
    container.appendChild(petal);
  }
}

/* ══════════════════════════════════════════════════════
   ПАРАЛЛАКС
   ══════════════════════════════════════════════════════ */
function initParallax() {
  if (window.innerWidth < 600) return;
  var layers = document.querySelectorAll('.parallax-layer');
  if (!layers.length) return;

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var scrollY = window.scrollY;
        var hero    = document.getElementById('hero');
        if (!hero) { ticking = false; return; }
        var heroH   = hero.offsetHeight;
        if (scrollY > heroH) { ticking = false; return; }
        layers.forEach(function(layer) {
          var speed = parseFloat(layer.dataset.speed) || 0.3;
          layer.style.transform = 'translateY(' + (scrollY * speed * 0.55) + 'px)';
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════
   КЕРІ САНАҚ
   ══════════════════════════════════════════════════════ */
function startCountdown() {
  var elD = document.getElementById('t-days');
  var elH = document.getElementById('t-hours');
  var elM = document.getElementById('t-mins');
  var elS = document.getElementById('t-secs');
  if (!elD) return;

  var prev = {};

  function upd(el, val) {
    var s = String(Math.floor(val)).padStart(2,'0');
    if (prev[el.id] !== s) {
      el.textContent = s;
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = 'cdFlip 0.3s ease';
      prev[el.id] = s;
    }
  }

  function tick() {
    var d = CONFIG.weddingDate - new Date();
    if (d <= 0) {
      [elD,elH,elM,elS].forEach(function(e){ e.textContent='00'; });
      return;
    }
    upd(elD, d / 86400000);
    upd(elH, (d % 86400000) / 3600000);
    upd(elM, (d % 3600000)  / 60000);
    upd(elS, (d % 60000)    / 1000);
  }

  tick();
  setInterval(tick, 1000);
}

/* ══════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════ */
function initScrollReveal() {
  var els = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
  if (!els.length) return;

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(function(el) { io.observe(el); });
}

/* ══════════════════════════════════════════════════════
   RSVP ФОРМА
   ══════════════════════════════════════════════════════ */
function initRsvpForm() {
  var form = document.getElementById('rsvpForm');
  var btn  = document.getElementById('submitBtn');
  var msg  = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var checked = form.querySelector('input[name="status"]:checked');
    if (!form.guestName.value.trim()) {
      showMsg(msg, 'Аты-жөніңізді енгізіңіз', 'error'); return;
    }
    if (!checked) {
      showMsg(msg, 'Келу статусын таңдаңыз', 'error'); return;
    }

    var data = {
      timestamp:  new Date().toLocaleString('kk-KZ'),
      guestName:  form.guestName.value.trim(),
      guestPhone: form.guestPhone.value.trim(),
      status:     checked.value,
      guestCount: form.guestCount.value,
      guestWish:  form.guestWish.value.trim(),
    };

    btn.disabled = true;
    btn.textContent = 'Жіберілуде...';

    function finish(ok) {
      btn.disabled = false;
      btn.textContent = 'Растауды жіберу';
      if (ok) {
        showMsg(msg, 'Рахмет! Жауабыңыз қабылданды ✦', 'success');
        form.reset();
      } else {
        showMsg(msg, 'Қате шықты. Қайталап көріңіз.', 'error');
      }
    }

    if (CONFIG.appsScriptUrl && CONFIG.appsScriptUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      fetch(CONFIG.appsScriptUrl, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function() { finish(true); })
        .catch(function()  { finish(false); });
    } else {
      console.log('RSVP (demo):', data);
      setTimeout(function() { finish(true); }, 700);
    }
  });
}

function showMsg(el, text, type) {
  el.textContent = text;
  el.className = 'form-msg ' + type;
  setTimeout(function() { el.textContent = ''; el.className = 'form-msg'; }, 5000);
}