
import interactionsType from "./interactionsType";

function logRegister(interactionType) {
  switch (interactionType) {
    case interactionsType.BUTTON_CLICK:
      return 1001;
    case interactionsType.PAGE_LOAD:
      return 1002;
    case interactionsType.FORM_SUBMISSION:
      return 1003;
    case interactionsType.LINK_CLICK:
      return 1004;
    case interactionsType.VIDEO_PLAY:
      return 1005;
    case interactionsType.AUDIO_PLAY:
      return 1006;
    case interactionsType.FILE_UPLOAD:
      return 1007;
    case interactionsType.SEARCH:
      return 1008;
    case interactionsType.MENU_NAVIGATION:
      return 1009;
    case interactionsType.ITEM_SELECTION:
      return 1010;
    case interactionsType.CHAT_MESSAGE:
      return 1011;
    case interactionsType.EMAIL_SENT:
      return 1012;
    case interactionsType.LOGOUT:
      return 1013;
    case interactionsType.LOGIN:
      return 1014;
    case interactionsType.SIGNUP:
      return 1015;
    case interactionsType.PROFILE_UPDATE:
      return 1016;
    case interactionsType.PASSWORD_CHANGE:
      return 1017;
    case interactionsType.NOTIFICATION_READ:
      return 1018;
    case interactionsType.NOTIFICATION_CLICK:
      return 1019;
    case interactionsType.ERROR_OCCURRED:
      return 1020;
    case interactionsType.PAGE_NOT_FOUND:
      return 1021;
    case interactionsType.DATA_EXPORT:
      return 1022;
    case interactionsType.DATA_IMPORT:
      return 1023;
    case interactionsType.PAYMENT_PROCESS:
      return 1024;
    case interactionsType.ACCOUNT_DELETE:
      return 1025;
    case interactionsType.COOKIE_CONSENT:
      return 1026;
    case interactionsType.SURVEY_RESPONSE:
      return 1027;
    default:
      return 4000; // Código para tipos de interação desconhecidos
  }
}

module.exports = logRegister;
