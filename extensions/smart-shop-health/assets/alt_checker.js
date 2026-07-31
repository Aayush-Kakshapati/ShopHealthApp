(function () {
  function highlightMissingAlt() {
    document
      .querySelectorAll(
        ".product img,[data-product-media] img,.product__media img",
      )
      .forEach(function (img) {
        if (img.dataset.shophealthAltDone) return;

        img.dataset.shophealthAltDone = true;

        var alt = img.getAttribute("alt");

        if (alt && alt.trim() !== "") return;

        var container = img.closest(".product-media-container") || img.parentElement;

        container.style.position = "relative";

        var badge = document.createElement("div");

        badge.className = "shophealth-alt-badge";
        badge.textContent = "⚠ Missing Alt Text";
        container.appendChild(badge);
      });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", highlightMissingAlt);
  else highlightMissingAlt();
})();
