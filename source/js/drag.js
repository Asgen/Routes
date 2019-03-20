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


/*
inter {
    1: geoCode
    2: window.obj.push(geocoded)
    3: updateRoute(window.obj)
}

drag {
    1: updateRoute(??)
}

sort {
    1: window.obj = []
    2: window.obj.push(sorted)
    3: updateRoute(window.obj)
}

del {
    

}
*/