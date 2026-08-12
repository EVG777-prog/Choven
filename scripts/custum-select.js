document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.select-wrap select').forEach((select) => {
    createCustomSelect(select);
  });
});

function createCustomSelect(select) {
  const wrapper = select.parentElement;

  // Создаем кастомный select
  const custom = document.createElement('div');
  custom.className = 'custom-select';

  custom.innerHTML = `
    <button type="button" class="custom-select__button">
      <span class="custom-select__value"></span>

      <svg
        class="custom-select__arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div class="custom-select__menu"></div>
  `;

  wrapper.appendChild(custom);

  const button = custom.querySelector('.custom-select__button');
  const value = custom.querySelector('.custom-select__value');
  const menu = custom.querySelector('.custom-select__menu');

  function renderOptions() {
    menu.innerHTML = '';

    [...select.options].forEach((option) => {
      const item = document.createElement('div');

      item.className = 'custom-select__option';
      item.textContent = option.textContent;
      item.dataset.value = option.value;

      if (option.value === select.value) {
        item.classList.add('selected');
      }

      item.addEventListener('click', (e) => {
        e.stopPropagation();

        select.value = option.value;

        // Передаем изменение существующей логике фильтра
        select.dispatchEvent(new Event('change', { bubbles: true }));

        value.textContent = option.textContent;

        menu
          .querySelectorAll('.custom-select__option')
          .forEach((el) => el.classList.remove('selected'));

        item.classList.add('selected');

        custom.classList.remove('open');
      });

      menu.appendChild(item);
    });

    const selected = select.options[select.selectedIndex];

    if (selected) {
      value.textContent = selected.textContent;
    }
  }

  renderOptions();

  // Открытие
  button.addEventListener('click', (e) => {
    e.stopPropagation();

    // Закрываем другие
    document.querySelectorAll('.custom-select.open').forEach((other) => {
      if (other !== custom) {
        other.classList.remove('open');
      }
    });

    custom.classList.toggle('open');
  });

  // Если существующий JS изменил select программно
  select.addEventListener('change', () => {
    renderOptions();
  });

  // Если options добавляются динамически
  const observer = new MutationObserver(() => {
    renderOptions();
  });

  observer.observe(select, {
    childList: true,
  });
}

// Закрытие при клике вне dropdown
document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select.open').forEach((select) => {
    select.classList.remove('open');
  });
});
