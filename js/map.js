// map.js

function initMap() {
  const mapEl = document.querySelector(".map");
  if (!mapEl) return;

  const position = { lat: 37.5563, lng: 126.922 };

  const map = new google.maps.Map(mapEl, {
    center: position,
    zoom: 16,
    disableDefaultUI: true,
    gestureHandling: "cooperative",
  });

  new google.maps.Marker({ position, map });

  /* ===============================
     fullpage wheel 제어 (★ 추가)
  =============================== */
  mapEl.addEventListener("mouseenter", () => {
    window.disableFullpageWheel = true;
  });

  mapEl.addEventListener("mouseleave", () => {
    window.disableFullpageWheel = false;
  });
}
