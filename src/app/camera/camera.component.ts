import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.less']
})
export class CameraComponent implements OnInit {

  options:string[]=[];
  cameras:{id;label;}[]=[];
  videosource:any=undefined;
  playing=false;
  camera:string;
  constraints = {
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440
      },
    }
  };


  constructor() { 
  }

  ngOnInit(): void {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      console.log("Media Devices are available...");
    }
    console.log("Requesting Permission to access video");
    navigator.mediaDevices.getUserMedia({video: true})
    this.getCameraSelection();
  }

  getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    if(videoDevices==null || videoDevices.length==0)return alert("No Video devices found..");
    console.log(videoDevices);
    videoDevices.forEach(vd => {
      this.options.push(vd.label);
      this.cameras.push({id:vd.deviceId,label:vd.label});
    });
  }

  play(){
    if(this.camera==null || this.camera=="")return alert("Camera Not Selected..");
    let cameraId=this.getCameraId(this.camera);
    console.log(cameraId);
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

  pause(){
    this.videosource=undefined;
    this.playing=false;
  }

  screenshot(){

  }

  getCameraId(label){
    let match=this.cameras.filter(cam=>cam.label==label);
    if(match==null || match.length==0)return null;
    else return match[0];
  }
  


  startStream = async (constraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.handleStream(stream);
  }
  
   handleStream = (stream) => {
    this.videosource = stream;
    this.playing = true;
  }

}
