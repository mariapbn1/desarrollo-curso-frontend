/**
 * Servicio de contacto por WhatsApp.
 */
(function () {
  var PHONE_NUMBER = "573505951584";
  var CONTACT_MESSAGE = "Hola! Quisiera obtener información sobre una película.";

  /**
   * Arma la URL de contacto de WhatsApp.
   * @returns {string} La URL lista para abrir.
   */
  function buildWhatsappUrl() {
    return "https://wa.me/" + PHONE_NUMBER + "?text=" + encodeURIComponent(CONTACT_MESSAGE);
  }

  /**
   * Abre WhatsApp en una pestaña nueva.
   */
  function openWhatsappContact() {
    window.open(buildWhatsappUrl(), "_blank");
  }

  /**
   *  Detecta clicks en botones de WhatsApp y abre el contacto.
   */
  function bindWhatsappButtons() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-whatsapp-contact]");

      if (!button) {
        return;
      }

      event.preventDefault();
      openWhatsappContact();
    });
  }

  window.whatsappService = {
    buildWhatsappUrl: buildWhatsappUrl,
    openWhatsappContact: openWhatsappContact,
  };

  bindWhatsappButtons();
})();
