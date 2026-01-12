$(function () {
  const $header = $("header");
  const $globalBg = $("#global-bg");

  function typeText(el, text, speed = 90) {
    el.textContent = "";
    let i = 0;

    if (el._typingTimer) {
      clearInterval(el._typingTimer);
    }

    el._typingTimer = setInterval(() => {
      el.textContent += text[i];
      i++;

      if (i >= text.length) {
        clearInterval(el._typingTimer);
        el._typingTimer = null;
      }
    }, speed);
  }

  const sectionActions = {
    home($section) {
      $header.removeClass("black");

      $globalBg.addClass("is-hidden");

      const typingEl = $section.find(".typing")[0];
      const $cursor = $section.find(".cursor");

      if (!typingEl) return;

      typingEl.textContent = "";
      $cursor.css({
        opacity: 1,
        visibility: "visible",
      });

      setTimeout(() => {
        typeText(typingEl, `"We make wonderful show"`, 90);
      }, 1000);

      setTimeout(() => {
        $cursor.css({
          opacity: 0,
          visibility: "hidden",
        });
      }, 1000 + 2600);
    },

    default() {
      $header.addClass("black");

      $globalBg.removeClass("is-hidden");
    },
  };

  $(document).on("section:active", function (e, $section) {
    const id = $section.attr("id");

    if (id === "home") {
      sectionActions.home($section);
    } else {
      sectionActions.default($section);
    }
  });
});

$(function () {
  const MOBILE_MAX = 640;
  const isMobile = () => window.innerWidth <= MOBILE_MAX;
  const DRAG_THRESHOLD = 6;

  /* =================================================
    COMING SOON
  ================================================= */
  $.getJSON("./data/comingsoon.json").done(function (data) {
    const $news = $("#news");
    if (!$news.length) return;

    $news.find(".cs-img").attr({
      src: data.img,
      alt: data.tit + " poster image",
    });
    $news.find(".cs-tit").text(data.tit);
    $news.find(".cs-date").text(data.date);
    $news.find(".cs-des").text(data.des);
  });

  /* =================================================
    HISTORY
  ================================================= */
  $.getJSON("./data/history.json").done(function (data) {
    const $tabs = $(".history-tabs");
    const $tabsWrap = $(".overflow-wrap");
    const $scroll = $(".history-scroll");
    const $track = $(".history-track");
    const scrollEl = $scroll[0];
    const tabsWrapEl = $tabsWrap[0];

    if (!$tabs.length || !$scroll.length || !$track.length || !$tabsWrap.length)
      return;

    /* =========================
      PAUSE / LOCK STATE
    ========================= */
    let pauseByHover = false;
    let pauseByDrag = false;
    let pauseByClick = false;
    let lockByClick = false; // 🔥 PC 클릭 고정 상태

    function isPaused() {
      if (isMobile()) {
        return pauseByDrag || pauseByClick;
      }
      return pauseByHover || pauseByDrag || pauseByClick;
    }

    function resetPause() {
      pauseByHover = false;
      pauseByDrag = false;
      pauseByClick = false;
      lockByClick = false;
    }

    /* =========================
      HOVER TIMER (PC)
    ========================= */
    let hoverTimer = null;
    const HOVER_ACTIVE_DELAY = 1200;

    /* =========================
      TAB RENDER
    ========================= */
    data.forEach((item, i) => {
      $tabs.append(`
        <li class="${i === 0 ? "active" : ""}" data-year="${item.year}">
          <button type="button">${item.year}</button>
        </li>
      `);
    });

    /* =========================
      SECTION RENDER
    ========================= */
    data.forEach((yearItem) => {
      const $section = $(`
        <section class="history-year" data-year="${yearItem.year}"></section>
      `);

      yearItem.list.forEach((item) => {
        $section.append(`
          <article class="history-card">
            <div class="img-wrap">
              <div class="img-inner">
                <img src="${item.img}" alt="${item.tit}" draggable="false" />
              </div>
            </div>
          </article>
        `);
      });

      $track.append($section);
    });

    /* =========================
      INFINITE CLONE
    ========================= */
    $track.append($track.children().clone());

    let halfWidth = 0;
    function updateWidth() {
      halfWidth = $track[0].scrollWidth / 2;
    }

    /* =========================
      VIEWPORT CHECK
    ========================= */
    function isInViewport(el) {
      const elRect = el.getBoundingClientRect();
      const contRect = scrollEl.getBoundingClientRect();
      return elRect.right > contRect.left && elRect.left < contRect.right;
    }

    /* =========================
      ACTIVE TAB FOLLOW
    ========================= */
    function ensureActiveTabVisible($tab) {
      if (!$tab || !$tab.length) return;

      const tabRect = $tab[0].getBoundingClientRect();
      const wrapRect = tabsWrapEl.getBoundingClientRect();

      const diff =
        tabRect.left + tabRect.width / 2 - (wrapRect.left + wrapRect.width / 2);

      tabsWrapEl.scrollLeft += diff;
    }

    /* =========================
      SCROLL EVENT
    ========================= */
    const $years = $track.find(".history-year");
    const $tabItems = $tabs.find("li");
    let lastActiveYear = null;

    $scroll.on("scroll", function () {
      const center = scrollEl.scrollLeft + scrollEl.clientWidth / 2;
      let activeYear = null;

      $years.each(function () {
        const start = this.offsetLeft;
        const end = start + this.offsetWidth;
        if (center >= start && center < end) {
          activeYear = $(this).data("year");
          return false;
        }
      });

      if (activeYear) {
        $tabItems.each(function () {
          $(this).toggleClass("active", $(this).data("year") === activeYear);
        });

        if (activeYear !== lastActiveYear) {
          lastActiveYear = activeYear;
          ensureActiveTabVisible(
            $tabItems.filter(`[data-year="${activeYear}"]`)
          );
        }
      }

      const $active = $(".history-card .img-wrap.active");
      if ($active.length) {
        const $card = $active.closest(".history-card");
        if (!isInViewport($card[0])) {
          $(".img-wrap").removeClass("active");
          resetPause();
        }
      }

      if (halfWidth && scrollEl.scrollLeft >= halfWidth) {
        scrollEl.scrollLeft -= halfWidth;
      }
    });

    /* =========================
      AUTO SCROLL
    ========================= */
    const getAutoStep = () => (isMobile() ? 2 : 3);

    function autoScroll() {
      if (!isPaused()) {
        scrollEl.scrollLeft += getAutoStep();
        if (scrollEl.scrollLeft >= halfWidth) {
          scrollEl.scrollLeft -= halfWidth;
        }
      }
      requestAnimationFrame(autoScroll);
    }

    /* =========================
      HOVER PAUSE (PC)
    ========================= */
    $scroll.on("mouseenter", function () {
      if (!isMobile()) pauseByHover = true;
    });

    $scroll.on("mouseleave", function () {
      if (!isMobile()) {
        if (lockByClick) return; // 🔥 클릭 고정 중이면 건드리지 않음
        $(".img-wrap").removeClass("active");
        hoverTimer && clearTimeout(hoverTimer);
        resetPause();
      }
    });

    /* =========================
      DRAG
    ========================= */
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let moved = false;

    $scroll.on("mousedown touchstart", function (e) {
      const x = e.pageX || e.originalEvent.touches[0].pageX;

      isDragging = true;
      moved = false;
      startX = x;
      startScrollLeft = scrollEl.scrollLeft;
      pauseByDrag = true;

      if ($(".img-wrap.active").length) {
        $(".img-wrap").removeClass("active");
        resetPause();
      }
    });

    $scroll.on("mousemove touchmove", function (e) {
      if (!isDragging) return;

      const x = e.pageX || e.originalEvent.touches[0].pageX;
      const diff = x - startX;

      if (Math.abs(diff) > DRAG_THRESHOLD) {
        moved = true;
        scrollEl.scrollLeft = startScrollLeft - diff;
      }
    });

    $scroll.on("mouseup touchend touchcancel", function () {
      isDragging = false;
      pauseByDrag = false;
    });

    /* =========================
      PC HOVER ACTIVE
    ========================= */
    if (!isMobile()) {
      $scroll.on("mouseenter", ".history-card", function () {
        if (isPaused() || lockByClick) return;

        const $card = $(this);
        hoverTimer = setTimeout(() => {
          $(".img-wrap").removeClass("active");
          $card.find(".img-wrap").addClass("active");
          pauseByHover = true;
        }, HOVER_ACTIVE_DELAY);
      });

      $scroll.on("mouseleave", ".history-card", function () {
        hoverTimer && clearTimeout(hoverTimer);
      });
    }

    /* =========================
      PC CLICK ACTIVE (🔥 FIXED)
    ========================= */
    if (!isMobile()) {
      $scroll.on("click", ".history-card", function () {
        const $img = $(this).find(".img-wrap");
        const wasActive = $img.hasClass("active");

        hoverTimer && clearTimeout(hoverTimer);

        if (wasActive) {
          $img.removeClass("active");
          resetPause();
        } else {
          $(".img-wrap").removeClass("active");
          $img.addClass("active");
          pauseByClick = true;
          lockByClick = true;
        }
      });
    }

    /* =========================
      MOBILE TAP ACTIVE
    ========================= */
    if (isMobile()) {
      $scroll.on("click", ".history-card", function () {
        if (moved) {
          moved = false;
          return;
        }

        const $img = $(this).find(".img-wrap");
        const wasActive = $img.hasClass("active");

        $(".img-wrap").not($img).removeClass("active");

        if (wasActive) {
          $img.removeClass("active");
          resetPause();
        } else {
          $img.addClass("active");
          pauseByClick = true;
        }

        moved = false;
      });
    }

    /* =========================
      TAB CLICK
    ========================= */
    $tabs.on("click", "li", function () {
      const year = $(this).data("year");
      const $target = $track.find(`.history-year[data-year="${year}"]`).first();
      if (!$target.length) return;

      pauseByClick = true;

      $tabs.find("li").removeClass("active");
      $(this).addClass("active");
      ensureActiveTabVisible($(this));

      const offset =
        $target.position().left +
        scrollEl.scrollLeft -
        scrollEl.clientWidth * 0.3;

      $scroll.stop().animate({ scrollLeft: offset }, 600, () => {
        pauseByClick = false;
      });
    });

    /* =========================
      START
    ========================= */
    setTimeout(() => {
      updateWidth();
      ensureActiveTabVisible($tabs.find("li.active").first());
      requestAnimationFrame(autoScroll);
    }, 500);
  });
});

/* =================================================
  3D TILT (PC ONLY)
================================================= */
$(document).on("mousemove", ".history-card .img-wrap.active", function (e) {
  if (window.innerWidth <= 900) return;

  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const rotateY = ((x - rect.width / 2) / rect.width) * -14;
  const rotateX = ((y - rect.height / 2) / rect.height) * 14;

  this.style.transform = `
    perspective(2000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
  `;
});

$(document).on("mouseleave", ".history-card .img-wrap.active", function () {
  if (window.innerWidth <= 900) return;
  this.style.transform = "perspective(2000px) rotateX(0) rotateY(0)";
});
