import { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: "com.microwd.app",
  appName: "Crowd",
  webDir: "www",
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,
      style: KeyboardStyle.Default,
      // resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      // ios ids
      serverClientId:
        "219864729095-351aj206lltjpl9t7n9a4reffekde9gi.apps.googleusercontent.com",
      iosClientId:
        "219864729095-so7dl4l5k2m0he7jjubdr559ia140g6m.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
   
  },
};

export default config;

// capacitor.config.json
// {
//   "plugins": {
//     "GoogleAuth": {
//       "scopes": ["profile", "email"],
//       "serverClientId": "219864729095-351aj206lltjpl9t7n9a4reffekde9gi.apps.googleusercontent.com",
//       "androidClientId": "219864729095-0i20ii885j04fs7n6antpvnqdm2gtk4j.apps.googleusercontent.com",
//       
//       "serverClientId": "219864729095-351aj206lltjpl9t7n9a4reffekde9gi.apps.googleusercontent.com",
//       "iosClientId": "219864729095-so7dl4l5k2m0he7jjubdr559ia140g6m.apps.googleusercontent.com",
//       "forceCodeForRefreshToken": true
//     },
//     "SplashScreen": {
//       "launchShowDuration": 0,
//       "launchAutoHide": true
//     }
//   }
// }