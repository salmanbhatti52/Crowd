import { PaymentsuccessPage } from "./../paymentsuccess/paymentsuccess.page";
import { ModalController, Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { ApplePayEventsEnum, GooglePayEventsEnum, PaymentFlowEventsEnum, PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from '@angular/common/http';
import { first, lastValueFrom } from 'rxjs';
@Component({
  selector: "app-paymentmethod",
  templateUrl: "./paymentmethod.page.html",
  styleUrls: ["./paymentmethod.page.scss"],
})
export class PaymentmethodPage implements OnInit {
  data:any = {
    name: 'Ali',
    email: 'ali@gmail.com',
    amount: 100,
    currency: 'USD'
  };
  userdata: any = "";
  visitorArr: any = "";
  selectedVenue: any = "";
  android = false;
  ios = false;
  // paymentRequest!: google.payments.api.PaymentDataRequest;
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public platform: Platform,
    public http:HttpClient,
    
  ) {
    Stripe.initialize({
      publishableKey: environment.stripe.publishableKey,
    });
    this.android = platform.is("android");
    this.ios = platform.is("ios");
  }

  httpPost(body:any){
    return this.http.post<any>(environment.api + 'payment-sheet', body).pipe(first());
  }

  async paymentSheet() {
    try {
      // be able to get event of PaymentSheet
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
        console.log('PaymentSheetEventsEnum.Completed');
      });
      
      // const data = new HttpParams({
      //   fromObject: this.data,
      // })

      // Connect to your backend endpoint, and get every key.
      const data$ = this.httpPost(this.data);
      
      const {paymentIntent, ephemeralKey, customer} = await lastValueFrom(data$);

      console.log("PaymentIntent: ",paymentIntent);
      
      // prepare PaymentSheet with CreatePaymentSheetOption.
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: 'MI Crowd'
      });

      console.log("createPaymentSheet");
      
      // present PaymentSheet and get result.
      const result = await Stripe.presentPaymentSheet();
      console.log('Result: ',result);
      
      if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
        this.splitAndJoin(paymentIntent);
        console.log("paymentIntent",paymentIntent);
        
        // Happy path
      }
        
    } catch (error) {
      console.log("Error catched: ",error);
      
    }
    

  }

  async paymentFlow(){
    try {
      // be able to get event of PaymentFlow
      Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
        console.log('PaymentFlowEventsEnum.Completed');
      });
      
      // const data = new HttpParams({
      //   fromObject: this.data,
      // })

      // Connect to your backend endpoint, and get every key.
      // const data$ = this.http.post<{
      //   paymentIntent: string;
      //   ephemeralKey: string;
      //   customer: string;
      // }>(environment.api + 'payment-sheet', data).pipe(first());
      const data$ = this.httpPost(this.data);
      
      const {paymentIntent, ephemeralKey, customer} = await lastValueFrom(data$);

      console.log("PaymentIntent: ",paymentIntent);

      // Prepare PaymentFlow with CreatePaymentFlowOption.
      await  Stripe.createPaymentFlow({
        paymentIntentClientSecret: paymentIntent,
        // setupIntentClientSecret: setupIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        merchantDisplayName: 'Mi Crowd'
      });

      // Present PaymentFlow. **Not completed yet.**
      const presentResult = await Stripe.presentPaymentFlow();
      console.log("presentResult: ",presentResult);
      
      // Confirm PaymentFlow. Completed.
      const confirmResult = await Stripe.confirmPaymentFlow();
      console.log("confirmResult: ",confirmResult);
      if (confirmResult.paymentResult === PaymentFlowEventsEnum.Completed) {
        this.splitAndJoin(paymentIntent);
        // Happy path
      }
    } catch (error) {
      console.log("Error catched: ",error);
    }
  }

  async applePay(){
    try {
      // Check to be able to use Apple Pay on device
      const isAvailable = Stripe.isApplePayAvailable().catch(() => undefined);
      if (isAvailable === undefined) {
        // disable to use Google Pay
        return;
      }

      // be able to get event of Apple Pay
      Stripe.addListener(ApplePayEventsEnum.Completed, () => {
        console.log('ApplePayEventsEnum.Completed');
      });

      // const data = new HttpParams({
      //   fromObject: this.data,
      // })

      // Connect to your backend endpoint, and get paymentIntent.
      // const data$ = this.http.post<{
      //   paymentIntent: string;
      // }>(environment.api + 'payment-sheet', data).pipe(first());
      const data$ = this.httpPost(this.data);

      
      const {paymentIntent} = await lastValueFrom(data$);

      console.log("PaymentIntent: ",paymentIntent);

      // Prepare Apple Pay
      await Stripe.createApplePay({
        paymentIntentClientSecret: paymentIntent,
        paymentSummaryItems: [{
          label: 'Marriage Event',
          amount: 1099.00
        }],
        merchantIdentifier: 'rdlabo',
        countryCode: 'US',
        currency: 'USD',
      });

      // Present Apple Pay
      const result = await Stripe.presentApplePay();
      console.log("Result: ",result);
      
      if (result.paymentResult === ApplePayEventsEnum.Completed) {
        this.splitAndJoin(paymentIntent);
        // Happy path
      }
    } catch (error) {
      console.log("Error catched: ",error);

    }
  }

  async googlePay(){
    try {
      // Check to be able to use Google Pay on device
      const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
      if (isAvailable === undefined) {
        // disable to use Google Pay
        return;
      }
      
      Stripe.addListener(GooglePayEventsEnum.Completed, () => {
        console.log('GooglePayEventsEnum.Completed');
      });
      
      // const data = new HttpParams({
      //   fromObject: this.data,
      // })

      // Connect to your backend endpoint, and get every key.
      // const data$ = this.http.post<{
      //   paymentIntent: string;
      // }>(environment.api + 'payment-sheet', data).pipe(first());
      const data$ = this.httpPost(this.data);

      const {paymentIntent} = await lastValueFrom(data$);
      console.log("PaymentIntent: ",paymentIntent);

      // Prepare Google Pay
      await Stripe.createGooglePay({
        paymentIntentClientSecret: paymentIntent,

        // Web only. Google Pay on Android App doesn't need
        paymentSummaryItems: [{
          label: 'Marriage Event ',
          amount: 1099.00
        }],
        merchantIdentifier: 'merchant.com.getcapacitor.stripe',
        countryCode: 'US',
        currency: 'USD',
      });

      // Present Google Pay
      const result = await Stripe.presentGooglePay();
      console.log("Result: ",result);
      
      if (result.paymentResult === GooglePayEventsEnum.Completed) {
        this.splitAndJoin(paymentIntent);
        // Happy path
      }
    } catch (error) {
      
    }
  }

  splitAndJoin(paymentIntent:any){
    const result = paymentIntent.split('_').slice(0,2).join('_');
    console.log("Result: ",result);
    return result;
    
  }

  ionViewWillEnter() {
    this.selectedVenue = this.rest.detail;
    
  }

  ngOnInit() {
    // this.paymentRequest = {
    //   apiVersion: 2,
    //   apiVersionMinor: 0,
    //   allowedPaymentMethods: [
    //     {
    //       type: 'CARD',
    //       parameters: {
    //         allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    //         allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
    //       },
    //       tokenizationSpecification: {
    //         type: 'PAYMENT_GATEWAY',
    //         parameters: {
    //           gateway: 'example',
    //           gatewayMerchantId: 'exampleGatewayMerchantId'
    //         }
    //       }
    //     }
    //   ],
    //   merchantInfo: {
    //     merchantId: '12345678901234567890',
    //     merchantName: 'Demo Merchant (You will not be charged)'
    //   },
    //   transactionInfo: {
    //     totalPriceStatus: 'FINAL',
    //     totalPriceLabel: 'Total',
    //     totalPrice: this.item.price.toFixed(2),
    //     currencyCode: 'USD',
    //     countryCode: 'US'
    //   }
    // }
  }

  // async onLoadPaymentData(event:Event){
  //   const paymentData = (event as CustomEvent<google.payments.api.PaymentData>).detail;
  //   // await this.storeService.processOrder(
  //   //   [
  //   //     {
  //   //       item: this.item,
  //   //       quantity: this.quantity,
  //   //       size: this.size,
  //   //     },
  //   //   ],
  //   //   paymentData,
  //   // );

  //   console.log("paymentData: ",paymentData);
    

  // }

  goBack() {
    this.location.back();
  }

  handleImgError2(ev: any, item: any) {
    console.log("hloooooo");

    const source = ev.srcElement;
    const imgSrc = `assets/imgs/inplace.jpeg`;
    source.src = imgSrc;
  }

  async paynow() {
    console.log("model");
    const modal = await this.modalCtrl.create({
      component: PaymentsuccessPage,
      cssClass: "riz",
    });

    await modal.present();
    this.router.navigate(['/ticket']);
  }

  buyTicket() {
    console.log("buy");
  }

  goToNext() {
    this.router.navigate(["paymentmethod"]);
  }
  addcard() {
    this.router.navigate(["addcard"]);
  }

  // ========================Google Pay===================

  //==========================done=========================
}
