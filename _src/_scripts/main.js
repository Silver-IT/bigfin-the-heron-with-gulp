//= require vendor/fastclick.js
//= require vendor/aos.js
//= require vendor/jquery.magnific-popup.js
//= require vendor/js.cookie.js

(function(window, document, $, undefined) {
	'use strict';

	$(document).on('ready', function() {
		FastClick.attach(document.body);

		var showpopup = false;
		var siteurl         = 'https://www.liveatheron.com/';
		//var siteurl         = 'http://localhost:3000';
		var now             = new Date();
		var later           = new Date();
		var popupExpireDate = new Date( "January 31, 2019 11:59:59" );
		var specialStart = new Date( "Novmeber 30, 2018 00:00:01" );
		var specialExpireDate = new Date( "November 30, 2018 11:59:59" );
		//console.log(now);

		var specialCook            = {
			name: 'endofnov',
			value: 'popup-seen',

			/**
			* Set popup cookie expire date to 3 hours from time popup is closed.
			*/
			expires: later.setHours( now.getHours() + 3 )
		};
		var cook            = {
			name: '2019-1-31',
			value: 'popup-seen',

			/**
			* Set popup cookie expire date to 3 hours from time popup is closed.
			*/
			expires: later.setHours( now.getHours() + 3 )
		};



		var $body = $('.js-body');

		AOS.init({
			offset: 150,
			duration: 600,
			once: true,
			disable: window.innerWidth < 1000
		});

		//gallery
		var $gallery = $('.js-pop-gallery');
		if( $gallery.length > 0 ) {
			$gallery.each(function() {
				$(this).magnificPopup({
					delegate: 'a',
					type: 'image',
					tLoading: 'Loading image #%curr%...',
					mainClass: 'mfp-img-mobile',
					gallery: {
						enabled: true,
						navigateByImgClick: true,
						preload: [0,1] // Will preload 0 - before current, and 1 after the current image
					},
					image: {
						tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
						titleSrc: function(item) {
							return item.el.attr('title');
						}
					}
				});
			});
		}

		$(document).on('click', '.js-field-submit', function(e) {
			var pass = true;
			var $field = $('.js-field-required');

			$field.removeClass('field__error');

			for( var i = 0; i < $field.length; i++ ) {
				var $f = $($field[i]);
				if($f.val() == '' || $f.val() == null) {
					pass = false;
					$f.addClass('field__error');
				}else{
					var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

					if($f.attr('type') == 'email' && !re.test( $f.val() )) {
						pass = false;
						$f.addClass('field__error');
					}
				}
			}

			if(!pass) {
				e.preventDefault();
			}
		});


		var $accord = $('.js-accord dt');
		$accord.on('click', function(){
			var $parent = $(this).parent();
			var state = $parent.attr('data-state');

			if(state == 'active') {
				$parent.attr('data-state', '');
			}else{
				$parent.attr('data-state', 'active');
			}
		});

		//mobile menu
		var $menu = $('.js-menu');
		$menu.on('click', function() {
			var state = $body.attr('data-menu');

			if(state != 'active') {
				$body.attr('data-menu', 'active');
			}else{
				$body.attr('data-menu', '');
			}
		});



		var $iframe = $('.js-pop-iframe');
		if( $iframe.length > 0 ) {
			$iframe.each(function() {
				$(this).magnificPopup({
					disableOn: 700,
					type: 'iframe',
					mainClass: 'mfp-fade',
					removalDelay: 160,
					preloader: false,

					fixedContentPos: false
				});
			});
		}





		$('.js-home-hero').attr('data-animate', 'true');



		if ( typeof Cookies.get( specialCook.name ) == "undefined" && now >= specialStart && now <= specialExpireDate ) {
			if ( showpopup ) {
				$.magnificPopup.open({
					items: {
						src: '<div id="popup" class="white-popup"><a href="'+ siteurl +'/choose-your-home/"><img class="white-popup__desktop" src="'+ siteurl + "/assets/promo/specialpop.jpg" +'"><img class="white-popup__mobile" src="'+ siteurl + "/assets/promo/specialpop--mobile.jpg" +'"></a></div>',
						type: 'inline'
					},
					callbacks: {
						close: function() {
							// set popup seen cookie
							Cookies.set( specialCook.name, specialCook.value, { expires: specialCook.expires });
						}
					}
				});
			}
		}else if ( typeof Cookies.get( cook.name ) == "undefined" && now <= popupExpireDate ) {
			if ( showpopup ) {
				$.magnificPopup.open({
					items: {
						src: '<div id="popup" class="white-popup"><a href="'+ siteurl +'/choose-your-home/"><img class="white-popup__desktop" src="' + siteurl + "/assets/promo/pop.jpg" +'"><img class="white-popup__mobile" src="'+ siteurl + "/assets/promo/pop--mobile.jpg" +'"></a></div>',
						type: 'inline'
					},
					callbacks: {
						close: function() {
							// set popup seen cookie
							Cookies.set( cook.name, cook.value, { expires: cook.expires });
						}
					}
				});
			}
		}


		// on click of popup image
		$( document ).on( 'click', '.white-popup a', function( event ) {
			// stop page redirecf
			event.preventDefault();

			// get click item
			var $el = $( this );

			// set popup seen cookie
			Cookies.set( cook.name, cook.value, { expires: cook.expires });

			// now redirect user to the 'choose yor home' page
			window.location = $el.attr( 'href' )
		});


		var unitCookie = function(id) {
			if(typeof id !== "undefined") {
				if( typeof Cookies.get( 'unit' ) !== "undefined") {
					Cookies.set('unit', id + ',' + Cookies.get('unit'), {expires: 365});
				}else{
					Cookies.set('unit', id, {expires: 365});
				}
			}

			var unit = Cookies.get('unit');
			if(typeof unit !== "undefined") {
				unit = unit.split(',');
				console.log(unit);

				var interest = [];
				$.each(unit, function(i, el){
					if($.inArray(el, interest) === -1) interest.push(el);
				});

				$('.js-field-unit').val(unit[0]);
				$('.js-field-unit-other').val(interest.slice(1,7).join(', '));
			}
		}

		unitCookie();

		//= require inc/_map.js
		//= require inc/_units.js
	});

})(window, document, jQuery);
