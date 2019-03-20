'use strict';
(function () {

  var renderWayPoint = function (content) {

    // Отрисовка в DOM элементов
    var pointList = document.querySelector('.data__list');

    let listElement = document.createElement('li');
    let btn = document.createElement("BUTTON");
    listElement.classList.add('data__point');
    btn.classList.add('data__close-btn');
    //btn.addEventListener('click', function (evt) {onCloseBtnClick(evt, mRoute, map)});
    listElement.textContent = content;

    listElement.appendChild(btn);
    pointList.appendChild(listElement);
  };

  // Callback успешной загрузки данных
  var onSuccessGet = function (xhr) {
    var result = xhr.response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;

    window.data.objects.push(result);
    console.log('пришел иксэйч ар!!!');

    renderWayPoint(result);
  };

  // Callback ошибки
  var onError = function () {
    // Показывает сообщение об ошибке
    window.alert(window.data.errorMessage);
  };

  window.funcs = {
    onSuccessGet: onSuccessGet,
    onError: onError
  };

})();
