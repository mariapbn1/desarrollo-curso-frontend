/**
 * Helpers reutilizables del proyecto.
 */
(function () {
  /**
   * Formatea una fecha en texto legible para Colombia.
   * @param {string|Date} dateValue - La fecha a formatear.
   * @returns {string} La fecha formateada.
   */
  function formatDate(dateValue) {
    return new Date(dateValue).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Crea una etiqueta de texto para mostrar informacion.
   * @param {string} label - El texto a mostrar.
   * @returns {string} La etiqueta HTML.
   */
  function createMetaPill(label) {
    return '<span class="meta-pill">' + label + "</span>";
  }

  /**
   * Aplica fallback a imagenes con data-fallback-src.
   * @param {Element|Document} scope - El ambito donde buscar imagenes.
   */
  function bindImageFallbacks(scope) {
    var root = scope || document;
    var images = root.matches && root.matches("img[data-fallback-src]") ? [root] : root.querySelectorAll("img[data-fallback-src]");

    images.forEach(function (image) {
      function applyFallback(target) {
        var fallbackSource = target.dataset.fallbackSrc;

        if (!fallbackSource || target.dataset.fallbackApplied === "true") {
          return;
        }

        target.dataset.fallbackApplied = "true";
        target.src = fallbackSource;
      }

      image.addEventListener("error", function (event) {
        applyFallback(event.currentTarget);
      });

      if (image.complete && image.naturalWidth === 0) {
        applyFallback(image);
      }
    });
  }

  window.helpers = {
    formatDate: formatDate,
    createMetaPill: createMetaPill,
    bindImageFallbacks: bindImageFallbacks,
  };
})();
