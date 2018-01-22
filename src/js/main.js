//Js Revealing module pattern
var core = function($) {

    var init = function() {
    	//List functions here
		initLandingBG();
		initNav();
		initWork();
		initForm();
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

		$('.header a, .scroll-mouse, .scroll-to').on('click', function(e) {
			e.preventDefault();

			loaded = 1;

			var target = $(this).attr('href'),
				margin = 0;

			if ($(window).width() < 768 && target != "#about") {
				margin = 50;
			}

			$('.content-wrap').removeClass('nav-active')
			$('.header').removeClass('active');

			$('html, body').animate({
				scrollTop: $(target).offset().top - margin
			}, 600);
		});

		var controlNavColour = function() {

			var landingHeight = $('.landing').height(),
				windowOffset = $(window).scrollTop();

			if ( (landingHeight) <= windowOffset ) {
				$('.header').addClass('header--white');
			} else {
				$('.header').removeClass('header--white');
			}

		};

		controlNavColour();
		document.addEventListener('scroll', controlNavColour);
		document.addEventListener('resize', controlNavColour);

		var controlNavLinesThroughs = function() {

			$('.header__nav a').each(function() {

				var section = $($(this).attr('href')),
					sectionHeight = section.height(),
					sectionOffset = section.offset().top,
					windowOffset = $(window).scrollTop();

				if (sectionOffset <= windowOffset + 80 && sectionOffset + sectionHeight > windowOffset) {
					$('.header__nav a').removeClass("active");
					$(this).addClass('active');
				}
				else {
					$(this).removeClass('active');
				}

			});

		};

		controlNavLinesThroughs();
		document.addEventListener('scroll', controlNavLinesThroughs);
		document.addEventListener('resize', controlNavLinesThroughs);

		var scrollToContent = function () {

			if ( loaded == 0 ) {
				var landing = $('#landing'),
					landingHeight = landing.height(),
					windowOffset = $(window).scrollTop();

				if (windowOffset < landingHeight) {
					$('html, body').animate({
						scrollTop: $('#about').offset().top
					}, 600);
				}

				loaded = 1;
			}

		};

		loaded = 0;
		document.addEventListener('scroll', scrollToContent);


		var horizontalScrollBar = function() {

			var documentHeight = $(document).height(),
				windowHeight = $(window).height(),
				windowOffset = $(window).scrollTop(),
				percentage = windowOffset / (documentHeight - windowHeight) * 100;

			$('.header__horizontal-bar').css('width', percentage+'%');

		};

		horizontalScrollBar();
		document.addEventListener('scroll', horizontalScrollBar);
		document.addEventListener('resize', horizontalScrollBar);

	};

	var initWork = function() {

		$('.work__block').on('click', function(e) {

			e.preventDefault();

			var windowWidth = $(window).width();

			if (windowWidth < 768) {
				$(this).toggleClass('active');
			}

		});

		$('.work__block-icon').on('click', function(e) {

			e.preventDefault();

			var windowWidth = $(window).width(),
				href = $(this).closest('.work__block').attr('href');

			if (windowWidth < 768) {
				window.open(href, '_blank');
			}

		});

	};

	var initForm = function() {

		var contact_php_path = window.location.href + 'assets/js/ajax/contact-form.php';

        /**
         * When the form is submitted
         */
		$('#contact_form').submit(function (e) {
			e.preventDefault();

			var $form = $(this);
			//don't do anything if the form has already been submitted
			if (!$form.hasClass('loading')) {

				//add the loading class to the form
				$form.addClass('loading');

				//hide any error messages
				$form.find('.form__errors').empty();

				//submit details via ajax
				$.ajax({
					url: contact_php_path,
					cache: false,
					dataType: "json",
					method: "POST",
					data: $form.serialize(),
				}).done(function (data) {
					//got a result  
					if (data.result && data.result == 'success') {

						var thankyou_message = '<div class="form__message">' +
							'<p>Thanks for getting touch '+ data.name + '!' +
							'<br />I will get back to you soon.</p>' +
						'</div>';

						$form.replaceWith(thankyou_message);
						$('html, body').animate({ scrollTop: $('.thankyou-message').offset().top });
					} else {
						//failure
						//is there a failure array?
						if (typeof data.errors != 'undefined') {
							$.each(data.errors, function (key, val) {
								console.log('setting #' + key + ' to', val);
								$form.find('#' + key).next().html(val);
								$form.find('#' + key).addClass('active red');
							});
							$('html, body').animate({ scrollTop: $form.offset().top });
						} else if (typeof data.message != 'undefined') {
							$form.replaceWith('<p class="response">' + data.message + '</p>');
							console.log(data.error);
							//scroll to top of form
							$('html, body').animate({ scrollTop: $form.offset().top });
						}
						// grecaptcha.reset(); // Reset recaptcha
					}
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.log('got an error when submitting form');
					console.log(jqXHR);
					console.log(textStatus);
					$form.replaceWith('<p class="response">Error submitting request. Please try again later.</p>');
				}).always(function () {
					//remove loading class from form
					$form.removeClass('loading');
				});

			}
		});

		$('input, textarea').on('focus', function() {
			$(this).parent().addClass('active');
		});

		$('input, textarea').on('keyup', function () {
			$(this).parent().removeClass('active red');
		});

		$('input, textarea').on('focusout', function() {
			$(this).parent().removeClass('active');
		});

	};

    return {
    	init: init
    };

} (jQuery);

jQuery(function() { 
	core.init(); 
});
