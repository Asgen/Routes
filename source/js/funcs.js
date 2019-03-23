'use strict';
(function () {

  var data = window.data;

  // Добавление путевой точки
  var onKeydownInput = function (evt, mRoute, map) {

    var input = document.querySelector('.data__input');

    evt.stopPropagation();
    if (evt.keyCode === data.KeyCode.ENTER_KEYCODE) {
      // Получение координат введенного пользователем местоположения.
      var newPoint = input.value;
      input.disabled = true;
      input.placeholder = 'Поиск ...';
      // Очищаем поле ввода
      input.value = "";

      //отправляем ввод пользователя на гео-кодирование
      var myGeocoder = ymaps.geocode(newPoint);
      myGeocoder.then(
        function (res) {
          // Если ничего не найдено
          if (res.metaData.geocoder.found < 1) {
            window.alert(data.Message.FIND_ERROR);
            input.disabled = false;
            input.placeholder = 'Новая точка';
            input.focus();
          }

          // выуживаем массив результатов
          var objs = res.geoObjects.toArray();

          // берем первый результат
          newPoint = objs[0].properties.getAll().text;

          // Проверка на повторное добавление
          if (data.objects[data.objects.length-1] !== newPoint) {
            data.objects.push(newPoint);
          }

          updateRoute(mRoute, data.objects, map);
        }
      );
    }
  };

  // Удаление путевой точки
  var onCloseBtnClick = function (evt, mRoute, map) {
    // Получаем удаляемую точку
    var destToRemove = evt.target.parentElement.textContent;

    // Обновляем массив ПТ
    var indexToRemove = data.objects.indexOf(destToRemove);
    data.objects.splice(indexToRemove, 1);
    evt.target.parentElement.remove();

    // Обновление маршрута
    var newPoints = data.objects.slice();
    mRoute.model.setReferencePoints(newPoints, []);
  };

  // Обновление маршрута
  var updateRoute = function (mRoute, pointsArr, map) {
    // Обновление маршрута
    var newPoints = pointsArr.slice();

    // Проверяем все точки, если есть координаты, то геокодируем
    // Получаем путевые точки
    var wayPoints = mRoute.getWayPoints();
    // Проход по коллекции путевых точек.
    // Для каждой точки зададим содержимое меток.
    wayPoints.each(function (point) {
    var index = point.properties._data.index;
      if (typeof(pointsArr[index]) !== 'string') {

        var coords = point.geometry.getCoordinates();
        //var coortds = point.geometry.getCoordinates()[1] + ',' + point.geometry.getCoordinates()[0];
        var request = data.requestTemplate + coords[1] + ',' + coords[0];
        window.xhrRequest(request, 'get', window.utils.onSuccessGet, window.utils.onError, index, mRoute);

      }
    });

    mRoute.model.setReferencePoints(pointsArr, []);
  };

  // Обновление иконки путевой точки и контента балуна
  var upDateBalloon = function (mRoute) {
    var wayPoints = mRoute.getWayPoints();

    wayPoints.each(function (point, index) {

      var disc = point.properties._data.index + 1 + '';
      // Создаем балун меткок.
      ymaps.geoObject.addon.balloon.get(point);
      point.options.set({
          preset:   'islands#blueIcon',
          iconContentLayout: ymaps.templateLayoutFactory.createClass(
              disc
          ),
          balloonContentLayout: ymaps.templateLayoutFactory.createClass(
              '{{ properties.address|raw }}'
          )

      });
    });
  };

  // Отрисовка списка ПТ во фронтенде
  var renderWayPoint = function (mRoute, map) {
      // Отрисовка в DOM элементов
      var pointList = document.querySelector('.data__list');

      // Удаление DOM элементов списка ПТ
      while (pointList.firstChild) {
        pointList.removeChild(pointList.firstChild);
      }

      for (var i = 0; i < data.objects.length; i++) {
        let listElement = document.createElement('li');
        let btn = document.createElement("BUTTON");
        listElement.classList.add('data__point');
        btn.classList.add('data__close-btn');
        btn.addEventListener('click', function (evt) {
          onCloseBtnClick(evt, mRoute, map)
        });
        listElement.textContent = data.objects[i];

        listElement.appendChild(btn);
        pointList.appendChild(listElement);
      }
  };

  window.funcs = {
    onKeydownInput: onKeydownInput,
    onCloseBtnClick: onCloseBtnClick,
    updateRoute: updateRoute,
    upDateBalloon: upDateBalloon,
    renderWayPoint: renderWayPoint
  }

})();
