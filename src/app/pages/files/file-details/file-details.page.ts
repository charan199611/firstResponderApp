import { Component, OnInit } from '@angular/core';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.page.html',
  styleUrls: ['./file-details.page.scss'],
})
export class FileDetailsPage implements OnInit {


  mediaName;
  mediaPath;
  basicId;
  vehicleId;
  mediaList = [];

 
  constructor(private customNavService: CustomNavService, private http: CustomHttpClient,
     private commonService: CommonServices, private translateService: TranslateService) {

    this.basicId = this.customNavService.get('basicId');
    this.vehicleId = this.customNavService.get('vehicleId');
    console.log("mediatype", this.basicId);
    console.log("mediatype", this.vehicleId);
   

   this.initializeMedia();
   }

  ngOnInit() {
  }

  getFileExtensionData(medianame){
    let mediaData : any;
   
     mediaData = medianame.split(".");

     console.log(mediaData);
  }


  initializeMedia(){
   // this.mediaDisplay("https://cloudfileserver.trinityiot.in:8443/fileUpload/police-icon.png","FDGHDG");
    this.commonService.showLoader("Loading...")

    let data = {
      vehicle_id: this.vehicleId,
      basicId: this.basicId
    };

    this.http.post('Responder/fetch_attached_files', data).subscribe(data => {

      this.mediaList = data.value;
      console.log("medialist", this.mediaList);
      this.commonService.hideLoader();

    }, (error) => {
      this.commonService.hideLoader();
    });
  }


  mediaDisplay(path, name){
let mediatype;
console.log("filename", name);
console.log("filePath", path);
if((name != "") && (name != undefined)){  
if(this.getFileName(name)){
  mediatype = this.getFileExtension(name);
}else{
  mediatype = this.getFileExtensionFromPath(path)
}
 }else{
  mediatype = this.getFileExtensionFromPath(path)
 }
 console.log("mediatype", mediatype);

 if(mediatype != 5){

    this.customNavService.navigateByUrl('files/file-display', { mediaType: mediatype, media: path });
 }else{
   this.showFile(path, name)
 }
  }

  getFileName(media){
    let mediaData = media.split(".");

    if(mediaData.length > 1){
      return true;
    }else{
      return false;
    }
  }

  getFileExtension(medianame){
   let mediaData : any;

   
     mediaData = medianame.split(".");

     console.log(mediaData);
     console.log("mediadata1", mediaData[1]);
    if (mediaData[1].includes('png') || mediaData[1].includes('jpg') || mediaData[1].includes('jpeg')) {
      console.log('containspng');
      return 1
      //this.atr.atrType = 'image'
    } else if (mediaData[1].includes('mp4')) {
      return 2
    }  else if (mediaData[1].includes('pdf')) {
      return 3
    } else if(mediaData[1].includes('mp3') || mediaData[1].includes('wav')){
      return 4
    } else if(mediaData[1].includes('xlsx')){
     return 5

  }
  }

  getFileExtensionFromPath(medianame){
    let mediaData : any;
    
    let  media = medianame.split("/");
    mediaData = media[4].split(".");
 
      console.log(mediaData);
     if (mediaData[1].includes('png') || mediaData[1].includes('jpg') || mediaData[1].includes('jpeg')) {
       console.log('containspng');
       return 1
       //this.atr.atrType = 'image'
     } else if (mediaData[1].includes('mp4')) {
       return 2
     }  else if (mediaData[1].includes('pdf')) {
       return 3
     } else if(mediaData[1].includes('mp3') || mediaData[1].includes('wav')){
       return 4
     } else if(mediaData[1].includes('xlsx')){
      return 5
     }
   }

   getLabelName(path, name){
     let fileName;
    if((name != "") && (name != undefined)){   
     
      return name;
     }else{
      let  mediaData = path.split("/");
     return mediaData[4];
       
     }
   }

   showFile(path, name){

    saveAs(path, name);

   }

}
