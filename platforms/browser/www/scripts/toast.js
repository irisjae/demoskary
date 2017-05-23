var _toast_type = (cordova .platformId === 'browser') ? 'browser' : 'cordova';

var _toast_last = Promise .resolve ();
var toast = function (text) {
				_toast_last =	_toast_last
									.then (_toast_type === 'browser' &&  function () {
										var root = document .createElement ('component-snackbar');
										root .textContent = text;
										var component = riot .mount (root, 'component-snackbar') [0];
										document .body .insertBefore (root, null);
										return	wait (100)
													.then (function () {
														root .setAttribute ('active', 'active');
													})
													.then (function () {
														return wait (1000)
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
										return	new Promise (function (resolve) {
													window.plugins.toast.showWithOptions({
														message: text,
														duration: 1000,
														position: 'bottom',
													},
													function (result) {
														if (result && result.event) {
															if (result.event === 'hide') {
																resolve ();
															}
														}
													},
													function (error) {
														document .body ._tag .impressions (':exception') ({
															source: 'toast',
															data: error
														});
													});
												})
													.then (function () {
														return wait (500)
													})
									})
			}