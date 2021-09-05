import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImgCapture } from '../models/models';
import { Utility } from '../services/utility';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.less']
})
export class CameraComponent implements OnInit,OnDestroy{

  options:string[]=[];
  cameras:{id;label;}[]=[];
  videostream:any=undefined;
  imagecapture:any=undefined;
  streaming=false;
  camera:string;
  settings:boolean=false;
  canvas:boolean=false;
  isMobile:boolean=Utility.mobileAndTabletCheck();
  captures:ImgCapture[]=[];
  showCaptures:boolean=false;
  layoutheight:string;

  constructor(private sanitizer:DomSanitizer) { 
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

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}
}
