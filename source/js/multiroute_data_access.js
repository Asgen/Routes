var KeyCode = {
  ESC_KEYCODE: 27,
  ENTER_KEYCODE: 13
};

var editedPoints;
var input = document.querySelector('.data__input');
var pointList = document.querySelector('.data__list');
var points = [];

var errorMessage = "Ой, кажется такого нет на Земле. Попробуйте ввести по-другому.";



// Удаление путевой точки
var onCloseBtnClick = function (evt, mRoute, map) {
  // Получаем удаляемую точку
  var destToRemove = evt.target.parentElement.textContent;
  if (destToRemove !== errorMessage) {
    console.log(editedPoints);
    var indexToRemove = editedPoints.indexOf(destToRemove);
    points.splice(indexToRemove, 1);
    editedPoints.splice(indexToRemove, 1);
    evt.target.parentElement.remove();

    console.log(destToRemove);
    console.log(points);

    //updateRoute(mRoute, points, map);
    mRoute.model.setReferencePoints(points, []);
  }
  else {
    evt.target.parentElement.remove();
    console.log(editedPoints);
  }

  // Центровка карты после перестроения маршрута
    //updateRoute(mRoute, points, map);


  /*// Добавление введенного местоположения в массив путевых точек
  points.push(newPoint);
  // Очищаем поле ввода
  input.value = "";

  // Добавляем точку во фронтенд
  // Редактирование введенного пользователем местоположения
  mRoute.events
  .add("update", function () {
    var wayPoints = mRoute.getWayPoints();
    // Проход по коллекции путевых точек.
    // Для каждой точки зададим содержимое меток.
    wayPoints.each(function (point, index) {
      //console.log(point.properties._data.address);
      if (index === 0) {
        editedPoints = [];
      }
      editedPoints.push(point.properties._data.address);
      updatePoints(editedPoints);
    });
  });

  // Обновление маршрута
  mRoute.model.seReferencePoints(points, []);

  // Центровка карты после перестроения маршрута
  mRoute.events
  .add("boundschange", function () {
    // Центровка карты по маршруту
    map.setBounds(mRoute.getBounds());

    // Изменение масштаба карты, когда задана всего одна путевая точка
    if(points.length < 2) {
      map.setZoom( 10 );
    }
  });*/
};

// Добавление путевой точки
var onKeydownInput = function (evt, mRoute, map) {

  if (evt.keyCode === KeyCode.ENTER_KEYCODE) {
    // Получение координат введенного пользователем местоположения.
    var newPoint = input.value;
    // Добавление введенного местоположения в массив путевых точек
    points.push(newPoint);
    // Очищаем поле ввода
    input.value = "";

    // Добавляем точку во фронтенд
    // Редактирование введенного пользователем местоположения
    mRoute.events
    .add("update", function () {
      var wayPoints = mRoute.getWayPoints();
      // Проход по коллекции путевых точек.
      // Для каждой точки зададим содержимое меток.
      wayPoints.each(function (point, index) {
        if (index === 0) {
          editedPoints = [];
        }
        editedPoints.push(point.properties._data.address);
        updatePoints(editedPoints, mRoute);
      });
    });

    // Перерисовка маршрута с центровкой карты
    updateRoute(mRoute, points, map);
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
};

// Обновление путевых точек (frontend)
var updatePoints = function (newPointsArr, mRoute) {
  // Чистка списка путевых точек
  while (pointList.firstChild) {
    pointList.removeChild(pointList.firstChild);
  }
  // Перерисовка списка путевых точек
  for (var i = 0; i < newPointsArr.length; i++) {

    if (newPointsArr[i] === undefined) {
      newPointsArr[i] = errorMessage;

      var wayPoints = mRoute.getWayPoints();
      // Проход по коллекции путевых точек.
      // Для каждой точки зададим содержимое меток.
      wayPoints.each(function (point, index) {
        if (point.properties._data.coordinates && point.properties._data.coordinates.length > 0 && index === i) {
          newPointsArr[i] = point.properties._data.coordinates[0].toFixed(3) + ', ' + point.properties._data.coordinates[1].toFixed(3)
        }
      });
    }

    let listElement = document.createElement('li');
    let btn = document.createElement("BUTTON");
    listElement.classList.add('data__point');
    btn.classList.add('data__close-btn');
    btn.addEventListener('click', function (evt) {onCloseBtnClick(evt, mRoute)});
    listElement.textContent = newPointsArr[i];
    listElement.appendChild(btn);
    pointList.appendChild(listElement);
  }
};

ymaps.ready(init);

function init () {
  // Создаем мультимаршрут и настраиваем его внешний вид с помощью опций.
  var multiRoute = new ymaps.multiRouter.MultiRoute({
      referencePoints: points
  }, {

      // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
      boundsAutoApply: true,
      wayPointDraggable: true
  });

  // Создаем карту.
  var mapCont = document.querySelector('#map'),
    myMap = new ymaps.Map(mapCont, {
      // Центр карты
      center: [55.739625, 37.54120],
      zoom: 4
    }, {
      buttonMaxWidth: 300
    });

  // Добавление путевой точки
  input.addEventListener('keydown', function (evt) {onKeydownInput(evt, multiRoute, myMap)});

  // Добавляем мультимаршрут на карту.
  myMap.geoObjects.add(multiRoute);
};
