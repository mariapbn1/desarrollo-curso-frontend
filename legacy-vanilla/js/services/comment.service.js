/**
 * Servicio de comentarios.
 */
(function () {
  var storage = window.storageService;

  /**
   * Obtiene los comentarios guardados de una pelicula.
   * @param {number} movieId - ID de la pelicula para recuperar comentarios.
   * @returns {Array} Lista de comentarios asociados a la pelicula.
   */
  function getMovieComments(movieId) {
    return storage.getMovieComments(movieId);
  }

  /**
   * Guarda los comentarios de una pelicula.
   * @param {number} movieId - ID de la pelicula.
   * @param {Array} comments - La lista de comentarios.
   * @returns {boolean} true si el guardado fue exitoso.
   */
  function saveMovieComments(movieId, comments) {
    return storage.saveMovieComments(movieId, comments);
  }

  /**
   * Guarda un comentario nuevo al inicio de la lista.
   * @param {number} movieId - ID de la pelicula.
   * @param {Object} comment - El comentario nuevo.
   * @returns {boolean} true si el guardado fue exitoso.
   */
  function addMovieComment(movieId, comment) {
    var nextComments = [comment].concat(getMovieComments(movieId));
    return saveMovieComments(movieId, nextComments);
  }

  /**
   * Elimina un comentario por ID.
   * @param {number} movieId - ID de la pelicula.
   * @param {number} commentId - ID del comentario a eliminar.
   * @returns {boolean} true si el guardado fue exitoso.
   */
  function deleteMovieComment(movieId, commentId) {
    var nextComments = getMovieComments(movieId).filter(function (comment) {
      return comment.id !== commentId;
    });

    return saveMovieComments(movieId, nextComments);
  }

  window.commentService = {
    getMovieComments: getMovieComments,
    saveMovieComments: saveMovieComments,
    addMovieComment: addMovieComment,
    deleteMovieComment: deleteMovieComment,
  };
})();
