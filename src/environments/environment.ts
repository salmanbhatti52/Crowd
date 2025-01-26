// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  stripe:{
    publishableKey: "pk_test_51MQ37qDFPlDlGxkdw91wUybcouQFM0EOUev6HlGRi86QjYCu3tITcy1KzcDJGrSncQ8G2rHYxPmiDAm4Y027ff6g00Es0yT7y1",
    secretKey:"sk_test_51MQ37qDFPlDlGxkdlXFzM1TSkhofxqUNM7UqGA9JgEkEIZPAmr172nVMGtsKRV0p7Iwz6rbByj5m2JlsWpfGNzD200gSyX7zYL"
  },
  mapboxgl: {
    accessToken: 'pk.eyJ1IjoiY3Jvd2RhcHAiLCJhIjoiY20zcjkxOTE0MDNneTJrc2FkaWtrMHNuYSJ9.Xqwl58YnNlk5HwP6UH4cfQ'
  }
  // api: 'https://192.168.1.3:3000/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
