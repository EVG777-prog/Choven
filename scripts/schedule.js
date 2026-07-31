document.addEventListener("DOMContentLoaded", async (event) => {
  // заполнение тарифов
  const scheduleSection = document.querySelector(".schedule-section");
  const scheduleContainer = scheduleSection.querySelector(
    ".schedule-container"
  );
  const showMoreLessonsButton =
    scheduleSection.querySelector(".show-more-lessons");
  const selectedTimeInput = scheduleSection.querySelector("#selectedTime");
  const selectLevelInput = scheduleSection.querySelector("#selectedLevel");

  const pageTitle = document.title;

  const schedule = await getLessons(pageTitle);

  console.log(schedule);

  const teachers = await getTeachers(pageTitle);

  let rates;

  // Если расписания нет, скрываем секцию
  if (!schedule.length) {
    scheduleSection.style.display = "none";
  } else {
    // Получаем все кастомные селекты
    const customSelects = document.querySelectorAll(
      ".schedule-section .custom-select"
    );

    fillOptionsSelect();

    customSelects.forEach(function (customSelect) {
      const selectedValue = customSelect.querySelector(".selected-value");
      const valueList = customSelect.querySelector(".value-list");
      const hiddenInput = customSelect.querySelector("input[type=hidden]"); // Предполагается, что у каждого селекта есть свой скрытый input

      // Обработчик клика по выбранному значению
      selectedValue.addEventListener("click", function () {
        customSelect.classList.toggle("open");
        valueList.classList.toggle("hidden");
      });

      // Обработчик клика по элементу списка
      valueList.addEventListener("click", function (e) {
        if (e.target.tagName.toLowerCase() === "li") {
          selectedValue.textContent = e.target.textContent;
          selectedValue.dataset.value = e.target.dataset.value;
          hiddenInput.value = e.target.dataset.value; // Обновляем значение скрытого input
          showLessons(schedule);
          customSelect.classList.remove("open");
          valueList.classList.add("hidden");
        }
      });
    });

    // Закрытие всех открытых списков при клике вне селектов
    document.addEventListener("click", function (e) {
      customSelects.forEach(function (customSelect) {
        var valueList = customSelect.querySelector(".value-list");
        if (!customSelect.contains(e.target)) {
          customSelect.classList.remove("open");
          valueList.classList.add("hidden");
        }
      });
    });

    setTimeout(async () => {
      rates = await getRates();
      showLessons(schedule); // Иначе добавляем лекции в DOM
    }, 100);

    // Получаем все кнопки, которые открывают модальное окно

    showMoreLessonsButton.addEventListener("click", () => {
      // Проверяем, раскрыт ли контейнер
      if (scheduleContainer.classList.contains("expanded")) {
        // showLessons(schedule);
        scheduleContainer.classList.remove("expanded");
        showMoreLessonsButton.textContent = "Більше";
        setHeightContainer();
      } else {
        // Раскрываем контейнер
        // showLessons(schedule);
        scheduleContainer.classList.add("expanded");
        showMoreLessonsButton.textContent = "Приховати";
        setHeightContainer();
      }
    });
  }
  // использование с локальными данными
  function showLessons(schedule) {
    const screenWidth = window.innerWidth;

    // Получаем модальное окно
    const modal = document.getElementById("myModal");

    const time = selectedTimeInput.value;
    const level = selectLevelInput.value;
    let lessons = [...schedule];

    if (level !== "any")
      lessons = lessons.filter((lesson) => lesson.level.includes(level));

    if (time !== "any") {
      lessons = lessons.filter((lesson) => {
        const timeLesson = parseInt(
          lesson.schedule.substring(
            lesson.schedule.indexOf(":") - 2,
            lesson.schedule.indexOf(":")
          )
        );
        if (time === "Ранковий час" && timeLesson < 12) {
          return true;
        } else if (
          time === "Денний час" &&
          timeLesson >= 12 &&
          timeLesson < 17
        ) {
          return true;
        } else if (time === "Вечірній час" && timeLesson >= 17) {
          return true;
        }
        return false;
      });
    }

    scheduleContainer.innerHTML = "";

    const textNoLessonsWarning = document.querySelector(".no-lessons-warning");

    console.log(textNoLessonsWarning);

    textNoLessonsWarning.style.display = lessons.length == 0 ? "block" : "none";

    console.log(textNoLessonsWarning);

    let countColumns = 4;

    if (screenWidth < 716) {
      countColumns = 1;
    } else if ((screenWidth >= 716) & (screenWidth < 1076)) {
      countColumns = 2;
    } else if ((screenWidth >= 1076) & (screenWidth < 1436)) {
      countColumns = 3;
    } else if ((screenWidth >= 1436) & (screenWidth < 1797)) {
      countColumns = 4;
    } else {
      countColumns = 5;
    }

    for (i = 0; i < countColumns; i++) {
      const scheduleColumn = document.createElement("div");
      scheduleColumn.classList.add("schedule-column");
      scheduleContainer.appendChild(scheduleColumn);
    }

    const scheduleColumns =
      scheduleSection.querySelectorAll(".schedule-column");

    lessons.forEach((lesson, i) => {
      const lessonElement = document.createElement("div");
      lessonElement.classList.add("schedule-card");
      lessonElement.classList.add(
        `${lesson.level === "з нуля" ? "zero" : lesson.level}`
      );

      const rate = rates.filter((rate) => rate.name === lesson.rate)[0];
      const rateText = rate
        ? `${rate.price} грн/${rate.quantity} уроків`
        : lesson.rate;

      const teacher = teachers.filter(
        (teacher) => teacher.name === lesson.teacher
      )[0];

      const link = teacher.link
        ? ` <button class="youtube-button" onclick="showTeacherVideo('${teacher.link}')">
                <img src="../assets/icons/icon_play.svg" alt="Icon" class="icon-play"/>
           </button>`
        : "";

      lessonElement.innerHTML = `
            <span class="schedule-card_start">${
              lesson.timeStart ? `Старт: ${lesson.timeStart}` : ""
            }</span>
            <span class="schedule-card_level">${lesson.level}</span>
            <div class="schedule-card_info-container flex-row">
              <div class="schedule-card_info-headers">
                <p class="schedule-card_schedule">Розклад:</p>
                <p class="schedule-card_teacher">Викладач:</p>
                <p class="schedule-card_rate">Вартість:</p>
              </div>
              <div class="schedule-card_info-data">
                <p class="schedule-card_schedule">${lesson.schedule}</p>
                <p class="schedule-card_teacher">${lesson.teacher} ${link}</p>
                <p class="schedule-card_rate">${rateText}</p></div>
              </div>
            </div>
            <button class="order">Записатися</button>
            <button class="show-more"></button>
            `;

      scheduleColumns[i % countColumns].appendChild(lessonElement);
    });

    const showButtons = scheduleContainer.querySelectorAll(".show-more");

    showButtons.forEach((showButton) =>
      showButton.addEventListener("click", function () {
        const scheduleCard = this.closest(".schedule-card");
        scheduleCard.classList.toggle("additional-info");
        setHeightContainer();
      })
    );

    const btns = document.querySelectorAll(".schedule-section .order");

    // Добавляем обработчик событий для каждой кнопки
    btns.forEach(function (btn) {
      btn.onclick = function () {
        const scheduleCard = btn.closest(".schedule-card");

        console.log(scheduleCard);

        const level = scheduleCard.querySelector(
          ".schedule-card_level"
        ).textContent;
        const schedule = scheduleCard.querySelector(
          ".schedule-card_info-data .schedule-card_schedule"
        ).textContent;
        const teacher = scheduleCard.querySelector(
          ".schedule-card_info-data .schedule-card_teacher"
        ).textContent;
        const rate = scheduleCard.querySelector(
          ".schedule-card_info-data .schedule-card_rate"
        ).textContent;

        const data = `${level} ${schedule} ${teacher} ${rate}`;

        modal.dataset.lesson = data;

        modal.style.display = "block";
        modal.classList.add("schedule");
        document.body.classList.add("no-scroll");
      };
    });

    if (screenWidth <= 715) {
      showMoreLessonsButton.style.display =
        lessons.length > 10 ? "block" : "none";

      setHeightContainer();
    }
  }

  function fillOptionsSelect() {
    const selectLevelOptions = document.querySelector("#selectLevelOptions");

    const uniqueLevels = [...new Set(schedule.map((obj) => obj.level))];

    console.log(uniqueLevels);

    const listItemsHtml = uniqueLevels
      .map((level) => `<li data-value="${level}">${level}</li>`)
      .join("");

    selectLevelOptions.innerHTML = `
    <li data-value="any">Всі рівні</li>
    ${listItemsHtml}
    `;
  }

  function setHeightContainer() {
    // Получаем вычисленные стили контейнера
    const computedStyles = window.getComputedStyle(
      scheduleContainer.querySelector(".schedule-column")
    );

    // Получаем значение свойства gap
    const gap = computedStyles.getPropertyValue("gap").replace(/\D/g, "");

    let scheduleCards;
    if (scheduleContainer.classList.contains("expanded")) {
      scheduleCards = scheduleContainer.querySelectorAll(".schedule-card");
    } else {
      // Получаем первые 10 элементов с классом schedule-card
      scheduleCards = scheduleContainer.querySelectorAll(
        ".schedule-card:nth-of-type(-n+10)"
      );
    }

    // Инициализируем переменную для хранения высоты
    let totalHeight = gap * (scheduleCards.length - 1);

    // Итерируемся по первым 10 элементам и суммируем их высоту
    scheduleCards.forEach((scheduleCard) => {
      totalHeight += scheduleCard.getBoundingClientRect().height;
    });

    scheduleContainer.style.maxHeight = `${totalHeight}px`;
  }
});
