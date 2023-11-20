import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../service/firestore.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  constructor(private firestore: FirestoreService,
    private auth: AuthService) {}

  ngOnInit() {
  }
}
