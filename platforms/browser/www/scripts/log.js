var alert_log =	function () {
					var msg = '';
					for (var key in arguments) {
						var value = arguments [key];
						msg = (msg ? msg + '\n\n......\n\n' : '') + value +'\n'+ circular_json (value, 4, 2);
					}
					alert (msg);
				};
					var circular_json =	function (input, maxDepth, indent) {
										    var output;
										        
										    maxDepth = maxDepth || 5;
										        
										    if (typeof input === "object") {
										        output = recursion (maxDepth) (input);
										    }
										    else {
										        output = input;
										    }
										    
										    return JSON .stringify (output, null, indent);
										};
											var recursion =	function (maxDepth) {
																var refs = [];
																var refsPaths = [];
																var self =	function (input, path, depth) {
																		        var output = {},
																		            pPath,
																		            refIdx;
																		        
																		        path  = path  || "";
																		        depth = depth || 0;
																		        depth ++;
																		        
																		        if (maxDepth && depth > maxDepth) {
																		            return "{depth over " + maxDepth + "}";
																		        }
																		        
																		        for (var p in input) {
																		            pPath = (path ? (path + ".") : "") + p;
																		            if (typeof input [p] === "function") {
																		                output [p] = "{function}";
																		            }
																		            else if (typeof input [p] === "object") {
																		                refIdx = refs .indexOf (input [p]);
																		                
																		                if (-1 !== refIdx) {
																		                    output [p] = "{reference to " + refsPaths [refIdx]  + "}";
																		                }
																		                else {
																		                    refs .push (input [p]);
																		                    refsPaths .push (pPath);
																		                    output [p] = self (input [p], pPath, depth);
																		                }
																		            }
																		            else {
																		                output [p] = input [p];
																		            }
																		        }
																		        
																		        return output;
																		    };
																return self;
														    };
			
			
//log = alert_log;
var log =	function () {
				console .log .apply (console, arguments);	
			};

log .error =	function (e) {
					if (log === alert_log)
						alert_log .apply (this, arguments);
					else
						throw e;
				};

var logged =	function (/* args */) {
					log .apply (this, arguments);
					return arguments [arguments .length - 1];
				};
var logged_with =	function (/* args */) {
						var args = [] .slice .call (arguments);
						return	function (item) {
									log .apply (null, args .concat (item));
									return item;
								};
					};
var _debugger =	function () {
					debugger;
				};