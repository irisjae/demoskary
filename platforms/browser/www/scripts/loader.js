var _loader_type = (cordova .platformId === 'browser') ? 'browser' : 'cordova';

var _loader_next = noop;
var _loader_prev = Promise .resolve ();
var loader =    function (text, loading) {
                    loading = loading || stream ();
    
                    var declare = _loader_next;
                    _loader_next = function () { loading .end (true) };
                    _loader_prev =  _loader_prev
                                        .then ((_loader_type === 'browser' &&  function () {
                        					var root = document .createElement ('component-loader');
                        					root .textContent = text;
                        					var component = riot .mount (root, 'component-loader') [0];
                        					document .body .insertBefore (root, null);
                        					return	wait (100)
                        								.then (function () {
                        									root .setAttribute ('active', 'active');
                        								})
                        								.then (function () {
                        									return Promise .all ([wait (800), promise (loading .end)])
                        								})
                        								.then (function () {
                        									root .removeAttribute ('active');
                        								})
                        								.then (function () {
                        									return wait (500)
                        								})
                        								.then (function () {
                        									component .unmount ();
                        								})
                        				}
                        				|| function () {
                                            window .plugins .spinnerDialog .show (null, text || null, true);
                        					return	promise (loading .end)
                        					            .then (function () {
                                                            window .plugins .spinnerDialog .hide();
                        					            })
                        				}))
                    declare (_loader_prev)    
    			}