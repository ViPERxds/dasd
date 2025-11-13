document.addEventListener("DOMContentLoaded", () => {
  const groups = document.querySelectorAll(".diag__chips");

  groups.forEach((group) => {
    group.addEventListener("click", (event) => {
      const target = event.target;
      if (!target.classList.contains("chip")) return;

      group.querySelectorAll(".chip").forEach((chip) => {
        chip.classList.remove("chip--active");
      });

      target.classList.add("chip--active");
    });
  });

  const runButton = document.getElementById("diagRun");
  const resultBox = document.getElementById("diagResult");

  const buildResult = (status, title, body, steps) => {
    const dotClass =
      status === "ok"
        ? "diag__pill-dot--ok"
        : status === "warn"
        ? "diag__pill-dot--warn"
        : "diag__pill-dot--danger";

    const statusText =
      status === "ok" ? "Лёгкое отклонение" : status === "warn" ? "Нужна корректировка условий" : "Высокий риск, действуйте аккуратно";

    const stepsHtml = steps
      .map((item) => `<li>${item}</li>`)
      .join("");

    resultBox.innerHTML = `
      <div class="diag__pill">
        <span class="diag__pill-dot ${dotClass}"></span>
        ${statusText}
      </div>
      <h3 class="diag__title">${title}</h3>
      <p class="diag__body">${body}</p>
      ${
        stepsHtml
          ? `<ul class="diag__list">${stepsHtml}</ul>`
          : ""
      }
    `;
  };

  const getSelectedCode = (groupName) => {
    const group = document.querySelector(
      `.diag__chips[data-diag-group="${groupName}"]`
    );
    if (!group) return null;
    const active = group.querySelector(".chip--active");
    return active ? active.dataset.code : null;
  };

  runButton?.addEventListener("click", () => {
    const leaf = getSelectedCode("leaf");
    const soil = getSelectedCode("soil");
    const pests = getSelectedCode("pests");

    if (!leaf && !soil && !pests) {
      buildResult(
        "ok",
        "Пока всё выглядит спокойно",
        "Вы не отметили ни одного тревожного признака. Наблюдайте за растением ещё несколько дней, не меняя условия резко. Если появятся новые симптомы — вернитесь к диагностике.",
        []
      );
      return;
    }

    if (pests && pests !== "none") {
      buildResult(
        "danger",
        "Высока вероятность вредителей",
        "По описанию очень похоже, что на растении поселились вредители. Их важно убрать как можно раньше, пока колония не разрослась.",
        [
          "Изолируйте растение от остальных минимум на 2 недели.",
          "Тщательно осмотрите нижнюю сторону листьев, стебли и пазухи.",
          "Промойте растение под тёплым душем с мягким мылом, защитив грунт плёнкой.",
          "Примените подходящий биопрепарат или инсектицид курсом, строго по инструкции.",
        ]
      );
      return;
    }

    if (leaf === "yellow" && soil === "wet") {
      buildResult(
        "danger",
        "Возможен перелив и загнивание корней",
        "Жёлтые листья на фоне постоянно мокрой почвы чаще всего говорят о переливе. Корням не хватает воздуха, они начинают подгнивать, из‑за чего растение теряет листья.",
        [
          "Дайте грунту хорошо просохнуть до лёгкой сухости на глубину 2–3 см.",
          "Уберите всю воду из поддона, проверьте, есть ли отверстия для дренажа.",
          "При сильном запахе сырости и чёрных корнях пересадите растение в свежий, более лёгкий субстрат.",
        ]
      );
      return;
    }

    if (leaf === "dry" && !soil) {
      buildResult(
        "warn",
        "Сухие кончики чаще всего от сухого воздуха",
        "Подсыхающие кончики при в целом зелёном листе нередко связаны с сухим воздухом, особенно зимой возле батарей.",
        [
          "Отодвиньте горшок от батареи и источников горячего сухого воздуха.",
          "Поставьте рядом поддон с керамзитом и водой или используйте увлажнитель.",
          "Самые сильно подсохшие кончики можно аккуратно подрезать по форме листа.",
        ]
      );
      return;
    }

    if (leaf === "pale" && soil === "normal") {
      buildResult(
        "warn",
        "Растению может не хватать света или питания",
        "Бледные, вытянутые листья обычно сигнализируют о том, что растению не хватает света, реже — питания.",
        [
          "Переставьте растение ближе к светлому окну, избегая прямых обжигающих лучей.",
          "Поворачивайте горшок разной стороной к свету раз в 1–2 недели.",
          "Через 1–2 недели после изменения условий можно дать мягкую комплексную подкормку.",
        ]
      );
      return;
    }

    if (leaf === "spots" && soil === "wet") {
      buildResult(
        "warn",
        "Возможна грибковая инфекция из‑за сырости",
        "Пятна на листьях при сыром, прохладном содержании часто связаны с развитием грибковых заболеваний.",
        [
          "Удалите сильно поражённые листья, не жалейте самые больные.",
          "Обеспечьте хорошее проветривание без холодных сквозняков.",
          "Используйте мягкий фунгицид по инструкции и временно уменьшите полив.",
        ]
      );
      return;
    }

    buildResult(
      "ok",
      "Нужны дополнительные наблюдения",
      "По выбранным признакам сложно назвать одну конкретную причину. Но вы уже сделали важный шаг — внимательно посмотрели на растение.",
      [
        "Ведите небольшие заметки: когда поливали, подкармливали, куда ставили горшок.",
        "Фотографируйте растение раз в 7–10 дней, чтобы отслеживать динамику.",
        "Если состояние продолжит ухудшаться, вернитесь к разделам о симптомах и лечении выше.",
      ]
    );
  });

  // Reveal-on-scroll анимация секций
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("reveal", "reveal--visible");
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    revealItems.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  // Лёгкий параллакс для карточки растения в шапке
  const heroVisual = document.querySelector(".hero__visual");
  const heroMainCard = document.querySelector(".hero-card--main");

  if (heroVisual && heroMainCard) {
    let frameRequested = false;
    let targetX = 0;
    let targetY = 0;

    const handleMove = (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetX = x * 12;
      targetY = y * 10;

      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(() => {
          heroMainCard.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
          frameRequested = false;
        });
      }
    };

    const resetMove = () => {
      heroMainCard.style.transform = "translate3d(0, 0, 0)";
    };

    heroVisual.addEventListener("mousemove", handleMove);
    heroVisual.addEventListener("mouseleave", resetMove);
  }
});


