import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InteraccionsService {
  private loading: any; 

  constructor(public toastController: ToastController,
    public  loadingCtrl: LoadingController) {}

  //Notificacion por pantalla
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      cssClass: 'notificacion-pantalla-usuario',
      position: "middle"
    });
    await toast.present();
  }

  //Inicia la carga por pantalla
  async showLoading(mensaje: string) {
    this.loading = await this.loadingCtrl.create({
      message: mensaje,
    });
  await this.loading.present();
  }

  //Termina la carga por pantalla
  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }
}
