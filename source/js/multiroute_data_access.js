var xxx = 0;
var data = window.data;

var input = document.querySelector('.data__input');
var pointList = document.querySelector('.data__list');
var points = [];

// Удаление путевой точки
var onCloseBtnClick = function (evt, mRoute, map) {
  // Получаем удаляемую точку
  var destToRemove = evt.target.parentElement.textContent;

  var indexToRemove = points.indexOf(destToRemove);
  points.splice(indexToRemove, 1);
  evt.target.parentElement.remove();

  // Обновление маршрута
  updateRoute(mRoute, points, map);
};

// Добавление путевой точки
var onKeydownInput = function (evt, mRoute, map) {
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
          window.alert(data.errorMessage);
          input.disabled = false;
          input.placeholder = 'Новая точка';
          input.focus();
        }

        // выуживаем массив результатов
        var objs = res.geoObjects.toArray();

        // берем первый результат
        newPoint = objs[0].properties.getAll().text;

        // Проверка на повторное добавление
        if (window.data.objects[window.data.objects.length-1] !== newPoint) {
          window.data.objects.push(newPoint);
        }

        updateRoute(mRoute, window.data.objects, map);
      }
    );

    // Добавляем точку во фронтенд
    // Редактирование введенного пользователем местоположения
    /*mRoute.events
    .add("update", function () {
      updatePoints(mRoute, map);
      console.log('sdfbsdfbvsdfvb');
    });*/
  }
};

// Обновление маршрута
var updateRoute = function (mRoute, pointsArr, map) {

  // Обновление маршрута
  mRoute.model.setReferencePoints(pointsArr, []);

  /*// Центровка карты после перестроения маршрута
  mRoute.events
  .add("update", function () {
    // Центровка карты по маршруту
    map.setBounds(mRoute.getBounds());

    // Изменение масштаба карты, когда задана всего одна путевая точка
    if(pointsArr.length < 2) {
      map.setZoom( 16 );
    }
  });*/

  //upDateBalloon(mRoute);
};

// Обновление путевых точек (frontend)
var updatePoints = function (mRoute, map) {

  // Удаление DOM элементов списка ПТ
  /*while (pointList.firstChild) {
  pointList.removeChild(pointList.firstChild);
  }*/

  // Получаем путевые точки
  var wayPoints = mRoute.getWayPoints();
  // Проход по коллекции путевых точек.
  // Для каждой точки зададим содержимое меток.
  wayPoints.each(function (point, index) {

  var coords = point.geometry.getCoordinates();
  //var coortds = point.geometry.getCoordinates()[1] + ',' + point.geometry.getCoordinates()[0];
  var request = window.data.requestTemplate + coords[1] + ',' + coords[0];
  window.xhrRequest(request, 'get', window.funcs.onSuccessGet, window.funcs.onError);



    // Подставляем геокодированный адрес после перетаскивания ПТ
    /*if (point.properties._data.address === undefined) {
      //отправляем ПТ на гео-кодирование
      var myGeocoder = ymaps.geocode(point.geometry.getCoordinates().toString());
      myGeocoder.then(
        function (res) {
          //выуживаем массив результатов
          var objs = res.geoObjects.toArray();
          var address = objs[0].properties.getAll().text;

          listElement.textContent = address;
          listElement.appendChild(btn);
        }
      );
    }*/

    /*// Отрисовка в DOM элементов
    let listElement = document.createElement('li');
    let btn = document.createElement("BUTTON");
    listElement.classList.add('data__point');
    btn.classList.add('data__close-btn');
    btn.addEventListener('click', function (evt) {onCloseBtnClick(evt, mRoute, map)});
    listElement.textContent = points[index];
    listElement.appendChild(btn);
    pointList.appendChild(listElement);*/
  });
};

var upDateBalloon = function (mRoute) {
  var wayPoints = mRoute.getWayPoints();

  wayPoints.each(function (point, index) {
    var disc = window.data.objects[index];
    console.log(disc);
    console.log(window.data.objects);
    // Создаем балун меткок.
    ymaps.geoObject.addon.balloon.get(point);
    point.options.set({
        preset: 'islands#blackStretchyIcon',
        iconContentLayout: ymaps.templateLayoutFactory.createClass(
            '{{ properties.name|raw }}'
        ),
        balloonContentLayout: ymaps.templateLayoutFactory.createClass(
            '{{ properties.address|raw }}'
        )

    });
  });
};


ymaps.ready(init);

function init () {
  // Создаем мультимаршрут и настраиваем его внешний вид с помощью опций.
  var multiRoute = new ymaps.multiRouter.MultiRoute({
    referencePoints: window.data.objects
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
  input.addEventListener('keydown', function (evt) {onKeydownInput(evt, multiRoute, myMap)});

  // Добавляем мультимаршрут на карту.
  myMap.geoObjects.add(multiRoute);






multiRoute.events
  .add("update", function () {
    console.log('update');

    updatePoints(multiRoute, myMap);

    // Центровка карты по маршруту
    myMap.setBounds(multiRoute.getBounds());

    // Изменение масштаба карты, когда задана всего одна путевая точка
    if(window.data.objects.length < 2) {
      myMap.setZoom( 16 );
    }

    upDateBalloon(multiRoute);

    if (window.result) {
      window.funcs.renderWayPoint(window.result);
    }
    input.disabled = false;
    input.placeholder = 'Новая точка';
    input.focus();

  });



  // Перетаскивание списка и обновление маршрута по завершению
  $( "#sortable" ).sortable({
    stop: function (event, ui) {window.onMoveEnd(multiRoute, window.data.objects, myMap)}
  }).disableSelection();
};

