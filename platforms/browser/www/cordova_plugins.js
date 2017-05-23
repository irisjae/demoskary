cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/browser/notification.js",
        "id": "cordova-plugin-dialogs.notification_browser",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-spinner-dialog/www/spinner.js",
        "id": "cordova-plugin-spinner-dialog.SpinnerDialog",
        "pluginId": "cordova-plugin-spinner-dialog",
        "merges": [
            "window.plugins.spinnerDialog"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
        "id": "cordova-plugin-x-toast.Toast",
        "pluginId": "cordova-plugin-x-toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-toast/test/tests.js",
        "id": "cordova-plugin-x-toast.tests",
        "pluginId": "cordova-plugin-x-toast"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-crosswalk-webview": "2.3.0",
    "cordova-plugin-dialogs": "1.3.1",
    "cordova-plugin-spinner-dialog": "1.3.1",
    "cordova-plugin-whitelist": "1.3.1",
    "cordova-plugin-x-toast": "2.6.0"
}
// BOTTOM OF METADATA
});