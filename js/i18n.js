/* ===============================
   I18N DATA (방식 B)
=============================== */
window.I18N = {
  ko: {
    "home.subtitle":
      '공연문화의 중심에서 <br class="tablet-br" />검증된 전문성과 노하우를 갖춘 업계 최고의 이력',

    /* ABOUT */
    "about.p1":
      '주식회사 고엔터테인먼트는 공연기획, 연출, 제작사로 콘서트, 페스티벌, 이벤트, 기업행사 등 공연문화의 중심에서 <br class="pc-br" />검증된 전문성과 노하우를 갖추어 업계 최고의 이력을 자랑하고 있습니다.',

    "about.p2":
      '주식회사 고엔터테인먼트는 검증된 인프라를 통해 효율적인 커뮤니케이션과 효과적인 운영으로 최고의 서비스를 제공합니다. <br class="pc-br" />또한, 축적된 노하우로 완벽한 공연을 만들어내며, 정확하고 확실하게 마지막까지 책임지고 임하는 것이 저희의 모토입니다.',

    "about.p3":
      "특히 주식회사 고엔터테인먼트는 내한공연에 대한 이해도가 높은 기업으로 국·내외의 최정상 아티스트를 섭외하고 최고의 공연들을 유치하고 있습니다.",

    "about.p4":
      '최근 문화시장의 규모가 급속도로 발전하며, 고부가가치 산업인 공연 분야의 시너지를 추구하고자 <br class="pc-br" />주식회사 고엔터테인먼트는 다양한 콘텐츠 개발에 나서고 있으며, 공연의 전반적인 분야에 걸친 사업을 전개해 나갈 것입니다.',
    "contact.address": "서울특별시 마포구 동교로 136, 301호 (서교동)",
  },

  en: {
    "home.subtitle":
      'The best history in the industry with proven <br class="tablet-br" />expertise and know-how at the center of show culture',

    /* ABOUT */
    "about.p1":
      'Go Entertainment is a show planning, directing, and production company that boasts the best history in the industry <br class="pc-br" />with proven expertise and know-how at the center of show culture such as concerts, festivals, events, and corporate events.',

    "about.p2":
      'Go Entertainment provides the best service with efficient communication and effective operation through proven infrastructure. <br class="pc-br" />In addition, our motto is to accurately and reliably take responsibility until the end, creating perfect shows with accumulated know-how.',

    "about.p3":
      'In particular, Go Entertainment is a company with a high degree of understanding of international performances, <br class="pc-br" />recruiting top-class artists from Korea and abroad and attracting world-class shows.',

    "about.p4":
      'Recently, as the cultural market has rapidly expanded, Go Entertainment is developing various contents to pursue synergy in the show industry, <br class="pc-br" />a high value-added field, and will continue to expand its business across all areas of show production.',

    "contact.address":
      "301-3F, 136, Donggyo-ro, Mapo-gu, <br />Seoul, Republic of Korea",
  },
};

/* ===============================
   LANGUAGE SETTER
=============================== */
window.setLanguage = function (lang) {
  // 상태 저장
  localStorage.setItem("lang", lang);

  // html lang 속성
  document.documentElement.lang = lang === "en" ? "en" : "ko";

  // 텍스트 교체
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (window.I18N[lang] && window.I18N[lang][key]) {
      el.innerHTML = window.I18N[lang][key];
    }
  });

  // 헤더 표시
  const current = document.querySelector(".current-lang");
  if (current) {
    current.textContent = lang === "en" ? "ENG" : "KOR";
  }
};
