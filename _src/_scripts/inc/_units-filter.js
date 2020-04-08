//variables
//FILTER = all filters
//filter = key name
//value value of the key value being checked
//i = iteration count
//unit = unit data
//check = whether or not the unit passes
//count = how many fiters it has passed

if(filter == 'bed') {
	if( value === '1' && (unit.bed === "0" || unit.bed === "1" && unit["floor_plan"] != "LW") ) {
		check = true;
		filterCount++;
		break;
	}

	if( value === '2' && (unit.bed === "2") ) {
		check = true;
		filterCount++;
		break;
	}

	if( value === '3' && (unit.bed === "3") ) {
		check = true;
		filterCount++;
		break;
	}

	if( value == 'lw' && (unit["floor_plan"] == "LW") ) {
		check = true;
		filterCount++;
		break;
	}
}


if(filter == 'scheme') {
	if( filterMatch(value, unit.scheme) ) {
		check = true;
		filterCount++;
		break;
	}
}


if(filter == 'view') {
	if( filterMatch(value, unit.view) ) {
		check = true;
		filterCount++;
		break;
	}
}

if(filter == 'floor') {
	if( filterMatch(value, unit.floor) ) {
		check = true;
		filterCount++;
		break;
	}
}

if(filter == 'kitchen') {
	if( filterMatch(value, unit.kitchen) ) {
		check = true;
		filterCount++;
		break;
	}
}

if(filter == 'outdoor') {
	if( filterMatch(value, unit.outdoor) ) {
		check = true;
		filterCount++;
		break;
	}
}

//other
if(filter == 'ada') {
	if( filterMatch(value, unit.ada) ) {
		check = true;
		filterCount++;
		break;
	}
}


if(filter == 'arch') {
	if( value === 'yes' && (unit.arch == 'Y') ) {
		check = true;
		filterCount++;
		break;
	}
}

if(filter == 'ac') {
	if( value === 'yes' && (unit.arch == 'Y') ) {
		check = true;
		filterCount++;
		break;
	}
}


if(filter == 'den') {
	if( value === 'yes' && (unit.den > 0)) {
		check = true;
		filterCount++;
		break;
	}
}

if(filter == 'loft') {
	if( value === 'yes' && (unit.loft > 0)) {
		check = true;
		filterCount++;
		break;
	}
}

if(filter == 'closet_wic') {
	if( value === 'yes' && (unit["closet_wic"] > 0)) {
		check = true;
		filterCount++;
		break;
	}
}

if(filter == 'closet_wtc') {
	if( value === 'yes' && (unit["closet_wtc"] > 0)) {
		check = true;
		filterCount++;
		break;
	}
}
