/**
 * Módulo de Visualización de Detalles de Película.
 * Gestiona la renderización de metadatos, el sistema de favoritos y la 
 * persistencia de comentarios para una película específica.
 */
(function () {
  var favoriteService = window.favoriteService;
  var commentService = window.commentService;
  var authService = window.authService;

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
    authNav: document.querySelector("[data-auth-nav]"),
    favoritesNav: document.querySelector("[data-favorites-nav]"),
  };

  /**
   * Valores por defecto para recursos faltantes o errores de carga.

   */
  var FALLBACKS = {
    poster: "assets/img/movie-fallback.svg",
  };

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
   * Determina la etiqueta textual del botón de favoritos basándose en el 
   * estado de persistencia actual del usuario.
   * @param {number} movieId - ID de la película para verificar en el servicio de almacenamiento.
   * @returns {string} Texto descriptivo para la acción del botón ("Quitar..." o "Marcar...").
   */
  function buildFavoriteButtonLabel(movieId) {
    if (!authService || !authService.isAuthenticated()) {
      return "Inicia sesión para guardar";
    }

    return favoriteService.isFavorite(movieId) ? "Quitar de favoritos" : "Guardar en favoritos";
  }

  /**
   * Actualiza el estado de sesion en el navbar.
   */
  function renderAuthNav() {
    var currentUser;

    if (!authService) {
      return;
    }

    currentUser = authService.getCurrentUser();

    if (SELECTORS.authNav) {
      SELECTORS.authNav.innerHTML = currentUser
        ? '<span class="auth-user"><img src="assets/img/icon-user-neon.png" alt="Usuario" class="nav-icon-img" /><span>Hola, ' +
          escapeHtml(currentUser.name) +
          '</span></span><button class="nav-icon-link auth-logout-button" type="button" data-auth-logout>Salir</button>'
        : '<a class="nav-icon-link" href="auth.html" aria-label="Ir a usuario"><img src="assets/img/icon-user-neon.png" alt="Usuario" class="nav-icon-img" /></a>';
    }

    if (SELECTORS.favoritesNav) {
      SELECTORS.favoritesNav.classList.toggle("d-none", !currentUser);
    }
  }

  /**
   * Formatea el precio de renta para mostrarlo en la ficha.
   * @param {Object} movie - La pelicula con datos de renta.
   * @returns {string} El precio listo para imprimir.
   */
  function getRentalPriceLabel(movie) {
    if (typeof movie.rentalPrice !== "number") {
      return "Consultar";
    }

    return "$" + movie.rentalPrice.toLocaleString("es-CO");
  }

  /**
   * Obtiene el formato de renta con valor por defecto.
   * @param {Object} movie - La pelicula con datos de renta.
   * @returns {string} El formato disponible.
   */
  function getRentalFormat(movie) {
    return movie.format || "Digital";
  }

  /**
   * Obtiene el stock de renta con valor por defecto.
   * @param {Object} movie - La pelicula con datos de renta.
   * @returns {number} El stock disponible.
   */
  function getRentalStock(movie) {
    return typeof movie.stock === "number" ? movie.stock : 0;
  }

  /**
   * Obtiene el tiempo de renta con valor por defecto.
   * @param {Object} movie - La pelicula con datos de renta.
   * @returns {string} El tiempo de renta.
   */
  function getRentalTime(movie) {
    return movie.rentalTime || "48 horas";
  }

  /**
   * Revisa si la pelicula esta disponible para renta.
   * @param {Object} movie - La pelicula con datos de renta.
   * @returns {boolean} La disponibilidad actual.
   */
  function isRentalAvailable(movie) {
    if (typeof movie.available === "boolean") {
      return movie.available;
    }

    return getRentalStock(movie) > 0;
  }

  /**
   * Devuelve la etiqueta de disponibilidad.
   * @param {Object} movie - La pelicula con datos de renta.
   * @returns {string} El texto de disponibilidad.
   */
  function getAvailabilityLabel(movie) {
    return isRentalAvailable(movie) ? "Disponible" : "No disponible";
  }

  /**
   * Renderiza etiquetas de renta para la ficha.
   * @param {Object} movie - La pelicula con datos de renta.
   * @returns {string} El HTML de etiquetas.
   */
  function createRentalTags(movie) {
    var tags = Array.isArray(movie.tags) && movie.tags.length ? movie.tags : [getRentalFormat(movie)];

    return tags
      .map(function (tag) {
        return '<span class="rental-tag">' + tag + "</span>";
      })
      .join("");
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
      window.helpers.createMetaPill(movie.genre) +
      window.helpers.createMetaPill(window.helpers.formatDate(movie.releaseDate)) +
      window.helpers.createMetaPill("Calificación " + movie.rating.toFixed(1)) +
      window.helpers.createMetaPill(getRentalPriceLabel(movie) + " / " + getRentalTime(movie));
    SELECTORS.detailSynopsis.textContent = movie.synopsis;
    SELECTORS.detailReview.textContent = movie.review;
    SELECTORS.favoriteButton.dataset.movieId = movie.id;
    SELECTORS.favoriteButton.textContent = buildFavoriteButtonLabel(movie.id);
    SELECTORS.favoriteButton.classList.toggle("is-active", favoriteService.isFavorite(movie.id));

    SELECTORS.actorsList.innerHTML = movie.actors
      .map(function (actor) {
        return '<span class="chip">' + actor + "</span>";
      })
      .join("");

    SELECTORS.movieFacts.innerHTML = [
      { label: "Fecha de estreno", value: window.helpers.formatDate(movie.releaseDate) },
      { label: "Género", value: movie.genre },
      { label: "Calificación", value: movie.rating.toFixed(1) + "/10" },
      { label: "Actores", value: movie.actors.length.toString() },
      { label: "Precio de renta", value: '<span class="rental-price-value">' + getRentalPriceLabel(movie) + "</span>" },
      { label: "Formato", value: '<span class="rental-badge rental-format">' + getRentalFormat(movie) + "</span>" },
      {
        label: "Disponibilidad",
        value:
          '<span class="rental-badge rental-availability ' +
          (isRentalAvailable(movie) ? "is-available" : "is-unavailable") +
          '">' +
          getAvailabilityLabel(movie) +
          "</span>",
      },
      {
        label: "Stock",
        value: getRentalStock(movie) + (getRentalStock(movie) === 1 ? " unidad" : " unidades"),
      },
      { label: "Tiempo de renta", value: getRentalTime(movie) },
      { label: "Etiquetas", value: '<div class="rental-tags rental-fact-tags">' + createRentalTags(movie) + "</div>" },
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
   * Muestra el estado de película no encontrada.
   * Oculta la vista de detalle y muestra el mensaje correspondiente.
   */
  function showMovieNotFound() {
    SELECTORS.detailBanner.classList.add("d-none");
    SELECTORS.detailView.classList.add("d-none");
    SELECTORS.movieNotFound.classList.remove("d-none");
  }

  /**
   * Muestra los comentarios guardados de una película.
   * @param {number} movieId - ID de la película para mostrar comentarios.
   */
  function renderComments(movieId) {
    var comments = commentService.getMovieComments(movieId);
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

    var wasSaved = commentService.addMovieComment(movieId, comment);

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
    if (commentService.deleteMovieComment(movieId, commentId)) {
      renderComments(movieId);
      setFeedback("Comentario eliminado.", true);
    } else {
      setFeedback("No fue posible eliminar el comentario.");
    }
  }

  /**
   * Conecta el cierre de sesion desde el navbar.
   */
  function bindAuthNavEvents(movieId) {
    if (!SELECTORS.authNav || !authService) {
      return;
    }

    SELECTORS.authNav.addEventListener("click", function (event) {
      if (!event.target.closest("[data-auth-logout]")) {
        return;
      }

      authService.logoutUser();
      renderAuthNav();
      if (SELECTORS.favoriteButton && movieId) {
        SELECTORS.favoriteButton.classList.remove("is-active");
        SELECTORS.favoriteButton.textContent = buildFavoriteButtonLabel(movieId);
      }
    });
  }

  /**
   * Maneja los eventos de la vista (favorita, submit y eliminar comentario).
   * @param {Object} movie - El objeto de la película.
   */
  function bindEvents(movie) {
    SELECTORS.favoriteButton.addEventListener("click", function () {
      if (!authService || !authService.isAuthenticated()) {
        window.location.href = "auth.html";
        return;
      }

      favoriteService.toggleFavorite(movie.id);
      SELECTORS.favoriteButton.classList.toggle("is-active", favoriteService.isFavorite(movie.id));
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
    var movie = window.movieService.getMovieById(movieId);

    renderAuthNav();

    if (!movie) {
      showMovieNotFound();
      return;
    }

    bindAuthNavEvents(movie.id);
    renderMovie(movie);
    window.helpers.bindImageFallbacks(SELECTORS.detailPoster);
    renderComments(movie.id);
    bindEvents(movie);
  }

  init();
})();
