import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class RestService {
  detail: any = "";

  constructor(public toastCtrl: ToastController) {}

  async presentToast(msg: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: "bottom",
    });

    await toast.present();
  }
}
