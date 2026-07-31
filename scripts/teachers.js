// заполнение учителей
const teachersContainer = document.querySelector('.teachers-grid');
// const teachersSection = document.querySelector('.teachers');
const modalVideoContainer = document.querySelector('#video-modal');
const iframe = modalVideoContainer.querySelector('#videoIframe');
const closeModalButton = modalVideoContainer.querySelector('.close');

document.addEventListener('DOMContentLoaded', async (event) => {
  const teachers = await getTeachers('Чеська');

  // Если учителей нет, скрываем секцию
  if (teachers.length) showTeachers(teachers);

  fitTeacherCards();
  window.addEventListener('resize', fitTeacherCards);

  // Обработчик для закрытия модального окна
  closeModalButton.addEventListener('click', () => closeVideoModal());

  // Закрытие модального окна при клике вне его содержимого
  document.querySelector('#video-modal').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
      closeVideoModal();
    }
  });
});

function closeVideoModal() {
  modalVideoContainer.style.display = 'none';
  iframe.src = ''; // Останавливаем видео
  document.body.style.overflow = 'auto'; // Включаем прокрутку основного контента
}

function showTeachers(teachers) {
  teachersContainer.innerHTML = '';

  teachers.forEach((teacher) => {
    const teacherElement = document.createElement('div');
    teacherElement.classList.add('teacher-card');

    const link = teacher.link
      ? `  <span class="flag" onclick="showTeacherVideo('${teacher.link}')">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </span>
        `
      : '';

    teacherElement.innerHTML = `
            <div class="teacher-photo">
              <img
                src="../assets/teachers/${teacher.photo}.webp"
                alt="Photo of ${teacher.name}"
                onload="handleImageLoad()"
              />
            </div>
            <div class="teacher-info">
              <div class="teacher-name">
                ${teacher.name} ${link}
        
              </div>
              <p class="teacher-bio">
                ${teacher.description}
              </p>
            </div>
        `;

    teachersContainer.appendChild(teacherElement);
  });
}

function fitTeacherCards() {
  const grid = document.querySelector('.teachers-grid');
  if (!grid || !grid.children.length) return;

  const gap = 20;
  const minCardWidth = 300; // минимально допустимая ширина карточки
  const containerWidth = grid.clientWidth;

  // сколько карточек минимальной ширины влезет целиком
  let count = Math.floor((containerWidth + gap) / (minCardWidth + gap));
  count = Math.max(1, count);

  // растягиваем карточки, чтобы заполнить всю ширину без остатка
  const cardWidth = (containerWidth - gap * (count - 1)) / count;

  grid.style.setProperty('--card-w', `${cardWidth}px`);
  grid.dataset.step = cardWidth + gap; // сохраняем шаг для стрелок
}

function showTeacherVideo(link) {
  console.log('Show YouTube Video', link);
  const modalVideoContainer = document.querySelector('#video-modal');
  var iframe = document.getElementById('videoIframe');

  iframe.src = link.includes('?') ? `${link}&autoplay=1` : `${link}?autoplay=1`;

  modalVideoContainer.style.display = 'block';
}
