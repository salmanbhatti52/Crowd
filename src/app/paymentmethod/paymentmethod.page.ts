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
  // data:any = {
  //   name: 'Ali',
  //   email: 'ali@gmail.com',
  //   amount: 100,
  //   currency: 'USD'
  // };
  userdata: any = "";
  visitorArr: any = "";
  selectedVenue: any = "";
  android = false;
  ios = false;
  paymentMethods:any;
  paymentMethodApplePay = false;
  paymentMethodGooglePay = false;
  paymentMethodStripe = false;
  userId: any;
  customerId: any;
  ephemeralKey: any;
  paymentIntent: any;
  userName: any;
  userEmail: any;
  txnsId: any;
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
      // publishableKey: environment.stripe.publishableKey,
      publishableKey:"pk_test_51NLjiSCq21ty1Wx6S2nBXtuBtmDqGwwAbCPA4rt1oXxlr9sTRamGNjF5KpTZfrWbDsVwPDhqaNwAJDOA9pKz80cF00IgQ0c5Yn",
    });
    this.android = platform.is("android");
    this.ios = platform.is("ios");
    let data = {
      users_business_id: this.rest.billDetails.user_business_id
    }
    this.rest.presentLoader();
    this.rest.sendRequest('get_business_payment_gateway',data).subscribe((res:any)=>{
      console.log("get_payment_method resss", res);
      if(res.status == 'success'){
        this.paymentMethods = res.data;
        for(let i=0; i<this.paymentMethods.length; i++){
          if(this.paymentMethods[i].name == 'Stripe' && this.paymentMethods[i].status == 'Active'){
            this.paymentMethodStripe = true;
          }else if(this.paymentMethods[i].name == 'Google Pay' && this.paymentMethods[i].status == 'Active'){
            this.paymentMethodGooglePay = true;
          }else if(this.paymentMethods[i].name == 'Apple Pay' && this.paymentMethods[i].status == 'Active'){
            this.paymentMethodApplePay = true;
          }
        }
      }
      this.rest.dismissLoader();
    })


  }


  httpPost(){
    // let amount = String(this.rest.billDetails.total_bill * 100)
    console.log("Amount before multiply by 100: ", this.rest.billDetails.total_bill);
    let amount = this.rest.billDetails.total_bill * 100
    console.log("Amount after multiply by 100: ", amount);
    
    let data = {
      name:this.userName,
      email:this.userEmail,
      amount:amount,
      currency:"USD"
    }
    this.rest.sendRequest('payment_sheet',data).subscribe((res:any)=>{
      console.log("Ress: ",res);
      this.customerId = res.customer;
      this.ephemeralKey = res.ephemeralkey?.id;
      this.paymentIntent = res.paymentintent?.client_secret;
      console.log("customerId: ",this.customerId);
      console.log("ephemeralKey: ",this.ephemeralKey);
      console.log("paymentIntent: ",this.paymentIntent);
      
    })
  }

  payCash(paymentType:any){
    let data = {
      events_id:this.rest.billDetails.event_id,
      user_id:this.userId,
      user_business_id:this.rest.billDetails.user_business_id,
      number_of_ticket:this.rest.billDetails.ticket_requested,
      package_name:this.rest.billDetails.package_name,
      package_type:this.rest.billDetails.package_type,
      price_per_ticket:this.rest.billDetails.price_per_ticket,
      total_amount:this.rest.billDetails.total_bill,
      transiction_id:this.txnsId,
      transiction_status:"Paid",
      payment_type:paymentType
    }
    console.log('pay with cash dataaa: ',data);
    this.rest.presentLoader();
    this.rest.sendRequest('event_bookings',data).subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Resssss: ",res);
      if(res.status == 'success'){
        this.rest.ticketToken = res.data.random_string;
        this.rest.presentToast('Success');
        this.paynow();
      }
      
    }
    // ,(err)=>{
    //   this.rest.dismissLoader();
    //   console.log("Errr: ",err );
      
    // }
    )
    
  }

  async paymentSheet() {
    try {
      this.paymentIntent = undefined;
      this.customerId = undefined;
      this.ephemeralKey = undefined;
      // be able to get event of PaymentSheet
      this.rest.presentLoader()
      this.httpPost();
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
        console.log('PaymentSheetEventsEnum.Completed');
      });
      
      // Connect to your backend endpoint, and get every key.

      setTimeout(async () => {
        console.log("If PaymentIntent: ",this.paymentIntent);
        // prepare PaymentSheet with CreatePaymentSheetOption.
        await Stripe.createPaymentSheet({
          enableGooglePay:true,
          enableApplePay:true,
          paymentIntentClientSecret: this.paymentIntent,
          customerId: this.customerId,
          customerEphemeralKeySecret: this.ephemeralKey,
          merchantDisplayName: 'Crowd'
        });
        this.rest.dismissLoader();
        console.log("createPaymentSheet");
      }, 3000);
      
      setTimeout(async () => {
        // present PaymentSheet and get result.
        const result = await Stripe.presentPaymentSheet();
        console.log('Result: ',result);
        
        if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
          this.splitAndJoin(this.paymentIntent);
          console.log("paymentIntent",this.paymentIntent);
          this.payCash('Stripe');
          // Happy path
        }
      }, 3000);
      
      
        
    } catch (error) {
      console.log("Error catched: ",error);
      
    }
    

  }

  async paymentFlow(){
    try {
      this.paymentIntent = undefined;
      this.customerId = undefined;
      this.ephemeralKey = undefined;
      this.rest.presentLoader();
      this.httpPost();
      // be able to get event of PaymentFlow
      Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
        console.log('PaymentFlowEventsEnum.Completed');
      });

      setTimeout(async () => {
        console.log("If PaymentIntent: ",this.paymentIntent);

        // Prepare PaymentFlow with CreatePaymentFlowOption.
        await  Stripe.createPaymentFlow({
          paymentIntentClientSecret: this.paymentIntent,
          // setupIntentClientSecret: setupIntent,
          customerEphemeralKeySecret: this.ephemeralKey,
          customerId: this.customerId,
          merchantDisplayName: 'Mi Crowd'
        });
        this.rest.dismissLoader();

        // Present PaymentFlow. **Not completed yet.**
        const presentResult = await Stripe.presentPaymentFlow();
        console.log("presentResult: ",presentResult);
        
        // Confirm PaymentFlow. Completed.
        const confirmResult = await Stripe.confirmPaymentFlow();
        console.log("confirmResult: ",confirmResult);
        if (confirmResult.paymentResult === PaymentFlowEventsEnum.Completed) {
          this.splitAndJoin(this.paymentIntent);
          // Happy path
        }
      }, 3000);
      
    } catch (error) {
      console.log("Error catched: ",error);
    }
  }

  async applePay(){
    try {
      this.paymentIntent = undefined;
      this.customerId = undefined;
      this.ephemeralKey = undefined;
      this.rest.presentLoader();
      this.httpPost();
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

      setTimeout(async () => {
        console.log("If PaymentIntent: ",this.paymentIntent);

        // Prepare Apple Pay
        await Stripe.createApplePay({
          paymentIntentClientSecret: this.paymentIntent,
          paymentSummaryItems: [{
            label: 'Marriage Event',
            amount: 1099.00
          }],
          merchantIdentifier: 'rdlabo',
          countryCode: 'US',
          currency: 'USD',
        });
        this.rest.dismissLoader();

        // Present Apple Pay
        const result = await Stripe.presentApplePay();
        console.log("Result: ",result);
        
        if (result.paymentResult === ApplePayEventsEnum.Completed) {
          this.splitAndJoin(this.paymentIntent);
          // Happy path
        }
      }, 3000);
      
    } catch (error) {
      console.log("Error catched: ",error);

    }
  }

  async googlePay(){
    try {
      this.paymentIntent = undefined;
      this.customerId = undefined;
      this.ephemeralKey = undefined;
      this.rest.presentLoader();
      this.httpPost();
      // Check to be able to use Google Pay on device
      const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
      if (isAvailable === undefined) {
        // disable to use Google Pay
        console.log("Google Pay is not available.");
        
        return;
      }
      
      Stripe.addListener(GooglePayEventsEnum.Completed, () => {
        console.log('GooglePayEventsEnum.Completed');
      });
      
      setTimeout(async () => {
        console.log("PaymentIntent: ",this.paymentIntent);

        // Prepare Google Pay
        await Stripe.createGooglePay({
          paymentIntentClientSecret: this.paymentIntent,
          // Web only. Google Pay on Android App doesn't need
          paymentSummaryItems: [{
            label: 'Marriage Event ',
            amount: 1099.00
          }],
          merchantIdentifier: 'merchant.com.getcapacitor.stripe',
          countryCode: 'US',
          currency: 'USD',
        });
        this.rest.dismissLoader();
        // Present Google Pay
        const result = await Stripe.presentGooglePay();
        console.log("Result: ",result);
        
        if (result.paymentResult === GooglePayEventsEnum.Completed) {
          this.splitAndJoin(this.paymentIntent);
          // Happy path
        }
      }, 3000);
      
    } catch (error) {
      console.log("Err: ", error);
      
    }
  }

  splitAndJoin(paymentIntent:any){
    const result = paymentIntent.split('_').slice(0,2).join('_');
    this.txnsId = result;
    console.log("txnsId: ",this.txnsId);
    console.log("Result: ",result);
    return result;
    
  }

  ionViewWillEnter() {
    this.selectedVenue = this.rest.detail;
    this.userdata = localStorage.getItem('userdata');
    this.userId = JSON.parse(this.userdata).users_customers_id;
    this.userName = JSON.parse(this.userdata).username;
    this.userEmail = JSON.parse(this.userdata).email;
  }

  ngOnInit() {
    
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
}
