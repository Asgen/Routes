'use strict';
(function () {

  var objects = [];
  var apikey = '65126dc0-27cc-4992-a8e5-7a1181f53693';
  var requestTemplate = 'https://geocode-maps.yandex.ru/1.x/?format=json&apikey=' + apikey + '&geocode=';

  var KeyCode = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13
  };

  var Message = {
    FIND_ERROR: 'Ой, кажется такого нет на Земле. Попробуйте ввести по-другому.',
    GET_ERROR: 'Ошибка получения данных'
  }

  window.data = {
    objects: objects,
    requestTemplate: requestTemplate,
    KeyCode: KeyCode,
    Message: Message
  };

})();
