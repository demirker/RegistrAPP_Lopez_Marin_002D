import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { InteraccionsService } from '../service/interaccions.service';
import { Router } from '@angular/router'; //para navegar entre paginas desde el ts
import { FirestoreService } from '../service/firestore.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit {
  //variable de credenciales
  credenciales = {
    correo: '',
    contra: ''
  }

  constructor(private auth: AuthService,
    private inter: InteraccionsService,
    private router: Router,
    private fire: FirestoreService) { }

  ngOnInit() {}

  //login
  async login() {
    await this.inter.showLoading('Ingresando...');
    console.log('credenciales -> ',this.credenciales);
    const res = await this.auth.login(this.credenciales.correo, this.credenciales.contra).catch(error => {
      console.log('ERROR');
      this.inter.hideLoading();
      this.inter.presentToast('Email o contraseña invalidos');
    });
    if (res) {
      this.inter.hideLoading();
      console.log('res -> ',res);
      this.fire.camBand();
      this.router.navigate(['/']);
    }
  }
}
