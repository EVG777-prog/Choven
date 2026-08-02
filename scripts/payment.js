document.addEventListener('DOMContentLoaded', async (event) => {
  // заполнение тарифов
  const ratesList = document.querySelector('.payment-grid');

  const rates = await getRates();

  showRates();

  function showRates() {
    ratesList.innerHTML = '';

    rates.forEach((rate) => {
      const rateElement = document.createElement('div');
      rateElement.classList.add('payment-card');

      rateElement.innerHTML = `  
        <div class="blob">
          <img src="../assets/pictures/payment-card-graphic.svg" alt="Payment card graphic" />
        </div>
        <h3>${rate.name}</h3>
        <div class="payment-sub">${rate.duration}</div>
        <div class="payment-count">${rate.quantity} ${pluralizeLessons(rate.quantity)}</div>
        <div class="payment-row">
            <div class="payment-price">${rate.price} грн</div>
            <a href="#" class="btn btn-teal btn-sm">Оплатити</a>
        </div>
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
