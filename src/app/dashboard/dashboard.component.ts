import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Role } from '../models/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  userActivity:any={};
  Role:Role;
  devicePixelRatio:number=0;
  constructor(public firestore: FirestoreService) {
    this.devicePixelRatio=window.devicePixelRatio;
  }

  ngOnInit(): void {
  }


}
