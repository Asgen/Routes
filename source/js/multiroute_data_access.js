'use strict';
(function () {

  var data = window.data;
  var func = window.funcs;
  var util = window.utils;
  var input = document.querySelector('.data__input');

  ymaps.ready(init);

  function init () {
    // Создаем мультимаршрут и настраиваем его внешний вид с помощью опций.
    var multiRoute = new ymaps.multiRouter.MultiRoute({
      referencePoints: data.objects
    }, {

      // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
      boundsAutoApply: true,
      wayPointDraggable: true,
      preventDragUpdate: true
    });

    // Создаем карту.
    var mapCont = document.querySelector('#map'),
    myMap = new ymaps.Map(mapCont, {
      // Центр карты
      center: [45.739625, 40.54120],
      zoom: 4
    }, {
      buttonMaxWidth: 300
    });

    // Добавление путевой точки
    input.addEventListener('keydown', function (evt) {
      func.onKeydownInput(evt, multiRoute, myMap)
    });

    // Добавляем мультимаршрут на карту.
    myMap.geoObjects.add(multiRoute);

    // Обновление отображения маршрута и отрисовка списка путевых точек
    multiRoute.events
      .add("update", function (evt) {

        func.upDateBalloon(multiRoute);
        func.renderWayPoint(multiRoute, myMap);

        input.disabled = false;
        input.placeholder = 'Новая точка';
        input.focus();

        // Центровка карты по маршруту
        if (multiRoute.getBounds()) {
          myMap.setBounds(multiRoute.getBounds());
          if(data.objects.length < 2) {
            myMap.setZoom( 16 );
          }
        }
      });

    // Обновление маршрута после перетаскивания ПТ
    multiRoute.events
      .add("dragend", function (evt) {
        func.updateRoute(multiRoute, data.objects, myMap);
      });


    // Перетаскивание списка и обновление маршрута по завершению
    $( "#sortable" ).sortable({
      stop: function (event, ui) {window.onMoveEnd(multiRoute, myMap)}
    }).disableSelection();
  };
})();
