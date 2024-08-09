import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements as ionicDefineCustomElements } from '@ionic/pwa-elements/loader';
import { defineCustomElements as stripeDefineCustomElements } from 'stripe-pwa-elements/loader';



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
.then(() => {
  // Use the functions with the appropriate namespace
  stripeDefineCustomElements(window);
})
  .catch(err => console.log(err));

  // Call the element loader after the platform has been bootstrapped
  ionicDefineCustomElements(window);

