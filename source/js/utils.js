'use strict';
(function () {

  // Callback успешной загрузки данных
  var onSuccessGet = function (xhr, index, mRoute) {

    window.result = xhr.response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
    window.data.objects[index] = result;


    mRoute.model.setReferencePoints(window.data.objects, []);
    window.funcs.upDateBalloon(mRoute);
  };

  // Callback ошибки
  var onError = function () {
    // Показывает сообщение об ошибке
    window.alert(window.data.Message.GET_ERROR);
  };

  window.utils = {
    onSuccessGet: onSuccessGet,
    onError: onError
  };

})();
