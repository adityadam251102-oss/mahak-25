document.addEventListener('DOMContentLoaded', () => {

  // Elements
  const beginBtn = document.getElementById('beginBtn');
  const landing = document.getElementById('landing');
  const experience = document.getElementById('experience');
  const poemLines = Array.from(document.querySelectorAll('.poem p'));
  const bgRoot = document.getElementById('bg-root');
  // effectsRoot: the .effects element inside bg-root
  let effectsRoot = bgRoot ? bgRoot.querySelector('.effects') : null;
  if (!effectsRoot) {
    effectsRoot = document.createElement('div');
    effectsRoot.className = 'effects';
    if (bgRoot) bgRoot.appendChild(effectsRoot);
    else document.body.appendChild(effectsRoot);
  }
  const music = document.getElementById('bgMusic');

  // Defensive checks
  if (!beginBtn || !landing || !experience) {
    console.error('Essential elements missing: begin/landing/experience');
    return;
  }

  // ---------- Begin button handler ----------
  beginBtn.addEventListener('click', () => {
    // stop double-clicks
    beginBtn.disabled = true;

    // fade landing
    landing.style.transition = 'opacity 900ms ease';
    landing.style.opacity = '0';

    // play music (best-effort)
    if (music) {
      music.volume = 0;
      music.play().catch((e) => {
        console.warn('Audio play blocked or missing:', e);
      });
      fadeAudioTo(music, 0.35, 3500);
    }

    // after fade
    setTimeout(() => {
      landing.style.display = 'none';
      experience.classList.remove('hidden');
      experience.classList.add('active');

      // start poem reveal and ensure background effects are running
      startPoemTimeline();
    }, 950);
  });

  // ---------- Poem timeline ----------
  function startPoemTimeline() {
    // spacing: 0.9s first, then 2.6s between lines to feel musical but not too slow
    const initialDelay = 900;
    const gap = 2600;
    poemLines.forEach((line, i) => {
      setTimeout(() => line.classList.add('show'), initialDelay + i * gap);
    });
  }

  // ---------- Audio fade helper ----------
  function fadeAudioTo(audioEl, targetVolume, durationMs) {
    if (!audioEl) return;
    const step = 100;
    const steps = Math.max(1, Math.floor(durationMs / step));
    const inc = targetVolume / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur++;
      audioEl.volume = Math.min(targetVolume, audioEl.volume + inc);
      if (cur >= steps) clearInterval(id);
    }, step);
  }

  // ---------- Sparkles (subtle continuous) ----------
  (function startSparkles() {
    setInterval(() => {
      const s = document.createElement('div');
      s.className = 'sparkle';
      const size = Math.random() * 3 + 2;
      s.style.width = `${size}px`; s.style.height = `${size}px`;
      s.style.left = `${Math.random() * window.innerWidth}px`;
      s.style.top = `${Math.random() * window.innerHeight}px`;
      effectsRoot.appendChild(s);
      // animate opacity then remove
      requestAnimationFrame(() => s.style.opacity = '1');
      setTimeout(() => s.style.opacity = '0', 1400 + Math.random()*800);
      setTimeout(() => s.remove(), 3200);
    }, 500);
  })();

  // ---------- Meteors (anime-style) ----------
  function createMeteor({ speed = 2200, sizeMultiplier = 1 } = {}) {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';

    const tail = document.createElement('div');
    tail.className = 'tail';
    const head = document.createElement('div');
    head.className = 'head';

    meteor.appendChild(tail);
    meteor.appendChild(head);
    effectsRoot.appendChild(meteor);

    const w = window.innerWidth;
    const h = window.innerHeight;

    // spawn slightly off left/top so it travels across view
    const startX = Math.random() * (w * 0.6) - 200;
    const startY = Math.random() * (h * 0.25) - 120;
    const angle = 15 + Math.random() * 25; // degrees

    meteor.style.left = `${startX}px`;
    meteor.style.top = `${startY}px`;
    meteor.style.transform = `rotate(${angle}deg)`;

    // scale tail & head placement by sizeMultiplier
    const tailWidth = Math.max(220, 360 * sizeMultiplier);
    tail.style.width = `${tailWidth}px`;
    tail.style.height = `${Math.max(2, 3 * sizeMultiplier)}px`;
    head.style.left = `${tailWidth - 8}px`;

    // animate across screen
    requestAnimationFrame(() => {
      meteor.style.transition = `left ${speed}ms linear, top ${speed}ms linear, transform ${speed}ms linear, opacity ${Math.max(600, speed)}ms linear`;
      meteor.style.left = `${startX + w + 800}px`;
      meteor.style.top = `${startY + h + 500}px`;
      meteor.style.opacity = '1';
    });

    // cleanup
    setTimeout(() => meteor.remove(), speed + 300);
  }

  // spawn layered meteors periodically
  setInterval(() => {
    const fg = Math.random() > 0.65;
    createMeteor({ speed: fg ? 3000 : 2000, sizeMultiplier: fg ? 1.6 : 1 });
  }, 5200);

  // cinematic burst near 2:15 mark to lift the emotion (non-blocking)
  setTimeout(() => {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const fg = Math.random() > 0.5;
        createMeteor({ speed: fg ? 2600 : 1800, sizeMultiplier: fg ? 1.8 : 1.1 });
      }, i * 240);
    }
  }, 135000);

  // done
});
