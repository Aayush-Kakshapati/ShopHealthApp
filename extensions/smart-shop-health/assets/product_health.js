(function () {
  var productId = window.shopHealthProductId;
  if (!productId) return; 

  function findMainProductImage() {
    return document.querySelector(
      ".product img, [data-product-media] img, .product__media img"
    );
  }

  function wrapWithOverlay(img, data) {
    if (img.dataset.shophealthOverlayed) return;
    img.dataset.shophealthOverlayed = "true";

    var wrapper = document.createElement("div");
    wrapper.className = "product_health_wrapper";

    var panel = document.createElement("div");
    panel.className = "product_health_panel";

    var checksHtml = data.checks
      .map(function (check) {
        var icon = check.passed ? "✓" : "✗";
        var cls = check.passed ? "check-pass" : "check-fail";
        return (
          "<div class='shophealth-check-row " + cls + "'>" +
          "<span>" + icon + "</span> <span>" + check.label + "</span>" +
          "</div>"
        );
      })
      .join("");

    panel.innerHTML =
      "<div class='product_health_title'>Product Health</div>" +
      checksHtml +
      "<div class='product_health_score'>Health: " + data.score + "%</div>";

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(panel);
  }

  function init() {
    var img = findMainProductImage();
    if (!img) return;

    fetch("/apps/shophealth/health?productId=" + encodeURIComponent(productId))
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed: " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data.score == null) return;
        wrapWithOverlay(img, data);
      })
      .catch(function (err) {
        console.error("Product health overlay error:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();