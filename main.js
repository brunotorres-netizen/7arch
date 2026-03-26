/* ============================================================
   7arch — main.js
   Header scroll · Mobile menu · Scroll animations ·
   Animated counters · Parallax hero · Form validation
   ============================================================ */

'use strict';

/* ── 1. HEADER SCROLL ──────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── 2. MOBILE MENU ────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });
})();

/* ── 3. SMOOTH SCROLL (fallback for older browsers) ────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('header')
        ? document.getElementById('header').offsetHeight
        : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* ── 4. INTERSECTION OBSERVER — scroll reveal ──────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('.animate');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(function (el) { observer.observe(el); });
})();

/* ── 5. ANIMATED COUNTERS ──────────────────────────────────── */
(function initCounters() {
  const section = document.getElementById('numeros');
  if (!section) return;

  const counters = section.querySelectorAll('.count');
  if (!counters.length) return;

  let started = false;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const isArea  = el.getAttribute('data-format') === 'area';
    const duration = 1600; // ms
    const start   = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const value    = Math.round(eased * target);

      if (isArea) {
        // Format with dot separator: 10.400
        el.textContent = value.toLocaleString('pt-BR');
      } else {
        el.textContent = value;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isArea ? target.toLocaleString('pt-BR') : target;
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting && !started) {
        started = true;
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(section);
})();

/* ── 6. HERO PARALLAX ──────────────────────────────────────── */
(function initParallax() {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg) return;

  // Disable on mobile (performance)
  if (window.matchMedia('(max-width: 768px)').matches) return;

  function onScroll() {
    const scrolled = window.scrollY;
    heroBg.style.transform = 'translateY(' + (scrolled * 0.28) + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── 7. FORM VALIDATION ────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contato-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  // Phone mask: (11) 9 0000-0000
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 7) {
        v = '(' + v.slice(0,2) + ') ' + v.slice(2,3) + ' ' + v.slice(3,7) + '-' + v.slice(7);
      } else if (v.length > 2) {
        v = '(' + v.slice(0,2) + ') ' + v.slice(2);
      } else if (v.length > 0) {
        v = '(' + v;
      }
      this.value = v;
    });
  }

  function validateField(id, errorGroupId, condition, msg) {
    const input = document.getElementById(id);
    const group = document.getElementById(errorGroupId);
    if (!input || !group) return true;
    const errMsg = group.querySelector('.error-msg');

    if (!condition(input.value)) {
      group.classList.add('has-error');
      input.classList.add('error');
      if (errMsg && msg) errMsg.textContent = msg;
      return false;
    } else {
      group.classList.remove('has-error');
      input.classList.remove('error');
      return true;
    }
  }

  // Clear errors on input
  ['nome','email','telefone','bairro'].forEach(function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function() {
      const group = document.getElementById('group-' + id);
      if (group) {
        group.classList.remove('has-error');
        this.classList.remove('error');
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var validNome = validateField('nome', 'group-nome',
      function(v) { return v.trim().length >= 2; },
      'Por favor, informe seu nome completo.');

    var validEmail = validateField('email', 'group-email',
      function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      'Informe um e-mail válido.');

    var validTel = validateField('telefone', 'group-telefone',
      function(v) { return v.replace(/\D/g,'').length >= 10; },
      'Informe um telefone com DDD.');

    var validBairro = validateField('bairro', 'group-bairro',
      function(v) { return v.trim().length >= 2; },
      'Informe o bairro do apartamento.');

    if (!validNome || !validEmail || !validTel || !validBairro) {
      var firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Submit to Formspree via fetch
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      if (response.ok) {
        form.style.display = 'none';
        success.classList.add('visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        return response.json().then(function(data) {
          throw new Error(data.errors ? data.errors.map(function(e){ return e.message; }).join(', ') : 'Erro ao enviar.');
        });
      }
    })
    .catch(function(err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar pré-briefing';
      }
      alert('Ops! Não foi possível enviar. Tente pelo WhatsApp ou e-mail: contato@7arch.com.br');
      console.error('Formspree error:', err);
    });
  });
})();

/* ── 8. ACTIVE NAV LINK on scroll ─────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id="hero"]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    let current = '';
    const headerH = document.getElementById('header')
      ? document.getElementById('header').offsetHeight + 10
      : 80;

    sections.forEach(function (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerH;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.removeAttribute('aria-current');
      if (link.getAttribute('href') === '#' + current) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
