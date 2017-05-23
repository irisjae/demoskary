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
									
									
									
					self .render =	function () {
										var args = arguments;
										return	next_tick () .then (function () {
													if (self .isMounted) {
														self .update .apply (self, args);
													}
												})
									};
				}
			};

riot .mixin ({
	init:	function () {
				__so (this);			
			}
});
	
var so =	function (self) {
				if (! self .self) {
					__so (self);
					self .affiliated =	function (topic) {
											if (topic in self .__dialogues)
												return self .__dialogues [topic];
											else {
												var next = self .__parent || self ._parent || self .parent;
												while (next) {
													if (next .affiliated)
														return next .affiliated (topic);
													else
														next = next .__parent || next ._parent || next .parent;
												}
											}
										};	
				}
			};
	
								
								
/*
var so =	function (self) {
				if (! self .self) {
					Object .defineProperty
						(self, 'args', { get: function () { return retaining (self .opts) (self .opts .params || []) } });
									
					self .self = self;
					self .my =	function (label) {
									if (label in self)
										return self [label];
									else {
										var next = self .__parent || self ._parent || self .parent;
										while (next) {
											if (next .my)
												return next .my (label);
											else
												next = next .__parent || next ._parent || next .parent;
										}
									}	
								};
												
					self .thru =	function (func, args) {
										return	func .apply (
													self, [] .concat .call (args || [], [self])
												);
									};
									
					
					self .__registered = {};
					self .register =	function () {
											Object .keys (self)
												.forEach (function (key) {
													if (flyd .isStream (self [key]) && ! self .__registered [key]) {
														self .__registered =	self [key]
																					.thru (tap, function (x) {
																						//if (key && key [0] === ':')
																			            	log (self .tag || self .root .localName, key, x);
																					})
													}
												})
										}									
					self .render =	function () {
										var args = arguments;
										return	next_tick () .then (function () {
													if (self .isMounted) {
														self .update .apply (self, args);
													}
												})
									};
				}
			};

riot .mixin ({
	init:	function () {
				so (this);			
			}
});
*/