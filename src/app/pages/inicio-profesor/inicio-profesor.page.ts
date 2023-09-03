import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-profesor',
  templateUrl: './inicio-profesor.page.html',
  styleUrls: ['./inicio-profesor.page.scss'],
})
export class InicioProfesorPage implements OnInit {
  mostrarImagen: boolean = false;

  toggleImagen() {
    this.mostrarImagen = !this.mostrarImagen;
  }
  
  constructor() { }

  ngOnInit() {
  }

}
