import { Component, OnDestroy, OnInit , ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ImgCapture } from '../models/models';
import { Utility } from '../services/utility';
import {DomSanitizer} from '@angular/platform-browser';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.less']
})
export class CameraComponent implements OnInit,OnDestroy,AfterViewInit {

  options:string[]=[];
  cameras:{id;label;}[]=[];
  videostream:any=undefined;
  imagecapture:any=undefined;
  streaming=false;
  camera:string;
  settings:boolean=false;
  showCanvas:boolean=false;
  isMobile:boolean=Utility.mobileAndTabletCheck();
  captures:ImgCapture[]=[];
  showCaptures:boolean=false;
  layoutheight:string;

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('video')
  video: ElementRef<HTMLVideoElement>;
  public context: CanvasRenderingContext2D;

  constructor(private sanitizer:DomSanitizer,public firestore:FirestoreService,private storage:AngularFireStorage,private toaster:ToastrService) { 
  }

  ngOnInit(): void {
    this.layoutheight=(window.innerHeight-65)+"";
    let a=this;
    window.onresize=function(){a.layoutheight=(window.innerHeight-65)+"";}
    console.log(this.layoutheight);
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      console.log("Media Devices are available...");
      this.getCameraOptions();
    }
    this.captures=[];
  }

  ngOnDestroy(): void{
    this.captures=[];
    this.stopStream();
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  getCameraOptions = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    if(videoDevices==null || videoDevices.length==0)return alert("No Video devices found..");
    console.log(videoDevices);
    videoDevices.forEach(vd => {
      let label=vd.label;
      if(label==""){
        label="Cam "+(this.options.length+1);
      }
      this.options.push(label);
      this.cameras.push({id:vd.deviceId,label:label});
    });
    this.camera=this.options[0];
    this.startCamera();
  }

  toggleCamera(){
    if(this.camera==this.cameras[0].label){
      this.camera=this.cameras[1].label;
    }
    else if(this.camera==this.cameras[1].label){
      this.camera=this.cameras[0].label;      
    }
    else{
      console.log("Toggling Camera Failed in mobile device");
    }
    this.startCamera();
  }

  startCamera(){
    if(this.camera==null || this.camera=="")return;
    let cameraId=this.getCameraId(this.camera);
    console.log("Camera ID :",cameraId);
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia && cameraId!=null) {
      let constraints = {
        video: { deviceId : cameraId, width: 1280, height: 720}
      };
      if(this.streaming){
        this.stopStream();
      }
      this.startStream(constraints);
    }

  }

  capturePhoto(){
    if(this.streaming && this.imagecapture!=null){
      this.imagecapture.takePhoto().then((blob)=>{
        let img=new ImgCapture("Capture "+this.captures.length,blob);
        img.url=this.sanitize(window.URL.createObjectURL(blob));
        this.captures.push(img);
        console.log("Capture Added ",this.captures);
      }).catch(this.handleError);
      this.imagecapture.grabFrame().then(this.processFrame).catch(this.handleError);
    }
  }

   
  processFrame(imageBitmap) {

  }
  
   
  handleError(error) {
    console.error(error);
    alert("Camera Error..");
  }

  getCameraId(label){
    let match=this.cameras.filter(cam=>cam.label==label);
    if(match==null || match.length==0)return null;
    else return match[0].id;
  }
  
  startStream = (constraints) => {
    let a=this;
    navigator.mediaDevices.getUserMedia(constraints).then(stream=>{
      a.videostream = stream;
      a.imagecapture= new ImageCapture(stream.getVideoTracks()[0]);
      a.streaming = true;
    },
    rejected=>{alert("Camera Access Blocked...")});
  }

  stopStream = ()=>{
    this.streaming=false;
    if(this.videostream!=null){
      this.videostream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });
    this.videostream=null;
    this.imagecapture==null;
    }
  }

  drawCanvas(){
    if(this.showCanvas && this.streaming && this.context!=null  && this.video!=null){
      console.log("Drawing Canvas....");
      this.context.drawImage(this.video.nativeElement, 0, 0,4000,3000,0,0,window.innerWidth,window.innerHeight-64);// 0, 0, this.video.nativeElement.width, this.video.nativeElement.height);
      
      setTimeout(this.drawCanvas.bind(this), 1000 / 30);
    }  
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  saveCapture(c:ImgCapture){
    let id=Utility.uuidv4();
      this.firestore.getUserFileCollection().doc(id).set({
        id:id,
        name:c.name,
        type:c.blob.type,
        bytes:c.blob.size,
        date:new Date().toDateString(),
        time:new Date().toTimeString(),
        user:this.firestore.user.id,
        icon:Utility.getFileTypeIcon(c.blob.type),
        size:Utility.bytesToSize(c.blob.size),
        content:Utility.getContentType(c.blob.type)
      });
      this.storage.ref(id).put(c.blob).then(()=>{
        this.toaster.success("Uploaded "+c.name,"SUCCESS");
      });
  }


  removeCapture(i){
    console.log("Removing capture "+i);
    this.captures.splice(i,1);
  }
}
