import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class RestService {
  detail: any = "";
  venuArrHome: any = "";
  pinobject: any = "";
  selectedBooking: any = "";
  comingFrom: any = "";

  baseURL = "https://crowd.eigix.net/api/";
  baseURLimg = "https://crowd.eigix.net/public/";

  constructor(
    public toastCtrl: ToastController,
    private http: HttpClient,
    public alertcontroller: AlertController,
    public loadingController: LoadingController
  ) {}

  sendRequest(action: any, data?: any) {
    let header;

    header = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.post(`${this.baseURL}${action}`, JSON.stringify(data), {
      headers: header,
    });
  }

  
  presentLoader() {
    this.loadingController
      .create({
        message: "Please wait...",
        cssClass: "loader-css-class",
        backdropDismiss: true,
      })
      .then((res) => {
        res.present();
      });
  }

  presentLoaderWd() {
    this.loadingController
      .create({
        message: "Please wait...",
        cssClass: "loader-css-class",
        backdropDismiss: true,
        duration:3000
      })
      .then((res) => {
        res.present();
      });
  }

  dismissLoader() {
    this.loadingController
      .dismiss()
      .then((response) => {
        console.log("Loader closed!", response);
      })
      .catch((err) => {
        console.log("Error occured : ", err);
      });
  }

  async presentToast(msg: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: "bottom",
    });

    await toast.present();
  }

  async presentAlert(msg: any) {
    const alert = await this.alertcontroller.create({
      cssClass: "basicAlert",
      message: msg,
      buttons: ["OK"],
    });
    await alert.present();
  }

  signup(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "signup", data, {
      headers: header,
    });
  }

  bookings_add(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "bookings_add", data, {
      headers: header,
    });
  }

  notifications(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "notifications", data, {
      headers: header,
    });
  }

  venues(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "venues", data, {
      headers: header,
    });
  }

  user_chat(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "user_chat", data, {
      headers: header,
    });
  }

  bookings_edit(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "bookings_edit", data, {
      headers: header,
    });
  }

  bookings_cancel(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "bookings_cancel", data, {
      headers: header,
    });
  }

  bookings_upcoming(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "bookings_upcoming", data, {
      headers: header,
    });
  }

  bookings_previous(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "bookings_previous", data, {
      headers: header,
    });
  }

  events_saved(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "events_saved", data, {
      headers: header,
    });
  }

  venues_saved(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "venues_saved", data, {
      headers: header,
    });
  }

  change_password(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "change_password", data, {
      headers: header,
    });
  }

  forgot_password(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "forgot_password", data, {
      headers: header,
    });
  }

  modify_password(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "modify_password", data, {
      headers: header,
    });
  }

  events_like_unlike(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "events_like_unlike", data, {
      headers: header,
    });
  }

  venues_like_unlike(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "venues_like_unlike", data, {
      headers: header,
    });
  }

  update_profile(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "update_profile", data, {
      headers: header,
    });
  }

  events(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "events", data, {
      headers: header,
    });
  }

  login(data: any) {
    let header;

    header = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.post(this.baseURL + "signin", data, {
      headers: header,
    });
  }

  users_customers_signup_social(data: any) {
    let header;

    header = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.post(
      this.baseURL + "users_customers_signup_social",
      data,
      {
        headers: header,
      }
    );
  }

  delete_account(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "delete_account", data, {
      headers: header,
    });
  }

  get_visitors_list(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "get_visitors_list", data, {
      headers: header,
    });
  }

  claim_discount(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "claim_discount", data, {
      headers: header,
    });
  }

  update_visitors(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "update_visitors", data, {
      headers: header,
    });
  }

  update_visitors_events(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "update_visitors_events", data, {
      headers: header,
    });
  }

  get_visitors_events_list(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "get_visitors_events_list", data, {
      headers: header,
    });
  }

  venues_by_idAPI(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "venues_by_id", data, {
      headers: header,
    });
  }

  system_settings() {
    let header;

    header = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.get(this.baseURL + "system_settings", {
      headers: header,
    });
  }
}
