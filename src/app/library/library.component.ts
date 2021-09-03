import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirestoreService } from '../services/firestore.service';
import { ToastrService } from 'ngx-toastr';
import { Utility } from '../services/utility';
import { UserFile } from '../models/models';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less']
})
export class LibraryComponent implements OnInit {

  search:string=undefined;
  files:UserFile[]=[];

  constructor(public firestore:FirestoreService,private storage:AngularFireStorage,private toaster:ToastrService) { }

  ngOnInit(): void {
    this.loadUserFiles();
  }

  loadUserFiles = async()=>{
    this.files=[];
    (await this.firestore.getUserFileCollection().get().toPromise()).docs.forEach(d=>{
        this.files.push(d.data());
      });
  }

  upload(event){
    let files:File[]=event.target.files;
    console.log("Files to upload : ",files);
    for(var i in files){
      let file=files[i];
      let id=Utility.uuidv4();
      this.firestore.getUserFileCollection().add({
        id:id,
        name:file.name,
        type:file.type,
        size:file.size,
        date:new Date().toDateString(),
        time:new Date().toTimeString(),
        user:this.firestore.user.id
      });
      this.storage.ref(id).put(file).then(()=>{
        this.toaster.success("Uploaded "+file.name,"SUCCESS");
      });
    }
  }

}
