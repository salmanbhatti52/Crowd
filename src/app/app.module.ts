import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { CancelReservationPageModule } from "./cancel-reservation/cancel-reservation.module";
import { PaymentmethodPageModule } from "./paymentmethod/paymentmethod.module";
import { FilterPageModule } from "./filter/filter.module";
import { CancelbookPageModule } from "./cancelbook/cancelbook.module";
import { SearchComponentComponent } from "./search-component/search-component.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { OneSignal } from "@awesome-cordova-plugins/onesignal/ngx";
import { Geolocation } from "@awesome-cordova-plugins/geolocation/ngx";

import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@awesome-cordova-plugins/native-geocoder/ngx";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { PininfoPageModule } from "./pininfo/pininfo.module";
// import { LottieSplashScreen } from "@awesome-cordova-plugins/lottie-splash-screen/ngx";

import { SignInWithApple } from "@awesome-cordova-plugins/sign-in-with-apple/ngx";
import { BeseenPageModule } from "./beseen/beseen.module";
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { NgScrollCalendarModule } from "ng-scroll-calendar";

import { DatePicker } from "@ionic-native/date-picker/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
// import { CustomCalendarComponent } from './custom-calendar/custom-calendar.component';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
// import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator/ngx';
// type PDFGenerator = typeof PDFGenerator;
@NgModule({
  declarations: [AppComponent,SearchComponentComponent,],
  imports: [      
    FormsModule,   
    MbscModule, 
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    PininfoPageModule,
    BeseenPageModule,
    NgScrollCalendarModule,
    CancelbookPageModule,
    FilterPageModule,
    PaymentmethodPageModule,
    CancelReservationPageModule,
  ],
  providers: [
    Camera,
    SignInWithApple,
    OneSignal,
    DatePicker,
    FileOpener,
    // BarcodeScanner,
    // Geolocation,
    // LottieSplashScreen,
    InAppBrowser,
    // PDFGenerator,
    NativeGeocoder,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
