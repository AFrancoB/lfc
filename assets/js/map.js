// the map point description
export let shownId = null;

export function show(id) {
  const prevEl = document.getElementById(shownId);
  const el = document.getElementById(id);
  if (prevEl) {
    prevEl.style.display = null;
  }
  el.style.display = "block";
  shownId = id;
}

export function initMap(locations) {
  const lang = document.body.dataset.lang || "es";
  const map = L.map("map").setView([19.361810914799786, -99.16320173025815], 3);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  document.getElementById("mxcity").addEventListener("click", function () {
    var targetLatLng = L.latLng(19.361810914799786, -99.16320173025815);
    // if distance is less than X then pan else fly
    gradualFly(map, targetLatLng, 3, 11, 0.0085, 1);
  });

  initLocationButtons(map, Object.keys(locations));
  initZoomInButton(map);
  initCircleMarkers(map, locations, lang);
  return map;
}

export function initLocationButtons(map, buttonIds) {
  buttonIds.forEach((buttonId) => {
    document.getElementById(buttonId).addEventListener("click", function () {
      var targetLatLng = L.latLng(19.361810914799786, -99.16320173025815);
      gradualMove(map, targetLatLng, 6);
      show(buttonId + "Description");
    });
  });
}

export function initZoomInButton(map) {
  document.getElementById("zoomIn").addEventListener("click", function () {
    map.zoomIn(3);
  });
}

export function initCircleMarkers(map, locations, lang) {
  Object.entries(locations).forEach(([buttonId, value]) => {
    L.circleMarker(value.latlan)
      .addTo(map)
      .bindPopup(value[lang], { radius: value.radius || 0.1 })
      .on("click", function () {
        show(buttonId + "Description");
      });
  });
}

export function gradualMove(map, targetLatLng, dur) {
  map.panTo(targetLatLng, { animate: true, duration: dur });
}

export function gradualFly(
  map,
  targetLatLng,
  startZoom,
  targetZoom,
  increment,
  intervalTime
) {
  var currentZoom = startZoom;
  var interval = setInterval(function () {
    if (currentZoom < targetZoom) {
      currentZoom += increment;
      map.flyTo(targetLatLng, currentZoom, { animate: true });
    } else {
      clearInterval(interval);
    }
  }, intervalTime);
}
