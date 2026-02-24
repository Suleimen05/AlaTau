export function initTheme() {
  const tg = window.Telegram?.WebApp;

  function applyTheme() {
    const colorScheme = tg?.colorScheme ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  applyTheme();

  if (tg) {
    tg.onEvent('themeChanged', applyTheme);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
}
