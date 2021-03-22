import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as MicRecorder from 'mic-recorder-to-mp3';
import * as RecordRTC from 'recordrtc/recordRTC.min';
import * as moment from 'moment';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.page.html',
  styleUrls: ['./audio-recorder.page.scss'],
})
export class AudioRecorderPage implements OnInit {
  private recordRTC: any;
  public timeLeft: number = 60;
  recordingtimer;
  fileName;
  filePath;
  record;
  //audio: MediaObject;
  data = [];
  isAudioStarted: boolean;
  startResume;
  isPaused: boolean;
  recording: boolean;
  changeImageOnStart: String;
  startAudio: String = 'Start';
  resumeAudio: String = 'Resume';
  recordingStopped: String = 'assets/audiorecorder/microphone.png';
  recordingStarted: String = 'assets/audiorecorder/microphone-gif-12.gif';
  recorder;
  file;
  constructor(private modalCtrl: ModalController) {
    this.startResume = this.startAudio;
    this.changeImageOnStart = this.recordingStopped;
  }

  ngOnInit() {
    this.fileName = moment().valueOf() + '.mp3'
    this.isAudioStarted = true;
    this.isPaused = false;
  }

  timer(interval): void {
    this.recording = true
    let timeLeft: number;
    timeLeft = interval;
    this.recordingtimer = setInterval(() => {
      if (this.timeLeft != 0) {
        this.timeLeft -= 1;
      } else {
        //this.audio.stopRecord();
        clearInterval(this.recordingtimer);
        this.data.push(this.filePath, this.fileName);
        this.modalCtrl.dismiss(this.data);
      }
    }, 1000);
  }

  startAudioRecord() {

    this.changeImageOnStart = this.recordingStarted;
    this.isAudioStarted = false;
    this.isPaused = true;
    this.timer(60);


    this.recorder = new MicRecorder({
      bitRate: 128
    });
    this.recorder.start().then(() => {
      // something else
    }).catch((e) => {
      console.error(e);
    });

    let mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));

  }


  successCallback(stream) {
    var options = {
      mimeType: "audio/mp3",
      numberOfAudioChannels: 1
    };

    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }
  error;
  errorCallback(error) {
    this.error = 'Can not play audio in your browser';
  }

  pauseAudio() {
    this.recording = false;
    let resumeTimeStoped;
    // this.audio.pauseRecord();
    this.startResume = this.resumeAudio;
    this.changeImageOnStart = this.recordingStopped;
    this.timeLeft = this.timeLeft;
    clearInterval(this.recordingtimer);
  }

  stopAudioRecord() {
    //this.audio.stopRecord();
    clearInterval(this.recordingtimer);


    this.recorder
      .stop()
      .getMp3().then(([buffer, blob]) => {
        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        console.log('buffer===>', buffer);
        console.log('blob===>', blob);


        this.file = new File(buffer, this.fileName, {
          type: blob.type,
          lastModified: Date.now()
        });
        console.log('mp3filedata', this.file.name);
        //this.uploadFile(file);
        const player = new Audio(URL.createObjectURL(this.file));
        // player.play();

      }).catch((e) => {
        alert('We could not retrieve your message');
        console.log(e);
      });

    this.record.stop(this.processRecording.bind(this));
  }

  processRecording(blob) {
    this.modalCtrl.dismiss(this.file, this.fileName);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
