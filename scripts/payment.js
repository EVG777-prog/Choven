document.addEventListener('DOMContentLoaded', async (event) => {
  // заполнение тарифов
  const ratesList = document.querySelector('.payment-grid');

  const rates = await getRates();

  showRates();

  function showRates() {
    ratesList.innerHTML = '';

    rates.forEach((rate) => {
      const rateElement = document.createElement('div');
      rateElement.classList.add('price-card');

      rateElement.innerHTML = `  
      <article class="payment-card">
        <div class="blob">
            <svg viewBox="0 0 200 200">
            <path
                fill="#e7ebea"
                d="M43.4,-58.3C55.6,-49.9,64.4,-36.2,68.7,-21.1C73,-6,72.8,10.5,66.6,24.4C60.4,38.3,48.2,49.6,34.3,58.1C20.4,66.6,4.8,72.3,-11.3,72.1C-27.4,71.9,-44,65.8,-55.4,54.4C-66.8,43,-73,26.3,-73.9,9.4C-74.8,-7.5,-70.4,-24.6,-60.4,-37.4C-50.4,-50.2,-34.8,-58.7,-19.1,-65.1C-3.4,-71.5,12.4,-75.8,26.5,-71.6C40.6,-67.4,53,-54.7,43.4,-58.3Z"
                transform="translate(100 100)"
            />
            </svg>
        </div>
        <h3>${rate.name}</h3>
        <div class="payment-sub">${rate.duration}</div>
        <div class="payment-count">${rate.quantity} ${pluralizeLessons(rate.quantity)}</div>
        <div class="payment-row">
            <div class="payment-price">${rate.price} грн</div>
            <a href="#" class="btn btn-teal btn-sm">Оплатити</a>
        </div>
      </article>
      `;

      ratesList.appendChild(rateElement);
    });

    // Получаем модальное окно
    const modal = document.getElementById('myModal');

    // Получаем все кнопки, которые открывают модальное окно
    const btns = ratesList.querySelectorAll('.btn-teal');

    // Добавляем обработчик событий для каждой кнопки
    btns.forEach(function (btn) {
      btn.onclick = function () {
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
      };
    });
  }

  function pluralizeLessons(count) {
    const n = Math.abs(count) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) return 'уроків';
    if (n1 > 1 && n1 < 5) return 'уроки';
    if (n1 === 1) return 'урок';
    return 'уроків';
  }
});
