import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  username:string;
  password:string;
  clickCount:number=0;
  isAdmin=false;

  constructor(public auth: AngularFireAuth, public firestore: FirestoreService) { }

  ngOnInit(): void {
  }

  checkIfAdmin(){
    console.log("Click Event..")
    this.isAdmin=this.clickCount>=5;
    this.clickCount++;
  }

  adminLogin(){
    this.auth.signInWithEmailAndPassword(this.username,this.password)
    .catch(err=>{
      console.error(err);
      alert(err.message);
    });
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

}
