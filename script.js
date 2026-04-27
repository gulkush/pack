/* ═══════════════════════════════════════════════
   PACKPRO SOLUTIONS — INTERACTIVE SCRIPTS
   ═══════════════════════════════════════════════ */

'use strict';

/* ─── NAV: scroll-based glass effect ─── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ─── MOBILE MENU ─── */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // close on link click
  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ─── SCROLL REVEAL ─── */
(function () {
  const revealTargets = [
    // sections
    '.about-grid',
    '.case-card',
    '.compliance-card',
    '.contact-grid',
    '.specs-table-wrap',
    '.specs-cta',
    // individual elements
    '.section-header',
    '.about-text',
  ];

  // add .reveal class to all targets
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // stagger children in grid containers
      if (el.closest('.case-studies-grid') || el.closest('.compliance-grid')) {
        const delayIndex = (i % 4) + 1;
        el.classList.add(`reveal-delay-${delayIndex}`);
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ─── CONTACT FORM — Formspree ─── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const product = form.querySelector('#product').value;

    if (!name || !email || !product) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // mirror email into _replyto so replies go directly to the enquirer
    const replyTo = form.querySelector('[name="_replyto"]');
    if (replyTo) replyTo.value = email;

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        showToast('Thank you! Your enquiry has been sent. We\'ll respond within 24 hours.');
      } else {
        const data = await response.json();
        const msg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Submission failed. Please try again.';
        showToast(msg, 'error');
      }
    } catch (_) {
      showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      btn.textContent = 'Send Enquiry';
      btn.disabled = false;
    }
  });

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }
})();

/* ─── TOAST NOTIFICATIONS ─── */
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = type === 'error' ? '#ef4444' : '#10b981';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ─── ACTIVE NAV LINK HIGHLIGHT (scroll spy) ─── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── CASE CARD MICRO-INTERACTIONS ─── */
(function () {
  document.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = 'auto';
    });
  });
})();
