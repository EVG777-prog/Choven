const siteHeader = document.querySelector('.site-header');

const toggleHeaderScrolled = () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
};

window.addEventListener('scroll', toggleHeaderScrolled, { passive: true });
toggleHeaderScrolled(); // на случай если страница открылась не с самого верха
