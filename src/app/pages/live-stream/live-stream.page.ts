import { ElementRef, NgModule, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { ToastController } from '@ionic/angular';
import JSMpeg from 'jsmpeg-player';
import Stream from 'node-rtsp-stream-jsmpeg';


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
  arguments:[];
  constructor(private sanitizer: DomSanitizer, private applicationConfig: ApplicationConfigProvider, private customNavService:CustomNavService,
    public toastCtrl: ToastController,) {
  //  this.liveUrl = this.customNavService.get('eventDetails');
   }

 async  ngOnInit() {
  
// this.liveUrl = this.applicationConfig.liveStreamUrl;

 //  this.liveUrl = this.livestreamUrl

   // this.liveStreamUrl = this.sanitizer.bypassSecurityTrustResourceUrl('rtsp://administrator:P@$$w0rd@10.100.0.40:10.100.0.40/v1/system/cameras/streaming/10/1/live_stream?auth_acc_type=LDAPUser;add_info=NULL');

  //  this.liveStreamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveUrl);

  }



    

  async openLiveStream(){
    /*  window.startApp.set({
      "action": "ACTION_VIEW",
      "uri": "rtsp://administrator:P@$$w0rd@10.100.0.40:10.100.0.40/v1/system/cameras/streaming/10/1/live_stream?auth_acc_type=LDAPUser;add_info=NULL"  
      }).start();
      }  */
     /*  console.log('window ' + window);
      console.log('window ' + window.libVLCPlayer);
       let options: {autoPlay: true, hideControls: false}
      window.libVLCPlayer.play("rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream", [options], "this.onSuccess", "this.onFail"); */
     

  
    //  var childProcess = require("child_process");
   //   var oldSpawn = childProcess.spawn('npm', ['-v'], {stdio: 'inherit', shell: true})
  //let argument = ["rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream"]
  //let spawn = require('child_process').spawn;
  //let vlc = spawn('vlc',{stdio: 'inherit', shell: true});
  //var vlc = spawn('vlc', ['-v', 'v4l2:///dev/video0', ':chroma=H264' ,  ':v4l2-standard=NTSC', ':input-   slave=alsa://hw:4,0', ':live-caching=300', ':width=1024', ':height=570', ':fps=20',  ':sout=#file{dst=test.asf}', ':sout-keep']);
  /* var vlc = spawn ("vlc", ["rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream"], { shell: true });
  console.log('vlc ' + vlc.on);

  vlc.stdout.on('data', function(data) {
    console.log(data.toString());
});

  vlc.stderr.on ("data", (data) => {
    console.error ("error: " + data.toString ());
});

  
  vlc.on('exit', function(code){
      console.log('Exit code: ' + code);
  }); */
  

  
  const options = {
    name: 'streamName',
    url: 'rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream',
    wsPort: 5000
  }
  
 new Stream(options).start()

 let player = new JSMpeg.Player('ws://localhost:5000',
     { canvas: this.streamingcanvas, autoplay: true, audio: false, loop: true })
  
}
}