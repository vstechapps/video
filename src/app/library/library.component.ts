import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirestoreService } from '../services/firestore.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less']
})
export class LibraryComponent implements OnInit {

  constructor(public firestore:FirestoreService,private storage:AngularFireStorage,private toaster:ToastrService) { }

  ngOnInit(): void {
  }

  saveFile(){
    var blob = new Blob([], {type: "video/mp4"});
    this.storage.ref("courses.json").put(blob);
    this.toaster.success("Uploaded intto library","SUCCESS");
  }

}
