var replace_all =	function (search, replacement) {
						return	function (string) {
								    var target = string;
								    return target .split (search) .join (replacement);
								};
					};
var index =	function (test) {
				return	function (array) {
							for (var x = 0; x < array .length; x ++) {
							    if (test (array [x])) return x;
							}
							// not found, return fail value
							return -1;
						};
			};
var like =	function (baby) {
				if (typeof baby === 'function')
					var i = function () { return baby .apply (this, arguments) };
				else
					var i = {};
				for (var key in baby) {
					i [key] = baby [key];
				}
				return i;
			};
var without =	function (/*you*/) {
					var our_arguments = arguments
					return	function (baby) {
								var i = like (baby);
								for (var your_laugh of our_arguments) {
									delete i [your_laugh];
								}
								return i;
							};
				};
var with_ =	function (heart, yours) {
				return	function (baby) {
							var i = like (baby);
							i [heart] = yours;
							return i;
						};
			};
var having =	function (you) {
					return	function (baby) {
								var i = like (baby);
								for (var love in you) {
									i [love] = you [love];
								}
								return i;
							};
				};
var retaining =	function (you) {
					return	function (baby) {
								var i = Object .create (baby);
								for (var love in you) {
									i [love] = you [love];
								}
								return i;
							};
				};
var mutate =	function (data) {
					return	function (x, y) {
								data [x] = y;
								return data;
							};
				};
var difference =	function (data) {
						return	function () {
									return without .apply (this, arguments) (data);
								};
					};
var on_next_tick =	function (action) {
						requestAnimationFrame (action);
					};
var next_tick =	function () {
					return	new Promise (function (resolve) {
								requestAnimationFrame (resolve);
							});
				};
var wait =	function (ms, val) {
				return	new Promise (function (resolve) {
							setTimeout (resolve .bind (null, val), ms);
						});
			};
var value =	(function () {
				var trim_first_dot =	function (string) {//debugger;
																string = string + '';
																if (string [0] === '.')
																	return string .slice (1);
																else
																	return string;
															};
			
				return	function (/*property_name*/) {
							var property_names = [] .slice .call (arguments);
							return	function (object) {
										var value = object;
										
										for (var property_name of property_names) {
											if (! property_name)
												continue;
											property_name = trim_first_dot (property_name) .replace (/\s/g, '');
											if (! property_name)
												continue;
												
											for (var property_bit of property_name .split ('.') .filter (function (truthy) { return truthy; })) {
												if (! value)
													return value;
												value = value [property_bit];
											}
										}
										
										return value;
									};
						};
			}) ();
			
var noop = function () {};
var json_equal =	function (a, b) {
						return JSON .stringify (a) === JSON .stringify (b);
					};
					
var one_cache =	function (func) {
					var last_inp;
					var cache;
					return	function (inp) {
								if (inp !== last_inp) {
									last_inp = inp;
									cache = func (last_inp);
								}
								return cache;
							};
				};
			
var id = function (x) { return x; };

var breaking_reduce =	function (array, func, result, break_val) {
							for (var i = 0; i < array .length; i++) {
								var val = func (result, array [i], i, array);
								if (val === break_val) break;
								result = val;
							}
							return result;
						}
var positive_or_zero =	function (x) { return x > 0 ? x : 0 };
var values =	function (object) {
					return Object .keys (object) .map (function (key) { return object [key] });
				};
var flatten =	function (ary) {
					return	ary .reduce (function (a, b) {
								if (Array .isArray (b)) {
									return a .concat (flatten (b))
								}
								return a .concat (b)
							}, [])
				};
					
var constant =	function (x) {
					return function () { return x; };
				};
var eventify =	function (sth) {
					sth .addListener = sth .on;
					sth .removeListener = sth .off;
					return sth;
				};
var stringify =	function (data) {
	return data && JSON .stringify (data);
};
var parse =	function (json) {
				return ! json || json === 'undefined' ? undefined : JSON .parse (json);
			};
var capitalize =	function (str) {
					    return str .replace (/\w\S*/g, function (txt) { return txt .charAt (0) .toUpperCase () + txt .substr (1) .toLowerCase (); });
					}
var to_uppercase =	function (str) {
					    return str .toUpperCase ();
					}

var tap_ = function (fn) { return function (x) { fn .apply (this, arguments); return x; } };


var u =	function (x) {
			return x (x)
		};
var Y =	function (f) {
			return	u (function (x) {
						return f (function (y) { return (u (x)) (y); });
					});
		};


var pack =	function (aliases) {
				return	function (val) {
							var x = {};
							aliases .forEach (function (alias) {
								x [alias] = val;
							})
							return x;
						};
			};
var make =	function (func) {
				var x = {};
				func (x);
				return x;
			}		
			
			
			
var climb = function (n, scope) {
            for (var i = 0; i < n; i ++) {
              scope = scope .parent;
            }
            return scope;
          }