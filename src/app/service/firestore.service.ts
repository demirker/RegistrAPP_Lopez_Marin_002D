import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  //bandera
  band = false;

  constructor(private firestore: AngularFirestore) {}

  //crea ID para documento
  getId() {
    return this.firestore.createId();
  }

  //crea documento generico
  createDoc(id:any, path: string, data: any) {
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);
  }

  //lee coleccion
  getCol<tipo>(path: string) {
    return this.firestore.collection<tipo>(path).valueChanges();
  }

  //lee documento
  getDoc<tipo>(path: string, id: string) {
    return this.firestore.collection(path).doc<tipo>(id).valueChanges()
  }

  //actualiza documento
  updateDoc(path: string, id:string, data: any) {
    return this.firestore.collection(path).doc(id).update(data)
  }

  //eliminar documento
  delDoc(path: string, id:string) {
    return this.firestore.collection(path).doc(id).delete
  }

  //cambiador verf sesion
  camBand() {
    this.band = true;
  }

  //verificador band
  verBand() {
    return this.band
  }

  //desactivar verf
  desBand() {
    this.band = false;
  }
}