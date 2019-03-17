/*ymaps.ready(inito);
var coordsArray = [];

function inito(location, pointNum) {

  // Поиск координат центра Нижнего Новгорода.
  ymaps.geocode(location, {
    // Сортировка результатов от центра окна карты.
    // boundedBy: myMap.getBounds(),
    // strictBounds: true,
    // Вместе с опцией boundedBy будет искать строго внутри области, указанной в boundedBy.
    // Если нужен только один результат, экономим трафик пользователей.
    results: 1
  }).then(function (res) {
      // Выбираем первый результат геокодирования.
      var firstGeoObject = res.geoObjects.get(0),
        // Координаты геообъекта.
        coords = firstGeoObject.geometry.getCoordinates(),
        // Область видимости геообъекта.
        bounds = firstGeoObject.properties.get('boundedBy');

      coordsArray[pointNum] = coords;

      //window.coordsArray = [44.894965, 37.31617];
      console.log('коорд: ', coords);
      window.coordsArray = coordsArray;
      var wasMap = document.querySelector('ymaps');
      if (wasMap) {
        wasMap.remove();
      }
      window.init();

      /**
       * Если нужно добавить по найденным геокодером координатам метку со своими стилями и контентом балуна, создаем новую метку по координатам найденной и добавляем ее на карту вместо найденной.
       */
      /**
       var myPlacemark = new ymaps.Placemark(coords, {
       iconContent: 'моя метка',
       balloonContent: 'Содержимое балуна <strong>моей метки</strong>'
       }, {
       preset: 'islands#violetStretchyIcon'
       });

       myMap.geoObjects.add(myPlacemark);
       
    });
}

window.inito = inito;*/