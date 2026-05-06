/**
 * Módulo de Persistencia de Datos (Storage Service - localStorage).
 * Encapsula la interacción con `window.localStorage` para gestionar
 * las preferencias del usuario y el historial de interacciones.
 */
(function () {
  var STORAGE_KEYS = {
    favorites: "cinemaScopeFavorites",
    comments: "cinemaScopeComments",
  };

  /**
   * Lee una clave de localStorage y devuelve un valor por defecto si falla.
   * @param {string} key - La clave a leer.
   * @param {*} fallbackValue - El valor por defecto en caso de error.
   * @returns {*} El valor leído o el valor por defecto.
   */
  function readStorage(key, fallbackValue) {
    try {
      var rawValue = window.localStorage.getItem(key);
      return rawValue ? JSON.parse(rawValue) : fallbackValue;
    } catch (error) {
      console.error("No fue posible leer localStorage:", error);
      return fallbackValue;
    }
  }

  /**
   * Guarda un valor en localStorage y devuelve true si fue exitoso.
   * @param {string} key - La clave a guardar.
   * @param {*} value - El valor a guardar.
   * @returns {boolean} true si el guardado fue exitoso, false en caso contrario.
   */
  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("No fue posible guardar en localStorage:", error);
      return false;
    }
  }

  /**
   * Devuelve la lista de peliculas favoritas.
   * @returns {number[]} La lista de IDs de peliculas favoritas.
   */
  function getFavorites() {
    return readStorage(STORAGE_KEYS.favorites, []);
  }

  /**
   * Valida si una pelicula esta en favoritas.
   * @param {number} movieId - El ID de la película.
   * @returns {boolean} true si la película está en favoritas, false en caso contrario.
   */
  function isFavorite(movieId) {
    return getFavorites().includes(movieId);
  }

  /**
   * Agrega o quita una pelicula de favoritas y devuelve la lista actualizada.
   * @param {number} movieId - El ID de la película.
   * @returns {number[]} La lista actualizada de IDs de película favoritas.
   */
  function toggleFavorite(movieId) {
    var favorites = getFavorites();
    var alreadyFavorite = favorites.includes(movieId);
    var nextFavorites = alreadyFavorite
      ? favorites.filter(function (favoriteId) {
          return favoriteId !== movieId;
        })
      : favorites.concat(movieId);

    return writeStorage(STORAGE_KEYS.favorites, nextFavorites) ? nextFavorites : favorites;
  }

  /**
   * Devuelve todos los comentarios guardados por película.
   * @returns {Object} Un objeto que mapea IDs de películas a sus comentarios.
   */
  function getCommentsMap() {
    return readStorage(STORAGE_KEYS.comments, {});
  }

  /**
   * Trae los comentarios guardados de una película.
   * @param {number} movieId - El ID de la película.
   * @returns {Array} La lista de comentarios para la película especificada.
   */
  function getMovieComments(movieId) {
    var commentsMap = getCommentsMap();
    return commentsMap[movieId] || [];
  }

  /**
   * Guarda los comentarios de una película en localStorage.
   * @param {number} movieId - El ID de la película.
   * @param {Array} comments - La lista de comentarios para la película.
   * @returns {boolean} true si el guardado fue exitoso, false en caso contrario.
   */
  function saveMovieComments(movieId, comments) {
    var commentsMap = getCommentsMap();
    commentsMap[movieId] = comments;
    return writeStorage(STORAGE_KEYS.comments, commentsMap);
  }

  /**
   * Expone las funciones para usarlas en el resto del proyecto.
   */
  window.storageService = {
    STORAGE_KEYS: STORAGE_KEYS,
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
    getMovieComments: getMovieComments,
    saveMovieComments: saveMovieComments,
  };
})();
