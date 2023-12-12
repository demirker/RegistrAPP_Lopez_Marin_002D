import { Component, OnInit } from '@angular/core';
import { Vehiculo, Viaje } from 'src/app/interface/resultado';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AuthService } from '../service/auth.service';
import { InteraccionsService } from '../service/interaccions.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.page.html',
  styleUrls: ['./vehiculo.page.scss'],
})
export class VehiculoPage implements OnInit {
  //interface vehiculo
  data: Vehiculo = {
    id: '',
    patente: '',
    color: '',
    capacidad: 1
  }
  //resultados vehiculo
  resultados: Vehiculo[] = [];
  //resultado viaje
  resultadosB: Viaje[] = [];
  //boolean vehiculo
  veh = false;
  //boolean viaje
  via = false;
  //dato vacio para id
  uId = '';

  constructor(private database: FirestoreService,
    private auth: AuthService,
    private inter: InteraccionsService,
    private router: Router,
    private alert: AlertController,
    private fire: FirestoreService) { }

  ngOnInit() {
    //recupera estado de usuario
    this.auth.stateUser().subscribe( res => {
      this.getUid();
    })
  }

  async crearVehiculo() {
    this.inter.showLoading('Registrando...');
    const path = 'Vehiculos';
    const id = await this.auth.getUid();
    if (id) {
      console.log('Vehiculo creado con exito')
      this.data.id = id;
      await this.database.createDoc(id, path, this.data)
      this.inter.hideLoading();
      this.router.navigate(['/']);
    } 
    else {
      this.inter.hideLoading();
      this.inter.presentToast('Error en el registro');
      console.log('ERROR');
    }
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

  //recuperar info vehiculo
  getInfoUser() {
    const path = 'Vehiculos';
    const id = this.uId;
    this.fire.getDoc<Vehiculo>(path,id).subscribe( res => {
      if (res) {
        this.resultados[0]= res;
        this.veh = true;
      }
      console.log('datos vehiculo -> ',res)
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

  //Guardar info editada diferenciando (se ve como lo siguiente)
  //if (!this.via) {
  //  console.log('no existe viaje')
  //}
  //else {
  //  console.log('existe viaje')
  //  if (name != 'nombre' && name != 'contacto') {
  //    console.log('no se cambio nombre o contacto')
  //  }
  //  else {
  //    console.log('se cambio nombre o contacto')
  //  }
  //}
  saveAtri(name: string, input: any) {
    this.inter.showLoading('Actualizando...');
    const id = this.uId;
    const updateDoc: any = {};
    updateDoc[name] = input;
    if (!this.via) {
      console.log('no existe viaje');
      this.fire.updateDoc('Vehiculos', id, updateDoc).then( () => {
      this.inter.hideLoading();
      this.inter.presentToast('Actualizado con exito');
      })
      .catch((error) => {
        console.error('Error al actualizar el documento:', error);
        this.inter.hideLoading();
        this.inter.presentToast('Error al actualizar vehiculo');
      });
    }
    else {
      console.log('existe viaje');
      if (name != 'capacidad' && name != 'patente') {
        this.fire.updateDoc('Vehiculos', id, updateDoc).then( () => {
          this.inter.hideLoading();
          this.inter.presentToast('Actualizado con exito');
          console.log('no se cambio patente o capacidad');
        })
        .catch((error) => {
          console.error('Error al actualizar el documento:', error);
          this.inter.hideLoading();
          this.inter.presentToast('Error al actualizar vehiculo');
        });
      }
      else {
        console.log('se cambio patente o capacidad');
        //actualiza vehiculo
        this.fire.updateDoc('Vehiculos', id, updateDoc).then( () => {
          //actualiza viaje
          this.fire.updateDoc('Viajes', id, updateDoc).then( () => {
            this.inter.hideLoading();
            this.inter.presentToast('Actualizado con exito');
          })
          .catch((error) => {
            console.error('Error al actualizar el documento:', error);
            this.inter.hideLoading();
            this.inter.presentToast('Error al actualizar viaje');
          });
        })
        .catch((error) => {
          console.error('Error al actualizar el documento:', error);
          this.inter.hideLoading();
          this.inter.presentToast('Error al actualizar vehiculo');
        });
      }
    }
  }
}
