var cache_prefix = 'rest:cache;';

var _estimate_undefined = {};

var invalidated = function (as) { return { __invalidated__as: as }; }
var is_invalidation =	function (estimate) {
							return estimate && '__invalidated__as' in estimate ? true : false;
						}
var invalidated_as = function (within) { return within .__invalidated__as }

var stateful =	function (opts) {
					var key = opts .key;
					var per = opts .per || 'none';
					var estimate = opts .estimate;
					var request = opts .request;
					var _fetch = opts .fetch;
					var error = opts .error;
					var value = opts .value;
					
					return dialogue (function (inquiries) {
							
								var states = stream ();
								var states_persistence = persistance (states, key, cache_prefix);
								var states_init = states_persistence .init;
								
								
								inquiries
									.thru (tap, function (_inquiry) {
										states_init .then (function () {
											var id = _inquiry .label;
											var item = _inquiry .item;
											
											var _estimate = (estimate || constant (_estimate_undefined)) (item);
											var _request = request (item);
											
											var prev = states ();
											var curr = like (prev || {});
											
											if (_estimate !== _estimate_undefined)
												curr .estimate =	{
																		label: id,
																		item: _estimate
																	};
											if (_request)
												curr .request = 	(curr .request || []) .concat ([{
																		label: id,
																		item: _request
																	}]);
																
											states (curr);
										})
									})
									
									
		
								
								var prev_state;
								var fetching =	states
													.thru (dropRepeatsWith, json_equal)
													.thru (filter, function (state) {
														if (! state)
															return false;
														if (! state .request)
															return false;
														if (prev_state && state &&
															prev_state .request && state .request &&
															json_equal (prev_state .request [0], state .request [0])
														)
															return false;
														return true;
													})
													.thru (map, function (state) {
														prev_state = like (state);
														return state .request [0];
													})
													.thru (map, function (req) {
														var id = req .label;
														return	[Promise .resolve ((fetching () || {}) [0])
																	.then (function () {
																		/*var _state = states ();
																		if ((per === 'all' && (_state && _state .value)) ||
																			(per === 'lump' && (_state && _state .request))
																		) {
																			return {
																				result: 'value',
																				label: id,
																				item: _state .value .item
																			}
																		}*/
																		return	query (req .item)
																					.then (function (response) {
																						return	{
																							result: 'value',
																							label: id,
																							item: value (response)
																						};
																					})
																					.catch (function (_error) {
																						return {
																							result: 'error',
																							label: id,
																							item: (error || R .identity) (_error)
																						}
																					})
																	})];
													})
													.thru (tap, function () {
														fetching () [0]
															.then (function (_fetch) {
																var prev = states ();
																var curr = like (prev);
																
																if (_fetch .result === 'value') {
																	curr .value = {
																		label: _fetch .label,
																		item: _fetch .item
																	};
																	delete curr ['error'];
																	delete curr ['estimate'];
																}
																else if (_fetch .result === 'error') {
																	curr .error = {
																		label: _fetch .label,
																		item: _fetch .item
																	};
																}
																
																
																curr .request = curr .request
																					.filter (function (_request) {
																						return _request .label !== _fetch .label
																					});
																if (curr .request .length === 0)
																	delete curr ['request'];

																states (curr);
															})
													})
		
								var query =	function (request) {
												if (_fetch) {
													return	Promise .resolve (_fetch (request .path, request))
																.then (function (response) {
																	log ('queryied local', request .path, request, response);
																	return response;
																});
												}
												else {
													return	fetch (request .path, request)
																.then (function (response) {//log (response);
																    return	response .text ()
																    			.then (function (text) {
																    				try {
																    					return {
																    						json: JSON .parse (text),
																    						text: text,
																    						response: response
																    					}
																    				}
																    				catch (e) {
																	    				return {
																	    					text: text,
																	    					response: response
																	    				}
																    				}
																    			})
																})
																.then (function (response) {
																	log ('queryied network', request .path, request, response);
																	return response;
																});
												}
											};
								
								states .key = key;
								states .init = states_init;
								states .caching = states_persistence .caching;
								states .cached = states_persistence .cached;
								
								return states;
						})
					};



						
						
var restoration =	localforage .keys ()
						.then (function (labels) {
							return	R .fromPairs (
										labels
											.map (function (cache_label) {
												return [ cache_label, localforage .getItem (cache_label) ]
											}))
						})
						.catch (constant ({}))
							
var persistance =	function (s, key, prefix) {
						var persist =	function (state) {
											return localforage .setItem (prefix + key, state) .catch (noop)//todo: catch sth
										}
						var caching = s .thru (dropRepeatsWith, json_equal);
										
						return	{
									init: restoration
											.then (function (initials) {
												return initials [prefix + key]
											})
											.then (tap_ (function (_state) {
												if (_state)
													s (_state)
											})),
									caching: caching,
									cached:	combine (function (self) {
												var _state = caching ();
												return [Promise .resolve ((self () || []) [0])
															.then (function () {
																return persist (_state)
															})];
											}, [ caching ])

								}
					}
	
var query =	function (path, request) {
				if (request .method === 'local') {
					return	Promise .resolve (parse (request .body))
								.then (function (response) {
									log ('queryied local', path, request, response);
									return response;
								});
				}
				else {
					return	fetch (path, request)
								.then (function (response) {//log (response);
								    return	response .json ()
								    			.then (function (json) {
								    				return	retaining ({
										    					json: json
										    				}) (response)
								    			});
								})
								.then (function (response) {
									log ('queryied network', path, request, response);
									return response;
								});
				}
			};

			

					
var new_label =	function () {
					return (new Date ()) .getTime () + '-' + Math .random ();
				}
					
					
					
var detailed_inquire =	function (stateful, inquiry) {
							var id = new_label ();
							
							var details =	from (function (details) {
												stateful .impressions
													.thru (filter, function (state) {
														return state .request && state .request [0] .label === id;
													})
													.thru (tap, function (state) {
														details (state);
													});
												stateful .impressions
													.thru (filter, function (state) {
														return state .request && state .request [1] && state .request [1] .label === id;
													})
													.thru (trans, R .take (1))
													.thru (tap, function (state) {
														details (state);
													});
												stateful .impressions
													.thru (filter, function (state) {
														return (state .error && state .error .label === id) || (state .value && state .value .label === id);
													})
													.thru (tap, function (state) {
														details (state);
														details .end (true);
													});
											})
							
							stateful .mention ({
								label: id,
								item: inquiry
							})
							
							return details;
						}	
var inquire =	function (stateful, inquiry) {
					var details = detailed_inquire (stateful, inquiry)
					return	promise (details .end)
								.then (function () {
									return details ()
								})
								.then (function (state) {
									if (state .error)
										return Promise .reject (state .error .item);
									else
										return state .value .item;
								});
				}	
var inquire_last =	function (stateful) {
						var _state = stateful .impression ();
						if (_state &&
								! (_state .estimate && is_invalidation (_state .estimate .item)) &&
								_state .value)
							return Promise .resolve (_state .value .item);
						else
							return inquire (stateful)
					}
var value_details =	function (stateful) {
						return	stateful .impressions
									.thru (map, function (state) {
										if (state .estimate && is_invalidation (state .estimate .item))
											return invalidated_as (state .estimate .item)
										else if (state .value)
											return state .value .item;
									})
									.thru (dropRepeats)
					}
var optimistic_value_details =	function (stateful) {
									return	stateful .impressions
												.thru (map, function (state) {
													if (state .estimate && is_invalidation (state .estimate .item))
														return invalidated_as (state .estimate .item)
													else if (state .estimate)
														return state .estimate .item
													else if (state .value)
														return state .value .item;
												})
												.thru (dropRepeats)
								}
var pessimistic_value_details =	function (stateful) {
									return	stateful .impressions
												.thru (map, function (state) {
													if (state .estimate && is_invalidation (state .estimate .item))
														return undefined
													else if (state .value)
														return state .value .item;
												})
												.thru (dropRepeats)
								}
var error_details =	function (stateful) {
						return	stateful .impressions
									.thru (map, function (state) {
										if (state .error)
											return state .error .item;
									})
									.thru (dropRepeats)
					}