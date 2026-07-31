(function () {
  var productId = window.shopHealthProductId;
  if (!productId) return;

  function findMainProductImage() {
    return document.querySelector(
      ".product img, [data-product-media] img, .product__media img",
    );
  }

  function createOverlay(img, data) {
    if (img.dataset.shophealthOverlayed) return;
    img.dataset.shophealthOverlayed = "true";

    var container = img.closest(".product-media-container") || img.parentElement;
    if (!container) container = img.parentElement;

    container.style.position = "relative";

    var badge = document.createElement("div");
    badge.className = "product_health_badge";
    badge.textContent = "Health: " + `${data.score} `;
    var panel = document.createElement("div");
    panel.className = "product_health_panel";

    panel.innerHTML =
      "<div class='product_health_title'>Product Health</div>" +
      data.checks
        .map(function (check) {
          return (
            "<div class='shophealth-check-row " +
            (check.passed ? "check-pass" : "check-fail") +
            "'>" +
            "<span>" +
            (check.passed ? "✓" : "✗") +
            "</span><span>" +
            check.label +
            "</span></div>"
          );
        })
        .join("");

    container.appendChild(badge);
    container.appendChild(panel);
  }

  function init() {
    var img = findMainProductImage();
    if (!img) return;

    fetch("/apps/shophealth/health?productId=" + encodeURIComponent(productId))
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data.score == null) return;
        createOverlay(img, data);
      });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
