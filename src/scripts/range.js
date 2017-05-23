var null_range = { from: 0, to: -1 };

var rangify =	function (array) {
					if (array)
						return	{
									from: 0,
									to: array .length - 1
								};
				};
var arrayify =	function (range) {
					if (range) {
						var array = [];
						for (var key = range .from; key <= range .to; key ++) {
							array .push (key);
						};
						return array;
					}
				};
var objectify =	function (range) {
					if (range) {
						var object = {};
						for (var key = range .from; key <= range .to; key ++) {
							object [key] = key;
						};
						return object;
					}
				};
var count =	function (range) {
				return range .to - range .from + 1;
			};
var same =	function (place_one, place_two) {
				return place_one && place_two && place_one .to === place_two .to && place_one .from === place_two .from;
			};
var proper =	function (range) {
					return apply_sign (sign (range)) (range);
				};
var opposite =	function (range_one, range_two) {
					var sign_one = sign (range_one);
					var sign_two = sign (range_two);
					return	(sign_one > 0 && sign_two < 0)
							|| (sign_one < 0 && sign_two > 0);
				};
var left_and =	function (range_one, range_two) {
					range_one = range_one || null_range;
					range_two = range_two || null_range;

					return	{
								from: range_one .from,
								to: range_two .to
							};
				};
var left_difference =	function (range_one, range_two) {
							range_one = range_one || null_range;
							range_two = range_two || null_range;
	
							var middle = intersection (range_one, range_two);
							if (sign (middle) <= 0)
								return range_one;
							else if (middle .from !== range_one .from)
								return	{
											from: range_one .from,
											to: middle .from - 1
										};
							else
								return null_range
						};
var right_difference =	function (range_one, range_two) {
							range_one = range_one || null_range;
							range_two = range_two || null_range;
							
							var middle = intersection (range_one, range_two);
							if (sign (middle) <= 0)
								return range_one;
							else if (middle .to !== range_one .to)
								return	{
											from: middle .to + 1,
											to: range_one .to
										};
							else
								return null_range
						};
var invert =	function (range) {
					return	{
								from: range .to + 1,
								to: range .from - 1
							};
				};
var add =	function (range_one, range_two) {
				if (range_one .to + 1 === range_two .from)
					return	{
								from: range_one .from,
								to: range_two .to
							};
			};	
var included_in =	function (bigger, smaller) {
						return same (
									intersection (bigger, smaller),
									smaller);
					};
var intersection =	function (/*args*/) {
						var args = [] .slice .call (arguments) .map (function (range) { return range || null_range });
						/*log (range_one, range_two,	{
														from: Math .max (range_one .from, range_two .from),
														to: Math .min (range_one .to, range_two .to)
													});*/
						return	{
									from: Math .max .apply (Math, args .map (function (range) { return range .from })),
									to: Math .min .apply (Math, args .map (function (range) { return range .to }))
								};
					};
				var sign = count;
				var apply_sign =	function (sign) {
									return	function (range) {
												if (sign >= 0)
													return range;
												else
													return invert (range);
											};
								};