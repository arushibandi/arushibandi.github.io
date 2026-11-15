// Mobile: scale the "Save the Date" header so it spans the full content width.
// Everything in the header is sized from --h (the height of the big S), so we
// measure the header at a known --h and scale --h to fit. Measuring (instead of
// a fixed ratio in CSS) keeps it exact whatever fonts/browser render the text.
(function () {
  var DESKTOP = window.matchMedia("(min-width: 900px)");
  var std = document.querySelector(".std");
  if (!std) return;

  function fit() {
    std.style.removeProperty("--h");
    if (DESKTOP.matches) return;           // desktop keeps the CSS clamp() size
    var page = std.parentElement;
    var cs = getComputedStyle(page);
    var avail = page.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var probe = 100;
    std.style.setProperty("--h", probe + "px");
    var width = std.getBoundingClientRect().width;
    if (width > 0) std.style.setProperty("--h", (probe * avail / width) + "px");
  }

  fit();
  window.addEventListener("resize", fit);
  window.addEventListener("load", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
