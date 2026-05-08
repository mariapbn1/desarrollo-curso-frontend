/**
 * Servicio de favoritas.
 */
(function () {
  var STORAGE_KEY = "mapaVideoClubFavorites";

  /**
   * Lee el mapa de favoritas por usuario.
   * @returns {Object} El mapa de favoritas guardado.
   */
  function getFavoritesMap() {
    try {
      var rawValue = window.localStorage.getItem(STORAGE_KEY);
      return rawValue ? JSON.parse(rawValue) : {};
    } catch (error) {
      console.error("No fue posible leer favoritas:", error);
      return {};
    }
  }

  /**
   * Guarda el mapa de favoritas por usuario.
   * @param {Object} favoritesMap - El mapa de favoritas.
   * @returns {boolean} true si se guardo correctamente.
   */
  function saveFavoritesMap(favoritesMap) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesMap));
      return true;
    } catch (error) {
      console.error("No fue posible guardar favoritas:", error);
      return false;
    }
  }

  /**
   * Obtiene el correo del usuario activo.
   * @returns {string|null} El correo del usuario o null.
   */
  function getCurrentUserKey() {
    var currentUser = window.authService ? window.authService.getCurrentUser() : null;
    return currentUser && currentUser.email ? String(currentUser.email).toLowerCase() : null;
  }

  /**
   * Devuelve la lista de peliculas favoritas del usuario activo.
   * @returns {number[]} La lista de IDs de peliculas favoritas.
   */
  function getFavorites() {
    var userKey = getCurrentUserKey();
    var favoritesMap = getFavoritesMap();

    if (!userKey) {
      return [];
    }

    return Array.isArray(favoritesMap[userKey]) ? favoritesMap[userKey] : [];
  }

  /**
   * Revisa si una pelicula esta en favoritas del usuario activo.
   * @param {number} movieId - El ID de la pelicula.
   * @returns {boolean} true si la pelicula esta en favoritas.
   */
  function isFavorite(movieId) {
    return getFavorites().includes(movieId);
  }

  /**
   * Agrega o quita una pelicula de favoritas del usuario activo.
   * @param {number} movieId - El ID de la pelicula.
   * @returns {number[]} La lista actualizada de IDs de peliculas favoritas.
   */
  function toggleFavorite(movieId) {
    var userKey = getCurrentUserKey();
    var favoritesMap = getFavoritesMap();
    var favorites;
    var nextFavorites;

    if (!userKey) {
      return [];
    }

    favorites = Array.isArray(favoritesMap[userKey]) ? favoritesMap[userKey] : [];
    nextFavorites = favorites.includes(movieId)
      ? favorites.filter(function (favoriteId) {
          return favoriteId !== movieId;
        })
      : favorites.concat(movieId);

    favoritesMap[userKey] = nextFavorites;
    return saveFavoritesMap(favoritesMap) ? nextFavorites : favorites;
  }

  window.favoriteService = {
    STORAGE_KEY: STORAGE_KEY,
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
  };
})();
