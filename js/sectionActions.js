$(function () {
  function typeText(el, text, speed = 90) {
    el.textContent = "";
    let i = 0;

    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
  }

  const sectionActions = {
    home($section) {
      const typingEl = $section.find(".typing")[0];
      if (!typingEl) return;
      if (typingEl.dataset.done) return;

      typeText(typingEl, "We make wonderful show", 90);
      typingEl.dataset.done = "true";

      setTimeout(() => {
        $section.find(".cursor").fadeOut();
      }, 2600);
    },
  };

  $(document).on("section:active", function (e, $section) {
    const id = $section.attr("id");
    sectionActions[id]?.($section);
  });
});
