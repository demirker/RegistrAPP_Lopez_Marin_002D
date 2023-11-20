import { Component, OnInit } from '@angular/core';
import { Alumno, Viaje } from 'src/app/interface/resultado';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AuthService } from '../service/auth.service';
import { InteraccionsService } from '../service/interaccions.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-buscar-viaje',
  templateUrl: './buscar-viaje.page.html',
  styleUrls: ['./buscar-viaje.page.scss'],
})

export class BuscarViajePage implements OnInit {
  //interface de viaje
  data: Viaje = {
    id: '',
    nombre: '',
    contacto: '',
    capacidad: 1,
    patente: '',
    lugar: 'hospital el carmen',
    precio: 500,
    pasajero: []
  }
  //resultados alumno
  resultadosA: Alumno[] = [];
  //resultados viaje
  resultadosB: Viaje[] = [];
  //resultados viaje
  resultadosD: Viaje[] = [];
  //boolean viaje
  via = false;
  //dato vacio de id
  uId = '';
  //dato vacio capacidad
  cap = 0;

  constructor(private auth: AuthService,
    private inter: InteraccionsService,
    private fire: FirestoreService,
    private sanitizer: DomSanitizer,
    private alert: AlertController) { }

  ngOnInit() {
    //recupera estado de usuario
    this.auth.stateUser().subscribe( res => {
      this.getUid();
    })
  }

  //src del maps
  getGoogleMapsUrl(destination: string): SafeResourceUrl {
    const baseUrl = 'https://www.google.com/maps/embed/v1/directions';
    const origin = 'Duoc UC: Sede Maipu';
    const apiKey = 'AIzaSyBS5WPn6lWbfaYR4ZXpsgD-_c98-wmbfS0';
    //constante que agrupa todo
    const url = `${baseUrl}?origin=${origin}&destination=${destination}&key=${apiKey}&center=-33.51115192766463,-70.75249220424112&zoom=13`;
    // Marcar la URL como segura
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //recupera id de usuario
  async getUid() {
    const uid = await this.auth.getUid();
    if (uid) {
      this.uId = uid;
      this.getInfoUser();
      this.getInfoVia();
    }
  }

  //recuperar info alumno
  getInfoUser() {
    const path = 'Alumnos';
    const id = this.uId;
    this.fire.getDoc<Alumno>(path,id).subscribe( res => {
      if (res) {
        this.resultadosA[0]= res;
      }
    })
  }

  //recuperar info viaje
  getInfoVia() {
    this.fire.getCol<Viaje>('Viajes').subscribe(data => {
      this.resultadosB = data;
    });
  }

  //recuperar info viaje
  getInfoViaID(id: string) {
    const path = 'Viajes';
    this.fire.getDoc<Viaje>(path,id).subscribe( res => {
      if (res) {
        this.resultadosD[0]= res;
        this.cap = this.resultadosD[0].capacidad;
      }
    })
  }

  //alert editar info
  async editar(id: string) {
    this.getInfoViaID(id);
    const alert = await this.alert.create({
      header: '¿Asignar viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('confirm cancel')
          }
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: (ev) => {
            console.log('confirm Ok ' , ev);
            this.saveAtri(id);
          }
        }
      ],
    });
    await alert.present();
  }
  
  //Guardar info editada pasajeros
  saveAtri(id: string) {
    this.inter.showLoading('Asignando...');
    let pasajeros: string[] = [...this.resultadosD[0].pasajero]
    const nombre = this.resultadosA[0].nombre;
    console.log('datos pasajeros ', pasajeros)
    const capacidad: number = this.cap - 1;
    pasajeros.push(nombre);
    const updateDoc: any = {};
    updateDoc['capacidad'] = capacidad;
    updateDoc['pasajero'] = pasajeros;
    this.fire.updateDoc('Viajes', id, updateDoc).then( () => {
      this.inter.hideLoading();
      this.inter.presentToast('Actualizado con exito');
    })
    .catch((error) => {
      console.error('Error al actualizar el documento:', error);
      this.inter.hideLoading();
      this.inter.presentToast('Error al actualizar alumno');
    });
  }

  /*guardar con mas de una cantidad
  async editar(id: string) {
    this.getInfoViaID(id);
    const alert = await this.alert.create({
      header: '¿Asignar viaje?',
      inputs: [
        { 
          name: 'cant',
          type: 'text',
          placeholder: 'ingresa',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('confirm cancel')
          }
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: (ev) => {
            console.log('confirm Ok ' , ev);
            this.saveAtri(id, ev['cant']);
          }
        }
      ],
    });
    await alert.present();
  }

  saveAtri(id: string, cant: number) {
    const capacidad: number = this.cap - cant;
    const path = 'Viajes';
    const updateDoc: any = {};
    if (capacidad >= 0) {
      updateDoc['capacidad'] = capacidad;
      console.log(capacidad);
    }
    else {
      console.log('cantidad supero a capacidad');
    }
  }
  */
}