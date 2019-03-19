var KeyCode = {
  ESC_KEYCODE: 27,
  ENTER_KEYCODE: 13
};

var input = document.querySelector('.data__input');
var pointList = document.querySelector('.data__list');
var points = [];

var errorMessage = "Ой, кажется такого нет на Земле. Попробуйте ввести по-другому.";

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
  if (evt.keyCode === KeyCode.ENTER_KEYCODE) {
    // Получение координат введенного пользователем местоположения.
    var newPoint = input.value;
    // Очищаем поле ввода
    input.value = "";

    //отправляем ввод пользователя на гео-кодирование 
    var myGeocoder = ymaps.geocode(newPoint);
    myGeocoder.then(
      function (res) {
        // Если ничего не найдено
        if (res.metaData.geocoder.found < 1) {
          window.alert(errorMessage);
        }

        // выуживаем массив результатов
        var objs = res.geoObjects.toArray();

        // берем первый результат
        newPoint = objs[0].properties.getAll().text;
        points.push(newPoint);

        updateRoute(mRoute, points, map);
      }
    );

    // Добавляем точку во фронтенд
    // Редактирование введенного пользователем местоположения
    mRoute.events
    .add("update", function () {
      updatePoints(mRoute, map);
    });
  }
};

// Обновление маршрута
var updateRoute = function (mRoute, pointsArr, map) {

  // Обновление маршрута
  mRoute.model.setReferencePoints(pointsArr, []);

  // Центровка карты после перестроения маршрута
  mRoute.events
  .add("update", function () {
    // Центровка карты по маршруту
    map.setBounds(mRoute.getBounds());

    // Изменение масштаба карты, когда задана всего одна путевая точка
    if(pointsArr.length < 2) {
      map.setZoom( 16 );
    }
  });

  upDateBalloon(mRoute);
};

// Обновление путевых точек (frontend)
var updatePoints = function (mRoute, map) {

  // Удаление DOM элементов списка ПТ
  while (pointList.firstChild) {
  pointList.removeChild(pointList.firstChild);
  }

  // Получаем путевые точки
  var wayPoints = mRoute.getWayPoints();
  // Проход по коллекции путевых точек.
  // Для каждой точки зададим содержимое меток.
  wayPoints.each(function (point, index) {
    console.log(point.properties._data.address === undefined);

    // Подставляем геокодированный адрес после перетаскивания ПТ
    if (point.properties._data.address === undefined) {
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
    }

    // Отрисовка в DOM элементов
    let listElement = document.createElement('li');
    let btn = document.createElement("BUTTON");
    listElement.classList.add('data__point');
    btn.classList.add('data__close-btn');
    btn.addEventListener('click', function (evt) {onCloseBtnClick(evt, mRoute, map)});
    listElement.textContent = points[index];
    listElement.appendChild(btn);
    pointList.appendChild(listElement);
  });



console.log(pointList.lastChild.textContent);
  console.log(points[points.length-1].toString());


};

var upDateBalloon = function (mRoute) {  
  var wayPoints = mRoute.getWayPoints();

  wayPoints.each(function (point, index) {
    // Создаем балун у метки второй точки.
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
    referencePoints: points
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












  // Перетаскивание списка и обновление маршрута по завершению
  $( "#sortable" ).sortable({
    stop: function (event, ui) {window.onMoveEnd(multiRoute, points, myMap)}
  }).disableSelection();
};


