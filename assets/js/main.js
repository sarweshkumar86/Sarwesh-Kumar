(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const menuButton = document.getElementById('menuToggle');
  const nav = document.getElementById('navigation');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const filters = [...document.querySelectorAll('.filter-button')];
  const cards = [...document.querySelectorAll('.project-card')];
  const progress = document.getElementById('scrollProgress');
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>';
  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>';
  const setTheme = dark => { root.dataset.theme = dark ? 'dark' : 'light'; toggle.innerHTML = dark ? sun : moon; toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'); try { localStorage.setItem('sarwesh-academic-theme', dark ? 'dark' : 'light'); } catch(_) {} };
  let saved = 'light'; try { saved = localStorage.getItem('sarwesh-academic-theme') || 'light'; } catch(_) {}
  setTheme(saved === 'dark');
  toggle.addEventListener('click', () => setTheme(root.dataset.theme !== 'dark'));

  const closeMenu = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); };
  menuButton.addEventListener('click', () => { const open = !nav.classList.contains('open'); nav.classList.toggle('open',open); menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); });
  navLinks.forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click',e => { if (!nav.contains(e.target) && !menuButton.contains(e.target)) closeMenu(); });

  filters.forEach(button => button.addEventListener('click',() => {
    const category = button.dataset.filter;
    filters.forEach(b => { const selected = b === button; b.classList.toggle('selected',selected); b.setAttribute('aria-pressed',String(selected)); });
    cards.forEach(card => { card.hidden = !(category === 'all' || card.dataset.category.split(' ').includes(category)); });
  }));
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }); }, {threshold: .07, rootMargin:'0px 0px 55px 0px'});
    reveals.forEach(el => revealObserver.observe(el));
  } else { reveals.forEach(el => el.classList.add('visible')); }
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active',link.getAttribute('href') === '#' + entry.target.id)); }); }, { rootMargin:'-20% 0px -65% 0px'});
    sections.forEach(el => sectionObserver.observe(el));
  }
  let ticking = false;
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(() => { const total = document.documentElement.scrollHeight - innerHeight; progress.style.width = (total > 0 ? scrollY / total * 100 : 0) + '%'; ticking = false; }); ticking = true; } },{passive:true});
})();
