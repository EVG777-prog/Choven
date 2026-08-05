// ================= SHARED VIDEO MODAL =================
// Plays a teacher's YouTube intro video in a modal iframe.
// Used by both scripts/teachers.js (teacher cards) and scripts/schedule.js
// (teacher name inside a schedule row) so the open/close logic lives in
// exactly one place.

const videoModalContainer = document.querySelector('#video-modal');
const videoModalIframe = videoModalContainer?.querySelector('#videoIframe');
const videoModalCloseBtn = videoModalContainer?.querySelector('.close');

// Called via inline onclick="showTeacherVideo('...')" from wherever a
// teacher's YouTube link is rendered (teacher cards, schedule rows, etc).
function showTeacherVideo(link) {
  if (!videoModalContainer || !videoModalIframe || !link) return;

  videoModalIframe.src = link.includes('?') ? `${link}&autoplay=1` : `${link}?autoplay=1`;
  videoModalContainer.style.display = 'block';
  document.body.style.overflow = 'hidden'; // блокируем прокрутку фона
}

function closeVideoModal() {
  if (!videoModalContainer || !videoModalIframe) return;

  videoModalContainer.style.display = 'none';
  videoModalIframe.src = ''; // останавливаем видео
  document.body.style.overflow = 'auto'; // включаем прокрутку основного контента
}

document.addEventListener('DOMContentLoaded', () => {
  if (!videoModalContainer) return; // модалки нет на этой странице

  videoModalCloseBtn?.addEventListener('click', closeVideoModal);

  // закрытие по клику вне содержимого модалки
  videoModalContainer.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeVideoModal();
  });
});
