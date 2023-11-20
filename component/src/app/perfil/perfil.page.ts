import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FirestoreService } from '../service/firestore.service';
import { Alumno, Viaje } from 'src/app/interface/resultado';
import { AlertController } from '@ionic/angular';
import { InteraccionsService } from '../service/interaccions.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  //resultados alumno
  resultados: Alumno[] = [];
  //resultados viaje
  resultadosB: Viaje[] = [];
  //boolean viaje
  via = false;
  //dato vacio para id
  uId = '';

  constructor(private auth: AuthService,
    private fire: FirestoreService,
    private alert: AlertController,
    private inter: InteraccionsService) { }

  ngOnInit() {
    //recupera estado de usuario
    this.auth.stateUser().subscribe( res => {
      this.getUid();
    })
  }

  //recupera id de usuario
  async getUid() {
    const uid = await this.auth.getUid();
    if (uid) {
      this.uId = uid;
      this.getInfoUser();
      this.getInfoVia();
    } else {
    }
  }

  //recuperar info usuario
  getInfoUser() {
    const path = 'Alumnos';
    const id = this.uId;
    this.fire.getDoc<Alumno>(path,id).subscribe( res => {
      if (res) {
        this.resultados[0]= res;
      }
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
      this.fire.updateDoc('Alumnos', id, updateDoc).then( () => {
      this.inter.hideLoading();
      this.inter.presentToast('Actualizado con exito');
      })
      .catch((error) => {
        console.error('Error al actualizar el documento:', error);
        this.inter.hideLoading();
        this.inter.presentToast('Error al actualizar alumno');
      });
    }
    else {
      console.log('existe viaje');
      if (name != 'nombre' && name != 'contacto') {
        console.log('no se cambio nombre o contacto');
        this.fire.updateDoc('Alumnos', id, updateDoc).then( () => {
          this.inter.hideLoading();
          this.inter.presentToast('Actualizado con exito');
        })
        .catch((error) => {
          console.error('Error al actualizar el documento:', error);
          this.inter.hideLoading();
          this.inter.presentToast('Error al actualizar alumno');
        });
      }
      else {
        console.log('se cambio nombre o contacto');
        //actualiza alumno
        this.fire.updateDoc('Alumnos', id, updateDoc).then( () => {
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
          this.inter.presentToast('Error al actualizar alumno');
        });
      }
    }
  }

  //enviar el correo de cambio de contraseña
  camContra() {
    this.inter.showLoading('Actualizando...');
    this.auth.actualizarPass(this.resultados[0].correo).then(() => {
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
