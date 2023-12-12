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
    idP: [],
    pasajero: []
  }
  //resultados alumno
  resultadosA: Alumno[] = [];
  //resultados viaje
  resultadosB: Viaje[] = [];
  //resultados viaje por id
  resultadosD: Viaje[] = [];
  //boolean viaje
  pas = false;
  //dato vacio de id
  uId = '';
  //dato vacio capacidad
  cap = 0;
  //dato vacio id viaje
  idViaP = '';

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
    const id = await this.auth.getUid();
    if (id) {
      this.uId = id;
      this.pas = false;
      this.getInfoUser();
      this.getInfoVia();
    }
  }

  //recuperar info alumno
  getInfoUser() {
    this.fire.getDoc<Alumno>('Alumnos',this.uId).subscribe( res => {
      if (res) {
        this.resultadosA[0]= res;
      }
    })
  }

  //recuperar info viaje
  getInfoVia() {
    this.fire.getCol<Viaje>('Viajes').subscribe(data => {
      if (data) {
        this.resultadosB = data;
        this.getPasajero();
      }
    });
  }

  //recuperar info viaje
  getInfoViaID(id: string) {
    this.fire.getDoc<Viaje>('Viajes',id).subscribe( res => {
      if (res) {
        this.resultadosD[0]= res;
        this.cap = this.resultadosD[0].capacidad;
      }
    })
  }

  //verificar si es pasajero
  getPasajero() {
    const uIdPresente = this.resultadosB.find(viaje => viaje.idP.includes(this.uId));
    if (uIdPresente) {
      console.log(`El usuario tiene un viaje`);
      this.pas = true;
      //recuperar id viaje
      this.idViaP = uIdPresente.id;
      //recuperar viaje con id
      this.getInfoViaID(this.idViaP);
    } else {
      console.log(`El usuario no tiene viaje`);
    }
  }

  //alert tomar viaje
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

  //Guardar info pasajero
  saveAtri(id: string) {
    this.inter.showLoading('Asignando...');
    //nombre
    let nombrePasajero: string[] = [];
    nombrePasajero = [...this.resultadosD[0].pasajero];
    const nombreP = this.resultadosA[0].nombre;
    nombrePasajero.push(nombreP);
    //id
    let idPasajero: string[] = [];
    idPasajero = [...this.resultadosD[0].idP];
    const idPas = this.resultadosA[0].id;
    idPasajero.push(idPas);
    //capacidad
    const capacidad: number = this.cap - 1;
    //guardar
    const updateDoc: any = {};
    updateDoc['pasajero'] = nombrePasajero;
    updateDoc['idP'] = idPasajero;
    updateDoc['capacidad'] = capacidad;
    //guardar datos
    this.fire.updateDoc('Viajes', id, updateDoc).then( () => {
      this.inter.hideLoading();
      this.inter.presentToast('guardado con exito');
    })
    .catch((er) => {
      console.error('Error al guardar el documento:', er);
      this.inter.hideLoading();
      this.inter.presentToast('Error al guardar al pasajero del viaje');
    })
  }

  //alert salir viaje
  async editar2(id: string, nombre: string) {
    this.getInfoViaID(id);
    const alert = await this.alert.create({
      header: '¿Salir del viaje?',
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
            this.saveAtri2(id, nombre);
          }
        }
      ],
    });
    await alert.present();
  }

  //Guardar info pasajero
  saveAtri2(id: string, input: string) {
    this.inter.showLoading('Saliendo...');
    //const
    const updateDoc: any = {};
    //let
    let idPasajeros: string[] = [...this.resultadosD[0].idP]
    let nomPasajeros: string[] = [...this.resultadosD[0].pasajero]
    //sacar index
    const ind = nomPasajeros.indexOf(input);
    if (ind !== -1) {
      idPasajeros.splice(ind, 1);
      nomPasajeros.splice(ind, 1);
      const capacidad: number = this.cap + 1;
      updateDoc['capacidad'] = capacidad;
      updateDoc['idP'] = idPasajeros;
      updateDoc['pasajero'] = nomPasajeros;
      //actualizar viaje
      this.fire.updateDoc('Viajes', id, updateDoc).then(() => {
        console.log('Exito al actualizar el documento: ');
        this.inter.hideLoading();
        this.inter.presentToast('Exito al actualizar lista de viaje');
        location.reload();
      })
      .catch((error) => {
        console.log('Error al actualizar el documento: ', error);
        this.inter.hideLoading();
        this.inter.presentToast('Error al actualizar capacidad');
      });
    }
    else {
      this.inter.hideLoading();
      console.log('usuario no encontrado')
      this.inter.presentToast('Error: usuario no encontrado');
    }
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