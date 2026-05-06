/**
 * Módulo de Visualización de Detalles de Película.
 * Gestiona la renderización de metadatos, el sistema de favoritos y la 
 * persistencia de comentarios para una película específica.
 */
(function () {
  var movies = Array.isArray(window.MOVIES) ? window.MOVIES : [];
  var storage = window.storageService;

  var SELECTORS = {
    detailBanner: document.getElementById("detail-banner"),
    detailPoster: document.getElementById("detail-poster"),
    detailTitle: document.getElementById("detail-title"),
    detailMeta: document.getElementById("detail-meta"),
    detailSynopsis: document.getElementById("detail-synopsis"),
    detailReview: document.getElementById("detail-review"),
    actorsList: document.getElementById("actors-list"),
    movieFacts: document.getElementById("movie-facts"),
    galleryGrid: document.getElementById("gallery-grid"),
    favoriteButton: document.getElementById("detail-favorite-button"),
    commentForm: document.getElementById("comment-form"),
    commentName: document.getElementById("comment-name"),
    commentText: document.getElementById("comment-text"),
    commentFeedback: document.getElementById("comment-feedback"),
    commentsList: document.getElementById("comments-list"),
    commentsEmptyState: document.getElementById("comments-empty-state"),
    commentsCount: document.getElementById("comments-count"),
    movieNotFound: document.getElementById("movie-not-found"),
    detailView: document.getElementById("detail-view"),
  };

  /**
   * Valores por defecto para recursos faltantes o errores de carga.

   */
  var FALLBACKS = {
    poster: "assets/img/movie-fallback.svg",
  };


  /**
   * Función para categorizar información como géneros o etiquetas de fecha.
   * @param {string} label - El texto que se mostrará dentro de la etiqueta.
   * @returns {string} Cadena de texto con formato HTML (elemento <span>).
   */
  function createMetaPill(label) {
    return '<span class="meta-pill">' + label + "</span>";
  }

  /**
   * Transforma una cadena de fecha en un formato legible (día, mes y año).
   * Configurado específicamente para el estándar de Colombia (es-CO).
   * @example "2026-05-01" -> "1 de mayo de 2026"
   * @param {string|Date} dateValue - La fecha original en formato ISO o un objeto Date.
   * @returns {string} Fecha formateada.
   */
  function formatDate(dateValue) {
    return new Date(dateValue).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Convierte caracteres especiales de HTML en sus respectivas entidades seguras.
   * @param {string|number} value - El contenido que se desea convertir.
   * @returns {string} El texto procesado seguro para ser insertado en el DOM.
   */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // saca el id de la url para saber que pelicula cargar
  /**
   * Extrae el identificador de la película desde los parámetros de la URL para
   * saber qué película cargar.
   * @example URL: domain.com/detail.html?id=2026001 -> 2026001
   * @returns {number|null} El ID convertido a número, o NaN si el parámetro no existe.
   */
  function getMovieIdFromUrl() {
    var searchParams = new URLSearchParams(window.location.search);
    return Number(searchParams.get("id"));
  }

  /**
   * Localiza un objeto de película dentro del catálogo basándose en su ID único.
   * @param {number} movieId - El ID de la película a buscar.
   * @returns {Movie|undefined} El objeto de la película encontrada o undefined si no hay coincidencia.
   */
  function findMovieById(movieId) {
    return movies.find(function (movie) {
      return movie.id === movieId;
    });
  }

  /**
   * Determina la etiqueta textual del botón de favoritos basándose en el 
   * estado de persistencia actual del usuario.
   * @param {number} movieId - ID de la película para verificar en el servicio de almacenamiento.
   * @returns {string} Texto descriptivo para la acción del botón ("Quitar..." o "Marcar...").
   */
  function buildFavoriteButtonLabel(movieId) {
    return storage.isFavorite(movieId) ? "Quitar de favoritas" : "Marcar como favorita";
  }

  /**
   * Orquestador principal para la renderización de la vista de detalle.
   * Distribuye los datos de la película en las diferentes secciones del DOM.
   * @param {Movie} movie - El objeto de la película que se desea visualizar.
   */
  function renderMovie(movie) {
    SELECTORS.detailBanner.style.backgroundImage = 'url("' + movie.banner + '")';
    SELECTORS.detailPoster.src = movie.poster;
    SELECTORS.detailPoster.alt = "Poster de " + movie.title;
    SELECTORS.detailPoster.dataset.fallbackSrc = FALLBACKS.poster;
    SELECTORS.detailTitle.textContent = movie.title;
    SELECTORS.detailMeta.innerHTML =
      createMetaPill(movie.genre) +
      createMetaPill(formatDate(movie.releaseDate)) +
      createMetaPill("Calificación " + movie.rating.toFixed(1));
    SELECTORS.detailSynopsis.textContent = movie.synopsis;
    SELECTORS.detailReview.textContent = movie.review;
    SELECTORS.favoriteButton.dataset.movieId = movie.id;
    SELECTORS.favoriteButton.textContent = buildFavoriteButtonLabel(movie.id);
    SELECTORS.favoriteButton.classList.toggle("is-active", storage.isFavorite(movie.id));

    SELECTORS.actorsList.innerHTML = movie.actors
      .map(function (actor) {
        return '<span class="chip">' + actor + "</span>";
      })
      .join("");

    SELECTORS.movieFacts.innerHTML = [
      { label: "Fecha de estreno", value: formatDate(movie.releaseDate) },
      { label: "Género", value: movie.genre },
      { label: "Calificación", value: movie.rating.toFixed(1) + "/10" },
      { label: "Actores", value: movie.actors.length.toString() },
    ]
      .map(function (item) {
        return "<div><dt>" + item.label + "</dt><dd>" + item.value + "</dd></div>";
      })
      .join("");

    SELECTORS.galleryGrid.innerHTML = movie.photos
      .map(function (photo, index) {
        return [
          '<div class="col-12 col-sm-6 col-md-4">',
          '<img class="gallery-image" src="' + photo + '" alt="Fotograma ' + (index + 1) + " de " + movie.title + '" />',
          "</div>",
        ].join("");
      })
      .join("");
  }

  /**
   * Configura mecanismos de recuperación ante fallos en la carga de imágenes.
   * Si un recurso falla (error 404 o similar), se sustituye la fuente por un 
   * recurso local de respaldo definido en los atributos data del elemento.
   */
  function bindImageFallbacks() {
    [SELECTORS.detailPoster].forEach(function (image) {
      if (!image) {
        return;
      }

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

  /**
   * Muestra el estado de película no encontrada.
   * Oculta la vista de detalle y muestra el mensaje correspondiente.
   */
  function showMovieNotFound() {
    SELECTORS.detailBanner.classList.add("d-none");
    SELECTORS.detailView.classList.add("d-none");
    SELECTORS.movieNotFound.classList.remove("d-none");
  }

  /**
   * Obtiene los comentarios guardados de una película en el LocalStorage.
   * @param {number} movieId - ID de la película para recuperar comentarios.
   * @returns {Array} Lista de comentarios asociados a la película.
   */
  function getComments(movieId) {
    return storage.getMovieComments(movieId);
  }

  /**
   * Muestra los comentarios guardados de una película.
   * @param {number} movieId - ID de la película para mostrar comentarios.
   */
  function renderComments(movieId) {
    var comments = getComments(movieId);
    SELECTORS.commentsCount.textContent = comments.length + (comments.length === 1 ? " comentario" : " comentarios");
    SELECTORS.commentsEmptyState.classList.toggle("d-none", comments.length > 0);
    SELECTORS.commentsList.innerHTML = comments
      .map(function (comment) {
        return [
          '<article class="comment-card">',
          '<div class="comment-header">',
          '<div>',
          '<div class="comment-author">' + escapeHtml(comment.name) + "</div>",
          '<div class="comment-date">' + escapeHtml(comment.dateLabel) + "</div>",
          "</div>",
          '<button class="btn btn-sm btn-delete-comment" type="button" data-comment-id="' + comment.id + '">Eliminar</button>',
          "</div>",
          '<p class="comment-text">' + escapeHtml(comment.text) + "</p>",
          "</article>",
        ].join("");
      })
      .join("");
  }

  /**
   * Muestra un mensaje de estado en el formulario.
   * @param {string} message - El mensaje a mostrar.
   * @param {boolean} isSuccess - Indica si el mensaje es de éxito.
   */
  function setFeedback(message, isSuccess) {
    SELECTORS.commentFeedback.textContent = message;
    SELECTORS.commentFeedback.classList.toggle("is-success", Boolean(isSuccess));
  }

  /**
   * Crea el objeto del comentario si los datos son válidos.
   * @returns {Object|null} El objeto del comentario o null si los datos son inválidos.
   */
  function createCommentPayload() {
    var name = SELECTORS.commentName.value.trim();
    var text = SELECTORS.commentText.value.trim();

    if (!name || !text) {
      setFeedback("Debes completar tu nombre y el comentario.");
      return null;
    }

    return {
      id: Date.now(),
      name: name,
      text: text,
      dateLabel: new Date().toLocaleString("es-CO"),
    };
  }

  /**
   * Maneja el envío del formulario de comentarios.
   * Guarda el comentario nuevo y actualiza la lista.
   * @param {number} movieId - ID de la película para la cual se envía el comentario.
   * @param {Event} event - El evento de envío del formulario.
   */
  function handleCommentSubmit(movieId, event) {
    event.preventDefault();
    var comment = createCommentPayload();
    if (!comment) {
      return;
    }

    var nextComments = [comment].concat(getComments(movieId));
    var wasSaved = storage.saveMovieComments(movieId, nextComments);

    if (!wasSaved) {
      setFeedback("No fue posible guardar el comentario. Intenta nuevamente.");
      return;
    }

    SELECTORS.commentForm.reset();
    setFeedback("Comentario guardado correctamente.", true);
    renderComments(movieId);
  }

  /**
   * Borra el comentario y refresca los comentarios en pantalla.
   * @param {number} movieId - ID de la película para la cual se elimina el comentario.
   * @param {number} commentId - ID del comentario a eliminar.
   */
  function handleCommentDelete(movieId, commentId) {
    var nextComments = getComments(movieId).filter(function (comment) {
      return comment.id !== commentId;
    });

    if (storage.saveMovieComments(movieId, nextComments)) {
      renderComments(movieId);
      setFeedback("Comentario eliminado.", true);
    } else {
      setFeedback("No fue posible eliminar el comentario.");
    }
  }

  /**
   * Maneja los eventos de la vista (favorita, submit y eliminar comentario).
   * @param {Object} movie - El objeto de la película.
   */
  function bindEvents(movie) {
    SELECTORS.favoriteButton.addEventListener("click", function () {
      storage.toggleFavorite(movie.id);
      SELECTORS.favoriteButton.classList.toggle("is-active", storage.isFavorite(movie.id));
      SELECTORS.favoriteButton.textContent = buildFavoriteButtonLabel(movie.id);
    });

    SELECTORS.commentForm.addEventListener("submit", function (event) {
      handleCommentSubmit(movie.id, event);
    });

    SELECTORS.commentsList.addEventListener("click", function (event) {
      var deleteButton = event.target.closest("[data-comment-id]");
      if (!deleteButton) {
        return;
      }

      handleCommentDelete(movie.id, Number(deleteButton.dataset.commentId));
    });
  }

  /**
   * Inicializa la vista de detalle de la película.
   */
  function init() {
    var movieId = getMovieIdFromUrl();
    var movie = findMovieById(movieId);

    if (!movie) {
      showMovieNotFound();
      return;
    }

    renderMovie(movie);
    bindImageFallbacks();
    renderComments(movie.id);
    bindEvents(movie);
  }

  init();
})();
