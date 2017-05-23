var dialogue =	function (thought) {
					var mentions = stream ();
					var impressions = (thought || id) (mentions);
					
					var _dialogue =	function (x) {
											if (arguments .length) {
												mentions (x)
												return _dialogue;
											}
											else {
												return impressions ();
											}
										}
					_dialogue .mention =	function (x) {
												mentions (x)
											};
					_dialogue .impressions = impressions;
					_dialogue .impression =	function () {
												return impressions ();
											}
					
					return _dialogue;
				};
var is_dialogue =	function (x) {
						return (typeof (x) === 'function' && x .impressions) ? true : false;
					}
	

				
var wiretap_on =	function (who) {
						var talking = stream ();
						return	{
									dialogue:	function (thought) {
													talking (true);
													return dialogue (thought)
												},
									wiretapping:	mergeAll ([now (), talking .thru (throttle (0)) .thru (delay (0))])
														.thru (map, function () {
															return	Object .keys (who)
																		.filter (function (key) {
																			return is_dialogue (who [key])
																		});
														})
														.thru (trans, R .aperture (2))
														.thru (map, function (pair) {
															var prev = pair [0];
															var curr = pair [1];
															return curr .filter (function (x) {
																return prev .indexOf (x) === -1;
															})
														})
														.thru (spread)
								}
					};
				
var dialectic =	function (aux, self) {
					self .__parent = aux .parent;
					self .__dialogues = {};
					
					
					self .establish =	function (topic, thought) {
											self .__dialogues [topic] =	typeof thought === 'function'
																		? dialogue (thought)
																		: thought || dialogue ();
											self .__dialogues [topic] .impressions .thru (tap,
												((aux || {}) .impressed || noop) .bind (self, topic))
											
											return self;
										};

					self .personal =	function (topic) {
											return self .__dialogues [topic];
										};
					self .inherited =	function (topic) {
											if (self .__parent)
												return self .__parent .affiliated (topic);
										};
					self .affiliated =	function (topic) {
											return self .personal (topic) || self .inherited (topic);
										};
										
					self .mention =	function (topic, x) {
										self .affiliated (topic) && self .affiliated (topic) .mention (x);
										
										return self;
									};	
					self .impression =	function (topic, x) {
											return self .affiliated (topic) .impression (x);
										};
					self .impressions =	function (topic) {
											return self .affiliated (topic) .impressions;
										};
										
					self .remembers =	function (topic, impression) {
											if (impression !== undefined)
												return	self .establish
															(topic,
															function (mentions) {
																return	from (function (memory) {
																			memory (impression);
																			mentions .thru (project, memory);
																		});
															});
											else
												return	self .establish
															(topic);
										};
				    
				    return self;
				};	