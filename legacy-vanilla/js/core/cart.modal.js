/**
 * Modal del carrito simulado.
 */
(function () {
  var cartService = window.cartService;
  var authService = window.authService;
  var SELECTORS = {
    modal: document.querySelector("[data-cart-modal]"),
    panel: document.querySelector("[data-cart-panel]"),
    content: document.querySelector("[data-cart-content]"),
    countBadges: document.querySelectorAll("[data-cart-count]"),
  };
  var FALLBACKS = {
    poster: "assets/img/movie-fallback.svg",
  };
  var successTimerId = null;
  var checkoutTimerId = null;

  if (!cartService || !SELECTORS.modal || !SELECTORS.panel || !SELECTORS.content) {
    return;
  }

  /**
   * Convierte caracteres especiales en texto seguro.
   * @param {string|number} value - El texto a limpiar.
   * @returns {string} El texto seguro.
   */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Formatea precios del carrito.
   * @param {number} price - El valor numerico.
   * @returns {string} El precio formateado.
   */
  function formatPrice(price) {
    return "$" + Number(price || 0).toLocaleString("es-CO");
  }

  /**
   * Obtiene el formato de renta.
   * @param {Object} movie - La pelicula del item.
   * @returns {string} El formato visible.
   */
  function getRentalFormat(movie) {
    return movie.format || "Digital";
  }

  /**
   * Obtiene el tiempo de renta.
   * @param {Object} movie - La pelicula del item.
   * @returns {string} El tiempo visible.
   */
  function getRentalTime(movie) {
    return movie.rentalTime || "48 horas";
  }

  /**
   * Revisa si el modal esta abierto.
   * @returns {boolean} El estado actual.
   */
  function isCartOpen() {
    return SELECTORS.modal.classList.contains("is-open");
  }

  /**
   * Actualiza los botones que agregan al carrito.
   */
  function refreshCartButtons() {
    document.querySelectorAll("[data-cart-id]").forEach(function (button) {
      var movieId = Number(button.dataset.cartId);
      var isInCart = cartService.isInCart(movieId);

      if (button.disabled || button.classList.contains("is-unavailable")) {
        button.textContent = "Agotada";
        return;
      }

      button.classList.toggle("is-in-cart", isInCart);
      button.textContent = isInCart ? "En carrito" : "Agregar al carrito";
    });
  }

  /**
   * Actualiza el contador del navbar.
   */
  function refreshCartCount() {
    var count = cartService.getCart().length;

    SELECTORS.countBadges.forEach(function (badge) {
      badge.textContent = count;
      badge.classList.toggle("d-none", count === 0);
    });
  }

  /**
   * Renderiza el estado vacio.
   * @returns {string} El HTML del estado vacio.
   */
  function createEmptyState() {
    return [
      '<div class="cart-empty-state">',
      '<span class="cart-empty-icon">VHS</span>',
      "<h3>Tu carrito está vacío</h3>",
      "<p>Agrega películas del catálogo para simular tu pedido.</p>",
      '<button class="btn btn-primary app-btn-primary" type="button" data-cart-discover>Descubrir películas</button>',
      "</div>",
    ].join("");
  }

  /**
   * Renderiza un item del carrito.
   * @param {Object} item - El item calculado.
   * @returns {string} El HTML del item.
   */
  function createCartItem(item) {
    var movie = item.movie;
    var poster = movie.poster || FALLBACKS.poster;

    return [
      '<article class="cart-item">',
      '<img class="cart-item-poster" src="' +
        escapeHtml(poster) +
        '" alt="Poster de ' +
        escapeHtml(movie.title) +
        '" data-fallback-src="' +
        FALLBACKS.poster +
        '" />',
      '<div class="cart-item-body">',
      '<h3>' + escapeHtml(movie.title) + "</h3>",
      '<p>' + escapeHtml(getRentalFormat(movie)) + "</p>",
      '<p class="cart-item-price">' + formatPrice(item.unitPrice) + " / " + escapeHtml(getRentalTime(movie)) + "</p>",
      (!item.isAvailable ? '<p class="cart-item-status">Agotada</p>' : ""),
      "</div>",
      '<button class="cart-remove-button" type="button" data-cart-remove="' +
        movie.id +
        '">Eliminar</button>',
      "</article>",
    ].join("");
  }

  /**
   * Renderiza el carrito con items.
   * @param {Array} items - Los items del carrito.
   * @returns {string} El HTML del carrito.
   */
  function createCartList(items) {
    var hasUnavailableItems = items.some(function (item) {
      return !item.isAvailable;
    });

    return [
      '<div class="cart-items">',
      items.map(createCartItem).join(""),
      "</div>",
      hasUnavailableItems
        ? '<p class="cart-warning">Retira las peliculas agotadas para continuar.</p>'
        : "",
      '<div class="cart-summary">',
      '<span>Total</span>',
      '<strong>' + formatPrice(cartService.getCartTotal()) + "</strong>",
      "</div>",
      '<button class="btn btn-primary app-btn-primary w-100" type="button" data-cart-buy ' +
        (hasUnavailableItems ? 'disabled aria-disabled="true"' : "") +
        ">Comprar</button>",
    ].join("");
  }

  /**
   * Renderiza mensaje de compra simulada.
   */
  function renderSuccessMessage() {
    SELECTORS.content.innerHTML = [
      '<div class="cart-empty-state is-success">',
      '<span class="cart-empty-icon">OK</span>',
      "<h3>Compra exitosa</h3>",
      "<p>Gracias por rentar en MAPA VIDEO CLUB.</p>",
      "</div>",
    ].join("");
  }

  /**
   * Muestra aviso antes de enviar al login.
   */
  function renderLoginRequiredMessage() {
    SELECTORS.content.innerHTML = [
      '<div class="cart-empty-state">',
      '<span class="cart-empty-icon">LOGIN</span>',
      "<h3>Inicia sesión para finalizar tu compra</h3>",
      "<p>Tu carrito queda guardado para continuar después del ingreso.</p>",
      "</div>",
    ].join("");
  }

  /**
   * Renderiza el contenido del modal.
   */
  function renderCart() {
    var items = cartService.getCartItems();

    SELECTORS.content.innerHTML = items.length ? createCartList(items) : createEmptyState();
    refreshCartCount();
    refreshCartButtons();

    if (window.helpers) {
      window.helpers.bindImageFallbacks(SELECTORS.content);
    }
  }

  /**
   * Abre el modal del carrito.
   */
  function openCart() {
    renderCart();
    SELECTORS.modal.classList.add("is-open");
    SELECTORS.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-modal-open");
    SELECTORS.panel.focus();
  }

  /**
   * Cierra el modal del carrito.
   */
  function closeCart() {
    SELECTORS.modal.classList.remove("is-open");
    SELECTORS.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-modal-open");
  }

  /**
   * Abre el carrito si la URL lo solicita.
   */
  function openCartFromUrl() {
    var url = new URL(window.location.href);

    if (url.searchParams.get("openCart") !== "true") {
      return;
    }

    openCart();
    url.searchParams.delete("openCart");

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", url.toString());
    }
  }

  /**
   * Lleva al usuario al catalogo.
   */
  function discoverMovies() {
    closeCart();

    if (window.mapaVideoClubHome && window.mapaVideoClubHome.showFullCatalog) {
      window.mapaVideoClubHome.showFullCatalog();
      return;
    }

    window.location.href = "index.html#catalogo";
  }

  /**
   * Simula la compra y limpia el carrito.
   */
  function buyCart() {
    var items = cartService.getCartItems();

    if (!items.length) {
      return;
    }

    if (items.some(function (item) { return !item.isAvailable; })) {
      renderCart();
      return;
    }

    if (!authService || !authService.isAuthenticated()) {
      renderLoginRequiredMessage();
      window.clearTimeout(checkoutTimerId);
      checkoutTimerId = window.setTimeout(function () {
        window.location.href = "auth.html?redirect=checkout";
      }, 900);
      return;
    }

    renderSuccessMessage();
    window.clearTimeout(successTimerId);
    successTimerId = window.setTimeout(function () {
      cartService.clearCart();
      refreshCartCount();
      refreshCartButtons();
      closeCart();
      renderCart();
    }, 1600);
  }

  /**
   * Maneja clicks del carrito.
   * @param {Event} event - El evento click.
   */
  function handleCartClick(event) {
    var openButton = event.target.closest("[data-cart-open]");
    var addButton = event.target.closest("[data-cart-id]");
    var closeButton = event.target.closest("[data-cart-close]");
    var removeButton = event.target.closest("[data-cart-remove]");

    if (openButton) {
      event.preventDefault();
      openCart();
      return;
    }

    if (addButton) {
      event.preventDefault();
      event.stopPropagation();
      cartService.addToCart(Number(addButton.dataset.cartId));
      refreshCartCount();
      refreshCartButtons();

      if (isCartOpen()) {
        renderCart();
      }
      return;
    }

    if (closeButton) {
      event.preventDefault();
      closeCart();
      return;
    }

    if (removeButton) {
      event.preventDefault();
      cartService.removeFromCart(Number(removeButton.dataset.cartRemove));
      renderCart();
      return;
    }

    if (event.target.closest("[data-cart-discover]")) {
      event.preventDefault();
      discoverMovies();
      return;
    }

    if (event.target.closest("[data-cart-buy]")) {
      event.preventDefault();
      buyCart();
    }
  }

  /**
   * Conecta eventos del modal.
   */
  function bindEvents() {
    document.addEventListener("click", handleCartClick);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isCartOpen()) {
        closeCart();
      }
    });
  }

  /**
   * Inicializa el carrito visual.
   */
  function init() {
    renderCart();
    bindEvents();
    openCartFromUrl();
  }

  window.cartModal = {
    renderCart: renderCart,
    refreshCartButtons: refreshCartButtons,
    openCart: openCart,
    closeCart: closeCart,
  };

  init();
})();
