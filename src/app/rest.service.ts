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
  baseURL = "https://crowd.eigix.net/api/";
  baseURLimg = "https://crowd.eigix.net/public/";

  constructor(
    public toastCtrl: ToastController,
    private http: HttpClient,
    public alertcontroller: AlertController,
    public loadingController: LoadingController
  ) {}

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

  venues(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "venues", data, {
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

  delete_account(data: any) {
    let header;
    header = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.baseURL + "delete_account", data, {
      headers: header,
    });
  }

  system_setting(data: any) {
    let header;

    header = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.get(this.baseURL + "system_settings", {
      headers: header,
    });
  }
}
