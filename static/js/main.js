(() => {
  const body = document.body;
  const themeButton = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('ahe-theme-v3');
  const setTheme = (dark) => {
    body.classList.toggle('dark', dark);
    themeIcon.textContent = dark ? '☾' : '☼';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#050b12' : '#f2f6fa';
  };
  // AHE's midnight theme is the default; the visitor's switch choice is remembered.
  setTheme(savedTheme ? savedTheme === 'dark' : true);
  themeButton.addEventListener('click', () => {
    const dark = !body.classList.contains('dark');
    setTheme(dark);
    localStorage.setItem('ahe-theme-v3', dark ? 'dark' : 'light');
  });

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menu.classList.remove('open');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.classList.toggle('open', open);
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 18);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const hero = document.querySelector('.hero');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      hero.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--spot-x', '72%');
      hero.style.setProperty('--spot-y', '40%');
    }, { passive: true });
  }

  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal makes each section arrive gently as visitors explore the site.
  const revealTargets = document.querySelectorAll('.intro-grid,.section-heading,.service-card,.detail-grid,.product-cards > div,.about-grid,.values-grid article,.contact-grid,.cta-inner');
  revealTargets.forEach((item, index) => {
    item.classList.add('reveal-on-scroll');
    item.classList.add(`reveal-delay-${(index % 3) + 1}`);
  });
  if ('IntersectionObserver' in window && !motionReduced) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach((item) => revealObserver.observe(item));
  } else {
    revealTargets.forEach((item) => item.classList.add('is-visible'));
  }

  const progress = document.querySelector('.scroll-progress span');
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  document.querySelectorAll('.contact-form').forEach((form) => {
    form.addEventListener('submit', () => {
      const submit = form.querySelector('[type="submit"]');
      if (form.reportValidity()) {
        submit.classList.add('is-sending');
        submit.innerHTML = 'Sending your enquiry <span>…</span>';
      }
    });
  });
})();
