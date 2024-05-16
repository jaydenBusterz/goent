$(function () {
    // 네비게이션
    $(".nav li").click(function () {
        var nav = $(this).attr("id");
        var sectionPos = $("." + nav).offset().top;
        $('html, body').animate({
            scrollTop: sectionPos - 50
        }, 700);
        return false;
    });

    var textBanner = $.getJSON("../textBanner.json", function (data) {
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

    var concertPoster = $.getJSON("../concert.json", function (data) {
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

    var swiper = new Swiper(".concert-swiper", {
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
    var swiper2 = new Swiper(".concert-swiper2", {
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