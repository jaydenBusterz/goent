$(function () {
    // 네비게이션
    $(".nav li").click(function () {
        var nav = $(this).attr("id")
        var sectionPos = $("." + nav).offset().top
        $('html, body').animate({
            scrollTop: sectionPos - 50
        }, 700)
        return false
    });

    // 스크롤 이벤트
    var sectionSpot = []
    $(window).scroll(function () {
        var sct = $(window).scrollTop()
        var winH = $(window).height()
        var winY = $(window).scrollTop() + winH / 2
        sectionSpot = []

        $('section').each(function (i, e) {
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