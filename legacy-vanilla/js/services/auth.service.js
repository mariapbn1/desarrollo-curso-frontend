/**
 * Servicio de autenticacion de inicio de sesion local para el proyecto.
 * Usa localStorage solo como practica de frontend, no como seguridad real.
 */
(function () {
  var STORAGE_KEYS = {
    users: "mapaVideoClubUsers",
    session: "mapaVideoClubSession",
  };

  /**
   * Lee una clave de localStorage y devuelve un valor por defecto si falla.
   * @param {string} key - La clave a leer.
   * @param {*} fallbackValue - El valor por defecto si no hay datos.
   * @returns {*} El valor guardado o el valor por defecto.
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
   * Guarda un valor en localStorage y devuelve true si funciona.
   * @param {string} key - La clave a guardar.
   * @param {*} value - El valor a guardar.
   * @returns {boolean} true si se guardo correctamente.
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
   * Normaliza el correo para comparar usuarios.
   * @param {string} email - El correo ingresado.
   * @returns {string} El correo limpio.
   */
  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  /**
   * Revisa si el correo tiene una forma basica valida.
   * @param {string} email - El correo a validar.
   * @returns {boolean} true si el correo es valido.
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Devuelve todos los usuarios guardados.
   * @returns {Array} La lista de usuarios locales.
   */
  function getUsers() {
    return readStorage(STORAGE_KEYS.users, []);
  }

  /**
   * Guarda la lista completa de usuarios.
   * @param {Array} users - La lista de usuarios.
   * @returns {boolean} true si se guardo correctamente.
   */
  function saveUsers(users) {
    return writeStorage(STORAGE_KEYS.users, users);
  }

  /**
   * Registra un usuario nuevo si los datos son validos.
   * @param {Object} userData - Los datos del formulario de registro.
   * @returns {Object} El resultado del registro.
   */
  function registerUser(userData) {
    var name = String(userData.name || "").trim();
    var email = normalizeEmail(userData.email);
    var password = String(userData.password || "");
    var confirmPassword = String(userData.confirmPassword || "");
    var users = getUsers();
    var emailExists = users.some(function (user) {
      return normalizeEmail(user.email) === email;
    });

    if (!name || !email || !password || !confirmPassword) {
      return { success: false, message: "Completa todos los campos." };
    }

    if (!isValidEmail(email)) {
      return { success: false, message: "Ingresa un correo valido." };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Las contrasenas no coinciden." };
    }

    if (emailExists) {
      return { success: false, message: "Este usuario ya está registrado." };
    }

    users.push({
      id: Date.now(),
      name: name,
      email: email,
      password: password,
      createdAt: new Date().toISOString(),
    });

    if (!saveUsers(users)) {
      return { success: false, message: "No fue posible guardar el usuario." };
    }

    return { success: true, message: "Registro exitoso. Ya puedes iniciar sesion." };
  }

  /**
   * Inicia sesion si el correo y la contrasena coinciden.
   * @param {string} email - El correo ingresado.
   * @param {string} password - La contrasena ingresada.
   * @returns {Object} El resultado del login.
   */
  function loginUser(email, password) {
    var normalizedEmail = normalizeEmail(email);
    var cleanPassword = String(password || "");
    var users = getUsers();
    var user;

    if (!normalizedEmail || !cleanPassword) {
      return { success: false, message: "Completa correo y contrasena." };
    }

    if (!isValidEmail(normalizedEmail)) {
      return { success: false, message: "Ingresa un correo valido." };
    }

    user = users.find(function (savedUser) {
      return normalizeEmail(savedUser.email) === normalizedEmail && savedUser.password === cleanPassword;
    });

    if (!user) {
      return { success: false, message: "Correo o contrasena incorrectos." };
    }

    if (!writeStorage(STORAGE_KEYS.session, {
      userId: user.id,
      name: user.name,
      email: user.email,
    })) {
      return { success: false, message: "No fue posible iniciar sesion." };
    }

    return { success: true, message: "Sesion iniciada.", user: getCurrentUser() };
  }

  /**
   * Cierra la sesion local del usuario.
   */
  function logoutUser() {
    window.localStorage.removeItem(STORAGE_KEYS.session);
  }

  /**
   * Devuelve el usuario activo.
   * @returns {Object|null} El usuario de la sesion actual.
   */
  function getCurrentUser() {
    return readStorage(STORAGE_KEYS.session, null);
  }

  /**
   * Revisa si existe una sesion activa.
   * @returns {boolean} true si hay usuario activo.
   */
  function isAuthenticated() {
    return Boolean(getCurrentUser());
  }

  window.authService = {
    STORAGE_KEYS: STORAGE_KEYS,
    getUsers: getUsers,
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    getCurrentUser: getCurrentUser,
    isAuthenticated: isAuthenticated,
  };
})();
