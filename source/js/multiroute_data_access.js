var KeyCode = {
	ESC_KEYCODE: 27,
	ENTER_KEYCODE: 13
};

var points = ["Анапа"];

var xxx = ["Казань","Ростов"];

var defaultLoc1 = "Спб";
var defaultLoc2 = "Анадырь";

ymaps.ready(init(defaultLoc1, defaultLoc2));

function init (param1) {
	return function () {
		// Создаем модель мультимаршрута.
		/*var multiRouteModel = new ymaps.multiRouter.MultiRouteModel([
				// Путевые точки
				param1,
				"Москва, ул. Мясницкая"
			], {
				// Путевые точки можно перетаскивать.
				// Маршрут при этом будет перестраиваться.
				wayPointDraggable: true,
				boundsAutoApply: true
			});

		ymaps.modules.require([
			'MultiRouteCustomView'
		], function (MultiRouteCustomView) {
			// Создаем экземпляр текстового отображения модели мультимаршрута.
			// см. файл custom_view.js
			new MultiRouteCustomView(multiRouteModel);
		});*/






		// Объявляем набор опорных точек и массив индексов транзитных точек.
	    var referencePoints = [
	            "Москва, Ленинский проспект",
	            "Москва, Льва Толстого, 16",
	            "Москва, Кремлевская набережная",
	            "Москва, парк Сокольники"
	        ];

	    // Создаем мультимаршрут и настраиваем его внешний вид с помощью опций.
	    var multiRoute = new ymaps.multiRouter.MultiRoute({
	        referencePoints: referencePoints
	    }, {
	        

	        

	        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
	        boundsAutoApply: true,
	        wayPointDraggable: true
	    });







		// Создаем карту.
		var mapCont = document.querySelector('#map'),
			myMap = new ymaps.Map(mapCont, {
				// Центр карты
				center: [35.750625, 37.626],
				zoom: 7
			}, {
				buttonMaxWidth: 300
			});

			/*// Создаем на основе существующей модели мультимаршрут.
			multiRoute = new ymaps.multiRouter.MultiRoute(multiRouteModel, {
				// Путевые точки можно перетаскивать.
				// Маршрут при этом будет перестраиваться.
				wayPointDraggable: true,
				boundsAutoApply: true
			});*/

			// Добавление путевой точки
			var input = document.querySelector('.data__input');
			input.addEventListener('keydown', function (evt) {
				if (evt.keyCode === KeyCode.ENTER_KEYCODE) {
					// Получение координат введенного пользователем местоположения.
					var newPoint = input.value;
					points.push(newPoint);
					console.log(points);





					// Создаем мультимаршрут и настраиваем его внешний вид с помощью опций.
				    MultiRoute = new ymaps.multiRouter.MultiRoute({
				        referencePoints: xxx
				    }, {
				        

				        

				        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
				        wayPointDraggable: true,
				        boundsAutoApply: true
				    });



// Добавляем мультимаршрут на карту.
		//multiRoute.destroy();
		myMap.geoObjects.add(multiRoute);




					/*// Добавление путевой точки в маршрут
					multiRoute.model.setReferencePoints([
				      points[0],
				      points[points.length-1]
				    ], []);*/

					// Центровка карты после перестроения маршрута
					multiRoute.events
					.add("boundschange", function () {
				    myMap.setBounds(multiRoute.getBounds());
				    console.log(multiRoute.model.getReferencePoints());
					});
				}

			});

		// Добавляем мультимаршрут на карту.
		myMap.geoObjects.add(multiRoute);
	};
}

window.init = init;

