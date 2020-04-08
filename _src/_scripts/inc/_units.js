//units view
var $units = $('#js-units');

if( $units.length > 0 ) {





	/***** VARIABLES & CONSTANTS *****/
	var DATA = []; //base data should not be changed once set
	var UNITS = []; //current unit list to show (this will change based on filters)
	var SELECT = []; //selected unit data, meant for single page view
	var FILTER = {}; //current filters selected
	var BACK = true;

	var pageMax = 10;
	var scrollY = 0;





	/***** VUE OBJECTS *****/
	var vUnitList = new Vue({
		el: '#vue-units',
		data: {
			units: undefined,
			paginate: []
		}
	});

	var vUnitPage = new Vue({
		el: '#vue-page',
		data: {
			unit: SELECT
		}
	});





	/***** HELPERS *****/
	//helpers used to cleanup data (eg. renaming unit names) when unit data is first loaded
	//= require _units-cleanup.js

	//returns the data for a particular unit number
	var findUnit = function(id, data) {
		for(var i = 0; i < data.length; i++) {
			var d = data[i];
			if( d.id == id ) {
				return d;
			}
		}
		return false;
	}









	/***** PAGINATION *****/
	//checks the current page and max page that the pagination can go to
	var paginateCheck = function() {
		return {
			cur: vUnitList.paginate.curPage,
			max: vUnitList.paginate.totalPages
		}
	}

	//go one page more
	var paginateNext = function() {
		var check = paginateCheck();

		if(check.cur + 1 < check.max) {
			$("html, body").scrollTop( $('#vue-filters').offset().top - 40 );
			paginateUnit(check.cur + 1, UNITS);
		}
	}

	//go one page less
	var paginatePrev = function() {
		var check = paginateCheck();

		if(check.cur - 1 >= 0) {
			$("html, body").scrollTop( $('#vue-filters').offset().top - 40 );
			paginateUnit(check.cur - 1, UNITS);
		}
	}

	//shows given page based on the units data passed
	//this function is non-specifc and expect data to be sent unlike the pagination above
	//which has the UNITS variable hardcoded
	var paginateUnit = function(page, data) {
		var temp = [];
		var paginate = {};

		paginate.total = data.length;
		paginate.totalPages = Math.ceil(data.length / pageMax);
		paginate.curPage = page;

		var length = (page + 1) * pageMax;
		if( length > paginate.total ) {
			length = paginate.total;
		}else if(length < 0){
			length = 0;
		}

		for(var i = page * pageMax; i < length; i++) {
			var d = data[i];
			temp.push(d);
		}

		vUnitList.units = temp;
		vUnitList.paginate = paginate;
	}













	var filterToggle = function() {
		FILTER = {}; //resetting all filter data
		var $filters = $('.js-filter');

		for(var i = 0; i < $filters.length; i++) {
			var $f = $($filters[i]);

			var state = $f.attr('data-state');
			var type  = $f.attr('data-type');
			var value = $f.attr('data-value');

			if(state == 'active') {
				//makes sure the filter type has an array to push to
				if(FILTER[type] == undefined) {
					FILTER[type] = [];
				}

				FILTER[type].push( value );
			}
		}

		filterParse();
	}

	var filterMatch = function(filter, unit) {
		return filter.toString().toLowerCase() == unit.toString().toLowerCase();
	}

	var filterCheck = function(unit) {
		var check = false;
		var count = 0;
		var filterCount = 0;

		for(var filter in FILTER) {
			var f = FILTER[filter];
			for(var i = 0; i < f.length; i++) {
				var value = f[i];

				//= require _units-filter.js

			}
			count++;
		}

		if(count != filterCount) {
			check = false;
		}

		return check;
	}

	var filterParse = function() {
		var temp = [];

		if( jQuery.isEmptyObject( FILTER ) ) {
			temp = DATA;
		}else{
			for(var unit in DATA) {
				if( filterCheck(DATA[unit]) ) {
					temp.push(DATA[unit]);
				}
			}
		}

		UNITS = temp;
		paginateUnit(0, UNITS);
	}





	/***** UNIT TOGGLING *****/
	//initilize units view for the first time
	var unitLoad = function(data) {
		var id = window.location.hash.substring(1);
		var select = findUnit(id, UNITS);

		//custom bed filter
		if( id.indexOf('bed') >= 0 ) {
			paginateUnit(0, data);
			$('.js-filter[data-type="bed"][data-value="' + id.substring(4) + '"]').click();
		}else{
			if(id != '' && select) {
				BACK = false;
				unitPage(select.id);
			}else{
				paginateUnit(0, data);
			}
		}
	}

	//toggles to unit page view
	var unitPage = function(id) {
		SELECT = findUnit(id, UNITS);
		vUnitPage.unit = SELECT;

		$units.attr('data-state', 'page');

		scrollY = $(document).scrollTop();
		window.scrollTo(0, 0);
		setTimeout(function(){
			unitCookie(id);
			window.scrollTo(0, 0);
		}, 120);
	}

	//toggles to unit list view
	var unitList = function() {
		$units.attr('data-state', 'list');
		$("html, body").scrollTop( scrollY );
	}





	/***** DATA XHR *****/
	var API = {
		url: "https://bigfin.com/dev/apps/msgapi/api/v1/",
		key: "4530B2E75342C746EE341992B56DB334A0F3CB839660B860386EAC7417BAA7BC"
	}
	$.ajax({
		type: 'GET',
		url: API.url + 'heron' + '/units',
		headers: {
			'X-API-KEY' : API.key
		},
		success : function( result ) {
			DATA = result;

			$('#vue-units').attr('data-state', 'active');

			//parse any data changes to unit before finally loaded into Vue
			for(var i = 0; i < DATA.length; i++) {
				var d = DATA[i];

				DATA[i].fulltype = unitFullTypeCleaner(d.type);
				DATA[i].type = unitTypeCleaner(d.type);
				DATA[i].view = unitViewCleaner(d.view);
				DATA[i].scheme = unitSchemeCleaner(d.scheme);

				//if not available just don't even include it in anything
				if(d.availability == 'N') {
					//console.log(d.id);
					DATA.splice(i, 1);
					i--;
				}
			}

			UNITS = DATA;


			unitLoad(UNITS);
		}
	});





	/***** ROUTING *****/
	//triggers route checking on back/forward/new click
	$(window).bind('hashchange', function() {
		var id = window.location.hash.substring(1);

		if(id != '') {
			unitPage(id);
		}else{
			unitList();
		}
	});





	/***** INTERACTION *****/
	//alert(window.location.hash);

	//loads data for a specific unit
	$(document).on('click', '.js-unit', function(){
		var $that = $(this);
		var $parent = $that.parent();

		var id = $parent.attr('data-id');

		unitPage(id);

		history.pushState({}, "Unit Page", "#" + id);
	});

	$(document).on('click', '.js-back', function(){
		if(BACK) {
			history.back();
		}else{
			history.pushState({}, "Unit List", "#");
			BACK = true;
			paginateUnit(0, UNITS);
			unitList();
		}
	});

	$(document).on('click', '.js-page-next', function(){
		paginateNext();
	});

	$(document).on('click', '.js-page-prev', function(){
		paginatePrev();
	});

	//bed filters
	$(document).on('click', '.js-filter', function() {
		var selection = [];
		var $that = $(this);
		var state = $that.attr('data-state');

		if(state == 'active') {
			$that.attr('data-state', '');
		}else{
			$that.attr('data-state', 'active');
		}

		filterToggle();
	});
	$(document).on('click', '.js-filter-reset', function() {
		$('.js-filter').attr('data-state', '');

		FILTER = {};
		UNITS = DATA;
		paginateUnit(0, UNITS);
	});

	//scroll to form (mobile)
	$(document).on('click', '.js-scroll-form', function() {
		$('body').animate({
			scrollTop: $('.js-form').offset().top
		}, '500');
	});

	$('.js-filter-more').magnificPopup({
		type: 'inline',
		preloader: false,
		callbacks: {
			close: function() {
				$("html, body").scrollTop( $('#vue-filters').offset().top - 40 );
			}
		}
	});
	$(document).magnificPopup({
		type: 'image',
		delegate: '.js-location',
	});
	$(document).on('click', '.js-filter-close', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});
}
