/**
 * Módulo de la Vista Principal (Catálogo).
 * Gestiona el listado global de películas, la lógica de filtrado multidimensional,
 * la búsqueda en tiempo real y la paginación de resultados.
 */
(function () {
  var movies = window.movieService.getAllMovies();
  var favoriteService = window.favoriteService;
  var authService = window.authService;
  var cartService = window.cartService;

  var CONFIG = {
    moviesPerPage: 9,
    newReleaseSlides: 6,
    newReleaseInterval: 5000,
    featuredMovies: 4,
  };
  var FALLBACKS = {
    poster: "assets/img/movie-fallback.svg",
  };

  var state = {
    currentPage: 1,
    showOnlyFavorites: false,
    newReleaseIndex: 0,
    newReleaseTimerId: null,
    newReleaseMovies: [],
  };

  var SELECTORS = {
    heroSection: document.getElementById("hero-section"),
    heroTitle: document.getElementById("hero-title"),
    heroSynopsis: document.getElementById("hero-synopsis"),
    heroMeta: document.getElementById("hero-meta"),
    heroDetailLink: document.getElementById("hero-detail-link"),
    heroFavoriteButton: document.getElementById("hero-favorite-button"),
    searchInput: document.getElementById("search-input"),
    genreFilter: document.getElementById("genre-filter"),
    yearFilter: document.getElementById("year-filter"),
    ratingFilter: document.getElementById("rating-filter"),
    formatFilter: document.getElementById("format-filter"),
    catalogTitle: document.getElementById("catalog-title"),
    catalogCopy: document.getElementById("catalog-copy"),
    fullCatalogButtons: document.querySelectorAll('[data-action="show-full-catalog"]'),
    clearFiltersButtons: document.querySelectorAll('[data-action="clear-filters"]'),
    catalogStart: document.getElementById("movies-grid"),
    moviesGrid: document.getElementById("movies-grid"),
    emptyState: document.getElementById("empty-state"),
    latestList: document.getElementById("latest-list"),
    topRatedList: document.getElementById("top-rated-list"),
    favoritesList: document.getElementById("favorites-list"),
    favoriteShelf: document.getElementById("favoritos"),
    collectionCards: document.querySelectorAll("#colecciones .row.g-4 > .col-12"),
    resultsPill: document.getElementById("results-pill"),
    paginationPanel: document.getElementById("pagination-panel"),
    paginationNumbers: document.getElementById("pagination-numbers"),
    paginationPrev: document.getElementById("pagination-prev"),
    paginationNext: document.getElementById("pagination-next"),
    newReleasesCarousel: document.getElementById("new-releases-carousel"),
    newReleasesSection: document.querySelector(".new-releases-section"),
    newReleasesTrack: document.getElementById("new-releases-track"),
    newReleaseDots: document.getElementById("new-release-dots"),
    newReleasePrev: document.getElementById("new-release-prev"),
    newReleaseNext: document.getElementById("new-release-next"),
    topRentalSection: document.getElementById("top-rental-section"),
    topRentalGrid: document.getElementById("top-rental-grid"),
    topRentalEmpty: document.getElementById("top-rental-empty"),
    popularSection: document.getElementById("popular-section"),
    popularGrid: document.getElementById("popular-grid"),
    popularEmpty: document.getElementById("popular-empty"),
    authNav: document.querySelector("[data-auth-nav]"),
    favoritesNav: document.querySelector("[data-favorites-nav]"),
    collectionSection: document.getElementById("colecciones"),
  };

  /**
   * Convierte caracteres especiales en texto seguro.
   * @param {string} value - El texto a limpiar.
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
      SELECTORS.favoritesNav.classList.toggle("is-active", Boolean(currentUser && state.showOnlyFavorites));
    }
  }

  /**
   * Define el texto del botón según si es favorita o no.
   * @param {number} movieId - ID de la película.
   * @returns {string} El texto del botón.
   */
  function buildFavoriteButtonLabel(movieId) {
    if (!authService || !authService.isAuthenticated()) {
      return "Inicia sesión para guardar en favoritas";
    }

    return favoriteService.isFavorite(movieId) ? "Quitar de favoritas" : "Agregar a favoritas";
  }

  /**
   * Crea el boton de corazon para favoritas.
   * @param {number} movieId - ID de la pelicula.
   * @returns {string} El HTML del boton.
   */
  function createFavoriteToggleButton(movieId) {
    return [
      '<button class="movie-favorite-toggle ' +
        (favoriteService.isFavorite(movieId) ? "is-active" : "") +
        '" type="button" data-favorite-id="' +
        movieId +
        '" aria-label="' +
        buildFavoriteButtonLabel(movieId) +
        '" title="' +
        buildFavoriteButtonLabel(movieId) +
        '">' +
        (favoriteService.isFavorite(movieId) ? "♥" : "♡") +
        "</button>",
    ].join("");
  }

  /**
   * Define el texto del botón destacado de favoritas.
   * @param {number} movieId - ID de la película.
   * @returns {string} El texto del botón.
   */
  function buildHeroFavoriteButtonLabel(movieId) {
    if (!authService || !authService.isAuthenticated()) {
      return "Inicia sesión para guardar";
    }

    return favoriteService.isFavorite(movieId) ? "Quitar de favoritos" : "Agregar a favoritos";
  }

  /**
   * Formatea el precio de renta para mostrarlo en la vista.
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
      return movie.available && Number(movie.stock || 0) > 0;
    }

    return Number(movie.stock || 0) > 0;
  }

  /**
   * Devuelve la etiqueta de disponibilidad.
   * @param {Object} movie - La pelicula con datos de renta.
   * @returns {string} El texto de disponibilidad.
   */
  function getAvailabilityLabel(movie) {
    return isRentalAvailable(movie) ? "Disponible" : "Agotada";
  }

  /**
   * Renderiza etiquetas de renta para la card.
   * @param {Object} movie - La pelicula con datos de renta.
   * @returns {string} El HTML de etiquetas.
   */
  function createRentalTags(movie) {
    var tags = Array.isArray(movie.tags) && movie.tags.length ? movie.tags : [getRentalFormat(movie)];

    return tags
      .slice(0, 3)
      .map(function (tag) {
        return '<span class="rental-tag">' + tag + "</span>";
      })
      .join("");
  }

  /**
   * Calcula cuántas páginas hay según la cantidad de resultados.
   * @param {number} totalItems - La cantidad total de elementos.
   * @returns {number} El número total de páginas.
   */
  function getTotalPages(totalItems) {
    return Math.max(1, Math.ceil(totalItems / CONFIG.moviesPerPage));
  }

  /**
   * Esta función sirve para evitar que la página actual se pase del rango válido.
   * @param {number} totalPages - El número total de páginas.
   */

  function clampCurrentPage(totalPages) {
    state.currentPage = Math.min(Math.max(state.currentPage, 1), totalPages);
  }

  /**
   * Vuelve a la primera página cuando cambian los filtros.
   */
  function resetToFirstPage() {
    state.currentPage = 1;
  }

  /**
   * Revisa si hay busqueda o filtros activos.
   * @returns {boolean} true si hay filtros aplicados.
   */
  function hasActiveFieldFilters() {
    return Boolean(
      SELECTORS.searchInput.value.trim() ||
        SELECTORS.genreFilter.value ||
        SELECTORS.yearFilter.value ||
        SELECTORS.ratingFilter.value ||
        (SELECTORS.formatFilter && SELECTORS.formatFilter.value)
    );
  }

  /**
   * Revisa si la home esta en modo filtrado.
   * @returns {boolean} true si debe mostrar solo resultados.
   */
  function hasActiveFilters() {
    return hasActiveFieldFilters() || state.showOnlyFavorites;
  }

  /**
   * Muestra u oculta secciones destacadas segun los filtros.
   */
  function toggleFeaturedSections() {
    var shouldHideSections = hasActiveFilters();

    [SELECTORS.newReleasesSection, SELECTORS.topRentalSection, SELECTORS.popularSection, SELECTORS.collectionSection].forEach(
      function (section) {
        if (section) {
          section.classList.toggle("d-none", shouldHideSections);
        }
      }
    );

    if (shouldHideSections) {
      stopNewReleaseAutoplay();
      return;
    }

    startNewReleaseAutoplay();
  }

  /**
   * Limpia busqueda, filtros y favoritas.
   */
  function clearFilters() {
    SELECTORS.searchInput.value = "";
    SELECTORS.genreFilter.value = "";
    SELECTORS.yearFilter.value = "";
    SELECTORS.ratingFilter.value = "";

    if (SELECTORS.formatFilter) {
      SELECTORS.formatFilter.value = "";
    }

    state.showOnlyFavorites = false;
    resetToFirstPage();
    renderAuthNav();
    renderMovies();
    scrollToCatalogStart();
  }

  /**
   * Actualiza el titulo del catalogo segun la vista activa.
   */
  function updateCatalogHeading() {
    var hasFilters = hasActiveFieldFilters();

    if (!SELECTORS.catalogTitle || !SELECTORS.catalogCopy) {
      return;
    }

    if (state.showOnlyFavorites) {
      SELECTORS.catalogTitle.textContent = "Tus favoritas";
      SELECTORS.catalogCopy.textContent = "Estas son las películas que guardaste en tu lista.";
    } else if (hasFilters) {
      SELECTORS.catalogTitle.textContent = "Resultados filtrados";
      SELECTORS.catalogCopy.textContent = "Películas que coinciden con tu búsqueda y filtros actuales.";
    } else {
      SELECTORS.catalogTitle.textContent = "Catálogo del videoclub";
      SELECTORS.catalogCopy.textContent =
        "Explora nuestro catálogo retro, filtra por género y guarda tus películas favoritas para rentarlas después.";
    }

    SELECTORS.fullCatalogButtons.forEach(function (button) {
      button.classList.toggle("d-none", !state.showOnlyFavorites);
    });
    SELECTORS.clearFiltersButtons.forEach(function (button) {
      button.classList.toggle("d-none", !hasActiveFilters());
    });
  }

  /**
   * Vuelve al catalogo completo.
   */
  function showFullCatalog() {
    clearFilters();
  }

  /**
   * Activa favoritas si la URL lo solicita y hay sesion.
   */
  function applyInitialFavoriteView() {
    var searchParams = new URLSearchParams(window.location.search);
    state.showOnlyFavorites = searchParams.get("view") === "favorites" && authService && authService.isAuthenticated();
  }

  /**
   * Lleva el scroll al inicio del catalogo general.
   */
  function scrollToCatalogStart() {
    if (SELECTORS.catalogStart) {
      SELECTORS.catalogStart.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /**
   * Devuelve solo las películas que corresponden a la página actual.
   * @param {Array} filteredMovies - La lista de películas filtradas.
   * @returns {Array} La lista de películas para la página actual.
   */
  function getPaginatedMovies(filteredMovies) {
    var totalPages = getTotalPages(filteredMovies.length);
    var startIndex;
    var endIndex;

    clampCurrentPage(totalPages);
    startIndex = (state.currentPage - 1) * CONFIG.moviesPerPage;
    endIndex = startIndex + CONFIG.moviesPerPage;

    return filteredMovies.slice(startIndex, endIndex);
  }

  /**
   * Carga la película destacada en la parte superior.
   */
  function renderHeroSection() {
    if (!movies.length) {
      return;
    }

    var featuredMovie = window.movieService.getLatestMovies(1)[0];
    SELECTORS.heroSection.style.backgroundImage = 'url("' + featuredMovie.banner + '")';
    SELECTORS.heroTitle.textContent = featuredMovie.title;
    SELECTORS.heroSynopsis.textContent = featuredMovie.synopsis;
    SELECTORS.heroMeta.innerHTML =
      window.helpers.createMetaPill(featuredMovie.genre) +
      window.helpers.createMetaPill(window.helpers.formatDate(featuredMovie.releaseDate)) +
      window.helpers.createMetaPill("Calificacion " + featuredMovie.rating.toFixed(1)) +
      window.helpers.createMetaPill(getRentalPriceLabel(featuredMovie) + " / " + getRentalTime(featuredMovie)) +
      window.helpers.createMetaPill(getAvailabilityLabel(featuredMovie));
    SELECTORS.heroDetailLink.href = "movie-detail.html?id=" + featuredMovie.id;
    SELECTORS.heroFavoriteButton.textContent = buildHeroFavoriteButtonLabel(featuredMovie.id);
    SELECTORS.heroFavoriteButton.dataset.movieId = featuredMovie.id;
    SELECTORS.heroFavoriteButton.classList.toggle("is-active", favoriteService.isFavorite(featuredMovie.id));
  }

  /**
   * Recorta la sinopsis para usarla en novedades.
   * @param {string} synopsis - El texto original.
   * @returns {string} El texto breve.
   */
  function getShortSynopsis(synopsis) {
    var cleanSynopsis = String(synopsis || "").trim();

    if (cleanSynopsis.length <= 140) {
      return cleanSynopsis;
    }

    return cleanSynopsis.slice(0, 137).trim() + "...";
  }

  /**
   * Crea un slide del carrusel de novedades.
   * @param {Object} movie - La pelicula del slide.
   * @param {number} index - La posicion del slide.
   * @returns {string} El HTML del slide.
   */
  function createNewReleaseSlide(movie, index) {
    var imageUrl = movie.banner || movie.poster || FALLBACKS.poster;

    return [
      '<article class="new-release-slide ' + (index === 0 ? "is-active" : "") + '"',
      ' style="background-image: url(' + escapeHtml(imageUrl) + ')"',
      ' data-new-release-slide aria-hidden="' + (index === 0 ? "false" : "true") + '">',
      '<div class="new-release-content">',
      '<span class="rental-tag">ESTRENO</span>',
      '<h3>' + escapeHtml(movie.title) + "</h3>",
      '<p>' + escapeHtml(getShortSynopsis(movie.synopsis)) + "</p>",
      '<div class="new-release-meta">',
      window.helpers.createMetaPill(escapeHtml(movie.genre)),
      window.helpers.createMetaPill(window.helpers.formatDate(movie.releaseDate)),
      window.helpers.createMetaPill("Calificacion " + movie.rating.toFixed(1)),
      "</div>",
      '<a class="btn btn-primary app-btn-primary" href="movie-detail.html?id=' + movie.id + '">Ver detalle</a>',
      "</div>",
      "</article>",
    ].join("");
  }

  /**
   * Crea un indicador del carrusel.
   * @param {number} index - La posicion del indicador.
   * @returns {string} El HTML del indicador.
   */
  function createNewReleaseDot(index) {
    return [
      '<button class="new-release-dot ' + (index === 0 ? "is-active" : "") + '"',
      ' type="button" data-new-release-index="' + index + '"',
      ' aria-label="Ver novedad ' + (index + 1) + '"',
      ' aria-current="' + (index === 0 ? "true" : "false") + '"></button>',
    ].join("");
  }

  /**
   * Actualiza el slide activo del carrusel.
   */
  function updateNewReleaseCarousel() {
    var slides = SELECTORS.newReleasesTrack.querySelectorAll("[data-new-release-slide]");
    var dots = SELECTORS.newReleaseDots.querySelectorAll("[data-new-release-index]");

    slides.forEach(function (slide, index) {
      var isActive = index === state.newReleaseIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach(function (dot, index) {
      var isActive = index === state.newReleaseIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });
  }

  /**
   * Detiene el autoplay de novedades.
   */
  function stopNewReleaseAutoplay() {
    if (!state.newReleaseTimerId) {
      return;
    }

    window.clearInterval(state.newReleaseTimerId);
    state.newReleaseTimerId = null;
  }

  /**
   * Muestra un slide por indice.
   * @param {number} nextIndex - El indice a mostrar.
   * @param {boolean} shouldRestart - Indica si reinicia el autoplay.
   */
  function showNewReleaseSlide(nextIndex, shouldRestart) {
    var totalSlides = state.newReleaseMovies.length;

    if (!totalSlides) {
      return;
    }

    state.newReleaseIndex = (nextIndex + totalSlides) % totalSlides;
    updateNewReleaseCarousel();

    if (shouldRestart) {
      startNewReleaseAutoplay();
    }
  }

  /**
   * Inicia el autoplay de novedades.
   */
  function startNewReleaseAutoplay() {
    stopNewReleaseAutoplay();

    if (state.newReleaseMovies.length <= 1) {
      return;
    }

    state.newReleaseTimerId = window.setInterval(function () {
      showNewReleaseSlide(state.newReleaseIndex + 1, false);
    }, CONFIG.newReleaseInterval);
  }

  /**
   * Renderiza las peliculas recientes en el carrusel.
   */
  function renderNewReleasesCarousel() {
    if (!SELECTORS.newReleasesCarousel || !SELECTORS.newReleasesTrack || !SELECTORS.newReleaseDots) {
      return;
    }

    state.newReleaseMovies = window.movieService.getLatestMovies(CONFIG.newReleaseSlides);
    state.newReleaseIndex = 0;

    if (!state.newReleaseMovies.length) {
      SELECTORS.newReleasesCarousel.classList.add("d-none");
      return;
    }

    SELECTORS.newReleasesTrack.innerHTML = state.newReleaseMovies.map(createNewReleaseSlide).join("");
    SELECTORS.newReleaseDots.innerHTML = state.newReleaseMovies.map(function (_, index) {
      return createNewReleaseDot(index);
    }).join("");
    updateNewReleaseCarousel();
    startNewReleaseAutoplay();
  }

  /**
   * Llena los filtros (género y año) con datos del catálogo.
   */
  function fillSelectOptions() {
    var genres = Array.from(
      new Set(
        movies.map(function (movie) {
          return movie.genre;
        })
      )
    ).sort();

    var years = Array.from(
      new Set(
        movies.map(function (movie) {
          return window.movieService.getMovieYear(movie);
        })
      )
    ).sort(function (yearA, yearB) {
      return Number(yearB) - Number(yearA);
    });

    SELECTORS.genreFilter.innerHTML =
      '<option value="">Todos</option>' +
      genres
        .map(function (genre) {
          return '<option value="' + genre + '">' + genre + "</option>";
        })
        .join("");

    SELECTORS.yearFilter.innerHTML =
      '<option value="">Todos</option>' +
      years
        .map(function (year) {
          return '<option value="' + year + '">' + year + "</option>";
        })
        .join("");
  }

  /**
   * Aplica búsqueda, filtros y favoritas y devuelve la lista filtrada ordenada.
   * @returns {Array} La lista de películas filtradas y ordenadas.
   */
  function getFilteredMovies() {
    var searchTerm = SELECTORS.searchInput.value.trim().toLowerCase();
    var selectedGenre = SELECTORS.genreFilter.value;
    var selectedYear = SELECTORS.yearFilter.value;
    var selectedRating = Number(SELECTORS.ratingFilter.value || 0);
    var selectedFormat = SELECTORS.formatFilter ? SELECTORS.formatFilter.value : "";

    return movies
      .filter(function (movie) {
        var matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        var matchesGenre = !selectedGenre || movie.genre === selectedGenre;
        var matchesYear = !selectedYear || window.movieService.getMovieYear(movie) === selectedYear;
        var matchesRating = !selectedRating || movie.rating >= selectedRating;
        var matchesFormat = !selectedFormat || getRentalFormat(movie) === selectedFormat;
        var matchesFavorite = !state.showOnlyFavorites || favoriteService.isFavorite(movie.id);

        return matchesSearch && matchesGenre && matchesYear && matchesRating && matchesFormat && matchesFavorite;
      })
      .sort(window.movieService.sortByDateDesc);
  }

  /**
   * Crea la card de una película para mostrarla en el listado.
   * @param {Object} movie - La película para la cual crear la card.
   * @returns {string} El HTML de la card de la película.
   */
  function createMovieCard(movie) {
    var canRent = isRentalAvailable(movie);
    var isInCart = cartService && cartService.isInCart(movie.id);

    return [
      '<div class="col-12 col-sm-6 col-md-4">',
      '<article class="movie-card" data-format="' + getRentalFormat(movie) + '">',
      createFavoriteToggleButton(movie.id),
      '<img class="movie-poster" src="' +
        movie.poster +
        '" alt="Poster de ' +
        movie.title +
        '" data-fallback-src="' +
        FALLBACKS.poster +
        '" />',
      '<div class="movie-card-body movie-card-content">',
      '<h3 class="movie-title">' + movie.title + "</h3>",
      '<div class="movie-meta">',
      '<div class="movie-genre">' + movie.genre + "</div>",
      '<div class="movie-info-row">',
      '<span class="movie-date">' + window.helpers.formatDate(movie.releaseDate) + "</span>",
      '<span class="movie-rating">' + movie.rating.toFixed(1) + "</span>",
      "</div>",
      "</div>",
      '<div class="movie-rental">',
      '<div class="movie-rental-price"><span>' + getRentalPriceLabel(movie) + "</span> / " + getRentalTime(movie) + "</div>",
      '<div class="movie-rental-meta">',
      '<span class="rental-badge rental-format">' + getRentalFormat(movie) + "</span>",
      '<span class="rental-badge rental-availability ' +
        (isRentalAvailable(movie) ? "is-available" : "is-unavailable") +
        '">' +
        getAvailabilityLabel(movie) +
        "</span>",
      "</div>",
      '<div class="rental-tags">' + createRentalTags(movie) + "</div>",
      "</div>",
      '<p class="movie-description">' + movie.synopsis + "</p>",
      '<div class="movie-actions">',
      '<a class="btn btn-primary app-btn-primary" href="movie-detail.html?id=' + movie.id + '">Ver detalle</a>',
      '<button class="btn app-btn-secondary movie-cart-button ' +
        (isInCart ? "is-in-cart" : "") +
        (!canRent ? " is-unavailable" : "") +
        '" type="button" data-cart-id="' +
        movie.id +
        '" ' +
        (!canRent ? 'disabled aria-disabled="true"' : "") +
        '">' +
        (!canRent ? "Agotada" : isInCart ? "En carrito" : "Agregar al carrito") +
        "</button>",
      "</div>",
      "</div>",
      "</article>",
      "</div>",
    ].join("");
  }

  /**
   * Crea una card compacta para secciones destacadas.
   * @param {Object} movie - La pelicula para mostrar.
   * @param {string} badgeLabel - La etiqueta visual de la seccion.
   * @returns {string} El HTML de la card destacada.
   */
  function createFeaturedMovieCard(movie, badgeLabel) {
    return [
      '<div class="col-12 col-sm-6 col-lg-3">',
      '<article class="featured-movie-card">',
      '<div class="featured-movie-poster-wrap">',
      '<img class="featured-movie-poster" src="' +
        movie.poster +
        '" alt="Poster de ' +
        escapeHtml(movie.title) +
        '" data-fallback-src="' +
        FALLBACKS.poster +
        '" />',
      '<span class="rental-tag">' + escapeHtml(badgeLabel) + "</span>",
      createFavoriteToggleButton(movie.id),
      "</div>",
      '<div class="featured-movie-body">',
      '<h3>' + escapeHtml(movie.title) + "</h3>",
      '<div class="featured-movie-meta">',
      '<span>' + escapeHtml(movie.genre) + "</span>",
      '<span>' + movie.rating.toFixed(1) + "</span>",
      "</div>",
      '<div class="movie-rental-price"><span>' + getRentalPriceLabel(movie) + "</span> / " + getRentalTime(movie) + "</div>",
      '<a class="btn btn-primary app-btn-primary w-100" href="movie-detail.html?id=' + movie.id + '">Ver detalle</a>',
      "</div>",
      "</article>",
      "</div>",
    ].join("");
  }

  /**
   * Renderiza una seccion destacada.
   * @param {HTMLElement} section - La seccion contenedora.
   * @param {HTMLElement} grid - El grid de cards.
   * @param {HTMLElement} emptyState - El mensaje vacio.
   * @param {Array} sectionMovies - Las peliculas a mostrar.
   * @param {string} badgeLabel - La etiqueta visual de las cards.
   */
  function renderFeaturedSection(section, grid, emptyState, sectionMovies, badgeLabel) {
    if (!section || !grid || !emptyState) {
      return;
    }

    grid.innerHTML = sectionMovies.map(function (movie) {
      return createFeaturedMovieCard(movie, badgeLabel);
    }).join("");

    emptyState.classList.toggle("d-none", sectionMovies.length > 0);
    window.helpers.bindImageFallbacks(grid);
  }

  /**
   * Llena las secciones Top renta y Mas populares.
   */
  function renderFeaturedMovieSections() {
    var topRentalMovies = window.movieService.getTopRentalMovies(CONFIG.featuredMovies);
    var popularMovies = window.movieService.getPopularMovies(CONFIG.featuredMovies);

    renderFeaturedSection(
      SELECTORS.topRentalSection,
      SELECTORS.topRentalGrid,
      SELECTORS.topRentalEmpty,
      topRentalMovies,
      "Top renta"
    );
    renderFeaturedSection(
      SELECTORS.popularSection,
      SELECTORS.popularGrid,
      SELECTORS.popularEmpty,
      popularMovies,
      "Popular"
    );
  }

  /**
   * Actualiza el contador de resultados.
   * @param {number} totalMovies - El número total de películas filtradas.
   */
  function updateResultsCounter(totalMovies) {
    SELECTORS.resultsPill.textContent = totalMovies + (totalMovies === 1 ? " pelicula" : " peliculas");
  }

  /**
   * Genera la paginación según la cantidad de resultados.
   * @param {number} totalItems - El número total de elementos a paginar.
   */
  function renderPagination(totalItems) {
    var totalPages = getTotalPages(totalItems);
    var hasResults = totalItems > 0;

    SELECTORS.paginationPanel.classList.toggle("d-none", !hasResults);

    if (!hasResults) {
      SELECTORS.paginationNumbers.innerHTML = "";
      return;
    }

    clampCurrentPage(totalPages);
    SELECTORS.paginationPrev.disabled = state.currentPage === 1;
    SELECTORS.paginationNext.disabled = state.currentPage === totalPages;
    SELECTORS.paginationNumbers.innerHTML = Array.from({ length: totalPages }, function (_, index) {
      var pageNumber = index + 1;
      var isActive = pageNumber === state.currentPage;

      return (
        '<button class="btn pagination-button ' +
        (isActive ? "is-active" : "") +
        '" type="button" data-page-number="' +
        pageNumber +
        '" aria-current="' +
        (isActive ? "page" : "false") +
        '">' +
        pageNumber +
        "</button>"
      );
    }).join("");
  }

  /**
   * Genera las películas de la página actual y actualiza el estado.
   */
  function renderMovies() {
    var filteredMovies = getFilteredMovies();
    var paginatedMovies = getPaginatedMovies(filteredMovies);
    var hasFieldFilters = hasActiveFieldFilters();

    updateCatalogHeading();
    toggleFeaturedSections();

    SELECTORS.emptyState.innerHTML = state.showOnlyFavorites && !hasFieldFilters
      ? '<h3>No tienes películas favoritas todavía.</h3><p>Explora el catálogo y guarda las películas que quieras ver después.</p><button class="btn btn-primary app-btn-primary" type="button" data-action="show-full-catalog">Elegir favoritas</button>'
      : hasActiveFilters()
        ? '<h3>No encontramos películas con esos filtros.</h3><p>Prueba cambiando la búsqueda o limpiando los filtros.</p><button class="btn btn-primary app-btn-primary" type="button" data-action="clear-filters">Limpiar filtros</button>'
        : "<h3>No se encontraron peliculas</h3><p>Prueba con otra busqueda o cambia los filtros para ver mas resultados.</p>";
    SELECTORS.moviesGrid.innerHTML = paginatedMovies.map(createMovieCard).join("");
    SELECTORS.emptyState.classList.toggle("d-none", filteredMovies.length > 0);
    updateResultsCounter(filteredMovies.length);
    renderPagination(filteredMovies.length);
    window.helpers.bindImageFallbacks(SELECTORS.moviesGrid);
  }

  /**
   * Arma los items pequeños de las secciones (estrenos, top, favoritas).
   * @param {Object} movie - La película para la cual crear el item.
   * @returns {string} El HTML del item de la película.
   */
  function createMiniItem(movie) {
    return [
      '<div class="mini-item">',
      '<div>',
      '<a href="movie-detail.html?id=' + movie.id + '">' + movie.title + "</a>",
      '<div class="comment-date">' + movie.genre + " • " + movie.rating.toFixed(1) + "</div>",
      "</div>",
      '<span class="meta-pill">' + window.movieService.getMovieYear(movie) + "</span>",
      "</div>",
    ].join("");
  }

  /**
   * Llena las secciones de estrenos, mejor calificadas y favoritas.
   */
  function renderCollections() {
    var latestMovies = window.movieService.getLatestMovies(4);
    var topRatedMovies = window.movieService.getTopRatedMovies(4);
    var currentUser = authService && authService.getCurrentUser();
    var favorites = currentUser ? favoriteService.getFavorites() : [];
    var favoriteMovies = movies.filter(function (movie) {
      return favorites.includes(movie.id);
    });

    SELECTORS.latestList.innerHTML = latestMovies.map(createMiniItem).join("");
    SELECTORS.topRatedList.innerHTML = topRatedMovies.map(createMiniItem).join("");

    if (SELECTORS.favoriteShelf) {
      SELECTORS.favoriteShelf.classList.toggle("d-none", !currentUser);
    }

    SELECTORS.collectionCards.forEach(function (card) {
      var isFavoriteShelf = card === SELECTORS.favoriteShelf;

      card.classList.toggle("col-md-6", !currentUser && !isFavoriteShelf);
      card.classList.toggle("col-md-4", Boolean(currentUser || isFavoriteShelf));
    });

    if (!currentUser) {
      SELECTORS.favoritesList.innerHTML = "";
      return;
    }

    SELECTORS.favoritesList.innerHTML = favoriteMovies.length
      ? favoriteMovies.map(createMiniItem).join("")
      : '<div class="mini-item"><span class="comment-date">Todavia no agregas favoritas.</span></div>';
  }

  /**
   * Actualiza los botones de favorita según su estado.
   * @param {number} movieId - El ID de la película.
   */
  function refreshFavoriteButtons(movieId) {
    var isActive = favoriteService.isFavorite(movieId);
    var buttons = document.querySelectorAll('[data-favorite-id="' + movieId + '"]');

    buttons.forEach(function (button) {
      button.classList.toggle("is-active", isActive);
      button.textContent = isActive ? "♥" : "♡";
      button.setAttribute("aria-label", buildFavoriteButtonLabel(movieId));
      button.setAttribute("title", buildFavoriteButtonLabel(movieId));
    });

    if (Number(SELECTORS.heroFavoriteButton.dataset.movieId) === movieId) {
      SELECTORS.heroFavoriteButton.classList.toggle("is-active", isActive);
      SELECTORS.heroFavoriteButton.textContent = buildHeroFavoriteButtonLabel(movieId);
    }
  }

  /**
   * Agrega o quita una favorita y actualiza la vista.
   * @param {number} movieId - El ID de la película.
   */
  function handleFavoriteToggle(movieId) {
    if (!authService || !authService.isAuthenticated()) {
      window.location.href = "auth.html";
      return;
    }

    favoriteService.toggleFavorite(movieId);
    refreshFavoriteButtons(movieId);
    renderCollections();
    renderMovies();
  }

  /**
   * Conecta los eventos del buscador y filtros.
   */
  function bindFilterEvents() {
    [SELECTORS.searchInput, SELECTORS.genreFilter, SELECTORS.yearFilter, SELECTORS.ratingFilter, SELECTORS.formatFilter]
      .filter(Boolean)
      .forEach(function (element) {
      element.addEventListener("input", function () {
        resetToFirstPage();
        renderMovies();
      });
      element.addEventListener("change", function () {
        resetToFirstPage();
        renderMovies();
      });
    });

  }

  /**
   * Conecta los eventos de los botones de favoritas.
   */
  function bindFavoriteEvents() {
    document.addEventListener("click", function (event) {
      var favoriteButton = event.target.closest("[data-favorite-id]");
      if (!favoriteButton) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      handleFavoriteToggle(Number(favoriteButton.dataset.favoriteId));
    });

    SELECTORS.heroFavoriteButton.addEventListener("click", function () {
      handleFavoriteToggle(Number(SELECTORS.heroFavoriteButton.dataset.movieId));
    });
  }

  /**
   * Conecta los eventos de la paginación.
   */
  function bindPaginationEvents() {
    SELECTORS.paginationPrev.addEventListener("click", function () {
      if (state.currentPage === 1) {
        return;
      }

      state.currentPage -= 1;
      renderMovies();
      scrollToCatalogStart();
    });

    SELECTORS.paginationNext.addEventListener("click", function () {
      state.currentPage += 1;
      renderMovies();
      scrollToCatalogStart();
    });

    SELECTORS.paginationNumbers.addEventListener("click", function (event) {
      var pageButton = event.target.closest("[data-page-number]");
      if (!pageButton) {
        return;
      }

      state.currentPage = Number(pageButton.dataset.pageNumber);
      renderMovies();
      scrollToCatalogStart();
    });
  }

  /**
   * Conecta controles del carrusel de novedades.
   */
  function bindNewReleaseEvents() {
    if (!SELECTORS.newReleasesCarousel) {
      return;
    }

    SELECTORS.newReleasePrev.addEventListener("click", function () {
      showNewReleaseSlide(state.newReleaseIndex - 1, true);
    });

    SELECTORS.newReleaseNext.addEventListener("click", function () {
      showNewReleaseSlide(state.newReleaseIndex + 1, true);
    });

    SELECTORS.newReleaseDots.addEventListener("click", function (event) {
      var dot = event.target.closest("[data-new-release-index]");

      if (!dot) {
        return;
      }

      showNewReleaseSlide(Number(dot.dataset.newReleaseIndex), true);
    });
  }

  /**
   * Conecta el cierre de sesion desde el navbar.
   */
  function bindAuthNavEvents() {
    if (!SELECTORS.authNav || !authService) {
      return;
    }

    SELECTORS.authNav.addEventListener("click", function (event) {
      if (!event.target.closest("[data-auth-logout]")) {
        return;
      }

      authService.logoutUser();
      renderHeroSection();
      showFullCatalog();
      renderCollections();
    });
  }

  /**
   * Conecta la vista de favoritas del navbar.
   */
  function bindFavoriteNavEvents() {
    if (!SELECTORS.favoritesNav || !authService) {
      return;
    }

    SELECTORS.favoritesNav.addEventListener("click", function (event) {
      event.preventDefault();

      if (!authService.isAuthenticated()) {
        return;
      }

      if (state.showOnlyFavorites) {
        showFullCatalog();
        return;
      }

      state.showOnlyFavorites = true;
      resetToFirstPage();
      renderAuthNav();
      updateCatalogHeading();
      renderMovies();
      scrollToCatalogStart();
    });
  }

  /**
   * Conecta botones para volver al catalogo.
   */
  function bindFullCatalogEvents() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest('[data-action="show-full-catalog"]');

      if (!button) {
        return;
      }

      event.preventDefault();
      showFullCatalog();
    });
  }

  /**
   * Conecta botones para limpiar filtros.
   */
  function bindClearFiltersEvents() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest('[data-action="clear-filters"]');

      if (!button) {
        return;
      }

      event.preventDefault();
      clearFilters();
    });
  }

  /**
   * Agrupa todos los eventos de la página.
   */
  function bindEvents() {
    bindFilterEvents();
    bindFavoriteEvents();
    bindPaginationEvents();
    bindNewReleaseEvents();
    bindAuthNavEvents();
    bindFavoriteNavEvents();
    bindFullCatalogEvents();
    bindClearFiltersEvents();
  }

  /**
   * Inicializa la página: carga datos, pinta la vista y conecta eventos.
   */
  function init() {
    if (SELECTORS.emptyState) {
      SELECTORS.emptyState.innerHTML =
        "<h3>No se encontraron peliculas</h3><p>Prueba con otra busqueda o cambia los filtros para ver mas resultados.</p>";
    }

    applyInitialFavoriteView();
    renderAuthNav();
    updateCatalogHeading();
    fillSelectOptions();
    renderHeroSection();
    renderNewReleasesCarousel();
    renderFeaturedMovieSections();
    renderMovies();
    renderCollections();
    bindEvents();

    window.mapaVideoClubHome = {
      showFullCatalog: showFullCatalog,
    };
  }

  init();
})();
