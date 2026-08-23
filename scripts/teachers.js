// заполнение учителей
const teachersContainer = document.querySelector('.teachers-grid');

document.addEventListener('DOMContentLoaded', async (event) => {
  const teachers = await getTeachers('Чеська');

  // Если учителей нет, скрываем секцию
  if (teachers.length) showTeachers(teachers);

  fitTeacherCards();
  window.addEventListener('resize', fitTeacherCards);
});

function showTeachers(teachers) {
  teachersContainer.innerHTML = '';

  teachers.forEach((teacher) => {
    const teacherElement = document.createElement('div');
    teacherElement.classList.add('teacher-card');

    const link = teacher.link
      ? `  <span class="yt-icon" onclick="showTeacherVideo('${teacher.link}')">
             <img src="assets/icons/icon_youtube.svg" alt="Відео" />
           </span>
        `
      : '';

    teacherElement.innerHTML = `
            <div class="teacher-photo">
              <img
                src="assets/teachers/${teacher.photo}.webp"
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
  const containerWidth = grid.clientWidth;

  let cardWidth;
  if (window.innerWidth < 420) {
    cardWidth = containerWidth; // на самых узких экранах карточка = вся доступная ширина
  } else if (containerWidth >= 900) {
    cardWidth = 416;
  } else {
    cardWidth = 320;
  }

  grid.style.setProperty('--card-w', `${cardWidth}px`);
  grid.dataset.step = cardWidth + gap; // сохраняем шаг для стрелок
}
