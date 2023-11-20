import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hora',
  templateUrl: './hora.component.html',
  styleUrls: ['./hora.component.scss']
})
export class HoraComponent  implements OnInit {
  horaActual: string;

  //constructor que crea la hora
  constructor() { 
    const fecha = new Date();
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    this.horaActual = fecha.toLocaleTimeString('es-ES', options);
    
    setInterval(() => {
      this.actualizarHora();
    }, 1000);
  }

  ngOnInit() { }

  //actualiza la hora
  private actualizarHora() {
    const fecha = new Date();
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    this.horaActual = fecha.toLocaleTimeString('es-ES', options);
  }
}
