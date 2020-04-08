var unitTypeCleaner = function(type) {
	switch(type) {
		case "LW":
		return "1-Bed Loft";
		break;

		case "LW Loft":
		return "Live/Work + Loft";
		break;

		case "1x1":
		return "1-Bed";
		break;

		case "1x1 Loft+Den":
		return "1-Bed Loft + Den";
		break;

		case "1x1 Loft":
		return "1-Bed Loft";
		break;

		case "1x2 Loft":
		return "1-Bed Loft";
		break;

		case "1x2 Loft+Den":
		return "1-Bed Loft + Den";
		break;

		case "1x1 Den":
		return "1-Bed + Den";
		break;

		case "1x2 Den":
		return "1-Bed + Den";
		break;

		case "2x2":
		return "2-Beds";
		break;

		case "2x1":
		return "2-Beds";
		break;

		case "2x1 Loft":
		return "2-Beds Loft";
		break;

		case "2x2":
		return "2-Beds";
		break;

		case "2x2 Loft":
		return "2-Beds Loft";
		break;

		case "2x2 Loft+Den":
		return "2-Beds Loft + Den";
		break;

		case "3x2":
		return "3-Beds";
		break;

		case "3x2 Penthouse":
		return "3-Beds Penthouse";
		break;

		default:
		return type
	}
}

var unitFullTypeCleaner = function(type) {
	switch(type) {
		case "LW":
		return "One Bed Loft w/ Private Entrance";
		break;

		case "LW Loft":
		return "Live/Work 1-Bedroom Loft";
		break;

		case "Urban One":
		return "Urban 1-Bedroom, 1-Bathroom";
		break;

		case "1x1":
		return "1-Bedroom, 1-Bathroom";
		break;

		case "1x1 Loft+Den":
		return "1-Bedroom, 1-Bathroom Loft + Den";
		break;

		case "1x1 Loft":
		return "1-Bedroom, 1-Bathroom Loft";
		break;

		case "1x2 Loft":
		return "1-Bedroom, 2-Bathrooms Loft";
		break;

		case "1x2 Loft+Den":
		return "1-Bedroom, 2-Bathrooms Loft + Den";
		break;

		case "1x1 Den":
		return "1-Bedroom, 1-Bathroom + Den";
		break;

		case "1x2 Den":
		return "1-Bedroom, 2-Bathrooms + Den";
		break;

		case "2x2":
		return "2-Bedrooms, 2-Bathrooms";
		break;

		case "2x1":
		return "2-Bedrooms, 1-Bathroom";
		break;

		case "2x1 Loft":
		return "2-Bedrooms, 1-Bathroom Loft";
		break;

		case "2x2 Loft":
		return "2-Bedrooms, 2-Bathrooms Loft";
		break;

		case "2x2 Loft+Den":
		return "2-Bedrooms, 2-Bathrooms Loft + Den";
		break;

		case "3x2":
		return "3-Bedrooms, 3-Bathrooms";
		break;

		case "3x2 Penthouse":
		return "3-Beds, 2-Bathrooms Penthouse";
		break;

		default:
		return type
	}
}

var unitViewCleaner = function(view) {
	switch(view) {
		case "N":
		return "North";
		break;
		case "S":
		return "South";
		break;
		case "E":
		return "East";
		break;
		case "W":
		return "West";
		break;

		case "NE":
		return "North East";
		break;
		case "SE":
		return "South East";
		break;
		case "NW":
		return "North West";
		break;
		case "SW":
		return "South West";
		break;

		case "N+CY":
		return "North + Courtyard";
		break;
		case "S+CY":
		return "South + Courtyard";
		break;
		case "E+CY":
		return "East + Courtyard";
		break;
		case "W+CY":
		return "West + Courtyard";
		break;
		default:
		return view
	}
}

var unitSchemeCleaner = function(scheme) {
	switch(scheme) {
		case "A":
		return "A - Warm Dark";
		break;

		case "B":
		return "B - Warm Light";
		break;

		case "C":
		return "C - Cool Neutral";
		break;

		default:
		return scheme;
	}
}
