import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  editing: boolean = false;

  constructor(public firestore: FirestoreService, public toaster: ToastrService) {

  }

  ngOnInit(): void {
  }

  toggleNotifications() {
    var a = this;
    this.firestore.user.notifications=!this.firestore.user.notifications
    if (!this.firestore.user.notifications) {
      this.toaster.success("Success", "Notifications Disabled");
    } else {
      Notification.requestPermission(function (status) {
        console.log('Notification permission status:', status);
        Notification.permission == "granted" ? a.toaster.success("Success", "Notifications Enabled") : a.toaster.error("Failed", "Notifications Blocked");
      });
    }
    this.update();
  }

  update() {
    this.firestore.userRef.doc(this.firestore.user.id).set(this.firestore.user);
  }

}
