$(function () {
    // 네비게이션
    $(".nav li").on('click', function () {
        var nav = $(this).attr("id");
        var sectionPos = $("." + nav).offset().top;
        $('html, body').animate({
            scrollTop: sectionPos - 50
        }, 700);
        return false;
    });

    var textBanner = $.getJSON("../data/textBanner.json", function (data) {
        for (i = 0; i < data.textBanner.length; i++) {
            var val = data.textBanner[i];
            var list = `
            <li>
                <strong class="title">${val.tit}</strong>
                <strong class="date">${val.date}</strong>
                <strong class="place">${val.place}</strong>
            </li>`;
            $('.infinite-label ul').append(list);
        }
        var ulTwo = $('.infinite-label ul').clone();
        $('.infinite-label').append(ulTwo);
        return data;
    });

    var concert = $.getJSON("../data/concert.json", function (data) {
        for (i = 0; i < data.concert.length; i++) {
            var val = data.concert[i];
            var list = `
            <div class="swiper-slide">
              <img src="${val.img}" alt="포스터 이미지" />
            </div>`;
            $('.concert-swiper .swiper-wrapper, .concert-swiper2 .swiper-wrapper').append(list);
        }
        return data;
    });

    var festival = $.getJSON("../data/festival.json", function (data) {
        for (i = 0; i < data.length; i++) {
            var year = data[i].year;
            var list = `<li id="${year}">${year}</li>`;
            $('.tab-tit ul').append(list);
            $('.tab-tit li').eq(0).addClass('active');
        }
        for (j = 0; j < data[0].list.length; j++) {
            var dataList = data[0].list[j];
            var yearList = `<div class="swiper-slide">
                        <img src="${dataList.img}" alt="페스티벌 이미지" />
                        <div class="text-wrap">
                          <p class="title">${dataList.tit}</p>
                          <p class="date">${dataList.des}</p>
                        </div>
                      </div>`;
            $('.festival-swiper .swiper-wrapper').append(yearList);
        }
        return data;
    });

    var concertSwiper = new Swiper(".concert-swiper", {
        slidesPerView: 4,
        slidesPerGroup: 1,
        spaceBetween: 10,
        loop: true,
        freeMode: false,
        autoplay: {
            delay: 1000,
            disableOnInteraction: false
        },
        pagination: {
            el: ".concert-swiper .progress-pagination",
            type: 'progressbar'
        },
        breakpoints: {
            786: {
                slidesPerView: 6,
            }
        }
    });
    var concertSwiper2 = new Swiper(".concert-swiper2", {
        slidesPerView: 4,
        slidesPerGroup: 1,
        spaceBetween: 10,
        loop: true,
        freeMode: false,
        slidesOffsetBefore: 1,
        autoplay: {
            delay: 1000,
            disableOnInteraction: false,
            reverseDirection: true
        },
        pagination: {
            el: ".concert-swiper2 .progress-pagination",
            type: 'progressbar'
        },
        breakpoints: {
            786: {
                slidesPerView: 6,
            }
        }
    });
    var festivalSwiper = new Swiper(".festival-swiper", {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 10,
        loop: false,
        freeMode: false,
        slidesOffsetBefore: 1,
        breakpoints: {
            1024: {
                slidesPerView: 5,
            }
        }
    });

    // festival tab
    $(document).on('click', '.tab-tit li', function () {
        $('.tab-tit li').removeClass('active');
        $(this).addClass('active');

        $('.festival-swiper .swiper-wrapper .swiper-slide').remove();
        for (i = 0; i < festival.responseJSON.length; i++) {
            if (this.id == festival.responseJSON[i].year) {
                for (j = 0; j < festival.responseJSON[i].list.length; j++) {
                    var dataList = festival.responseJSON[i].list[j];
                    var yearList = `<div class="swiper-slide">
                    <img src="${dataList.img}" alt="페스티벌 이미지" />
                    <div class="text-wrap">
                      <p class="title">${dataList.tit}</p>
                      <p class="date">${dataList.des}</p>
                    </div>
                  </div>`;

                    console.log(dataList);
                    $('.festival-swiper .swiper-wrapper').append(yearList);
                }
            }
        }
    });

    // 스크롤 이벤트
    var sectionSpot = []
    $(window).scroll(function () {
        var sct = $(window).scrollTop()
        var winH = $(window).height()
        var winY = $(window).scrollTop() + (winH / 3) * 2
        sectionSpot = [];

        $('section, footer').each(function (i, e) {
            sectionSpot.push($(e).offset().top);

            if (winY >= sectionSpot[i] && !$(e).is('.on') && !sct == 0) {
                $(e).addClass('on')
                $(e).find('.section-title').addClass('active')
            } else if (winY < sectionSpot[i] && $(e).is('.on')) {
                $(e).removeClass('on')
                $(e).find('.section-title').removeClass('active')
            } else if (sct == 0) {
                $(e).removeClass('on')
                $(e).find('.section-title').removeClass('active')
            }

            if (winY > sectionSpot[i]) {
                $('.nav li').eq(i).addClass('active').siblings().removeClass('active')
            } else if (sct == 0) {
                $('.nav li').eq(0).addClass('active').siblings().removeClass('active')
            }
        });
    })
});