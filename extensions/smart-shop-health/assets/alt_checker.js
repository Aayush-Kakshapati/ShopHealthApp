(function () {
  var processedImages = new Set();

  function findImages() {
    var images = [];

    document
      .querySelectorAll(
        ".product img, [data-product-media] img, .product__media img",
      )
      .forEach(function (img) {
        images.push(img);
      });

    document.querySelectorAll(".product-card-wrapper img").forEach(function (img) {
      images.push(img);
    });

    return images;
  }

  function imageKey(img) {
    if (!img.dataset.shophealthAltKey) {
      img.dataset.shophealthAltKey = Math.random().toString(36).slice(2);
    }

    return img.dataset.shophealthAltKey;
  }

  function createBadge(img) {
    var alt = img.getAttribute("alt");

    if (alt && alt.trim() !== "") {
      removeBadge(img);
      return;
    }

    var container =
      img.closest(".product-media-container") ||
      img.closest(".card__inner") ||
      img.parentElement;

    if (!container) return;

    container.style.position = "relative";

    if (container.querySelector(".shophealth-alt-badge")) return;

    var badge = document.createElement("div");
    badge.className = "shophealth-alt-badge";
    badge.textContent = "⚠ Missing Alt Text";

    container.appendChild(badge);
  }

  function removeBadge(img) {
    var container =
      img.closest(".product-media-container") ||
      img.closest(".card__inner") ||
      img.parentElement;

    if (!container) return;

    var badge = container.querySelector(".shophealth-alt-badge");

    if (badge) badge.remove();
  }

  function init() {
    findImages().forEach(function (img) {
      var key = imageKey(img);

      if (processedImages.has(key)) return;

      processedImages.add(key);

      createBadge(img);
    });
  }

  function observeForChanges() {
    var debounceTimer;

    var observer = new MutationObserver(function () {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(function () {
        processedImages.clear();
        init();
      }, 150);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function start() {
    init();
    observeForChanges();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
