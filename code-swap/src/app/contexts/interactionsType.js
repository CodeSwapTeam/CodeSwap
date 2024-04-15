const interactionsType = {
  BUTTON_CLICK: {
    MESSAGE: 'button_click',
    CODE: 100
  },
  PAGE_LOAD: {
    MESSAGE: 'page_load',
    CODE: 101
  },
  LINK_CLICK: {
    MESSAGE: 'link_click',
    CODE: 103
  },
  VIDEO_PLAY: {
    MESSAGE: 'video_play',
    CODE: 104
  },
  ITEM_SELECTION: {
    MESSAGE: 'item_selection',
    CODE: 109
  },
  LOGOUT: {
    MESSAGE: 'logout',
    CODE: 112
  },
  LOGIN: {
    MESSAGE: 'LOGIN',
    CODE: 102
  },
  SIGNUP: {
    MESSAGE: 'signup',
    CODE: 113
  },
  CREATE_MODULE:{
    MESSAGE: 'criação de curso novo',
    CODE : 120
  },
  PAGE_LOAD_HOME: {
    MESSAGE: 'Carregamento de página Home',
    CODE: 121
  },
  PAGE_LOAD_COURSES: {
    MESSAGE: 'Carregamento de página de Cursos',
    CODE: 122
  }
};

module.exports = interactionsType;
