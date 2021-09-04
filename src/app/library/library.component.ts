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

  search:string="";
  userfiles:UserFile[]=[];
  files:UserFile[]=[];
  preview:UserFile=null;

  constructor(public firestore:FirestoreService,private storage:AngularFireStorage,private toaster:ToastrService) { }

  ngOnInit(): void {
    this.loadUserFiles();
  }

  loadUserFiles = async()=>{
    this.userfiles=[];
    (await this.firestore.getUserFileCollection().get().toPromise()).docs.forEach(d=>{
        this.userfiles.push(d.data());
      });
      this.refresh();
  }

  refresh(){
    this.files=[];
    this.userfiles.forEach(file=>{
      if(this.search ==null || this.search=='')this.files.push(file);
      else{
        let n=file.name.toLocaleLowerCase(),s=this.search.toLocaleLowerCase();
        if(n.indexOf(s)>=0)this.files.push(file);
      }
    });
  }

  upload(event){
    let files:File[]=event.target.files;
    console.log("Files to upload : ",files);
    for(var i in files){
      let file=files[i];
      let id=Utility.uuidv4();
      this.firestore.getUserFileCollection().doc(id).set({
        id:id,
        name:file.name,
        type:file.type,
        bytes:file.size,
        date:new Date().toDateString(),
        time:new Date().toTimeString(),
        user:this.firestore.user.id,
        icon:this.getFileTypeIcon(file.type),
        size:this.bytesToSize(file.size),
        content:this.getContentType(file.type)
      });
      this.storage.ref(id).put(file).then(()=>{
        this.toaster.success("Uploaded "+file.name,"SUCCESS");
      });
    }
    this.loadUserFiles();
  }

  getContentType(type){
    if(type!=null)
    if(type.indexOf('image')>=0)return "image";
    else if(type.indexOf('video')>=0)return "video";
    else if(type.indexOf('audio')>=0)return "audio";
    else return "file";
  }

  getFileTypeIcon(type){
    if(type!=null)
    if(type.indexOf('image')>=0)return "image";
    else if(type.indexOf('video')>=0)return "movie";
    else if(type.indexOf('audio')>=0)return "music_note";
    else return "description";
  }

  bytesToSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  view=async (file:UserFile)=>{
    if(file.url==null){
      (await this.storage.ref(file.id).getDownloadURL()).toPromise().then((url)=>{
        file.url=url;
        this.preview=file;
      });
    }
    else this.preview=file;
    
  }

  edit(file){

  }

  copy(file){

  }

  download = async (file)=>{
    (await this.storage.ref(file.id).getDownloadURL()).toPromise().then((url)=>{
      window.open(url,'_blank');
      this.toaster.success("Downloaded "+file.name);
    });
  }

  delete(file){
    this.firestore.getUserFileCollection().doc(file.id).delete().then(()=>{
      this.storage.ref(file.id).delete();
      this.toaster.success("Deleted "+file.name);
      this.loadUserFiles();
    });
  }

}
