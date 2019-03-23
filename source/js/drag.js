'use strict';
(function () {
  var data = window.data;
  window.onMoveEnd = function (mRoute, map) {

    // Обнуляем ПТ
    data.objects = [];

    var listElements = $('.data__point').each(function (index) {

      // Создаем отсортированный массив ПТ
      data.objects.push($(this).context.innerText);

      // Обновляем маршрут
      mRoute.model.setReferencePoints(data.objects, []);
    });
  };
})();
