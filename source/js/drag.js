var onMoveEnd = function (mRoute, pointUp, map) {
  // Обнуляем ПТ
  window.data.objects = [];
    var listElements = $('.data__point').each(function (index) {

        // Создаем отсортированный массив ПТ
        window.data.objects.push($(this).context.innerText);

        updateRoute(mRoute, window.data.objects, map);
    });
};

window.onMoveEnd = onMoveEnd;
