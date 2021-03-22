import { Component, OnInit, NgZone } from '@angular/core';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { HttpClient } from '@angular/common/http';
import { FcmService } from 'src/app/services/fcm.service';
import { Router } from '@angular/router';
import { AudioRecorderPage } from '../shared-pages/audio-recorder/audio-recorder.page';
import { ModalController, AlertController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';


@Component({
  selector: 'app-atr',
  templateUrl: './atr.page.html',
  styleUrls: ['./atr.page.scss'],
})
export class AtrPage implements OnInit {
  test: any;
  selectedData: any;
  public atr = {
    eventId: "",
    atrText: "",
    atrImages: [],
    atrVideos: [],
    atrAudio: [],
    atrStrAudio: [],
    basicId: 0,
    files: [],
    vehicleId: 0,
    cityId: 0,
    cityZoneId: "",
    deptId: 0,
    psId: 0,
    atrType: '',
    fileuploadedUrl: '',
    status:''
  };

  // removeImage;
  // removeVideo;
  // removeAudio;
  removeFilepath;
  static instance: AtrPage;
  cfsDetails;
  Sample_suggestions = [];
  public fetchVehicleDetails: {
    callSign: string,
    vehicleId: string;
    userName: string;
  };
  atrRemarks = [];
  selecetdAtrRemarks;
  language;
  suggestionAtrText;
  serviceType;

  constructor(private http: CustomHttpClient, private theDB: SqliteDb, private customNavService: CustomNavService, private modalCtrl: ModalController,
    private eventService: EventsDbService, private ngZone: NgZone, private httpClient: HttpClient, private router: Router, private domSanitizer: DomSanitizer,
    private commonService: CommonServices, private translateService: TranslateService, private alertCtrl: AlertController, private appConfig:ApplicationConfigProvider) {
    AtrPage.instance = this;
  }

  ngOnInit() {
    this.getLanguage();
    this.fetchVehicleInfo();
    
    this.cfsDetails = this.customNavService.get('eventDetails');
    this.serviceType = this.customNavService.get('servicedata');
    this.setAtrDetails();
    this.getAtrText();

    this.getAtrSuggestion();
    
  }
  

 



  getLanguage(){
    if (window.localStorage.getItem("language") === null || window.localStorage.getItem("language") === undefined) {
      this.language = "en";
    } else if(window.localStorage.getItem("language") == "arb"){
      this.language="ar";
    }else if(window.localStorage.getItem("language") == "en"){
      this.language="en";
      // this.translateService.use(window.localStorage.getItem("language"));
    }
  }

  setAtrDetails() {
    this.atr.eventId = this.cfsDetails.eventid
    this.atr.basicId = this.cfsDetails.basicid;
    this.atr.cityId = this.cfsDetails.cityId;
    this.atr.cityZoneId = this.cfsDetails.cityZoneId;
    this.atr.deptId = this.cfsDetails.deptId;
    this.atr.psId = this.cfsDetails.psId;
    this.atr.status = this.cfsDetails.status;
  }


  fetchVehicleInfo() {
    this.eventService.getVehicleDetails().then((vehicleMessage) => {
      let data = vehicleMessage[0];
      this.atr.vehicleId = data.vehicleId;

      this.fetchVehicleDetails = {
        callSign: data.vehicleCallSign,
        vehicleId: data.vehicleId,
        userName: data.loginUsername,

      };
    })
  }

  updateCFSAtr() {
    let counter = 0;
    if (this.atr.files.length > 0) {
      for (let j of this.atr.files) {
        counter++;
        this.uploadFile(j, counter);
      }
    } else if (this.atr.atrText) {

      this.atr.atrType = "Additional Details";
      
      this.updateAtrStatus();
    }else{
      this.commonService.presentAutoHideToast("Plesae Attach a file!")
    }
  }



  takePicture(fileLoader) {

    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      var reader = new FileReader();

      console.log('fileloader', fileLoader.files);

      if (fileLoader.files.length > 0) {
        for (let i of fileLoader.files) {
          AtrPage.instance.atr.files.push(i);
          AtrPage.instance.ngZone.run(() => {
            AtrPage.instance.atr.atrImages.push(i);
            console.log('that.atr.atrImages', AtrPage.instance.atr.atrImages);
          })

        }
      }

      reader.addEventListener("load", function () {
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  
  }

  takeVideo(fileLoader) {

    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      var reader = new FileReader();

      console.log('fileloader', fileLoader.files);

      if (fileLoader.files.length > 0) {
        for (let i of fileLoader.files) {
          AtrPage.instance.atr.files.push(i);
          AtrPage.instance.ngZone.run(() => {
            AtrPage.instance.atr.atrVideos.push(i);
            console.log('that.atr.atrVideos', AtrPage.instance.atr.atrVideos);
          })

        }
      }

      reader.addEventListener("load", function () {
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }
  urls = [];
  async recordAudio() {
    let details = await this.modalCtrl.create({
      component: AudioRecorderPage,
      componentProps: {}
    });

    details.onDidDismiss().then(data => {
      console.log('onDidDismiss', data);
      this.urls.push(data.data);
      this.atr.atrAudio.push(data);
      this.atr.files.push(data.data);
      //this.takeAudio(data, fileIndex);
    })
    details.present();

  }
  sanitize(url: string) {
    console.log('stringurl', url);

    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  openAtrSuggestion() {
    this.showAtrText();
  }
  addicondata: File[];
  fileAttachChangeEvent(event) {
    this.addicondata = event.target.files;
  }

  uploadFile(file: File, count) {
    let data = []
    const formData = new FormData();
    formData.append('uploadedfile1', file);

    this.httpClient.post(this.appConfig.fileUploadUrl + FcmService.phpUpload, formData).subscribe(
      (res) => {
        console.log('ouputresult', res)
      },
      (err) => {
        console.log('errorpage', err)
        if (err.status == 200 && err.error.text.includes('The file')) {

          data = err.error.text.split(" ")
          console.log('spliteed data==>', data);
          this.atr.fileuploadedUrl = this.getFileUploadUrl(data);
          // this.atr.fileuploadedUrl = FcmService.uploadMediaUrl + data[2]
          this.atr.atrType = this.getImageUploadedExtention(data);
          console.log('this.atr.atrType', this.atr.fileuploadedUrl);

          if (count == this.atr.files.length) {
            this.updateAtrStatus();
          }
        }
      }
    );
  }

  getFileUploadUrl(data){
    console.log(data);
    if(data.length == 8){

     
     return this.appConfig.fileUploadUrl + data[2]+" "+data[3];
    }else{
      return this.appConfig.fileUploadUrl + data[2];
    }
  }


  updateAtrStatus() {

    console.log("atrType", this.atr.atrType);
    

    let params = {
      "vehicle_id": this.atr.vehicleId,
      "call_sign": this.fetchVehicleDetails.callSign,
      "event_id": this.atr.eventId,
      "basic_id": this.atr.basicId,
      "dept_id": this.atr.deptId,
      "city_id": this.atr.cityId,
      "cityzone_id": this.atr.cityZoneId,
      "from_user": this.cfsDetails.fromUserType,
      "station_id": this.atr.psId,
      "media_type": this.atr.atrType,
      "text": this.atr.atrText,
      "status": this.atr.status,
      "path": this.atr.fileuploadedUrl,
      "from_user_name": this.cfsDetails.fromUserName
    };

    this.commonService.showLoader("Loading...")

    this.http.post('Responder/update_atr', params).subscribe(data => {
      console.log(JSON.stringify(data));
      let result = data
      console.log('fcmservicesdata', result);
      this.commonService.hideLoader();

      if (result.Result.includes('Success')) {
        console.log('inside if condition');
        this.commonService.hideLoader();
        this.commonService.presentAutoHideToast("ATR updated Successfully!")
        AtrPage.instance.atr.files = [];
        AtrPage.instance.atr.atrImages = [];
        AtrPage.instance.atr.atrVideos = [];
        AtrPage.instance.atr.atrAudio = [];
        this.atr.atrText = "";

       // this.customNavService.popPage();
      } else {
        this.commonService.presentAutoHideToast("Please Try again!")
      }
    });
  }

  getImageUploadedExtention(data) {

    console.log(data);
    if(data.length == 8){

     let mediaData  = data[3].split(".")
      if (mediaData[1].includes('png') || mediaData[1].includes('PNG') || mediaData[1].includes('jpg') || mediaData[2].includes('jpeg')) {
        console.log('containspng');
        return 'Image'
        //this.atr.atrType = 'image'
      } else if (mediaData[1].includes('mp4')) {
        return 'Video'
      } else if (mediaData[1].includes('mp3')) {
        return 'Audio'
      }
    }else{
      if (data[2].includes('png') || data[2].includes('PNG') || data[2].includes('jpg') || data[2].includes('jpeg')) {
        console.log('containspng');
        return 'Image'
        //this.atr.atrType = 'image'
      } else if (data[2].includes('mp4')) {
        return 'Video'
      } else if (data[2].includes('mp3')) {
        return 'Audio'
      }
    }

   

  }

  removeImage(data){

  
    
   let index = this.atr.files.indexOf(data);
    let imageIndex = this.atr.atrImages.indexOf(data);
    if (index > -1) {
      this.atr.files.splice(index, 1);
    }
    if(imageIndex > -1){
      this.atr.atrImages.splice(imageIndex,1);
    }

  }

  removeVideo(data){

    
    let index = this.atr.files.indexOf(data);
     let videoIndex = this.atr.atrVideos.indexOf(data);

     if (index > -1) {
       this.atr.files.splice(index, 1);
     }
     if(videoIndex > -1){
       this.atr.atrVideos.splice(videoIndex,1);
     }
  }

  removeAudio(data){

    let index = this.atr.files.indexOf(data.data);
     let audioIndex = this.atr.atrAudio.indexOf(data);
     if (index > -1) {
       this.atr.files.splice(index, 1);
     }
     if(audioIndex > -1){
       this.atr.atrAudio.splice(audioIndex,1);
     }

  }

  getAtrText(){
    this.http.get('Responder/get_atrtextoptions/'+this.language).subscribe(data => {

      let result = data
      this.commonService.hideLoader();
      this.atrRemarks = data.Value;
      console.log("atrRemarks", this.atrRemarks);
      // console.log("atrRemarks", this.atrRemarks.Value);

    }, err =>{


    });
  }

  async showAtrText(){
    let isStatusChecked = false;
    let atrText: any = {};

    this.translateService.get(['Please Choose any Remarks', 'Cancel', 'Ok']).subscribe(text => {
      atrText.title = text['Please Choose any Remarks'];
      atrText.cancelButton = text['Cancel'];
      atrText.okButton = text['Ok'];

    });


    let options = {
      header: atrText.title,
      message: '',
      inputs: [],
      buttons: [
      
        {
          text: atrText.okButton,
          handler: data => {

            this.selecetdAtrRemarks = data;
            console.log("atrRemarks", this.atrRemarks.length);

            if (this.atr.atrText == "") {
              this.atr.atrText = this.selecetdAtrRemarks;
          } else {

            this.atr.atrText += ","+ this.selecetdAtrRemarks;
             
          }
          

          }
        },
        {
          text: atrText.cancelButton,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    };

    options.inputs = [];
    // // Now we add the radio buttons

    // console.log("length", this.missionStatus.length);
    for (let i = 0; i < this.atrRemarks.length; i++) {

      if(this.language == "ar"){
        this.atrRemarks[i].atr_text = this.atrRemarks[i].ATR_TEXT_ARABIC;
      }

    console.log("atrRemarks", this.atrRemarks);
    console.log("atrRemarks", this.atrRemarks[i].atr_text);
    
      options.inputs.push({ name: 'options', value: this.atrRemarks[i].atr_text, label: this.atrRemarks[i].atr_text, type: 'radio', checked: isStatusChecked })
    }

    // Create the alert with the options
    let radioButtonAlert = await this.alertCtrl.create(options);

    radioButtonAlert.present();
  }
  

  backFunction(){

    if(this.atr.atrText != ""){
       this.eventService.inserAtrOption(this.atr.atrText)
    }

    if(this.serviceType == "cfsevent"){
      this.customNavService.navigateRoot('/cfs-event/cfs-event-details');
    }else if(this.serviceType == "sosEvent"){
      this.customNavService.navigateRoot('/sos-event/sos-event-details');
    }else{
      this.customNavService.navigateRoot('/iot-incident/iot-incident-details');
    }
     
    
    
  }

  getAtrSuggestion(){
    this.eventService.fetchAtrOption().then((rowAtrText) => {
      // let data = vehicleMessage[0];
      // this.atr.vehicleId = data.vehicleId;

      // this.fetchVehicleDetails = {
      //   callSign: data.vehicleCallSign,
      //   vehicleId: data.vehicleId,
      //   userName: data.loginUsername,

      // };
      console.log("suggestionAtrText",rowAtrText )
      this.suggestionAtrText = rowAtrText;
    })
  }


 async showSuggestion(){

 if(this.suggestionAtrText.length > 0){
 
  let isStatusChecked = false;
    let atrText: any = {};

    this.translateService.get(['Please Choose any Suggestion', 'Cancel', 'Ok']).subscribe(text => {
      atrText.title = text['Please Choose any Suggestion'];
      atrText.cancelButton = text['Cancel'];
      atrText.okButton = text['Ok'];

    });


    let options = {
      header: atrText.title,
      message: '',
      inputs: [],
      buttons: [
       
        {
          text: atrText.okButton,
          handler: data => {

            this.selecetdAtrRemarks = data;
            console.log("atrRemarks", this.atrRemarks.length);

            if (this.atr.atrText == "") {
              this.atr.atrText = this.selecetdAtrRemarks;
          } else {

            this.atr.atrText += ","+ this.selecetdAtrRemarks;
             
          }
          

          }
        },
        {
          text: atrText.cancelButton,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    };

    options.inputs = [];
    // // Now we add the radio buttons

    // console.log("length", this.missionStatus.length);
    for (let i = 0; i < this.suggestionAtrText.length; i++) {

     
    // console.log("atrRemarks", this.atrRemarks);
    console.log("atrRemarks", this.suggestionAtrText[i].atr_texts);
    
      options.inputs.push({ name: 'options', value: this.suggestionAtrText[i].atr_texts, label: this.suggestionAtrText[i].atr_texts, type: 'radio', checked: isStatusChecked })
    }

    // Create the alert with the options
    let radioButtonAlert = await this.alertCtrl.create(options);

    radioButtonAlert.present();
  }
else{
  this.commonService.presentAutoHideToast("No Suggestion!")
}

}
}



