/**
 * Servicio de contacto por WhatsApp.
 */
(function () {
  var CONFIG_WARNING = "Falta configurar el número de WhatsApp en js/config/app.config.js";
  var CONTACT_MESSAGE = "Hola, quería hacer una consulta sobre una película de MAPA VIDEO CLUB.";
  var SELECTORS = {
    modal: document.querySelector("[data-whatsapp-modal]"),
    dialog: document.querySelector(".whatsapp-modal__dialog"),
  };

  function getWhatsappPhone() {
    return window.APP_CONFIG && window.APP_CONFIG.whatsappPhone;
  }

  /**
   * Arma la URL de contacto de WhatsApp.
   * @returns {string} La URL lista para abrir.
   */
  function buildWhatsappUrl() {
    var whatsappPhone = getWhatsappPhone();

    if (!whatsappPhone) {
      console.warn(CONFIG_WARNING);
      return "";
    }

    return "https://wa.me/" + whatsappPhone + "?text=" + encodeURIComponent(CONTACT_MESSAGE);
  }

  /**
   * Abre WhatsApp en una pestaña nueva.
   */
  function openWhatsappContact() {
    var whatsappUrl = buildWhatsappUrl();

    if (!whatsappUrl) {
      return;
    }

    window.open(whatsappUrl, "_blank");
  }

  /**
   * Abre el modal de contacto.
   */
  function openWhatsappModal() {
    if (!SELECTORS.modal || !SELECTORS.dialog) {
      openWhatsappContact();
      return;
    }

    SELECTORS.modal.hidden = false;
    SELECTORS.modal.classList.add("is-open");
    SELECTORS.modal.setAttribute("aria-hidden", "false");
    SELECTORS.dialog.focus();
  }

  /**
   * Cierra el modal de contacto.
   */
  function closeWhatsappModal() {
    if (!SELECTORS.modal) {
      return;
    }

    SELECTORS.modal.classList.remove("is-open");
    SELECTORS.modal.setAttribute("aria-hidden", "true");
    SELECTORS.modal.hidden = true;
  }

  /**
   * Confirma el contacto por WhatsApp.
   */
  function handleWhatsappConfirm() {
    openWhatsappContact();
    closeWhatsappModal();
  }

  /**
   * Detecta clicks en botones de WhatsApp.
   */
  function bindWhatsappButtons() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-whatsapp-contact]");
      var closeButton = event.target.closest("[data-whatsapp-close]");
      var confirmButton = event.target.closest("[data-whatsapp-confirm]");

      if (button) {
        event.preventDefault();
        openWhatsappModal();
        return;
      }

      if (closeButton) {
        event.preventDefault();
        closeWhatsappModal();
        return;
      }

      if (confirmButton) {
        event.preventDefault();
        handleWhatsappConfirm();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeWhatsappModal();
      }
    });
  }

  window.whatsappService = {
    buildWhatsappUrl: buildWhatsappUrl,
    openWhatsappContact: openWhatsappContact,
    openWhatsappModal: openWhatsappModal,
    closeWhatsappModal: closeWhatsappModal,
  };

  bindWhatsappButtons();
})();
