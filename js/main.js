/* ===========================
   Portfolio - Main JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileNav();
  initActiveNavLink();
  initCollapsibleCards();
});

/* ---------- Theme Storage Helpers ---------- */
// localStorage doesn't always persist across file:// pages (e.g. Safari),
// so we write to both localStorage and a cookie as fallback.
function getTheme() {
  try {
    const ls = localStorage.getItem('theme');
    if (ls) return ls;
  } catch (e) { /* localStorage unavailable */ }
  // Cookie fallback
  const match = document.cookie.match(/(?:^|; )theme=(dark|light)/);
  return match ? match[1] : null;
}

function setTheme(value) {
  try { localStorage.setItem('theme', value); } catch (e) {}
  document.cookie = `theme=${value};path=/;max-age=31536000;SameSite=Lax`;
}

/* ---------- Dark Mode Toggle ---------- */
function initDarkMode() {
  const toggleDesktop = document.getElementById('dark-mode-toggle');
  const toggleMobile = document.getElementById('dark-mode-toggle-mobile');
  const html = document.documentElement;

  // Check saved preference, then system preference
  const saved = getTheme();
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  updateToggleIcon();

  const handleToggle = () => {
    html.classList.toggle('dark');
    setTheme(html.classList.contains('dark') ? 'dark' : 'light');
    updateToggleIcon();
  };

  if (toggleDesktop) toggleDesktop.addEventListener('click', handleToggle);
  if (toggleMobile) toggleMobile.addEventListener('click', handleToggle);
}

function updateToggleIcon() {
  const toggleDesktop = document.getElementById('dark-mode-toggle');
  const toggleMobile = document.getElementById('dark-mode-toggle-mobile');

  const isDark = document.documentElement.classList.contains('dark');
  // Sun icon for dark mode (click to go light), Moon icon for light mode (click to go dark)
  const icon = isDark
    ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
       </svg>`
    : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
       </svg>`;
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  [toggleDesktop, toggleMobile].forEach(btn => {
    if (btn) {
      btn.innerHTML = icon;
      btn.setAttribute('aria-label', label);
    }
  });
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      hamburger.setAttribute('aria-expanded', !isOpen);
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ---------- Active Navigation Link ---------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (href === 'index.html' && (currentPage === '' || currentPage === '/'))) {
      link.classList.add('active', 'text-orange-600', 'dark:text-orange-400', 'font-semibold');
    }
  });
}

/* ---------- Collapsible Cards ---------- */
function initCollapsibleCards() {
  const detailsElements = document.querySelectorAll('details.experience-card');

  detailsElements.forEach(details => {
    const summary = details.querySelector('summary');
    const toggleText = summary?.querySelector('.toggle-text');

    if (toggleText) {
      details.addEventListener('toggle', () => {
        toggleText.textContent = details.open ? 'Show less' : 'Show more';
      });
    }
  });
}
