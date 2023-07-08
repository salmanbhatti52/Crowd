
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-geolocation.Coordinates",
          "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
          "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
          "Coordinates"
        ]
        },
      {
          "id": "cordova-plugin-inappbrowser.inappbrowser",
          "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
          "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
          "cordova.InAppBrowser.open"
        ]
        },
      {
          "id": "cordova-plugin-file-opener2.FileOpener2",
          "file": "plugins/cordova-plugin-file-opener2/www/plugins.FileOpener2.js",
          "pluginId": "cordova-plugin-file-opener2",
        "clobbers": [
          "cordova.plugins.fileOpener2"
        ]
        },
      {
          "id": "cordova-plugin-sign-in-with-apple.SignInWithApple",
          "file": "plugins/cordova-plugin-sign-in-with-apple/www/sign-in-with-apple.js",
          "pluginId": "cordova-plugin-sign-in-with-apple",
        "clobbers": [
          "cordova.plugins.SignInWithApple"
        ]
        },
      {
          "id": "cordova-plugin-nativegeocoder.NativeGeocoder",
          "file": "plugins/cordova-plugin-nativegeocoder/www/NativeGeocoder.js",
          "pluginId": "cordova-plugin-nativegeocoder",
        "clobbers": [
          "nativegeocoder"
        ]
        },
      {
          "id": "cordova-plugin-geolocation.geolocation",
          "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
          "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
          "navigator.geolocation"
        ]
        },
      {
          "id": "onesignal-cordova-plugin.OneSignalPlugin",
          "file": "plugins/onesignal-cordova-plugin/dist/index.js",
          "pluginId": "onesignal-cordova-plugin",
        "clobbers": [
          "OneSignal"
        ]
        },
      {
          "id": "cordova-plugin-geolocation.Position",
          "file": "plugins/cordova-plugin-geolocation/www/Position.js",
          "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
          "Position"
        ]
        },
      {
          "id": "cordova-plugin-geolocation.PositionError",
          "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
          "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
          "PositionError"
        ]
        },
      {
          "id": "onesignal-cordova-plugin.NotificationReceivedEvent",
          "file": "plugins/onesignal-cordova-plugin/dist/NotificationReceivedEvent.js",
          "pluginId": "onesignal-cordova-plugin"
        },
      {
          "id": "onesignal-cordova-plugin.Subscription",
          "file": "plugins/onesignal-cordova-plugin/dist/Subscription.js",
          "pluginId": "onesignal-cordova-plugin"
        },
      {
          "id": "onesignal-cordova-plugin.OSNotification",
          "file": "plugins/onesignal-cordova-plugin/dist/OSNotification.js",
          "pluginId": "onesignal-cordova-plugin"
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-file-opener2": "4.0.0",
      "cordova-plugin-geolocation": "4.1.0",
      "cordova-plugin-inappbrowser": "5.0.0",
      "cordova-plugin-nativegeocoder": "3.4.1",
      "cordova-plugin-sign-in-with-apple": "0.1.2",
      "onesignal-cordova-plugin": "3.2.0"
    };
    // BOTTOM OF METADATA
    });
    