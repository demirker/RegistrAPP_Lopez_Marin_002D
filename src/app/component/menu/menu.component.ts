import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Alumno } from 'src/app/interface/resultado';
import { AuthService } from 'src/app/service/auth.service';
import { FirestoreService } from 'src/app/service/firestore.service';
import { InteraccionsService } from 'src/app/service/interaccions.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class MenuComponent  implements OnInit {
  //boolean login
  login = false;
  //variable vacia uId
  uId = '';
  //interface alumno
  resultados: Alumno[] = [];
  //observable
  items: Observable<any[]> | undefined;
  //roles usados para diferenciar
  //rol: 'alumno' | 'admin' = null;
  
  constructor(private router: Router,
    private auth: AuthService,
    private inter: InteraccionsService,
    private fire: FirestoreService) 
    {}

  ngOnInit() {
    //recupera estado de usuario
    this.auth.stateUser().subscribe( res => {
      if (res) {
      console.log('esta logueado');
      this.login = true;
      this.getUid();
      }
      else {
        console.log('No esta logueado');
        this.login = false;
      }
    })
  }

  //recupera id de usuario
  async getUid() {
    const uid = await this.auth.getUid();
    if (uid) {
      this.uId = uid;
      console.log('Uid -> ',uid);
      this.getInfoUser();
    } else {
      console.log('no existe Uid');
    }
  }

  //recuperar info usuario
  getInfoUser() {
    const path = 'Alumnos';
    const id = this.uId;
    this.fire.getDoc<Alumno>(path,id).subscribe( res => {
      if (res) {
        console.log('datos alumno -> ',res)
        //resultado
        this.resultados[0]= res;
        //bandera
        const band = this.fire.verBand();
        if (band) {
          this.inter.presentToast('Bienvenido ' + this.resultados[0].nombre + ' ' + this.resultados[0].apellido);
          this.fire.desBand();
        }
      }
    })
  }

  //cerrar sesion
  logOut() {
    this.auth.logOut();
    console.log('Sesion cerrada')
    this.inter.presentToast('Sesion Cerrada');
    this.router.navigate(['/']);
    this.recargar();
  }

  //recargar pagina
  recargar() {
    location.reload();
  }

  /*antiguo diferenciador de pages
  isInicioPage(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/inicio' || currentRoute === '/iniciar-sesion' || currentRoute === '/info' || currentRoute === '/recuperacion' || currentRoute === '/registro';
  }
  */

  //para diferenciar usuarios
  /*
  getDataUser(Uid: string) {
    const path= "Alumno";
    const id= Uid;
    this.fire.getDoc<Alumno>(path, id).subscribe( res => {
      console.log('datos -> ', res);
      if (res) {
        this.rol = res.perfil
      }
    })
  }
  manera de usar en html
  *ngIf="rol === 'admin'"
  */
}
