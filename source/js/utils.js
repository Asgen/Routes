'use strict';
(function () {

  var renderWayPoint = function (mRoute) {

      // Отрисовка в DOM элементов
      var pointList = document.querySelector('.data__list');

      // Удаление DOM элементов списка ПТ
      while (pointList.firstChild) {
        pointList.removeChild(pointList.firstChild);
      }

      for (var i = 0; i < window.data.objects.length; i++) {
        let listElement = document.createElement('li');
        let btn = document.createElement("BUTTON");
        listElement.classList.add('data__point');
        btn.classList.add('data__close-btn');
        //btn.addEventListener('click', function (evt) {onCloseBtnClick(evt, mRoute, map)});
        listElement.textContent = window.data.objects[i];

        listElement.appendChild(btn);
        pointList.appendChild(listElement);
      }
      upDateBalloon(mRoute);
  };

  // Callback успешной загрузки данных
  var onSuccessGet = function (xhr, index, mRoute) {
    window.result = xhr.response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
console.log(index);
    window.data.objects[index] = result;

    renderWayPoint(mRoute);
    console.log( window.data.objects);


    //setTimeout(function() {
      //renderWayPoint(window.result);
    //}, 500);

  };

  // Callback ошибки
  var onError = function () {
    // Показывает сообщение об ошибке
    window.alert(window.data.errorMessage);
  };

  window.funcs = {
    onSuccessGet: onSuccessGet,
    onError: onError,
    renderWayPoint: renderWayPoint
  };

})();
