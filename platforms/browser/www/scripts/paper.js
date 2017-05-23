var paper = function (impl) {
				return	function (args) {
							return	{
										realize:	function (parent) {
														return  (function (self) {
																	dialectic ({ parent: parent,
																		//logging
																		impressed:	function (what, how) {
																						//if (what && what [0] === ':')
																			            	log ('paper', what, how);
																					}
																	}, self);
																	self .self = self;
																	
																	self .recognize =	function (paper) {
																							paper .realize (self);
																							return self;
																						};
																	self .thru =	function (func, args) {
																						return	func .apply (
																									self, [] .concat .call (args || [], [self])
																								);
																					};
																	
																	impl (self, args);
																	
																	return self;
																}) ({});
													}
									}
						};
			};