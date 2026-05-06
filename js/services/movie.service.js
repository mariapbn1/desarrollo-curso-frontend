/**
 * Servicio de consulta de peliculas.
 */
(function () {
  /**
   * Devuelve todas las peliculas del catalogo.
   * @returns {Array} La lista de peliculas.
   */
  function getAllMovies() {
    return Array.isArray(window.MOVIES) ? window.MOVIES.slice() : [];
  }

  /**
   * Obtiene una pelicula por su ID.
   * @param {number} movieId - El ID de la pelicula.
   * @returns {Object|undefined} La pelicula encontrada.
   */
  function getMovieById(movieId) {
    return getAllMovies().find(function (movie) {
      return movie.id === movieId;
    });
  }

  /**
   * Obtiene el anio de estreno de la pelicula.
   * @param {Object} movie - El objeto de la pelicula.
   * @returns {string} El anio de estreno.
   */
  function getMovieYear(movie) {
    return new Date(movie.releaseDate).getFullYear().toString();
  }

  /**
   * Ordena las peliculas de la mas nueva a la mas vieja.
   * @param {Object} movieA - La primera pelicula.
   * @param {Object} movieB - La segunda pelicula.
   * @returns {number} El resultado de la comparacion.
   */
  function sortByDateDesc(movieA, movieB) {
    return new Date(movieB.releaseDate) - new Date(movieA.releaseDate);
  }

  /**
   * Devuelve los estrenos mas recientes.
   * @param {number} limit - La cantidad de peliculas a devolver.
   * @returns {Array} La lista de estrenos.
   */
  function getLatestMovies(limit) {
    return getAllMovies().sort(sortByDateDesc).slice(0, limit);
  }

  /**
   * Devuelve las peliculas mejor calificadas.
   * @param {number} limit - La cantidad de peliculas a devolver.
   * @returns {Array} La lista de peliculas mejor calificadas.
   */
  function getTopRatedMovies(limit) {
    return getAllMovies()
      .sort(function (movieA, movieB) {
        return movieB.rating - movieA.rating;
      })
      .slice(0, limit);
  }

  window.movieService = {
    getAllMovies: getAllMovies,
    getMovieById: getMovieById,
    getMovieYear: getMovieYear,
    sortByDateDesc: sortByDateDesc,
    getLatestMovies: getLatestMovies,
    getTopRatedMovies: getTopRatedMovies,
  };
})();
