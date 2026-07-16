// ==========================================================
// Ali Adel — Portfolio interactions
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  initTerminalTyping();
  initScrollReveal();
  initSkillBars();
  initMobileNav();
  initNavShadowOnScroll();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- 1) Terminal boot-sequence typing effect ---------- */
function initTerminalTyping() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  // Respect users who prefer reduced motion: show final state instantly.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const script = [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: 'Ali Adel' },
    { type: 'prompt', text: 'cat role.txt' },
    { type: 'role',   text: 'Cybersecurity Engineering Student | Web Developer | Vulnerability Researcher' },
    { type: 'prompt', text: 'status --check' },
    { type: 'out',    text: '[OK] Ready to build something secure.' },
  ];

  if (prefersReducedMotion) {
    body.innerHTML = script.map(renderLine).join('');
    return;
  }

  let lineIndex = 0;
  typeNextLine();

  function typeNextLine() {
    if (lineIndex >= script.length) {
      body.insertAdjacentHTML('beforeend', '<span class="cursor"></span>');
      return;
    }
    const item = script[lineIndex];
    const prefix = item.type === 'prompt' ? '<span class="line-prompt">$ </span>' : '';
    const cls = item.type === 'role' ? 'line-role' : item.type === 'out' ? 'line-out' : '';
    const lineEl = document.createElement('div');
    body.appendChild(lineEl);

    let charIndex = 0;
    const speed = item.type === 'prompt' ? 42 : 14;

    const timer = setInterval(() => {
      charIndex++;
      lineEl.innerHTML = prefix + `<span class="${cls}">${escapeHtml(item.text.slice(0, charIndex))}</span>`;
      if (charIndex >= item.text.length) {
        clearInterval(timer);
        lineIndex++;
        setTimeout(typeNextLine, item.type === 'prompt' ? 120 : 260);
      }
    }, speed);
  }

  function renderLine(item) {
    const prefix = item.type === 'prompt' ? '<span class="line-prompt">$ </span>' : '';
    const cls = item.type === 'role' ? 'line-role' : item.type === 'out' ? 'line-out' : '';
    return `<div>${prefix}<span class="${cls}">${escapeHtml(item.text)}</span></div>`;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
}

/* ---------- 2) Scroll-triggered reveal for sections ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.about-text, .about-stack, .skill-col, .service-card, .contact-card, .projects-empty, .section-tag, .section-title'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => observer.observe(el));
}

/* ---------- 3) Animate skill bars when visible ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.bar i');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const width = entry.target.style.width;
        entry.target.style.width = '0';
        requestAnimationFrame(() => {
          entry.target.style.width = width;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach((bar) => {
    // store the target width, then let the observer animate it in
    observer.observe(bar);
  });
}

/* ---------- 4) Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('is-open');
  });

  links.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => links.classList.remove('is-open'));
  });
}

/* ---------- 5) Subtle nav background on scroll ---------- */
function initNavShadowOnScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 12) {
      nav.style.boxShadow = '0 8px 24px -12px rgba(0,0,0,0.5)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
}