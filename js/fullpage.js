$(function () {
  const $container = $("#fullpage");
  const $sections = $(".fp-section");
  const $gnbItems = $(".gnb li");

  let current = 0;
  let isAnimating = false;

  const WHEEL_THRESHOLD = 120;
  const TOUCH_THRESHOLD = 80;
  const ANIMATION_TIME = 900;

  let positions = [];
  let wheelDelta = 0;

  /* ===============================
     Touch
  =============================== */
  let touchStartY = 0;
  let touchDeltaY = 0;
  let isTouching = false;

  /* ===============================
     fullpage 차단 플래그
  =============================== */
  window.disableFullpageWheel = false;

  /* ===============================
     섹션 위치
  =============================== */
  function calcPositions() {
    positions = [];
    let offset = 0;
    $sections.each(function () {
      positions.push(offset);
      offset += $(this).outerHeight();
    });
  }

  /* ===============================
     active + 이벤트
  =============================== */
  function setActive(index) {
    $sections.removeClass("active");
    const $current = $sections.eq(index).addClass("active");

    $gnbItems.removeClass("active");
    $gnbItems.eq(index).addClass("active");

    $(document).trigger("section:active", [$current, index]);
  }

  /* ===============================
     이동
  =============================== */
  function moveTo(index) {
    if (index < 0 || index >= $sections.length) return;
    if (isAnimating) return;

    isAnimating = true;
    current = index;

    setActive(current);

    $container.css("transform", `translate3d(0, -${positions[current]}px, 0)`);

    setTimeout(() => {
      isAnimating = false;
    }, ANIMATION_TIME);
  }

  /* ===============================
     초기화
  =============================== */
  function init() {
    wheelDelta = 0;
    current = 0;
    isAnimating = false;

    calcPositions();

    $container.css({
      transition: "none",
      transform: "translate3d(0,0,0)",
    });

    setActive(0);

    requestAnimationFrame(() => {
      $container.css(
        "transition",
        `transform ${ANIMATION_TIME}ms cubic-bezier(0.77, 0, 0.175, 1)`,
      );
    });
  }

  init();

  /* ===============================
     PC wheel
  =============================== */
  document.addEventListener(
    "wheel",
    function (e) {
      if (window.disableFullpageWheel) return;
      if (isAnimating) return;

      e.preventDefault();
      wheelDelta += e.deltaY;

      if (wheelDelta > WHEEL_THRESHOLD) {
        moveTo(current + 1);
        wheelDelta = 0;
      } else if (wheelDelta < -WHEEL_THRESHOLD) {
        moveTo(current - 1);
        wheelDelta = 0;
      }
    },
    { passive: false },
  );

  /* ===============================
     Mobile touch
  =============================== */
  document.addEventListener(
    "touchstart",
    function (e) {
      if (window.disableFullpageWheel) return;
      if (isAnimating) return;

      isTouching = true;
      touchStartY = e.touches[0].clientY;
      touchDeltaY = 0;
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    function (e) {
      if (!isTouching) return;
      if (window.disableFullpageWheel) return;

      const currentY = e.touches[0].clientY;
      touchDeltaY = touchStartY - currentY;

      e.preventDefault(); // iOS bounce 방지
    },
    { passive: false },
  );

  document.addEventListener("touchend", function () {
    if (!isTouching) return;
    if (isAnimating) return;

    if (touchDeltaY > TOUCH_THRESHOLD) {
      moveTo(current + 1);
    } else if (touchDeltaY < -TOUCH_THRESHOLD) {
      moveTo(current - 1);
    }

    isTouching = false;
    touchDeltaY = 0;
  });

  /* ===============================
     map / 내부 스크롤 예외
  =============================== */
  $(".map, .scroll-area").on("touchstart touchmove wheel", function (e) {
    window.disableFullpageWheel = true;
    e.stopPropagation();
  });

  $(".map, .scroll-area").on("touchend mouseleave", function () {
    window.disableFullpageWheel = false;
  });

  /* ===============================
     키보드
  =============================== */
  document.addEventListener("keydown", function (e) {
    if (isAnimating) return;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      moveTo(current + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      moveTo(current - 1);
    }
  });

  /* ===============================
     GNB 클릭
  =============================== */
  $(".gnb a").on("click", function (e) {
    e.preventDefault();
    if (isAnimating) return;

    const $target = $($(this).attr("href"));
    if (!$target.length) return;

    moveTo($sections.index($target));
  });

  /* ===============================
     resize
  =============================== */
  $(window).on("resize", function () {
    calcPositions();
    moveTo(current);
  });

  const $tabsWrap = $(".overflow-wrap");

  let tabDragging = false;
  let tabStartX = 0;
  let tabStartScrollLeft = 0;
  let tabLockedAxis = null;

  const AXIS_LOCK_THRESHOLD = 6;

  $tabsWrap.on("touchstart", function (e) {
    window.disableFullpageWheel = true;

    tabDragging = true;
    tabLockedAxis = null;

    tabStartX = e.touches[0].clientX;
    tabStartScrollLeft = this.scrollLeft;
  });

  $tabsWrap.on("touchmove", function (e) {
    if (!tabDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const dx = tabStartX - currentX;

    if (!tabLockedAxis) {
      if (Math.abs(dx) > AXIS_LOCK_THRESHOLD) tabLockedAxis = "x";
      else return;
    }

    if (tabLockedAxis === "x") {
      this.scrollLeft = tabStartScrollLeft + dx;

      e.preventDefault();
      e.stopPropagation();
    }
  });

  $tabsWrap.on("touchend touchcancel", function () {
    tabDragging = false;
    tabLockedAxis = null;

    setTimeout(() => {
      window.disableFullpageWheel = false;
    }, 50);
  });

  $tabsWrap.on("wheel", function (e) {
    window.disableFullpageWheel = true;
    e.stopPropagation();

    clearTimeout(this.__wheelUnlockTimer);
    this.__wheelUnlockTimer = setTimeout(() => {
      window.disableFullpageWheel = false;
    }, 120);
  });
});
