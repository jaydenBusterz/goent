$(function () {
  // main modal
  $(document).on("ready", function () {
    $.getJSON("./data/mainModal.json", function (data) {
      if (data.switch) {
        $(".main-modal, .dim").addClass("active");
        $("html, body").addClass("noscroll");

        var modalData = `<div class="modal-cont">
                        <div class="img-wrap">
                            <img src="${data.modal.img}" alt="${data.modal.tit} poster image"/>
                        </div>
                        <div class="text-wrap">
                            <h3 class="tit">${data.modal.tit}</h3>
                            <p class="date">${data.modal.date}</p>
                            <p class="des">${data.modal.des}</p>
                        </div>
                    </div>`;
        $(".main-modal").append(modalData);
      }
    });
  });

  // 네비게이션
  $(".gnb li").on("click", function () {
    var sectionPos = $("." + this.id).offset().top;
    $("html, body").animate(
      {
        scrollTop: sectionPos - 50,
      },
      700
    );
    return false;
  });

  $(".lang li").on("click", function () {
    $(".lang li, .about .center").removeClass("active");
    $(this).addClass("active");
    console.log($(".about .center." + this.id));
    $("." + this.id).addClass("active");
  });

  var textBanner = $.getJSON("./data/textBanner.json", function (data) {
    for (i = 0; i < data.textBanner.length; i++) {
      var val = data.textBanner[i];
      var list = `
            <li>
                <strong class="title">${val.tit}</strong>
                <strong class="date">${val.date}</strong>
                <strong class="place">${val.place}</strong>
            </li>`;
      $(".infinite-label ul").append(list);
    }
    var ulTwo = $(".infinite-label ul").clone();
    $(".infinite-label").append(ulTwo);
    return data;
  });

  var nowwe = $.getJSON("./data/nowwe.json", function (data) {
    for (i = 0; i < data.nowwe.length; i++) {
      var val = data.nowwe[i];
      var list = `
            <div class="swiper-slide" data-thisIndex="${i}">
              <img src="${val.img}" alt="${val.tit} poster image" loading="lazy" />
              <div class="swiper-lazy-preloader"></div>
            </div>`;
      $(".nowwe-swiper .swiper-wrapper, .nowwe-swiper2 .swiper-wrapper").append(
        list
      );
    }
    return data;
  });

  var history = $.getJSON("./data/history.json", function (data) {
    for (i = 0; i < data.length; i++) {
      var year = data[i].year;
      var list = `<li id="${year}">${year}</li>`;
      $(".tab-tit ul").append(list);
      $(".tab-tit li").eq(0).addClass("active");
    }
    for (j = 0; j < data[0].list.length; j++) {
      var dataList = data[0].list[j];
      var yearList = `<div class="swiper-slide">
                        <div class="img-wrap">
                            <img src="${dataList.img}" alt="${dataList.tit} poster image" loading="lazy" />
                            <div class="swiper-lazy-preloader"></div>
                        </div>
                        <div class="text-wrap">
                          <h3 class="tit">${dataList.tit}</h3>
                          <p class="date">${dataList.date}</p>
                          <p class="des">${dataList.des}</p>
                        </div>
                      </div>`;
      $(".history-swiper .swiper-wrapper").append(yearList);
    }
    return data;
  });

  var nowweSwiper = new Swiper(".nowwe-swiper", {
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 10,
    loop: true,
    freeMode: false,
    lazy: {
      loadPrevNext: true,
    },
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".nowwe-swiper .progress-pagination",
      type: "progressbar",
    },
    breakpoints: {
      1024: {
        slidesPerView: 6,
      },
    },
  });
  var nowweSwiper2 = new Swiper(".nowwe-swiper2", {
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 10,
    loop: true,
    freeMode: false,
    slidesOffsetBefore: 1,
    lazy: {
      loadPrevNext: true,
    },
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
      reverseDirection: true,
    },
    pagination: {
      el: ".nowwe-swiper2 .progress-pagination",
      type: "progressbar",
    },
    breakpoints: {
      1024: {
        slidesPerView: 6,
      },
    },
  });
  var historySwiper = new Swiper(".history-swiper", {
    slidesPerView: 2.5,
    slidesPerGroup: 1,
    spaceBetween: 10,
    loop: false,
    freeMode: false,
    slidesOffsetBefore: 1,
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 8,
    },
    navigation: {
      nextEl: ".control-wrap .next-btn",
      prevEl: ".control-wrap .prev-btn",
    },
    breakpoints: {
      1024: {
        slidesPerView: 5.5,
      },
    },
  });

  // nowwe modal
  $(document).on("click", ".nowwe .swiper-slide", function () {
    $(".modal-cont").remove();
    $(".history-modal, .dim").addClass("active");
    $("html, body").addClass("noscroll");
    var activeSlide = $(this).attr("data-thisIndex");
    var data = nowwe.responseJSON.nowwe[activeSlide];
    var modalData = `<div class="modal-cont">
            <div class="img-wrap">
                <img src="${data.img}" alt="${data.tit} poster image"/>
            </div>
            <div class="text-wrap">
                <h3 class="tit">${data.tit}</h3>
                <p class="date">${data.date}</p>
                <p class="des">${data.des}</p>
            </div>
        </div>`;

    $(".history-modal").append(modalData);
  });

  // history tab
  $(document).on("click", ".tab-tit li", function () {
    $(".tab-tit li").removeClass("active");
    $(this).addClass("active");
    historySwiper.slideTo(0);

    $(".history-swiper .swiper-wrapper .swiper-slide").remove();
    for (i = 0; i < history.responseJSON.length; i++) {
      if (this.id == history.responseJSON[i].year) {
        for (j = 0; j < history.responseJSON[i].list.length; j++) {
          var dataList = history.responseJSON[i].list[j];
          var yearList = `<div class="swiper-slide ready">
                    <div class="img-wrap">
                      <img src="${dataList.img}" alt="${dataList.tit} poster image" loading="lazy" />
                      <div class="swiper-lazy-preloader"></div>
                    </div>
                    <div class="text-wrap">
                      <h3 class="tit">${dataList.tit}</h3>
                      <p class="date">${dataList.date}</p>
                      <p class="des">${dataList.des}</p>
                    </div>
                  </div>`;

          $(".history-swiper .swiper-wrapper").append(yearList);

          $(".swiper-slide").focus().addClass("active");
        }
      }
    }
  });

  // history modal
  $(document).on("click", ".tab-cont .swiper-slide", function () {
    $(".modal-cont").remove();
    $(".history-modal, .dim").addClass("active");
    $("html, body").addClass("noscroll");
    var year = $(".tab-tit li.active").index();
    var activeSlide = $(this).index();
    var data = history.responseJSON[year].list[activeSlide];
    var modalData = `<div class="modal-cont">
            <div class="img-wrap">
                <img src="${data.img}" alt="${data.tit} poster image"/>
            </div>
            <div class="text-wrap">
                <h3 class="tit">${data.tit}</h3>
                <p class="date">${data.date}</p>
                <p class="des">${data.des}</p>
            </div>
        </div>`;

    $(".history-modal").append(modalData);
  });

  $(".dim").on("click", function () {
    $(".dim, .modal").removeClass("active");
    $("html, body").removeClass("noscroll");
  });

  // 스크롤 이벤트
  var sectionSpot = [];
  $(window).on("scroll", function () {
    var sct = $(window).scrollTop();
    var winH = $(window).height();
    var winY = $(window).scrollTop() + (winH / 4) * 3;
    sectionSpot = [];

    $("section, footer").each(function (i, e) {
      sectionSpot.push($(e).offset().top);

      if (winY >= sectionSpot[i] && !$(e).is(".on") && !sct == 0) {
        $(e).addClass("on");
        $(e).find(".section-title").addClass("active");
      } else if (winY < sectionSpot[i] && $(e).is(".on")) {
        $(e).removeClass("on");
        $(e).find(".section-title").removeClass("active");
      } else if (sct == 0) {
        $(e).removeClass("on");
        $(e).find(".section-title").removeClass("active");
      }

      if (winY > sectionSpot[i]) {
        $(".gnb li").eq(i).addClass("active").siblings().removeClass("active");
      } else if (sct == 0) {
        $(".gnb li").eq(0).addClass("active").siblings().removeClass("active");
      }
    });
  });
});
