import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.microwd.app",
  appName: "MiCrowd",
  webDir: "www",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      backgroundColor: "#A8B400",
      launchAutoHide: false,
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    },
  },
};

export default config;
