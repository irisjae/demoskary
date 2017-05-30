/*
	global paper,
	global stateful,
	global R,
	global constant,
	global stringify,
	global resettle,
	global tap,
	global map,
	global fecha
*/

var frontend_path = window .location .protocol + '//demo-mumenrider.c9users.io';
var backend_path = window .location .protocol + '//demo-fake.path';	

var home_path = '#user/verify';
var paper_mock_loggined_in =	paper (function (self, args, my) {
									var mock =	R. pipe (
													R .applySpec ({
														json: R .identity
													}),
													R .always
												);
	
									var user_id = 'e9de949f-22c0-460e-934b-18d3d510a0f5';
									var logged_in_header =	constant ({
																'Content-Type': 'application/json',
																'X-UUID': user_id
															})
															
															
									self
										.establish ('::matches-to-find', stateful ({
											key: '::user:' + user_id + '::matches-to-find',
											per: 'lump',
											request: R .applySpec ({
												path: constant (backend_path + '/match'),
												method: constant ('GET'),
												headers: logged_in_header
											}),
											value: R .compose (
													R .prop ('match_list'),
													R .prop ('result'),
													R .prop ('json')),
											fetch: mock ({
											    "result": {
											        "match_list": [{
											            "id": "1",
											            "start_at": "2017-05-26T11:30:00Z",
											            "end_at": "2017-05-26T13:00:00Z",
											            "home_team_average_age": "30",
											            "home_team_jersey_color": "blue",
											            "fee_per_team": "300",
											            "status": "VERIFIED",
											            "home_team_id": "1",
											            "applied_team_count": "0",
											            "tag_list": ["lol"],
											            "match_type": "11v11",
											            "home_team": {
											                "long_name": "kikashi",
											                "status": "VERIFIED",
											                "sportsmanship_rating": "100.00",
											                "division": "DIV_5"
											            },
											            "pitch": {
											                "name": "文東路公園",
											                "pitch_type": "人造草"
											            }
											        }, {
											            "id": "1",
											            "start_at": "2017-05-28T11:30:00Z",
											            "end_at": "2017-05-28T13:00:00Z",
											            "home_team_average_age": "36",
											            "home_team_jersey_color": "red",
											            "fee_per_team": "0",
											            "status": "VERIFIED",
											            "home_team_id": "1",
											            "applied_team_count": "0",
											            "tag_list": ["lol"],
											            "match_type": "7v7",
											            "home_team": {
											                "long_name": "tatsumaki",
											                "status": "VERIFIED",
											                "sportsmanship_rating": "100.00",
											                "division": "DIV_5"
											            },
											            "pitch": {
											                "name": "文東路公園",
											                "pitch_type": "人造草"
											            }
											        }, {
											            "id": "1",
											            "start_at": "2017-06-26T11:30:00Z",
											            "end_at": "2017-06-26T13:00:00Z",
											            "home_team_average_age": "36",
											            "home_team_jersey_color": "red",
											            "fee_per_team": "0",
											            "status": "VERIFIED",
											            "home_team_id": "1",
											            "applied_team_count": "0",
											            "tag_list": ["lol"],
											            "match_type": "11v11",
											            "home_team": {
											                "long_name": "tatsumaki",
											                "status": "VERIFIED",
											                "sportsmanship_rating": "100.00",
											                "division": "DIV_5"
											            },
											            "pitch": {
											                "name": "文東路公園",
											                "pitch_type": "人造草"
											            }
											        }] .concat (R .repeat ({
											            "id": "1",
											            "start_at": "2017-08-12T11:30:00Z",
											            "end_at": "2017-06-26T13:00:00Z",
											            "home_team_average_age": "36",
											            "home_team_jersey_color": "red",
											            "fee_per_team": "0",
											            "status": "VERIFIED",
											            "home_team_id": "1",
											            "applied_team_count": "0",
											            "tag_list": ["lol"],
											            "match_type": "5v5",
											            "home_team": {
											                "long_name": "fake team",
											                "status": "VERIFIED",
											                "sportsmanship_rating": "100.00",
											                "division": "DIV_5"
											            },
											            "pitch": {
											                "name": "文東路公園",
											                "pitch_type": "人造草"
											            }
											        }) (25)),
											        "last_item": {
											            "id": "1",
											            "start_at": "2017-05-26T11:30:00Z"
											        }
											    }
											})
										}))
										.remembers ('::match-to-find-info', function (match_id) {
											var label = '::match-to-find-info' + ':' + match_id;
											if (! self .personal (label))
												self .establish (label, stateful ({
													key: '::user:' + user_id + label,
													per: 'lump',
													request: R .applySpec ({
														path: constant (backend_path + '/match/' + match_id + '/preview'),
														method: constant ('GET'),
														headers: logged_in_header
													}),
													value: R .compose (
														R .prop ('match_preview'),
														R .prop ('result'),
														R .prop ('json')),
													fetch: mock ({
													    "result": {
													        "match_preview": {
													            "id": "1",
													            "start_at": "2017-05-26T11:30:00Z",
													            "end_at": "2017-05-26T13:00:00Z",
													            "home_team_average_age": "30",
													            "home_team_jersey_color": "pitch here",
													            "fee_per_team": "0",
													            "status": "VERIFIED",
													            "home_team_id": "1",
													            "applied_team_count": "0",
													            "tag_list": ["lol"],
													            "match_type": "11v11",
													            "home_team": {
													                "long_name": "kikashi",
													                "status": "VERIFIED",
													                "sportsmanship_rating": "100.00",
													                "division": "DIV_5"
													            },
													            "pitch": {
													                "name": "文東路公園",
													                "pitch_type": "人造草"
													            }
													        }
													    }
													})
												}))
											return label;
										})
										.establish ('::user', stateful ({
											key: '::user:' + user_id + '::user',
											per: 'lump',
											request: R .applySpec ({
												path: constant (backend_path + '/me'),
												method: constant ('GET'),
												headers: logged_in_header
											}),
											value: R .compose (
												R .prop ('user'),
												R .prop ('result'),
												R .prop ('json')),
											fetch: mock ({
											    "result": {
											        "user": {
											            "uuid": "e9de949f-22c0-460e-934b-18d3d510a0f5",
											            "status": "VERIFIED",
											            "name": "Jay Juang"
											        }
											    }
											})
										}))
										.establish ('::contact', stateful ({
											key: '::user:' + user_id + '::contact',
											per: 'none',
											request: R .applySpec ({
												path: constant (backend_path + '/me/contact'),
												method: constant ('POST'),
												headers: logged_in_header,
												body: stringify
											}),
											value: R .compose (
												R .prop ('json')),
											fetch: mock ({ result: 'ok' })
										}))
										.establish ('::team-open', stateful ({
											key: '::user:' + user_id + '::team-open',
											per: 'none',
											request: R .applySpec ({
												path: constant (backend_path + '/me/team'),
												method: constant ('POST'),
												headers: logged_in_header,
												body: stringify
											}),
											value: R .compose (
												R .prop ('result'),
												R .prop ('json')),
											fetch: mock ({ result: { error: 'fail'} })
										}))
										.remembers ('::match-open', function (team_id) {
											var label = '::match-open' + ':' + team_id;
											if (! self .personal (label))
												self .establish (label, stateful ({
													key: '::user:' + user_id + label,
													per: 'none',
													request: R .applySpec ({
														path: constant (backend_path + '/me/team/' + team_id + '/match'),
														method: constant ('POST'),
														headers: logged_in_header,
														body: stringify
													}),
													value: R .compose (
														R .prop ('result'),
														R .prop ('json')),
													fetch: mock ({ result: { error: 'fail'} })
												}))
											return label;
										})
										.remembers ('::match-apply', function (team_id, match_id) {
											var label = '::match-apply' + ':' + team_id + ':' + match_id;
											if (! self .personal (label))
												self .establish (label, stateful ({
													key: '::user:' + user_id + label,
													per: 'none',
													request: R .applySpec ({
														path: backend_path + '/me/team/' + team_id + '/match/' + match_id + '/request',
														method: constant ('POST'),
														headers: logged_in_header
													}),
													value: R .compose (
														R .prop ('result'),
														R .prop ('json')),
													fetch: mock ({ result: { error: 'fail'} })
												}))
											return label;
										})
										.remembers ('::match-applications', function (team_id, match_id) {
											var label = '::match-applications' + ':' + team_id + ':' + match_id;
											if (! self .personal (label))
												self .establish (label, stateful ({
													key: '::user:' + user_id + label,
													per: 'lump',
													request: R .applySpec ({
														path: constant (backend_path + '/me/team/' + team_id + '/match/' + match_id + '/match_request'),
														method: constant ('GET'),
														headers: logged_in_header
													}),
													value: R .compose (
														R .prop ('match_request_list'),
														R .prop ('result'),
														R .prop ('json')),
													fetch: mock ({ result: {"match_request_list":[]}})
												}))
											return label;
										})
										.establish ('::teams', stateful ({
											key: '::user:' + user_id + '::teams',
											per: 'lump',
											request: R .applySpec ({
												path: constant (backend_path + '/me/team'),
												method: constant ('GET'),
												headers: logged_in_header
											}),
											value: R .compose (
												R .prop ('team_list'),
												R .prop ('result'),
												R .prop ('json')),
											fetch: mock ({
												result: {
													"team_list": [{
												        "id": "1",
												        "short_name": null,
												        "long_name": "my team",
												        "description": null,
												        "status": "VERIFIED",
												        "image_url": null,
												        "average_age": "20",
												        "has_played_league": 0,
												        "team_statistic": {
												            "played_match": "0",
												            "won": "0",
												            "tied": "0",
												            "lost": "0",
												            "goal_for": "0",
												            "goal_against": "0",
												            "sportsmanship_rating": "100.00",
												            "division": "DIV_5"
												        },
												        "team_preference": {
												            "home_jersey_color": "XXX",
												            "away_jersey_color": null,
												            "day_of_week_list": ["1", "7"],
												            "match_type_list": ["9v9", "11v11"],
												            "pitch_type_list": ["仿真草", "真草"]
												        }
												    }]
											    }
											})
										}))
										.remembers ('::matches', function (team_id) {
											var label = '::matches' + ':' + team_id;
											if (! self .personal (label))
												self .establish (label, stateful ({
													key: '::user:' + user_id + label,
													per: 'lump',
													request: R .applySpec ({
														path: constant (backend_path + '/me/team/' + team_id + '/match'),
														method: constant ('GET'),
														headers: logged_in_header
													}),
													value: R .compose (
														R .prop ('match_list'),
														R .prop ('result'),
														R .prop ('json')),
													fetch: mock ({
														result: { 
															match_list: [{
															    "id": "1",
															    "start_at": "2017-06-26T11:30:00Z",
															    "end_at": "2017-06-26T13:00:00Z",
															    "reserved_day_for_trusted_team": "0",
															    "home_team_average_age": "30",
															    "away_team_average_age": "",
															    "home_team_jersey_color": "pitch here",
															    "away_team_jersey_color": null,
															    "fee_per_team": "0",
															    "status": "VERIFIED",
															    "home_team_score": "",
															    "away_team_score": "",
															    "home_team_sportsmanship": null,
															    "away_team_sportsmanship": null,
															    "is_pitch_proved": 0,
															    "home_team_id": "1",
															    "away_team_id": "",
															    "match_type": "11v11",
															    "home_team": {
															        "long_name": "kikashi",
															        "status": "VERIFIED",
															        "image_url": null,
															        "division": "DIV_5",
															        "sportsmanship_rating": "100.00"
															    },
															    "away_team": {
															        "long_name": null,
															        "status": null,
															        "image_url": null,
															        "division": null,
															        "sportsmanship_rating": null
															    },
															    "applied_team_count": "0",
															    "tag_list": ["lol"],
															    "pitch": {
															        "name": "文東路公園",
															        "pitch_type": "人造草"
															    }
															}]
														}
													})
												}))
											return label;
										})
										.remembers ('::matches-applied', function (team_id) {
											var label = '::matches-applied' + ':' + team_id;
											if (! self .personal (label))
												self .establish (label, stateful ({
													key: '::user:' + user_id + label,
													per: 'lump',
													request: R .applySpec ({
														path: constant (backend_path + '/me/team/' + team_id + '/requesting_match'),
														method: constant ('GET'),
														headers: logged_in_header
													}),
													value: R .compose (
														R .prop ('requesting_match_list'),
														R .prop ('result'),
														R .prop ('json')) ,
													fetch: mock ({
														result: {"requesting_match_list":[]}
													})
												}))
											return label;
										})
								});
var paper_api =	paper (function (self, args, my) {
					self
						.remembers ('::api', paper_mock_loggined_in ())
						.impressions ('::api')
							.thru (tap, function (to_be_api) {
								//debugger;
								self .thru (
									resettle, to_be_api)
							})
				});
			
var api = paper_api () .realize ();
			
			
var num_of_players_to_num =	function (text) {
					        	if (text === '5v5') return 5;
					        	if (text === '7v7') return 7;
					        	if (text === '9v9') return 9;
					        	if (text === '11v11') return 11;
							}
					        
var num_of_players_to_text =	function (num) {
						        	return num + 'v' + num 
						        }
var day_of_week_to_chi =	function (date_time) {
								return	(function (day) {
											if (day === '0') return '日'
											if (day === '1') return '一'
											if (day === '2') return '二'
											if (day === '3') return '三'
											if (day === '4') return '四'
											if (day === '5') return '五'
											if (day === '6') return '六'
										}) (fecha .format (date_time, 'd'))
							}
var date_to_chi =	function (date_time) {
						return fecha .format (date_time, 'YYYY年M月D日')
					}
var date_from_chi =	function (str) {
						return fecha .parse (str, 'YYYY年M月D日')
					}
var times =	function (start_date_time, end_date_time) {
					return fecha .format (start_date_time, 'h:mmA') + ' - ' + fecha .format (end_date_time, 'h:mmA')
				}
var location_from_api =	function (str) {
							return '摩士十號場'//str .split (',') .reverse () [0]
						}
var region_from_api =	function (str) {
							return '九龍'//str .split (',') .reverse () [1]
						}
var pitch_type_to_chi =	function (enum_) {
				        	if (enum_ === 'HARD_SURFACE') return '石地場'
				        	if (enum_ === 'GRASS_CARPET') return '人造草地場'
				        	if (enum_ === 'ARTIFICIAL_TURF') return '仿真草地場'
				        	if (enum_ === 'REAL_GRASS') return '草地場'
				        }
var field_type_to_chi =	function (enum_) {
				        	if (enum_ === 'HARD_SURFACE') return '硬地'
				        	if (enum_ === 'GRASS_CARPET') return '人造草'
				        	if (enum_ === 'ARTIFICIAL_TURF') return '仿真草'
				        	if (enum_ === 'REAL_GRASS') return '真草'
				        }
var fee_to_chi =	function (fee) {
						return (+ fee) ? 'HKD $' + fee : '免費'
					}
						        
						        

var win_rate =	function (won, played) {
					return (+ won * 100 / (+ played || 1)) .toFixed (0)
				}
var is_league = function (league) {
					return league ? '是' : '否'
				}





	
	
var treat_as_UTC =	function (date) {
					    var result = new Date (date);
					    result .setMinutes (result .getMinutes () - result .getTimezoneOffset ());
					    return result;
					}

var day_difference =	function (start, end) {
						    var milliseconds_per_day = 24 * 60 * 60 * 1000;
						    return (treat_as_UTC (end) - treat_as_UTC (start)) / milliseconds_per_day;
						}