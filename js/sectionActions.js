$(function () {
  const $header = $("header");

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
  $.getJSON("./data/history.json").done(function (data) {
    const $tabs = $(".history-tabs");
    const $scroll = $(".history-scroll");
    const $track = $(".history-track");
    const scrollEl = $scroll[0];

    if (!$tabs.length || !$scroll.length || !$track.length) return;

    /* =================================================
      PAUSE STATE
    ================================================= */
    let pauseByHover = false;
    let pauseByDrag = false;
    let pauseByClick = false;

    function resetPause() {
      pauseByHover = false;
      pauseByDrag = false;
      pauseByClick = false;
    }

    function isPaused() {
      return pauseByHover || pauseByDrag || pauseByClick;
    }

    /* =================================================
      HOVER DELAY STATE
    ================================================= */
    let hoverTimer = null;
    const HOVER_ACTIVE_DELAY = 1200;

    /* =================================================
      1. 탭 생성
    ================================================= */
    data.forEach((item, i) => {
      $tabs.append(`
        <li class="${i === 0 ? "active" : ""}" data-year="${item.year}">
          <button type="button">${item.year}</button>
        </li>
      `);
    });

    /* =================================================
      2. 연도 섹션 렌더
    ================================================= */
    data.forEach((yearItem) => {
      const $section = $(
        `<section class="history-year" data-year="${yearItem.year}"></section>`
      );

      yearItem.list.forEach((item) => {
        $section.append(`
          <article class="history-card">
            <div class="img-wrap">
              <img src="${item.img}" alt="${item.tit}" draggable="false" />
            </div>
          </article>
        `);
      });

      $track.append($section);
    });

    /* =================================================
      3. 무한 스크롤용 복제
    ================================================= */
    $track.append($track.children().clone());

    let halfWidth = 0;
    function updateWidth() {
      halfWidth = $track[0].scrollWidth / 2;
    }

    /* =================================================
      4. viewport 판별
    ================================================= */
    function isInViewport(el) {
      const elRect = el.getBoundingClientRect();
      const containerRect = scrollEl.getBoundingClientRect();

      return (
        elRect.right > containerRect.left && elRect.left < containerRect.right
      );
    }

    /* =================================================
      5. scroll → active 이탈 감지 (🔥 핵심)
    ================================================= */
    $scroll.on("scroll", function () {
      const $active = $(".history-card .img-wrap.active");
      if ($active.length) {
        const $card = $active.closest(".history-card");

        if (!isInViewport($card[0])) {
          // ✅ active 전체 제거
          $(".img-wrap").removeClass("active");

          // ✅ hover 타이머 제거
          if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
          }

          // ✅ pause 전부 해제 → autoScroll 재개
          resetPause();
        }
      }

      // 무한 스크롤 보정
      if (halfWidth && scrollEl.scrollLeft >= halfWidth) {
        scrollEl.scrollLeft -= halfWidth;
      }
    });

    /* =================================================
      6. Auto Scroll
    ================================================= */
    const AUTO_STEP = 2;

    function autoScroll() {
      if (!isPaused()) {
        scrollEl.scrollLeft += AUTO_STEP;

        if (scrollEl.scrollLeft >= halfWidth) {
          scrollEl.scrollLeft -= halfWidth;
        }
      }
      requestAnimationFrame(autoScroll);
    }

    /* =================================================
      7. Scroll 영역 Hover → pause
    ================================================= */
    $scroll.on("mouseenter", () => (pauseByHover = true));
    $scroll.on("mouseleave", () => {
      // hover 타이머 제거
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }

      // ✅ active 전부 제거
      $(".img-wrap").removeClass("active");

      // ✅ 3D transform 원복 (active로만 제어해도 되지만 안전하게)
      $(".history-card .img-wrap").css("transform", "");

      // ✅ pause 전부 해제 → autoScroll 계속
      resetPause();
    });

    /* =================================================
      8. Drag to Scroll
    ================================================= */
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let moved = false;
    const DRAG_THRESHOLD = 6;

    $scroll.on("mousedown touchstart", function (e) {
      const x = e.pageX || e.originalEvent.touches[0].pageX;

      isDragging = true;
      moved = false;
      startX = x;
      startScrollLeft = scrollEl.scrollLeft;

      pauseByDrag = true;

      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    });

    $(document).on("mousemove touchmove", function (e) {
      if (!isDragging) return;

      const x = e.pageX || e.originalEvent.touches[0].pageX;
      const diff = x - startX;

      if (Math.abs(diff) > DRAG_THRESHOLD) {
        moved = true;
        scrollEl.scrollLeft = startScrollLeft - diff;
      }
    });

    $(document).on("mouseup touchend touchcancel", function () {
      if (!isDragging) return;

      isDragging = false;
      pauseByDrag = false;
    });

    /* =================================================
      9. hover → delay active
    ================================================= */
    $scroll.on("mouseenter", ".history-card", function () {
      if (isPaused()) return;

      const $card = $(this);

      hoverTimer = setTimeout(() => {
        $(".img-wrap").removeClass("active");
        $card.find(".img-wrap").addClass("active");
        pauseByHover = true;
      }, HOVER_ACTIVE_DELAY);
    });

    $scroll.on("mouseleave", ".history-card", function () {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    });

    /* =================================================
      10. 클릭 → active
    ================================================= */
    $scroll.on("click", ".history-card", function (e) {
      if (moved) {
        e.preventDefault();
        return;
      }

      $(".img-wrap").removeClass("active");
      $(this).find(".img-wrap").addClass("active");

      pauseByClick = true;
      setTimeout(() => (pauseByClick = false), 800);
    });

    /* =================================================
      11. 시작
    ================================================= */
    setTimeout(() => {
      updateWidth();
      requestAnimationFrame(autoScroll);
    }, 500);
  });
});

$(document).on("mousemove", ".history-card .img-wrap.active", function (e) {
  if (window.innerWidth < 1024) return;

  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const cx = rect.width / 2;
  const cy = rect.height / 2;

  const rotateY = ((x - cx) / cx) * -7;
  const rotateX = ((y - cy) / cy) * 7;

  this.style.transform = `
      perspective(2000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1)
    `;
});

$(document).on("mouseleave", ".history-card .img-wrap.active", function () {
  if (window.innerWidth < 1024) return;

  this.style.transform = `
      perspective(2000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
});
