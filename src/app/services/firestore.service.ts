import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User,UserFile } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  user: UserData;
  userRef: AngularFirestoreCollection<User>;
  

  constructor(public firestore: AngularFirestore) {
    this.userRef = this.firestore.collection<User>('users');
  }

  setUser(user: User) {
    this.user = user;  
    //this.updateServiceWorker();
  }

  getUserFileCollection(){
    return this.firestore.collection<UserFile>("user-files", ref => ref.where("user", "==", this.user.id));
  }


  updateServiceWorker() {
    var a = this;
    if (Notification.permission == 'granted') {
    var interval = setInterval(function () {
        navigator.serviceWorker.getRegistration().then(function (reg) {
          if (reg) {
            reg.showNotification("Hello "+a.user.name + ", WebEdu Welcomes you onboard");
            console.log("Firestore Service trying to update user to service worker", a.user);
            let message={type:"DATA",user:a.user};
            reg.active.postMessage(message);
            clearInterval(interval);
          }
        });
    }, 1000);
    }
  }
}

export class UserData extends User {
}
