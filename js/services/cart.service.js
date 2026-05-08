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
   * Agrega una pelicula sin duplicarla.
   * @param {number} movieId - ID de la pelicula.
   * @returns {Array} El carrito actualizado.
   */
  function addToCart(movieId) {
    var cart = getCart();
    var normalizedMovieId = Number(movieId);

    if (!normalizedMovieId || isInCart(normalizedMovieId)) {
      return cart;
    }

    cart.push({
      movieId: normalizedMovieId,
      quantity: 1,
    });

    return saveCart(cart);
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
