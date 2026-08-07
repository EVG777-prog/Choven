document.addEventListener('DOMContentLoaded', async (event) => {
  // заполнение тарифов
  const ratesList = document.querySelector('.pricing-grid');

  const rates = await getRates();

  showRates();

  function showRates() {
    const graphicTop = `
          <div class="blob" style="width: 150px; height: 150px; top: 0px; right: 0px">
            <img src="assets/pictures/pricing-graphic_1.svg" alt="Blob" />
          </div>
    `;
    const graphicBottom = `
          <div class="blob" style="width: 150px; height: 150px; bottom: -85px; right: 0px">
            <img src="assets/pictures/pricing-graphic_2.svg" alt="Blob" />
          </div>
    `;
    ratesList.innerHTML = '';

    rates.forEach((rate, index) => {
      if (rate.details.length > 0) {
        const rateElement = document.createElement('div');
        rateElement.classList.add('price-card');

        rateElement.innerHTML = `
                ${index % 2 === 0 ? graphicBottom : graphicTop}
                <h3>${rate.name}</h3>
                <div class="freq">${rate.duration}</div>
                <ul>
                  <li><span class="dot"></span>${rate.details[0]}</li>
                  <li><span class="dot"></span>${rate.details[1]}</li>
                  <li><span class="dot"></span>${rate.details[2]}</li>
                  <li><span class="dot"></span>${rate.details[3]}</li>
                </ul>
                <div class="price">${rate.price} грн</div>
                <a href="#booking" class="btn btn-teal btn-sm">Записатись</a>
            `;

        ratesList.appendChild(rateElement);
      }
    });

    // Получаем модальное окно
    const modal = document.getElementById('myModal');

    // Получаем все кнопки, которые открывают модальное окно
    const btns = ratesList.querySelectorAll('.apply-button');

    // Добавляем обработчик событий для каждой кнопки
    btns.forEach(function (btn) {
      btn.onclick = function () {
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
      };
    });
  }
});
