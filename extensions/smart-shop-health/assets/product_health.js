(function () {
  var mainProductId = window.shopHealthProductId;
  var requestedPairs = new Set();

  function getProductIdFromCard(card) {
    var idElement = card.querySelector(
      "[id*='CardLink--'], [id*='StandardCardNoMediaLink--'], [id*='CardLink-template--'], [id*='StandardCardNoMediaLink-template--']",
    );

    if (!idElement) return null;
    var match = idElement.id.match(/(\d+)$/);

    if (!match) return null;
    return "gid://shopify/Product/" + match[1];
  }

  function findProductItems() {
    var products = [];
    var mainImages = document.querySelectorAll(
      ".product img, [data-product-media] img, .product__media img",
    );

    mainImages.forEach(function (img) {
      if (mainProductId) {
        products.push({
          img: img,
          productId: mainProductId,
        });
      }
    });

    var cards = document.querySelectorAll(".card-wrapper");

    cards.forEach(function (card) {
      var img = card.querySelector("img");
      var productId = getProductIdFromCard(card);

      if (img && productId) {
        products.push({
          img: img,
          productId: productId,
        });
      }
    });

    return products;
  }

  function pairKey(img, productId) {
    if (!img.dataset.shophealthKey) {
      img.dataset.shophealthKey = Math.random().toString(36).slice(2);
    }
    return img.dataset.shophealthKey + "::" + productId;
  }

  function createOverlay(img, data) {
    var container =
      img.closest(".product-media-container") ||
      img.closest(".card--media") ||
      img.parentElement;

    if (!container) return;

    if (img.dataset.shophealthScore == data.score) {
      return;
    }

    img.dataset.shophealthScore = data.score;

    var oldBadge = container.querySelector(".product_health_badge");
    var oldPanel = container.querySelector(".product_health_panel");

    if (oldBadge) oldBadge.remove();
    if (oldPanel) oldPanel.remove();

    container.style.position = "relative";

    var badge = document.createElement("div");
    badge.className = "product_health_badge";
    badge.textContent = "Health: " + data.score;

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
            "</span>" +
            "<span>" +
            check.label +
            "</span>" +
            "</div>"
          );
        })
        .join("");

    container.appendChild(badge);
    container.appendChild(panel);
  }

  function fetchAndRenderHealth(product) {
    fetch(
      "/apps/shophealth/health?productId=" +
        encodeURIComponent(product.productId),
    )
      .then(function (req) {
        if (!req.ok) throw new Error("Request failed: " + req.status);
        return req.json();
      })
      .then(function (data) {
        if (data.score == null) return;
        createOverlay(product.img, data);
      })
      .catch(function (err) {
        console.error("Product health overlay error:", err);
      });
  }

  function init() {
    var products = findProductItems();

    products.forEach(function (product) {
      var key = pairKey(product.img, product.productId);
      if (requestedPairs.has(key)) return;
      requestedPairs.add(key);

      fetchAndRenderHealth(product);
    });
  }

  function observeForChanges() {
    var debounceTimer;
    var observer = new MutationObserver(function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(init, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });
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
