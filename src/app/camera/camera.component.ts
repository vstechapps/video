import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.less']
})
export class CameraComponent implements OnInit,OnDestroy{

  options:string[]=[];
  cameras:{id;label;}[]=[];
  videostream:any=undefined;
  streaming=false;
  camera:string;
  constraints = {
    video: {
      width: {min: 1280,ideal: 1920,max: 2560,},
      height: {min: 720,ideal: 1080,max: 1440}
    }
  };


  constructor() { 
  }

  ngOnInit(): void {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      console.log("Media Devices are available...");
      this.getCameraOptions();
    }
  }

  ngOnDestroy(): void{
    this.stopStream();
  }

  getCameraOptions = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    if(videoDevices==null || videoDevices.length==0)return alert("No Video devices found..");
    console.log(videoDevices);
    videoDevices.forEach(vd => {
      this.options.push(vd.label);
      this.cameras.push({id:vd.deviceId,label:vd.label});
    });
    this.camera=this.options[0];
    this.startCamera();
  }

  startCamera(){
    if(this.camera==null || this.camera=="")return;
    let cameraId=this.getCameraId(this.camera);
    console.log("Camera ID :",cameraId);
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia && cameraId!=null) {
      let updatedConstraints = {
        ...this.constraints,
        deviceId: {
          exact: cameraId
        }
      };
      this.startStream(updatedConstraints);
    }

  }

  screenshot(){

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
    }
  }
  

}
