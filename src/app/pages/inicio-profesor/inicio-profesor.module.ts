import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioProfesorPageRoutingModule } from './inicio-profesor-routing.module';

import { InicioProfesorPage } from './inicio-profesor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioProfesorPageRoutingModule
  ],
  declarations: [InicioProfesorPage]
})
export class InicioProfesorPageModule {}
