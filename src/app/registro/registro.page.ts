import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/interface/resultado';
import { FirestoreService } from 'src/app/service/firestore.service';
import { AuthService } from '../service/auth.service';
import { InteraccionsService } from '../service/interaccions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  data: Alumno = {
    id: '',
    correo: '',
    nombre: '',
    contacto: '',
    apellido: '',
    contrasena: '',
    role: ''
  }

  constructor(private database: FirestoreService,
    private auth: AuthService,
    private inter: InteraccionsService,
    private router: Router) { }

  ngOnInit() {
  }

  async crearAlumno() {
    this.inter.showLoading('Registrando...');
    const res = await this.auth.register(this.data).catch(res => {
      this.inter.hideLoading();
      this.inter.presentToast('Error en el registro');
      console.log('ERROR');
    });
    if (res) {
      console.log('Usuario creado con exito')
      const path = 'Alumnos';
      const id = res.user!.uid;
      this.data.id = id;
      this.data.contrasena = '';
      await this.database.createDoc(id, path, this.data)
      this.inter.hideLoading();
      this.inter.presentToast('Registrado señor/señora ' + this.data.nombre + ' ' + this.data.apellido);
      this.router.navigate(['/']);
    }
  }
}