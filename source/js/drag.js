var onMoveEnd = function (mRoute, pointUp, map) {
   pointsUp = [];
    var listElements = $('.data__point').each(function (index) {
        pointsUp.push($(this).context.innerText);
        updateRoute(mRoute, pointsUp, map);
    });
};

window.onMoveEnd = onMoveEnd;