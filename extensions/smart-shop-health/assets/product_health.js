(function () {
  var container = document.getElementById("productHealthBadge");
  if (!container) return;

  var productId = container.dataset.productId;

  fetch("/apps/shophealth/product-health?productId=" + encodeURIComponent(productId))
    .then(function (res) {
      if (!res.ok) throw new Error("Request failed: " + res.status);
      return res.json();
    })
    .then(function (data) {
      renderBadge(data);
    })
    .catch(function (err) {
      container.innerHTML = "<div class='product-health-error'>Unable to load health data</div>";
      console.error("Product health badge error:", err);
    });

  function renderBadge(data) {
    if (data.score == null) {
      container.innerHTML = "<div class='product-health-error'>No scan yet</div>";
      return;
    }

    var checksHtml = data.checks
      .map(function (check) {
        var icon = check.passed ? "✓" : "✗";
        var cls = check.passed ? "check-pass" : "check-fail";
        return (
          "<div class='product-health-row " + cls + "'>" +
          "<span class='check-icon'>" + icon + "</span>" +
          "<span class='check-label'>" + check.label + "</span>" +
          "</div>"
        );
      })
      .join("");

    container.innerHTML =
      "<div class='product-health-box'>" +
      "<div class='product-health-title'>Product Health</div>" +
      checksHtml +
      "<div class='product-health-score'>Health: " + data.score + "%</div>" +
      "</div>";
  }
})();