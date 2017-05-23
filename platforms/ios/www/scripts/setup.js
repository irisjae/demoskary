Promise .config ({
    warnings: {
        wForgottenReturn: false
    }
});

/*
Use app
*/
document .addEventListener ('deviceready', function () {
	api .impressions ('::login') .init
		.then (function (_state) {
			if (_state && _state .value) {
				api .mention ('::api:login', _state .value .item);
			}
		})
		.then (function () {
			riot .mount ('*');
		})
});
/*
Use flatpickr
*/
Flatpickr .localize (Flatpickr .l10ns .hk);
/*
Register Open FB
*/
openFB .init (
	{
		appId: 825433247584933,
		cordova: true,
		oauthRedirectURL: frontend_path + '/fb/login.html',
		cordovaOAuthRedirectURL: frontend_path + '/fb/login.html',
		logoutRedirectURL: frontend_path
	}
);
/*
Register OneSignal
*/
/*document .addEventListener ('deviceready', function () {
	// Enable to debug issues.
	// window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
	
	var notificationOpenedCallback =	function (jsonData) {
											alert ('didReceiveRemoteNotificationCallBack: ' + JSON .stringify (jsonData));
										};
	
	window .plugins .OneSignal .init ("bc053930-f661-4267-8ef9-dbb378eb58b9",{
		googleProjectNumber: "972661889806"
	}, notificationOpenedCallback);
	
	// Show an alert box if a notification comes in when the user is in your app.
	window .plugins .OneSignal .enableInAppAlertNotification (true);
}, false);*/