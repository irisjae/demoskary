var __so =	function (self) {
				if (! self .self) {
					Object .defineProperty
						(self, 'args', { get: function () { return retaining (self .opts) (self .opts .params || []) } });
									
					dialectic ({
						parent: self .__parent || self ._parent || self .parent,
						//logging
						impressed:	function (what, how) {
										//if (what && what [0] === ':')
							            	log (self .tag || self .root .localName, what, how);
									}
					}, self);
					self .self = self;
					self .my = function (topic, thoughts) { return self .affiliated (topic) && self .impression (topic, thoughts); };
												
					self .recognize =	function (paper) {
											paper .realize (self);
											return self;
										};
					self .thru =	function (func, args) {
										return	func .apply (
													self, [] .concat .call (args || [], [self])
												);
									};
									
									
					var first = true;
					self .renders = [];
					self .render_promises = [];
					self .shouldUpdate =	function () {
												if (first) {
													first = false;
													//return logged_with ('first run free', self)(true);/*
													return true;//*/
												}
												//return logged_with ('render', self)(self .renders .length);/*
												return self .renders .length//*/
													|| (self .__ .isLoop && self .__ .parent .renders .length)
													|| ((self .__ .parent .__ .tagName === 'virtual')  && self .__ .parent .shouldUpdate ());//*/
											}
					self .render =	function () {//var stack = new Error ().stack;
										if (! self .isMounted) return new Promise (function (resolve) { self .one ('mount', resolve); });
										var args = arguments;
										if (self .renders .length && self .renders [0] .length === 0) {
											self .renders [0] = args;
											return self .render_promises [0];
										}
										else {
											self .renders .unshift (args);
											self .render_promises .unshift (
												next_tick () .then (function () {//var q = stack;
													if (self .isMounted) {
														self .update .apply (self, self .renders [self .renders .length - 1]);
														self .renders .pop ();
														self .render_promises .pop ();
													}
												})
											)	
											return self .render_promises [0];												
										}
									};
				}
			};

riot .mixin ({
	init:	function () {
				__so (this);			
			}
});