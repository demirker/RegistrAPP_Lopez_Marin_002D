import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth } from '@angular/fire/auth';
import { Alumno } from '../interface/resultado';
import { sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  //iniciar sesion
  login(correo: string, contra: string) {
    return this.auth.signInWithEmailAndPassword(correo, contra);
  }

  //cerrar sesion
  logOut() {
    this.auth.signOut();
  }

  //registrarse
  register(datos: Alumno) {
    return this.auth.createUserWithEmailAndPassword(datos.correo, datos.contrasena);
  }

  //estado de la sesion
  stateUser() {
    return this.auth.authState;
  }

  //obtener Uid
  async getUid() {
    const user = await this.auth.currentUser;
    if (user) {
      return user.uid;
    } else {
      return null
    }
    
  }

  async actualizarPass(correo: any){
    const auth = getAuth();
    return sendPasswordResetEmail(auth, correo)
  }
}
