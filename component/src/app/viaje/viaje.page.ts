import { Component, OnInit } from '@angular/core';
import { Alumno, Vehiculo, Viaje } from 'src/app/interface/resultado';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AuthService } from '../service/auth.service';
import { InteraccionsService } from '../service/interaccions.service';
import { AlertController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {
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
  //resultados vehiculo
  resultadosV: Vehiculo[] = [];
  //resultados viaje
  resultadosB: Viaje[] = [];
  //boolean vehiculo
  veh = false;
  //boolean viaje
  via = false;
  //dato vacio de id
  uId = '';
  //dato vacio capacidad
  cap = 0;

  constructor(private database: FirestoreService,
    private auth: AuthService,
    private inter: InteraccionsService,
    private alert: AlertController,
    private fire: FirestoreService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    //recupera estado de usuario
    this.auth.stateUser().subscribe( res => {
      this.getUid();
    })
  }

  //src del maps
  getGoogleMapsUrl(): SafeResourceUrl {
    const baseUrl = 'https://www.google.com/maps/embed/v1/directions';
    const origin = 'Duoc UC: Sede Maipu';
    const destination = this.data.lugar;
    const apiKey = 'AIzaSyBS5WPn6lWbfaYR4ZXpsgD-_c98-wmbfS0';
    //constante que agrupa todo
    const url = `${baseUrl}?origin=${origin}&destination=${destination}&key=${apiKey}&center=-33.51115192766463,-70.75249220424112&zoom=13`;
    // Marcar la URL como segura
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //crear viaje
  async crearViaje() {
    this.inter.showLoading('Creando...');
    const path = 'Viajes';
    const id = await this.auth.getUid();
    if (id) {
      console.log('Viaje creado con exito')
      this.data.id = id;
      this.data.nombre = String(this.resultadosA[0].nombre);
      this.data.contacto = String(this.resultadosA[0].contacto);
      this.data.capacidad = this.resultadosV[0].capacidad;
      this.data.patente = String(this.resultadosV[0].patente);
      await this.database.createDoc(id, path, this.data)
      this.inter.hideLoading();
    } 
    else {
      this.inter.hideLoading();
      this.inter.presentToast('Error en la creacion');
      console.log('ERROR');
    }
    }

  //recupera id de usuario
  async getUid() {
    const uid = await this.auth.getUid();
    if (uid) {
      this.uId = uid;
      this.getInfoUser();
      this.getInfoVeh();
      this.getInfoVia();
    }
  }

  //recuperar info vehiculo
  getInfoVeh() {
    const path = 'Vehiculos';
    const id = this.uId;
    this.fire.getDoc<Vehiculo>(path,id).subscribe( res => {
      if (res) {
        this.resultadosV[0]= res;
        this.veh = true;
      }
      console.log('datos vehiculo -> ',res)
    })
  }

  //recuperar info alumno
  getInfoUser() {
    const path = 'Alumnos';
    const id = this.uId;
    this.fire.getDoc<Alumno>(path,id).subscribe( res => {
      if (res) {
        this.resultadosA[0]= res;
      }
      console.log('datos alumno -> ',res)
    })
  }

  //recuperar info viaje
  getInfoVia() {
    const path = 'Viajes';
    const id = this.uId;
    this.fire.getDoc<Viaje>(path,id).subscribe( res => {
      if (res) {
        this.resultadosB[0]= res;
        this.via = true;
        this.cap = this.resultadosB[0].capacidad;
      }
      console.log('datos viaje -> ',res)
    })
  }

  //alert editar info
  async editar(name: string) {
    const alert = await this.alert.create({
      header: 'Editar ' + name,
      inputs: [
        { 
          name: name,
          type: 'text',
          placeholder: 'ingresa ' + name,
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
            console.log('confirm Ok ', ev);
            this.saveAtri(name, ev[name])
          }
        }
      ],
    });
    await alert.present();
  }

  //Guardar info editada
  saveAtri(name: string, input: any) {
    this.inter.showLoading('Actualizando...');
    const id = this.uId;
    const updateDoc: any = {};
    updateDoc[name] = input;
    this.fire.updateDoc('Viajes', id, updateDoc).then( () => {
      this.inter.hideLoading();
      this.inter.presentToast('Actualizado con exito');
    })
    .catch((error) => {
      console.error('Error al actualizar el documento:', error);
      this.inter.hideLoading();
      this.inter.presentToast('Error al actualizar');
    });
  }

  //alert editar info resultadosB
  async editar2() {
    const alert = await this.alert.create({
      header: '¿Asignar viaje?',
      inputs: [
        { 
          name: 'nombre',
          type: 'text',
          placeholder: 'ingresa nombre de pasajero a borrar',
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
            console.log('confirm Ok ' , ev['nombre']);
            this.saveAtri2(ev['nombre']);
          }
        }
      ],
    });
    await alert.present();
  }

  //Guardar info editada
  saveAtri2(input: string) {
    const updateDoc: any = {};
    const id = this.uId;
    let pasajeros: string[] = [...this.resultadosB[0].pasajero]
    const ind = pasajeros.indexOf(input);
    if (ind !== -1) {
      this.inter.showLoading('Eliminando...');
      pasajeros.splice(ind, 1)
      const capacidad: number = this.cap + 1;
      updateDoc['capacidad'] = capacidad;
      updateDoc['pasajero'] = pasajeros;
      this.fire.updateDoc('Viajes', id, updateDoc).then( () => {
        this.inter.hideLoading();
        this.inter.presentToast('Actualizado con exito');
      })
      .catch((error) => {
        console.error('Error al actualizar el documento:', error);
        this.inter.hideLoading();
        this.inter.presentToast('Error al actualizar');
      });
    }
    else {
      console.log('usuario no encontrado')
      this.inter.presentToast('Error usuario no encontrado');
    }
  }

  TerminarViaje() {
    this.inter.showLoading('Terminando...');
    const updateDoc: any = {};
    const id = this.uId;
    let pasajeros: string[] = [];
    const capacidad: number = this.cap + this.resultadosB[0].pasajero.length;
    updateDoc['capacidad'] = capacidad;
    updateDoc['pasajero'] = pasajeros;
    this.fire.updateDoc('Viajes', id, updateDoc).then( () => {
      this.inter.hideLoading();
      this.inter.presentToast('Actualizado con exito');
    })
    .catch((error) => {
      console.error('Error al actualizar el documento:', error);
      this.inter.hideLoading();
      this.inter.presentToast('Error al actualizar');
    });
  }
}
