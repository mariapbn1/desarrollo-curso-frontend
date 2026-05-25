/**
 * Servicio de carrito simulado para rentas locales.
 */
(function () {
  var STORAGE_KEY = "mapaVideoClubCart";

  /**
   * Obtiene el carrito guardado.
   * @returns {Array} La lista de peliculas en carrito.
   */
  function getCart() {
    var savedCart = window.localStorage.getItem(STORAGE_KEY);
    var parsedCart;
    var movieIds = [];

    if (!savedCart) {
      return [];
    }

    try {
      parsedCart = JSON.parse(savedCart);
    } catch (error) {
      return [];
    }

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.reduce(function (cart, item) {
      var movieId = Number(item.movieId);

      if (!movieId || movieIds.includes(movieId)) {
        return cart;
      }

      movieIds.push(movieId);
      cart.push({
        movieId: movieId,
        quantity: Math.max(1, Number(item.quantity) || 1),
      });
      return cart;
    }, []);
  }

  /**
   * Guarda el carrito en localStorage.
   * @param {Array} cart - La lista nueva del carrito.
   * @returns {Array} El carrito guardado.
   */
  function saveCart(cart) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    return cart;
  }

  /**
   * Busca una pelicula por id.
   * @param {number} movieId - ID de la pelicula.
   * @returns {Object|null} La pelicula encontrada.
   */
  function getMovieById(movieId) {
    if (!window.movieService) {
      return null;
    }

    return window.movieService.getMovieById(movieId) || null;
  }

  /**
   * Revisa si una pelicula puede rentarse.
   * @param {Object} movie - La pelicula a revisar.
   * @returns {boolean} La disponibilidad para carrito.
   */
  function isMovieAvailable(movie) {
    if (!movie) {
      return false;
    }

    if (typeof movie.available === "boolean") {
      return movie.available && Number(movie.stock || 0) > 0;
    }

    return Number(movie.stock || 0) > 0;
  }

  /**
   * Agrega una pelicula sin duplicarla.
   * @param {number} movieId - ID de la pelicula.
   * @returns {Object} El resultado de la accion.
   */
  function addToCart(movieId) {
    var cart = getCart();
    var normalizedMovieId = Number(movieId);
    var movie = getMovieById(normalizedMovieId);

    if (!normalizedMovieId || isInCart(normalizedMovieId)) {
      return { success: true, cart: cart };
    }

    if (!isMovieAvailable(movie)) {
      return { success: false, message: "Esta pelicula esta agotada.", cart: cart };
    }

    cart.push({
      movieId: normalizedMovieId,
      quantity: 1,
    });

    return { success: true, cart: saveCart(cart) };
  }

  /**
   * Elimina una pelicula del carrito.
   * @param {number} movieId - ID de la pelicula.
   * @returns {Array} El carrito actualizado.
   */
  function removeFromCart(movieId) {
    var normalizedMovieId = Number(movieId);
    var cart = getCart().filter(function (item) {
      return item.movieId !== normalizedMovieId;
    });

    return saveCart(cart);
  }

  /**
   * Vacia el carrito.
   * @returns {Array} El carrito vacio.
   */
  function clearCart() {
    return saveCart([]);
  }

  /**
   * Revisa si una pelicula ya esta en el carrito.
   * @param {number} movieId - ID de la pelicula.
   * @returns {boolean} El estado del item.
   */
  function isInCart(movieId) {
    var normalizedMovieId = Number(movieId);

    return getCart().some(function (item) {
      return item.movieId === normalizedMovieId;
    });
  }

  /**
   * Obtiene las peliculas completas del carrito.
   * @returns {Array} La lista con datos y subtotales.
   */
  function getCartItems() {
    var movies = window.movieService ? window.movieService.getAllMovies() : [];

    return getCart()
      .map(function (item) {
        var movie = movies.find(function (catalogMovie) {
          return catalogMovie.id === item.movieId;
        });
        var unitPrice;

        if (!movie) {
          return null;
        }

        unitPrice = typeof movie.rentalPrice === "number" ? movie.rentalPrice : 0;

        return {
          movie: movie,
          quantity: item.quantity,
          unitPrice: unitPrice,
          subtotal: unitPrice * item.quantity,
          isAvailable: isMovieAvailable(movie),
        };
      })
      .filter(Boolean);
  }

  /**
   * Calcula el total del carrito.
   * @returns {number} El total acumulado.
   */
  function getCartTotal() {
    return getCartItems().reduce(function (total, item) {
      return total + item.subtotal;
    }, 0);
  }

  window.cartService = {
    getCart: getCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    isInCart: isInCart,
    getCartItems: getCartItems,
    getCartTotal: getCartTotal,
  };
})();
