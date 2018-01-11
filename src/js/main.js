//Js Revealing module pattern
var core = function($) {

    var init = function() {
    	//List functions here
		initLandingBG();
		initNav();
    };

    var initLandingBG = function() {

		var headerSVG,
			headerContainer = document.getElementById('landing-triangles');

		var headerMapColorRender = function (path) {
			var random = 16;
			var ratio = (path.x + path.y) / (path.cols + path.lines);
			var code = Math.floor(255 - (ratio * (255-random)) - Math.random()*random).toString(16);
			return '#'+code+code+code;
		};

		var renderHeader = function() {
			if (!!headerSVG) {
				headerSVG.remove();
			}
			headerSVG = new Triangulr(
				window.innerWidth,
				window.innerHeight,
				180,
				100,
				headerMapColorRender
			);
			headerContainer.appendChild(headerSVG);

		};


		window.onresize = renderHeader;
		renderHeader();

	};
	
	var initNav = function() {

		$('.header__nav-toggle').on('click', function(e) {
			e.preventDefault();

			$('.content-wrap').toggleClass('nav-active');
			$('.header').toggleClass('active');

		});

	};

    return {
    	init: init
    };

} (jQuery);

jQuery(function() { 
	core.init(); 
});
