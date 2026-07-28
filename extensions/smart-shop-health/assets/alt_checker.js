(function () {
  function highlightMissingAlt() {
    var productImages = document.querySelectorAll(
      '.product img, [data-product-media] img, .product__media img'
    );

    productImages.forEach(function (img) {
      var alt = img.getAttribute('alt');
      if (!alt || alt.trim() === '') {
        wrapWithWarning(img);
      }
    });
  }

  function wrapWithWarning(img) {
    if (img.dataset.shophealthFlagged) return; // avoid double-wrapping
    img.dataset.shophealthFlagged = 'true';

    var wrapper = document.createElement('div');
    wrapper.className = 'shophealth-alt-wrapper';

    var badge = document.createElement('div');
    badge.className = 'shophealth-alt-badge';
    badge.textContent = '⚠ Missing Alt Text';

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(badge);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightMissingAlt);
  } else {
    highlightMissingAlt();
  }
})();