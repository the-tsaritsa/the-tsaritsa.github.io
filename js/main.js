(function () {
  'use strict';

  const TARGET_DATE = Date.UTC(2026, 11, 16, 4, 0, 0);

  const PATCHES = [
    { version: '6.7', start: Date.UTC(2026, 6, 1), note: 'The long winter' },
    { version: '7.0', start: Date.UTC(2026, 7, 12), note: 'Snezhnaya opens' },
    { version: '7.1', start: Date.UTC(2026, 8, 23), note: 'The cold deepens' },
    { version: '7.2', start: Date.UTC(2026, 10, 4), note: 'Storm gathers' },
    { version: '7.3', start: Date.UTC(2026, 11, 16), note: 'The Tsaritsa arrives' }
  ];

  const QUOTES = [
    { text: 'Her Royal Highness the Tsaritsa is actually a gentle soul. Too gentle, in fact, and that\u2019s why she had to harden herself. Likewise, she declared war against the whole world only because she dreams of peace.', attribution: 'Tartaglia' },
    { text: 'Everyone praises her for her kindness and benevolence, but they forget that love is also a form of sin. What if she\u2019s just trying to compensate for something?', attribution: 'The Wanderer' },
    { text: 'When I was imprisoned, it was the Tsaritsa who pardoned me and gave me the title of Harbinger. I could sense she was a person of true sincerity and compassion, unlike all those pompous hypocrites with their posturing and rhetoric.', attribution: 'Arlecchino' },
    { text: 'The first time I sang in the gardens of Zapolyarny Palace, the Tsaritsa happened to pass by. She stood there, silent and motionless, like a statue with no expression carved onto the face.', attribution: 'Columbina' },
    { text: 'Even I still get bothered by the errors in my heart, but Her Majesty the Tsaritsa... How did she manage to freeze her emotions so completely?', attribution: 'Sandrone' },
    { text: 'Although Nod-Krai is technically a part of Snezhnaya, you won\u2019t hear us habitually refer to "Her Majesty, the Tsaritsa." ...Who\u2019s "us"? Hehe... The Lightkeepers, of course... Who else?', attribution: 'Flins' },
    { text: 'A tomb and birch trees, the Tsar\u2019s final tokens of affection. That which I set in motion, I shall see to an end.', attribution: 'Laws of the Bitter Frost' }
  ];

  const $ = (id) => document.getElementById(id);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const countdownEl = $('countdown');
  const arrivedEl = $('arrived-message');
  const eyebrowEl = document.querySelector('.countdown-eyebrow');
  const units = {
    days: $('cd-days'),
    hours: $('cd-hours'),
    minutes: $('cd-minutes'),
    seconds: $('cd-seconds')
  };

  const pad = (n) => String(n).padStart(2, '0');

  let lastValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };
  let arrived = false;

  function setNum(el, value) {
    const str = pad(value);
    if (el.textContent !== str) {
      el.classList.remove('flip');
      void el.offsetWidth;
      el.classList.add('flip');
      el.textContent = str;
    }
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      if (!arrived) {
        arrived = true;
        eyebrowEl.textContent = 'The long winter is over';
        countdownEl.hidden = true;
        arrivedEl.hidden = false;
      }
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (days !== lastValues.days) {
      setNum(units.days, days);
      lastValues.days = days;
    }
    if (hours !== lastValues.hours) {
      setNum(units.hours, hours);
      lastValues.hours = hours;
    }
    if (minutes !== lastValues.minutes) {
      setNum(units.minutes, minutes);
      lastValues.minutes = minutes;
    }
    if (seconds !== lastValues.seconds) {
      setNum(units.seconds, seconds);
      lastValues.seconds = seconds;
    }
  }

  const body = document.body;
  const video = $('bg-video');
  const music = $('bg-music');
  const musicBtn = $('music-toggle');
  const videoBtn = $('video-toggle');

  let videoFailed = false;

  function showVideo() {
    body.classList.add('video-ready');
  }

  video.addEventListener('canplaythrough', showVideo);
  video.addEventListener('playing', showVideo);
  video.addEventListener('canplay', function () {
    if (video.paused) {
      video.play().catch(function () {});
    }
  });

  video.addEventListener('error', function () {
    videoFailed = true;
    video.removeAttribute('autoplay');
    video.pause();
    body.classList.add('video-off');
    videoBtn.classList.add('muted');
    videoBtn.setAttribute('aria-pressed', 'true');
    videoBtn.setAttribute('aria-label', 'Video background unavailable');
  }, true);

  function startMusic() {
    if (!music.paused) return;
    music.play().catch(function () {});
    musicBtn.classList.remove('muted');
    musicBtn.setAttribute('aria-pressed', 'true');
    musicBtn.setAttribute('aria-label', 'Pause music');
  }

  function stopMusic() {
    music.pause();
    musicBtn.classList.add('muted');
    musicBtn.setAttribute('aria-pressed', 'false');
    musicBtn.setAttribute('aria-label', 'Play music');
  }

  musicBtn.addEventListener('click', function () {
    if (music.paused) {
      startMusic();
    } else {
      stopMusic();
    }
  });

  startMusic();

  const startOnInteraction = function () {
    if (music.paused) startMusic();
    window.removeEventListener('pointerdown', startOnInteraction);
    window.removeEventListener('keydown', startOnInteraction);
    window.removeEventListener('touchstart', startOnInteraction);
    window.removeEventListener('wheel', startOnInteraction);
  };
  window.addEventListener('pointerdown', startOnInteraction);
  window.addEventListener('keydown', startOnInteraction);
  window.addEventListener('touchstart', startOnInteraction);
  window.addEventListener('wheel', startOnInteraction);

  videoBtn.addEventListener('click', function () {
    if (videoFailed) return;
    const off = body.classList.toggle('video-off');
    if (off) {
      videoBtn.classList.add('muted');
      videoBtn.setAttribute('aria-pressed', 'true');
      videoBtn.setAttribute('aria-label', 'Show video background');
    } else {
      videoBtn.classList.remove('muted');
      videoBtn.setAttribute('aria-pressed', 'false');
      videoBtn.setAttribute('aria-label', 'Hide video background');
    }
  });

  const quoteText = $('quote-text');
  const quoteAttr = $('quote-attribution');
  let quoteIndex = 0;
  let quoteOrder = [];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function renderQuote(i) {
    quoteText.textContent = quoteOrder[i].text;
    quoteAttr.textContent = '\u2014 ' + quoteOrder[i].attribution;
  }

  function cycleQuote() {
    quoteText.classList.add('is-hidden');
    quoteAttr.classList.add('is-hidden');
    setTimeout(function () {
      quoteIndex = (quoteIndex + 1) % quoteOrder.length;
      renderQuote(quoteIndex);
      quoteText.classList.remove('is-hidden');
      quoteAttr.classList.remove('is-hidden');
    }, 800);
  }

  quoteOrder = shuffle(QUOTES);
  renderQuote(0);
  setInterval(cycleQuote, 7000);

  const timelineEl = $('timeline');

  function patchStatus(p, now) {
    if (p.version === '7.3') return 'final';
    return p.start <= now ? 'past' : 'future';
  }

  const SNOWFLAKE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<line x1="12" y1="2" x2="12" y2="22"/>' +
    '<line x1="4" y1="6.5" x2="20" y2="17.5"/>' +
    '<line x1="20" y1="6.5" x2="4" y2="17.5"/>' +
    '</svg>';

  function daysUntil(targetMs) {
    return Math.ceil((targetMs - Date.now()) / 86400000);
  }

  function renderStopDate(stop, p, now) {
    const date = stop.querySelector('.stop-date');
    if (!date) return;

    let currentIndex = -1;
    PATCHES.forEach(function (x, i) {
      if (x.start <= now) currentIndex = i;
    });
    const isCurrent = currentIndex >= 0 && PATCHES[currentIndex] === p;
    const next = isCurrent ? PATCHES[currentIndex + 1] : null;

    if (isCurrent && p.version !== '7.3' && next) {
      date.textContent = daysUntil(next.start) + 'd left';
      return;
    }

    const d = new Date(p.start);
    const dateStr = d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    date.textContent = p.version === '7.3'
      ? dateStr + ', ' + d.getFullYear()
      : dateStr;
  }

  function buildTimeline() {
    timelineEl.innerHTML = '';

    const stops = document.createElement('div');
    stops.className = 'road-stops';

    PATCHES.forEach(function (p) {
      const stop = document.createElement('div');
      stop.className = 'road-stop';
      stop.dataset.version = p.version;

      const version = document.createElement('span');
      version.className = 'stop-version';
      version.textContent = p.version;

      const dot = document.createElement('span');
      dot.className = 'stop-dot';
      if (p.version === '7.3') {
        dot.innerHTML = SNOWFLAKE_SVG;
      }

      const date = document.createElement('span');
      date.className = 'stop-date';

      stop.appendChild(version);
      stop.appendChild(dot);
      stop.appendChild(date);
      stops.appendChild(stop);
    });

    timelineEl.appendChild(stops);
    refreshTimelineStatus();
  }

  function refreshTimelineStatus() {
    const now = Date.now();
    let currentIndex = -1;
    PATCHES.forEach(function (p, i) {
      if (p.start <= now) currentIndex = i;
    });

    const stops = timelineEl.querySelectorAll('.road-stop');
    stops.forEach(function (stop) {
      const p = PATCHES.find(function (x) { return x.version === stop.dataset.version; });
      if (!p) return;
      const i = PATCHES.indexOf(p);

      stop.classList.toggle('is-gone', currentIndex >= 0 && i < currentIndex);
      stop.classList.remove('past', 'current', 'future', 'final');
      stop.classList.add(patchStatus(p, now));
      if (i === currentIndex) stop.classList.add('current');
      renderStopDate(stop, p, now);
    });
  }

  const canvas = $('snow-canvas');
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  let flakes = [];
  let sparkles = [];
  let running = true;

  function makeFlake(initial) {
    return {
      x: Math.random() * canvas.clientWidth,
      y: initial ? Math.random() * canvas.clientHeight : -8,
      r: 0.8 + Math.random() * 2.6,
      vY: 0.3 + Math.random() * 0.9,
      amp: 12 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.9,
      opacity: 0.25 + Math.random() * 0.6
    };
  }

  function resizeSnow() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(40, Math.min(110, Math.round(window.innerWidth / 16)));
    flakes = Array.from({ length: count }, function () { return makeFlake(true); });
  }

  function spawnSparkle() {
    if (sparkles.length >= 3) return;
    const size = 10 + Math.random() * 26;
    sparkles.push({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight * 0.6,
      size: size,
      life: 0,
      maxLife: 160 + Math.random() * 140,
      rot: Math.random() * Math.PI
    });
  }

  function drawSparkle(s) {
    const t = s.life / s.maxLife;
    const alpha = Math.sin(t * Math.PI) * 0.8;
    const r = s.size * (0.6 + t * 0.6);
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.strokeStyle = 'rgba(200, 235, 250, ' + alpha.toFixed(3) + ')';
    ctx.lineWidth = 1;
    ctx.shadowColor = 'rgba(126, 200, 227, 0.8)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.stroke();
    ctx.restore();
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    flakes.forEach(function (f) {
      f.phase += f.speed * 0.016;
      const drift = Math.sin(f.phase) * f.amp * 0.016;
      f.x += drift;
      f.y += f.vY * (reduceMotion ? 0.1 : 1);

      if (f.y > canvas.clientHeight + 10) {
        Object.assign(f, makeFlake(false));
      }
      if (f.x > canvas.clientWidth + 20) f.x = -20;
      if (f.x < -20) f.x = canvas.clientWidth + 20;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(238, 244, 248, ' + f.opacity.toFixed(3) + ')';
      ctx.fill();
    });

    if (!reduceMotion && Math.random() < 0.02) spawnSparkle();

    sparkles.forEach(function (s) {
      s.life += 1;
      drawSparkle(s);
    });
    sparkles = sparkles.filter(function (s) { return s.life < s.maxLife; });

    requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });

  window.addEventListener('resize', resizeSnow);

  resizeSnow();
  tick();

  updateCountdown();
  setInterval(updateCountdown, 200);

  buildTimeline();
  setInterval(refreshTimelineStatus, 60000);
})();
