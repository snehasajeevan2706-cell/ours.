/* ============================================================
   SheGuard – script.js
   Scroll reveal · Nav behaviour · Mobile menu · SOS demo
   ============================================================ */

(function () {
  'use strict';

  // ─── DOM REFERENCES ───────────────────────────────────────
  const nav            = document.querySelector('.nav');
  const navToggle      = document.querySelector('.nav__toggle');
  const mobileNav      = document.querySelector('.nav__mobile');
  const mobileClose    = document.querySelector('.nav__mobile-close');
  const mobileLinks    = document.querySelectorAll('.nav__mobile a');
  const sosBtn         = document.querySelector('.sos__btn');

  // Elements that reveal on scroll
  const revealEls      = document.querySelectorAll('.card, .dual-card, .priv-card');


  // ─── NAV SCROLL BEHAVIOUR ─────────────────────────────────
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    // Shrink nav after scrolling 60px
    if (currentY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    lastScrollY = currentY;
  }, { passive: true });


  // ─── MOBILE NAV ───────────────────────────────────────────
  function openMobileNav() {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

  // Close on link tap
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on backdrop tap (click on .nav__mobile itself, not children)
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileNav();
    });
  }


  // ─── SCROLL-TRIGGERED CARD REVEAL ────────────────────────
  function checkReveal() {
    const windowHeight = window.innerHeight;

    revealEls.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      // Trigger when top edge is 88% down the viewport
      if (rect.top < windowHeight * 0.88) {
        // Stagger siblings within same grid by index
        const delay = (i % 3) * 90; // ms
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
      }
    });
  }

  // Run once on load + on every scroll
  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('load',   checkReveal);
  // Also fire after fonts load to avoid layout shift
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(checkReveal);
  }


  // ─── SOS BUTTON – DEMO ALERT ─────────────────────────────
  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      // Custom modal-style alert for a nicer UX than browser alert()
      showSOSModal();
    });
  }

  function showSOSModal() {
    // Build modal
    const overlay = document.createElement('div');
    overlay.className = 'sos-modal-overlay';
    overlay.innerHTML = `
      <div class="sos-modal">
        <div class="sos-modal__icon">🚨</div>
        <h2 class="sos-modal__title">SOS Activated</h2>
        <p class="sos-modal__text">In a real app, this would instantly:</p>
        <ul class="sos-modal__list">
          <li>📍 Send your live location to police</li>
          <li>👥 Notify your trusted contacts</li>
          <li>🎙️ Start audio &amp; video recording</li>
          <li>📱 Send SMS fallback if internet is low</li>
        </ul>
        <button class="sos-modal__close">Close</button>
      </div>
    `;

    // Inline styles for the modal (keeps CSS file clean)
    const style = document.createElement('style');
    style.textContent = `
      .sos-modal-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 24px;
        animation: modalIn 0.25s ease both;
      }
      @keyframes modalIn { from { opacity:0; } to { opacity:1; } }

      .sos-modal {
        background: linear-gradient(148deg, #6B0000, #4A0000);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 24px;
        padding: 44px 36px;
        max-width: 400px; width: 100%;
        text-align: center;
        box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(200,30,30,0.3);
        animation: modalSlide 0.3s cubic-bezier(0.22,1,0.36,1) both;
      }
      @keyframes modalSlide { from { transform: translateY(30px); opacity:0; } to { transform: translateY(0); opacity:1; } }

      .sos-modal__icon { font-size: 2.8rem; margin-bottom: 16px; }
      .sos-modal__title {
        font-family: 'Playfair Display', serif;
        font-size: 1.7rem; font-weight: 700;
        color: #FFF5F5; margin-bottom: 10px;
      }
      .sos-modal__text { font-size: 0.9rem; color: rgba(255,245,245,0.65); margin-bottom: 20px; }
      .sos-modal__list {
        list-style: none; text-align: left;
        max-width: 280px; margin: 0 auto 28px;
      }
      .sos-modal__list li {
        padding: 7px 0;
        font-size: 0.88rem;
        color: rgba(255,245,245,0.78);
        border-bottom: 1px solid rgba(255,255,255,0.07);
      }
      .sos-modal__list li:last-child { border-bottom: none; }

      .sos-modal__close {
        background: linear-gradient(135deg, rgba(232,184,75,0.2), rgba(232,184,75,0.08));
        border: 1px solid rgba(232,184,75,0.35);
        color: #F0D080;
        padding: 10px 32px;
        border-radius: 50px;
        font-size: 0.84rem;
        font-weight: 500;
        letter-spacing: 1px;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
      }
      .sos-modal__close:hover {
        background: rgba(232,184,75,0.28);
        transform: translateY(-1px);
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Close handlers
    const closeBtn = overlay.querySelector('.sos-modal__close');

    function closeModal() {
      overlay.style.animation = 'modalIn 0.2s ease reverse both';
      setTimeout(() => {
        overlay.remove();
        style.remove();
      }, 220);
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // ESC key
    const onEsc = (e) => {
      if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onEsc); }
    };
    document.addEventListener('keydown', onEsc);
  }


  // ─── SMOOTH ANCHOR SCROLL (nav links) ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // nav height approx
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


})();
