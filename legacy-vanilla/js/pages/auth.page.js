/**
 * Pagina de autenticacion del videoclub.
 * Maneja formularios y mensajes de registro/login.
 */
(function () {
  var authService = window.authService;

  var SELECTORS = {
    authNav: document.querySelector("[data-auth-nav]"),
    favoritesNav: document.querySelector("[data-favorites-nav]"),
    loginPanel: document.getElementById("login-panel"),
    registerPanel: document.getElementById("register-panel"),
    loginToggle: document.getElementById("auth-login-toggle"),
    registerToggle: document.getElementById("auth-register-toggle"),
    loginForm: document.getElementById("login-form"),
    registerForm: document.getElementById("register-form"),
    loginEmail: document.getElementById("login-email"),
    loginPassword: document.getElementById("login-password"),
    registerName: document.getElementById("register-name"),
    registerEmail: document.getElementById("register-email"),
    registerPassword: document.getElementById("register-password"),
    registerConfirm: document.getElementById("register-confirm"),
    loginFeedback: document.getElementById("login-feedback"),
    registerFeedback: document.getElementById("register-feedback"),
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
   * Muestra un mensaje en el formulario.
   * @param {HTMLElement} feedbackElement - El contenedor del mensaje.
   * @param {string} message - El mensaje a mostrar.
   * @param {boolean} isSuccess - Indica si el mensaje es exitoso.
   */
  function setFeedback(feedbackElement, message, isSuccess) {
    feedbackElement.textContent = message;
    feedbackElement.classList.toggle("is-success", Boolean(isSuccess));
  }

  /**
   * Obtiene el destino despues del login.
   * @returns {string} La ruta de salida.
   */
  function getLoginRedirectUrl() {
    var searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("redirect") === "checkout") {
      return "index.html?openCart=true";
    }

    return "index.html";
  }

  /**
   * Cambia entre login y registro.
   * @param {string} mode - El modo activo.
   */
  function showMode(mode) {
    var isLogin = mode === "login";

    SELECTORS.loginPanel.classList.toggle("d-none", !isLogin);
    SELECTORS.registerPanel.classList.toggle("d-none", isLogin);
    SELECTORS.loginToggle.classList.toggle("is-active", isLogin);
    SELECTORS.registerToggle.classList.toggle("is-active", !isLogin);
    SELECTORS.loginToggle.setAttribute("aria-selected", String(isLogin));
    SELECTORS.registerToggle.setAttribute("aria-selected", String(!isLogin));
  }

  /**
   * Actualiza el estado de sesion en el navbar.
   */
  function renderAuthNav() {
    var currentUser = authService.getCurrentUser();

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
   * Maneja el registro de usuario.
   * @param {Event} event - El evento submit.
   */
  function handleRegisterSubmit(event) {
    var result;

    event.preventDefault();
    result = authService.registerUser({
      name: SELECTORS.registerName.value,
      email: SELECTORS.registerEmail.value,
      password: SELECTORS.registerPassword.value,
      confirmPassword: SELECTORS.registerConfirm.value,
    });

    setFeedback(SELECTORS.registerFeedback, result.message, result.success);

    if (!result.success) {
      return;
    }

    SELECTORS.loginEmail.value = SELECTORS.registerEmail.value.trim();
    SELECTORS.registerForm.reset();
    showMode("login");
    setFeedback(SELECTORS.loginFeedback, result.message, true);
  }

  /**
   * Maneja el inicio de sesion.
   * @param {Event} event - El evento submit.
   */
  function handleLoginSubmit(event) {
    var result;

    event.preventDefault();
    result = authService.loginUser(SELECTORS.loginEmail.value, SELECTORS.loginPassword.value);
    setFeedback(SELECTORS.loginFeedback, result.message, result.success);

    if (!result.success) {
      return;
    }

    renderAuthNav();
    window.setTimeout(function () {
      window.location.href = getLoginRedirectUrl();
    }, 600);
  }

  /**
   * Conecta eventos de formularios y botones.
   */
  function bindEvents() {
    SELECTORS.loginToggle.addEventListener("click", function () {
      showMode("login");
    });

    SELECTORS.registerToggle.addEventListener("click", function () {
      showMode("register");
    });

    SELECTORS.registerForm.addEventListener("submit", handleRegisterSubmit);
    SELECTORS.loginForm.addEventListener("submit", handleLoginSubmit);

    if (SELECTORS.authNav) {
      SELECTORS.authNav.addEventListener("click", function (event) {
        if (!event.target.closest("[data-auth-logout]")) {
          return;
        }

        authService.logoutUser();
        renderAuthNav();
        showMode("login");
        setFeedback(SELECTORS.loginFeedback, "Sesion cerrada.", true);
      });
    }
  }

  /**
   * Inicializa la pagina de autenticacion.
   */
  function init() {
    showMode("login");
    renderAuthNav();
    bindEvents();
  }

  init();
})();
