document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  burgerBtn.addEventListener('click', openMenu);
  mobileMenuClose.addEventListener('click', closeMenu);

  // закрытие по клику на ссылку меню
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
});
