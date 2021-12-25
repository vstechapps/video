import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirestoreService } from '../services/firestore.service';
import { ToastrService } from 'ngx-toastr';
import { UserFile } from '../models/models';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less']
})
export class PreviewComponent implements OnInit {

  @Input('file')
  file: UserFile;

  @Output()
  close = new EventEmitter();
  refresh = new EventEmitter();

  constructor(public firestore: FirestoreService, private storage: AngularFireStorage, private toaster: ToastrService) { }

  ngOnInit(): void {
  }

  edit(file: File) {

  }

  copy(file: File) {

  }

  download = async (file) => {
    (await this.storage.ref(file.id).getDownloadURL()).toPromise().then((url) => {
      window.open(url, '_blank');
      this.toaster.success("Downloaded " + file.name);
    });
  }

  delete(file: UserFile) {
    this.firestore.getUserFileCollection().doc(file.id).delete().then(() => {
      this.storage.ref(file.id).delete();
      this.toaster.success("Deleted " + file.name);
      this.refresh.emit();
    });
  }

  setChromaBackground = async (file: UserFile) => {
    this.storage.ref(file.id).getDownloadURL().subscribe((url) => {
      this.firestore.user.chromaBackground = url;
      this.firestore.userRef.doc(this.firestore.user.id).set(this.firestore.user).then(() => {
        this.toaster.success("Updated Chroma Background " + file.name);
      })
    });

  }


}
