import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";

import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RestService {
  detail: any = "";
  baseURL = "http://microwd.eigix.net/api/";

  constructor(
    public toastCtrl: ToastController,
    private http: HttpClient,
    public alertcontroller: AlertController
  ) {}

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
    let headers = {
      "Content-Type": "application/json",
    };

    return this.http.post(this.baseURL + "signup/", data, { headers });
  }

  login(data: any) {
    let header;

    header = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });

    header.append("Access-Control-Allow-Origin", "*");
    header.append("Access-Control-Allow-Methods", "*");
    // header.append('Access-Control-Allow-Headers');

    // return this.http.post(this.authurl, myData, {
    //   headers: header,
    // });
    // let headers = {
    //   "Content-Type": "application/json",
    // };

    return this.http.post(this.baseURL + "signin/", data, {
      headers: header,
    });
  }
}
