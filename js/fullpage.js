$(function () {
  const $container = $("#fullpage");
  const $sections = $(".fp-section");
  const $gnbItems = $(".gnb li");

  let current = 0;
  let isAnimating = false;

  let wheelDelta = 0;
  const WHEEL_THRESHOLD = 120;
  const ANIMATION_TIME = 1000;

  let positions = [];

  /* ===============================
     섹션 위치(px) 계산
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
     active 관리 + 히어로 트리거
  =============================== */
  function setActive(index) {
    $sections.removeClass("active");
    const $current = $sections.eq(index).addClass("active");

    $gnbItems.removeClass("active");
    $gnbItems.eq(index).addClass("active");

    $(document).trigger("section:active", [$current, index]);

    $(document).on("section:active", function (e, $section, index) {
      const $bg = $("#global-bg");

      if (index === 0) {
        $bg.addClass("is-hidden");
      } else {
        setTimeout(() => {
          $bg.removeClass("is-hidden");
        }, 300);
      }
    });
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
    isAnimating = false;
    current = 0;

    calcPositions();

    $container.css("transition", "none");
    $container.css("transform", "translate3d(0, 0, 0)");

    setActive(0);

    requestAnimationFrame(() => {
      $container.css("transition", `transform ${ANIMATION_TIME}ms ease`);
    });
  }

  init();

  /* ===============================
     resize → 맨 위
  =============================== */
  let resizeTimer = null;
  // $(window).on("resize", function () {
  //   clearTimeout(resizeTimer);
  //   resizeTimer = setTimeout(init, 150);
  // });

  /* ===============================
     wheel (delta 누적)
  =============================== */
  document.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
      if (isAnimating) return;

      wheelDelta += e.deltaY;

      if (wheelDelta > WHEEL_THRESHOLD) {
        moveTo(current + 1);
        wheelDelta = 0;
      } else if (wheelDelta < -WHEEL_THRESHOLD) {
        moveTo(current - 1);
        wheelDelta = 0;
      }
    },
    { passive: false }
  );

  /* ===============================
     키보드
  =============================== */
  document.addEventListener("keydown", function (e) {
    if (isAnimating) return;

    switch (e.key) {
      case "ArrowDown":
      case "PageDown":
        e.preventDefault();
        moveTo(current + 1);
        break;

      case "ArrowUp":
      case "PageUp":
        e.preventDefault();
        moveTo(current - 1);
        break;
    }
  });

  /* ===============================
     GNB 클릭
  =============================== */
  $(".gnb a").on("click", function (e) {
    e.preventDefault();
    if (isAnimating) return;

    const targetId = $(this).attr("href");
    const $targetSection = $(targetId);

    if (!$targetSection.length) return;

    const index = $sections.index($targetSection);
    moveTo(index);
  });
});
