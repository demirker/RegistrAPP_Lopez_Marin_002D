import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-alumno',
  templateUrl: './inicio-alumno.page.html',
  styleUrls: ['./inicio-alumno.page.scss'],
})
export class InicioAlumnoPage implements OnInit {
  mostrarImagen: boolean = false;

  toggleImagen() {
    this.mostrarImagen = !this.mostrarImagen;
  }
  
  public alertButtons = ['OK'];

  constructor() { }

  ngOnInit() {
  }

}
