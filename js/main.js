/* ===========================
   Portfolio - Main JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileNav();
  initActiveNavLink();
  initCollapsibleCards();
  initCourseworkRepoLinks();
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

/* ---------- Coursework Private Repo Notice ---------- */
function initCourseworkRepoLinks() {
  document.querySelectorAll('.coursework-repo-link, .coursework-repo-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const project = el.getAttribute('data-project') || 'Coursework';
      showRepoNotice(project);
    });
  });

  // Close toast on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const toast = document.getElementById('repo-notice-toast');
      if (toast) toast.remove();
    }
  });
}

function showRepoNotice(projectName) {
  const existing = document.getElementById('repo-notice-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'repo-notice-toast';
  toast.className = 'fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-5 z-50 max-w-sm sm:max-w-md mx-auto sm:mx-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-4 transition-all duration-200';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');

  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 dark:text-orange-400 mt-0.5">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0 pr-1">
        <div class="flex items-center justify-between mb-1">
          <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Private Coursework Repository</h4>
          <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -mr-1 rounded-md transition-colors" aria-label="Close notification" onclick="document.getElementById('repo-notice-toast')?.remove()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          This repository is private in line with university academic policies. Access can be granted case-by-case upon request.
        </p>
        <div class="flex items-center gap-3">
          <a href="mailto:s.galutowski@gmail.com?subject=Repository%20Access%20Request%20-%20${encodeURIComponent(projectName || 'Coursework')}" class="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span>Request Access via Email</span>
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(toast);

  const timer = setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }
  }, 6000);

  toast.querySelector('button')?.addEventListener('click', () => {
    clearTimeout(timer);
    toast.remove();
  });
}

// Expose globally to window
window.showRepoNotice = showRepoNotice;
