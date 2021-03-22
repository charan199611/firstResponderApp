import { ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { ToastController } from '@ionic/angular';
//import {Stream} from 'node-rtsp-stream';
  //import { Flashphoner} from '@codeda/flashphoner';
//import ffmpeg from "fluent-ffmpeg";

declare var window: any;
@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.page.html',
  styleUrls: ['./live-stream.page.scss'],
})



export class LiveStreamPage implements OnInit {
  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 
  liveStreamUrl;
  liveUrl;
  cfsDetails;
  sessionStatus:any;
  streamStatus:any;
  constructor(private sanitizer: DomSanitizer, private applicationConfig: ApplicationConfigProvider, private customNavService:CustomNavService,
    public toastCtrl: ToastController,) {
  //  this.liveUrl = this.customNavService.get('eventDetails');
   }

  ngOnInit() {
  
// this.liveUrl = this.applicationConfig.liveStreamUrl;

 //  this.liveUrl = this.livestreamUrl

   // this.liveStreamUrl = this.sanitizer.bypassSecurityTrustResourceUrl('rtsp://administrator:P@$$w0rd@10.100.0.40:10.100.0.40/v1/system/cameras/streaming/10/1/live_stream?auth_acc_type=LDAPUser;add_info=NULL');

  //  this.liveStreamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveUrl);

  }



    

  openLiveStream(){
    /*  window.startApp.set({
      "action": "ACTION_VIEW",
      "uri": "rtsp://administrator:P@$$w0rd@10.100.0.40:10.100.0.40/v1/system/cameras/streaming/10/1/live_stream?auth_acc_type=LDAPUser;add_info=NULL"  
      }).start();
      }  */
  

     }



}