/* =============================================
   Smile Care Orthodontic – Main JS
   ============================================= */

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Scroll-reveal (data-aos) ── */
const aosCb = (entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const delay = parseInt(e.target.dataset.aosDelay || 0, 10);
    setTimeout(() => e.target.classList.add('visible'), delay);
    aosObserver.unobserve(e.target);
  });
};
const aosObserver = new IntersectionObserver(aosCb, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});
document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

/* ── Active nav link on scroll ── */
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections   = document.querySelectorAll('section[id]');

const linkObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navAnchors.forEach(a => a.classList.remove('active'));
    const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
    if (active) active.classList.add('active');
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => linkObserver.observe(s));

/* ── Counter animation ── */
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    animateCount(e.target);
    countObserver.unobserve(e.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-n[data-target]').forEach(el => countObserver.observe(el));

function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const dur    = 1800;
  const start  = performance.now();

  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const v = Math.floor(easeOut(p) * target);
    el.textContent = v + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(tick);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ── Location map switcher ── */
const locCards = document.querySelectorAll('.loc-card');
const mapFrame  = document.getElementById('mapFrame');

locCards.forEach(card => {
  card.addEventListener('click', () => {
    locCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    if (mapFrame && card.dataset.map) {
      mapFrame.src = card.dataset.map;
    }
  });
});

/* ── Contact form → WhatsApp ── */
const apptForm = document.getElementById('apptForm');
const bookBtn  = document.getElementById('bookBtn');

if (apptForm) {
  apptForm.addEventListener('submit', e => {
    e.preventDefault();

    const fields   = apptForm.querySelectorAll('input, select, textarea');
    const name     = fields[0].value.trim();
    const phone    = fields[1].value.trim();
    const email    = fields[2].value.trim();
    const service  = fields[3].value;
    const location = fields[4].value;
    const message  = fields[5].value.trim();

    if (!name || !phone) {
      shake(bookBtn);
      return;
    }

    /* Build the WhatsApp message */
    const lines = [
      '🦷 *New Appointment Request — Smile Care*',
      '',
      `👤 *Name:* ${name}`,
      `📞 *Phone:* ${phone}`,
    ];
    if (email)    lines.push(`📧 *Email:* ${email}`);
    if (service && service !== '')  lines.push(`🔧 *Service:* ${service}`);
    if (location && location !== '') lines.push(`📍 *Location:* ${location}`);
    if (message)  lines.push(`💬 *Note:* ${message}`);
    lines.push('', 'Please confirm my appointment. Thank you!');

    const text     = encodeURIComponent(lines.join('\n'));
    const waURL    = `https://wa.me/919685533548?text=${text}`;

    /* Show loading state, then open WhatsApp */
    bookBtn.disabled = true;
    bookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp…';

    setTimeout(() => {
      window.open(waURL, '_blank', 'noopener,noreferrer');

      bookBtn.classList.add('success');
      bookBtn.innerHTML = '<i class="fas fa-check-circle"></i> Sent via WhatsApp!';
      apptForm.reset();

      setTimeout(() => {
        bookBtn.disabled = false;
        bookBtn.classList.remove('success');
        bookBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Appointment';
      }, 4000);
    }, 600);
  });
}

function shake(el) {
  el.animate([
    { transform:'translateX(0)' },
    { transform:'translateX(-6px)' },
    { transform:'translateX(6px)' },
    { transform:'translateX(-4px)' },
    { transform:'translateX(4px)' },
    { transform:'translateX(0)' }
  ], { duration: 360, easing: 'ease-in-out' });
}

/* ── Smooth scroll for all #anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Navbar logo text color fix on hero ── */
const hero = document.getElementById('home');
if (hero) {
  const heroObserver = new IntersectionObserver(entries => {
    const inHero = entries[0].isIntersecting;
    navbar.classList.toggle('on-hero', inHero);
  }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });
  heroObserver.observe(hero);
}
