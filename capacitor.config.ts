import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.microwd.app",
  appName: "Crowd",
  webDir: "www",
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId:
        "219864729095-so7dl4l5k2m0he7jjubdr559ia140g6m.apps.googleusercontent.com",
      iosClientId:
        "219864729095-so7dl4l5k2m0he7jjubdr559ia140g6m.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
