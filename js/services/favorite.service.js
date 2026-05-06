/**
 * Servicio de favoritas.
 */
(function () {
  var storage = window.storageService;

  /**
   * Devuelve la lista de peliculas favoritas.
   * @returns {number[]} La lista de IDs de peliculas favoritas.
   */
  function getFavorites() {
    return storage.getFavorites();
  }

  /**
   * Revisa si una pelicula esta en favoritas.
   * @param {number} movieId - El ID de la pelicula.
   * @returns {boolean} true si la pelicula esta en favoritas.
   */
  function isFavorite(movieId) {
    return storage.isFavorite(movieId);
  }

  /**
   * Agrega o quita una pelicula de favoritas.
   * @param {number} movieId - El ID de la pelicula.
   * @returns {number[]} La lista actualizada de IDs de peliculas favoritas.
   */
  function toggleFavorite(movieId) {
    return storage.toggleFavorite(movieId);
  }

  window.favoriteService = {
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
  };
})();
