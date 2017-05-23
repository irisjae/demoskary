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

var frontend_path = window .location .protocol + '//forster-mumenrider.c9users.io';
var backend_path = window .location .protocol + '//forster-mumenrider.c9users.io:8081';	

var home_path = '#match/catalog';

var paper_logged_out =	paper (function (self, args, my) {
							self
								.establish ('::login', stateful ({
									key: '::login',
									per: 'none',
									request: R .applySpec ({
												path: constant (backend_path + '/oauth/sign_in'),
												method: constant ('POST'),
												headers: constant ({ 'Content-Type': 'application/json'}),
												body: stringify
											}),
									value: R .compose (
											R .prop ('result'),
											R .prop ('json'))
								}))
						});
var paper_loggined_in =	paper (function (self, args, my) {
							var user_id = args .login .user .uuid;
							var logged_in_header =	function () {
														return { 'Content-Type': 'application/json', 'X-UUID': args .login .user .uuid };
													};
													
													
							self
								.establish ('::test-user', stateful ({
									key: '::user:' + user_id + '::test-user',
									per: 'none',
									request: R .applySpec ({
										path: constant (backend_path + '/admin/test_create_user'),
										method: constant ('POST'),
										headers: constant ({ 'Content-Type': 'application/json', 'x-admin-uuid': '68ecd6d1-312e-4388-bee2-c3d81a8895e7' }),
										body: R .compose (
												stringify,
												constant ({ userName: 'tester' }))
									}),
									value: R .compose (
										R .prop ('user'),
										R .prop ('result'),
										R .prop ('json'))
								}))
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
											R .prop ('json'))
								}))
								.remembers ('::match-to-find-info', function (match_id) {
									var label = '::match-to-find-info' + ':' + match_id;
									if (! self .personal (label))
										self .establish (label, stateful ({
											key: '::user:' + user_id + label,
											per: 'lump',
											request: R .applySpec ({
												path: constant (backend_path + '/match/' + match_id + '/pre_match_info'),
												method: constant ('GET'),
												headers: logged_in_header
											}),
											value: R .compose (
												R .prop ('pre_match_info'),
												R .prop ('result'),
												R .prop ('json'))
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
										R .prop ('json'))
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
										R .prop ('json'))
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
										R .prop ('json'))
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
												R .prop ('json'))
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
												R .prop ('json'))
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
												R .prop ('json'))
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
										R .prop ('json'))
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
												R .prop ('json'))
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
												R .prop ('json')) 
										}))
									return label;
								})
						});
var paper_api =	paper (function (self, args, my) {
					self
						.remembers ('::api', paper_logged_out ())
						.impressions ('::api')
							.thru (tap, function (to_be_api) {
								//debugger;
								self .thru (
									resettle, to_be_api)
							})
						
					self
						.remembers ('::api:login')
						.impressions ('::api:login')
							.thru (tap, function (mention) {
								self .mention ('::api', paper_loggined_in ({ login: mention }))
							});
					self
						.remembers ('::api:logout')
						.impressions ('::api:logout')
							.thru (tap, function () {
								self .mention ('::api', paper_logged_out ());
								self .impressions ('::login') .caching (undefined);
								//debugger;
							});
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
							return str .split (',') .reverse () [0]
						}
var region_from_api =	function (str) {
							return str .split (',') .reverse () [1]
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