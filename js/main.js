/**
 * Módulo de la Vista Principal (Catálogo).
 * Gestiona el listado global de películas, la lógica de filtrado multidimensional,
 * la búsqueda en tiempo real y la paginación de resultados.
 */
(function () {
  var movies = Array.isArray(window.MOVIES) ? window.MOVIES.slice() : [];
  var storage = window.storageService;

  var CONFIG = {
    moviesPerPage: 9,
  };
  var FALLBACKS = {
    poster: "assets/img/movie-fallback.svg",
  };

  var state = {
    currentPage: 1,
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
    favoriteFilter: document.getElementById("favorite-filter"),
    catalogSection: document.getElementById("catalogo"),
    moviesGrid: document.getElementById("movies-grid"),
    emptyState: document.getElementById("empty-state"),
    latestList: document.getElementById("latest-list"),
    topRatedList: document.getElementById("top-rated-list"),
    favoritesList: document.getElementById("favorites-list"),
    resultsPill: document.getElementById("results-pill"),
    paginationPanel: document.getElementById("pagination-panel"),
    paginationNumbers: document.getElementById("pagination-numbers"),
    paginationPrev: document.getElementById("pagination-prev"),
    paginationNext: document.getElementById("pagination-next"),
  };

  /**
   * Transforma una cadena de fecha o un objeto Date en una representación 
   * textual amigable siguiendo el estándar de Colombia (es-CO).
   * @example "2026-05-01" -> "1 de mayo de 2026"
   * @param {string|Date} dateValue - El valor de fecha a procesar. 
   * Puede ser un string en formato ISO o una instancia de Date.
   * @returns {string} La fecha formateada en lenguaje natural.
   */
  function formatDate(dateValue) {
    return new Date(dateValue).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Obtiene el año de estreno de la película.
   * @param {Object} movie - El objeto de la película.
   * @returns {string} El año de estreno.
   */
  function getMovieYear(movie) {
    return new Date(movie.releaseDate).getFullYear().toString();
  }

  /**
   * Ordena las películas de la más nueva a la más vieja.
   * @param {Object} movieA - La primera película.
   * @param {Object} movieB - La segunda película.
   * @returns {number} El resultado de la comparación.
   */
  function sortByDateDesc(movieA, movieB) {
    return new Date(movieB.releaseDate) - new Date(movieA.releaseDate);
  }

  /**
   * Crea una etiqueta de texto para mostrar información.
   * @param {string} label - El texto a mostrar.
   * @returns {string} La etiqueta HTML.
   */
  function createMetaPill(label) {
    return '<span class="meta-pill">' + label + "</span>";
  }

  /**
   * Define el texto del botón según si es favorita o no.
   * @param {number} movieId - ID de la película.
   * @returns {string} El texto del botón.
   */
  function buildFavoriteButtonLabel(movieId) {
    return storage.isFavorite(movieId) ? "Quitar favorita" : "Marcar favorita";
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
   * Desplaza la vista del usuario hacia el inicio de la sección del catálogo.
   * Prioriza el desplazamiento hacia el contenedor del catálogo; si no existe, 
   * se desplaza al inicio absoluto del documento.
   */
  function scrollToCatalogStart() {
    if (SELECTORS.catalogSection) {
      SELECTORS.catalogSection.scrollIntoView({
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

    var featuredMovie = movies.slice().sort(sortByDateDesc)[0];
    SELECTORS.heroSection.style.backgroundImage = 'url("' + featuredMovie.banner + '")';
    SELECTORS.heroTitle.textContent = featuredMovie.title;
    SELECTORS.heroSynopsis.textContent = featuredMovie.synopsis;
    SELECTORS.heroMeta.innerHTML =
      createMetaPill(featuredMovie.genre) +
      createMetaPill(formatDate(featuredMovie.releaseDate)) +
      createMetaPill("Calificacion " + featuredMovie.rating.toFixed(1));
    SELECTORS.heroDetailLink.href = "movie-detail.html?id=" + featuredMovie.id;
    SELECTORS.heroFavoriteButton.textContent = buildFavoriteButtonLabel(featuredMovie.id);
    SELECTORS.heroFavoriteButton.dataset.movieId = featuredMovie.id;
    SELECTORS.heroFavoriteButton.classList.toggle("is-active", storage.isFavorite(featuredMovie.id));
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
          return getMovieYear(movie);
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
    var onlyFavorites = SELECTORS.favoriteFilter.checked;

    return movies
      .filter(function (movie) {
        var matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        var matchesGenre = !selectedGenre || movie.genre === selectedGenre;
        var matchesYear = !selectedYear || getMovieYear(movie) === selectedYear;
        var matchesRating = !selectedRating || movie.rating >= selectedRating;
        var matchesFavorite = !onlyFavorites || storage.isFavorite(movie.id);

        return matchesSearch && matchesGenre && matchesYear && matchesRating && matchesFavorite;
      })
      .sort(sortByDateDesc);
  }

  /**
   * Crea la card de una película para mostrarla en el listado.
   * @param {Object} movie - La película para la cual crear la card.
   * @returns {string} El HTML de la card de la película.
   */
  function createMovieCard(movie) {
    return [
      '<div class="col-12 col-sm-6 col-md-4">',
      '<article class="movie-card">',
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
      '<span class="movie-date">' + formatDate(movie.releaseDate) + "</span>",
      '<span class="movie-rating">' + movie.rating.toFixed(1) + "</span>",
      "</div>",
      "</div>",
      '<p class="movie-description">' + movie.synopsis + "</p>",
      '<div class="movie-actions">',
      '<a class="btn btn-primary app-btn-primary" href="movie-detail.html?id=' + movie.id + '">Ver detalle</a>',
      '<button class="btn favorite-button ' +
        (storage.isFavorite(movie.id) ? "is-active" : "") +
        '" type="button" data-favorite-id="' +
        movie.id +
        '">' +
        buildFavoriteButtonLabel(movie.id) +
        "</button>",
      "</div>",
      "</div>",
      "</article>",
      "</div>",
    ].join("");
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

    SELECTORS.moviesGrid.innerHTML = paginatedMovies.map(createMovieCard).join("");
    SELECTORS.emptyState.classList.toggle("d-none", filteredMovies.length > 0);
    updateResultsCounter(filteredMovies.length);
    renderPagination(filteredMovies.length);
    bindImageFallbacks(SELECTORS.moviesGrid);
  }

  /**
   * Conecta los eventos de fallback para las imágenes.
   * Es decir, si una imagen falla al cargar, usa una imagen de respaldo.
   * @param {Element} scope - El ámbito en el que buscar imágenes.
   */
  function bindImageFallbacks(scope) {
    var images = scope.querySelectorAll("img[data-fallback-src]");

    images.forEach(function (image) {
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
      '<span class="meta-pill">' + getMovieYear(movie) + "</span>",
      "</div>",
    ].join("");
  }

  /**
   * Llena las secciones de estrenos, mejor calificadas y favoritas.
   */
  function renderCollections() {
    var latestMovies = movies.slice().sort(sortByDateDesc).slice(0, 4);
    var topRatedMovies = movies
      .slice()
      .sort(function (movieA, movieB) {
        return movieB.rating - movieA.rating;
      })
      .slice(0, 4);
    var favoriteMovies = movies.filter(function (movie) {
      return storage.isFavorite(movie.id);
    });

    SELECTORS.latestList.innerHTML = latestMovies.map(createMiniItem).join("");
    SELECTORS.topRatedList.innerHTML = topRatedMovies.map(createMiniItem).join("");
    SELECTORS.favoritesList.innerHTML = favoriteMovies.length
      ? favoriteMovies.map(createMiniItem).join("")
      : '<div class="mini-item"><span class="comment-date">Todavia no agregas favoritas.</span></div>';
  }

  /**
   * Actualiza los botones de favorita según su estado.
   * @param {number} movieId - El ID de la película.
   */
  function refreshFavoriteButtons(movieId) {
    var isActive = storage.isFavorite(movieId);
    var buttons = document.querySelectorAll('[data-favorite-id="' + movieId + '"]');

    buttons.forEach(function (button) {
      button.classList.toggle("is-active", isActive);
      button.textContent = buildFavoriteButtonLabel(movieId);
    });

    if (Number(SELECTORS.heroFavoriteButton.dataset.movieId) === movieId) {
      SELECTORS.heroFavoriteButton.classList.toggle("is-active", isActive);
      SELECTORS.heroFavoriteButton.textContent = buildFavoriteButtonLabel(movieId);
    }
  }

  /**
   * Agrega o quita una favorita y actualiza la vista.
   * @param {number} movieId - El ID de la película.
   */
  function handleFavoriteToggle(movieId) {
    storage.toggleFavorite(movieId);
    refreshFavoriteButtons(movieId);
    renderCollections();
    renderMovies();
  }

  /**
   * Conecta los eventos del buscador y filtros.
   */
  function bindFilterEvents() {
    [SELECTORS.searchInput, SELECTORS.genreFilter, SELECTORS.yearFilter, SELECTORS.ratingFilter].forEach(function (element) {
      element.addEventListener("input", function () {
        resetToFirstPage();
        renderMovies();
      });
      element.addEventListener("change", function () {
        resetToFirstPage();
        renderMovies();
      });
    });

    SELECTORS.favoriteFilter.addEventListener("change", function () {
      resetToFirstPage();
      renderMovies();
    });
  }

  /**
   * Conecta los eventos de los botones de favoritas.
   */
  function bindFavoriteEvents() {
    SELECTORS.moviesGrid.addEventListener("click", function (event) {
      var favoriteButton = event.target.closest("[data-favorite-id]");
      if (!favoriteButton) {
        return;
      }

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
   * Agrupa todos los eventos de la página.
   */
  function bindEvents() {
    bindFilterEvents();
    bindFavoriteEvents();
    bindPaginationEvents();
  }

  /**
   * Inicializa la página: carga datos, pinta la vista y conecta eventos.
   */
  function init() {
    if (SELECTORS.emptyState) {
      SELECTORS.emptyState.innerHTML =
        "<h3>No se encontraron peliculas</h3><p>Prueba con otra busqueda o cambia los filtros para ver mas resultados.</p>";
    }

    fillSelectOptions();
    renderHeroSection();
    renderMovies();
    renderCollections();
    bindEvents();
  }

  init();
})();
