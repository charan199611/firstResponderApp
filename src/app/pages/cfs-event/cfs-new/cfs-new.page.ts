import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController, AlertController } from '@ionic/angular';
// import { Customizer } from './../../providers/customizer';
// import { ApplicationConfig } from './../../providers/application-config';
// import { LoggerService } from './../../providers/logger-service';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { FcmService } from 'src/app/services/fcm.service';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { TranslateService } from '@ngx-translate/core';
// import { ViewChild, ElementRef } from '@angular/core';
// import { SQLite } from 'ionic-native';
// import { NavController, NavParams, Platform } from '@ionic/angular';


interface eventMainType {
  dept_id: number;
  type_code: number;
  event_type: string;
}

interface eventSubType {
  event_description: string;
  event_code: number;
  type_id: number;
}

@Component({
  selector: 'app-cfs-new',
  templateUrl: './cfs-new.page.html',
  styleUrls: ['./cfs-new.page.scss'],
})
export class CfsNewPage implements OnInit {
  public eventTypeList;
  public eventSubTypeList;
  static instance: CfsNewPage;

  public newCFS = {
    distressName: "",
    distressContactNo: "",
    distressAddress: "",
    eventMainType: -1,
    eventSubType: -1,
    additionalDetails: "",
    longitude: 0,
    latitude: 0,
    priority: 3,
    vehicle_id: '',
    mdt_userid: '',
    simNo: ''
  };

  language="en";
 

  // 'file:/C:/Users/sonali.s/Downloads/find (1).png'
  mediafiles = [{
    fileLocalPath: 'assets/img/attach.png', isFileAttached: false, fileType: 'image',
    fileUploadedUrl: '', fileTypeId: null,
    fileLocalPathDisplay: '', filepath: 'assets/img/attach.png'
  },
  //  {
  //   fileLocalPath: 'assets/img/attach.png',
  //   isFileAttached: false, fileType: 'image', fileUploadedUrl: '', fileTypeId: null,
  //   fileLocalPathDisplay: '', filepath: 'assets/img/attach.png'
  // },
  // {
  //   fileLocalPath: 'assets/img/attach.png', isFileAttached: false, fileType: 'image',
  //   fileUploadedUrl: '', fileTypeId: null,
  //   fileLocalPathDisplay: '', filepath: 'assets/img/attach.png'
 // }
]
  updateImage: number;

  mdtDetails: any = {
    vehicleId: String,
    departmentId: String,
  
  }

  cfsFiles = [];
  

  fileuploadedUrl;
  fileType;
  fileName;
  location:{
    latitude:"",
    longitude: ""
  }
  

  constructor(private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController, 
    private httpClient: CustomHttpClient,private eventService: EventsDbService,private ngZone: NgZone,
     private commonService: CommonServices, private http: HttpClient, private customservice: CustomNavService,
     private applicationConfig: ApplicationConfigProvider, private customNav:CustomNavService, private translateService: TranslateService) {

    CfsNewPage.instance = this;


    this.getVehiclesInfo();
    this.newCFS.latitude = this.applicationConfig.latitude;
    this.newCFS.longitude = this.applicationConfig.longitude;

  }



  ngOnInit() {


    if (window.localStorage.getItem("language") === null || window.localStorage.getItem("language") === undefined) {
      this.language = "en";
    } else if(window.localStorage.getItem("language") == "arb"){
      this.language="ar";
    }else if(window.localStorage.getItem("language") == "en"){
      this.language="en";
      // this.translateService.use(window.localStorage.getItem("language"));
    }
  


    this.httpClient.post('Responder/event_type/'+this.language+'', {}).subscribe((data) => {
      console.log('Responder/event_type', data.eventtyperesult);
      this.eventTypeList = data.eventtyperesult;

      if(this.language == "ar"){
        for(var i=0; i<this.eventTypeList.length; i++){
          this.eventTypeList[i].event_name = this.eventTypeList[i].event_name_arabic;
        }
      }
      

    });

    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('Pos: ', position);
      this.CfsNewPage.latitude = position.coords.latitude
      this.CfsNewPage.longitude = position.coords.longitude
    }, function (error) {
      console.log('Errer', error);
    });
  }



  getVehiclesInfo(){
    this.eventService.getVehicleDetails().then((res: any) => {

      for (let entry of res) {
        console.log('entry===>', entry.vehicleId);
  

        this.mdtDetails.vehicleId = entry.vehicleId
        this.mdtDetails.departmentId = entry.departmentId
      

      }
    });
  }

  public displayCFSForm: boolean = true;
  // public eventSortedList: Array<eventSubType>;
  public eventSortedList;



  //   constructor(public navCtrl: NavController, public navParams: NavParams, private http: CustomHttpClient, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, private customizer: Customizer, public modalCtrl: ModalController) {
  //     this.http.post("Responder/eventtype", { language: "en" }).subscribe(value => {
  //      // this.logger.log(LoggerService.INFO, CfsNewPage.name, "Responder/eventtype"+JSON.stringify(value))
  //       this.eventTypeList = value.json();
  //     });


  //     this.http.post("Responder/event_subtype", { language: "en" }).subscribe(value => {
  //  //this.logger.log(LoggerService.INFO, CfsNewPage.name, "Responder/event_subtype"+JSON.stringify(value))
  //       this.eventSubTypeList = value.json();
  //     });

  //     this.geolocation.getCurrentPosition().then((position: Geoposition) => {
  //       this.nativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude).then(location => {
  //         this.newCFS.distressAddress = ((location.houseNumber == undefined ? " " : location.houseNumber + ",") + " " + (location.street == undefined ? " " : location.street + ",") + " " + (location.city == undefined ? " " : location.city + ",") + " " + location.countryName + "-" + location.postalCode).trim();
  //         this.newCFS.latitude = position.coords.latitude;
  //         this.newCFS.longitude = position.coords.longitude;
  //       })
  //     });
  //   }





  //   ionViewDidLoad() {
  //     console.log('ionViewDidLoad CfsNewPage');
  //   }
  //   presentModal() {
  //     alert("opened")
  //     this.navCtrl.push(createCFSLocatorModal)
  //   }

  getSubType(mainType) {
    console.log('getSubType', mainType);

    this.eventSortedList = [];
    this.httpClient.post('/Responder/event_subtype/'+this.language+'/' + mainType, {}).subscribe((data) => {
      this.eventSortedList = data.layerresult;
      if(this.language == "ar"){
        for(var i=0; i<this.eventSortedList.length; i++){
          this.eventSortedList[i].event_name = this.eventSortedList[i].event_name_arabic;
        }
      }
    });

  }


  createCFSSubmit() {

    let data = {
      name: this.newCFS.distressName,
      address: this.newCFS.distressAddress,
      mainEventTypeId: this.newCFS.eventMainType,
      subEventTypeId: this.newCFS.eventSubType,
      vehicleId: localStorage.getItem('vehicleId'),
      latitude: this.newCFS.latitude,
      longitude: this.newCFS.longitude,
      location: this.newCFS.distressAddress,
      landmark: this.newCFS.distressAddress,
      primaryContact: this.newCFS.distressContactNo,
      narrative: this.newCFS.additionalDetails,
      deptId:  this.mdtDetails.departmentId,
      fileName: this.fileName,
      filePath:this.fileuploadedUrl,
      fileType:this.fileType
    }
    this.commonService.showLoader("Please wait...");
    console.log(JSON.stringify(this.newCFS));
    this.httpClient.post( 'Responder/createEventFromMDT/', data).subscribe(value => {
      //this.logger.log(LoggerService.INFO, CfsNewPage.name, "createCFSSubmit Responder/createnewcfs" + JSON.stringify(value))
      this.commonService.hideLoader();
  
      let result = value;
      console.log("result", result);
      console.log("resultStatus", result.STATUS);
      if (result.STATUS === true) {
        this.commonService.hideLoader();
        this.commonService.presentAutoHideToast("Event created successfully!")
        this.customNav.popPage();
        //this.customizer.presentAutoHideToast("Event created successfully.");
       
      } else {
        this.commonService.presentAutoHideToast("Unable to create event. Please try again later!")
        // this.customizer.presentAutoHideToast("Event created successfully.");
        // this.navCtrl.pop();
        this.commonService.hideLoader();

      }
    }, error => {
      this.commonService.hideLoader();
      this.commonService.presentAutoHideToast("Unable to create event. Please try again later!")
      //this.customizer.presentAutoHideToast("Error in creating CFS. Error ==> " + JSON.stringify(error));

    });
  }

  currentLocationAddress="";
  updateLocationByMap() {
    this.customservice.navigateForward('map', {
             callback: this.myCallbackFunction, reportService: this.newCFS,
         });
 }

 myCallbackFunction = (_params) => {
  return new Promise((resolve, reject) => {
      console.log("after Call Back the return params are :::=>", _params);
      this.updateMapLocation(_params);
  });
}


async updateMapLocation(locationDetails) {

  let locationMap: any = {};


  this.translateService.get(['Are you sure to change the address location to below address?', 'Cancel', 'Ok']).subscribe(text => {
    locationMap.title = text['Are you sure to change the address location to below address?'];
    locationMap.cancelButton = text['Cancel'];
    locationMap.okButton = text['Ok'];

  });
  let alert =await this.alertCtrl.create({
      header: locationMap.title ,
      message: locationDetails.address,
      buttons: [
          {
              text: locationMap.cancelButton,
              role: 'cancel',
              handler: () => {
                  console.log('Cancel clicked');
              }
          },
          {
              text: locationMap.okButton,
              handler: () => {

                console.log("location address", locationDetails);
              
                  this.currentLocationAddress = locationDetails;
                  this.newCFS.distressAddress = locationDetails.place[0];
                  this.newCFS.latitude = locationDetails.latitude;
                  this.newCFS.longitude = locationDetails.longitude;
                  
              }
          }
      ]
  });
  alert.present();
}

  //   saveEvent() {

  //   }

  // }

  // @Component({
  //   selector: 'page-newmap',
  //   template: `
  //   <ion-header>

  //   <ion-navbar>
  //     <ion-title>
  //       <img class="header-logo" src="assets/img/logo/logo_small_new.png"> <span class="header-title">Create CFS</span>
  //     </ion-title>
  //   </ion-navbar>

  // </ion-header>


  // <ion-content>
  //     <div #map id="map"></div>
  //     </ion-content>
  //   `
  // })

  // export class createCFSLocatorModal {

  //   @ViewChild('map') mapElement: ElementRef;
  //   public map: GoogleMap;

  //   constructor(private googleMaps: GoogleMaps, private nativeGeocoder: NativeGeocoder) { }

  //   ionViewDidLoad() {
  //     alert("ionViewDidLoad");
  //     console.log('ionViewDidLoad CfsNewPage');
  //     this.loadMap();
  //   }

  //   loadMap() {
  //     alert("loadMap");
  //     this.map = this.googleMaps.create(this.mapElement.nativeElement);

  //     this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
  //         this.map.clear();

  //       this.showMyLocation();

  //     });
  //   }
  //   showMyLocation() {
  //     alert("showMyLocation");
  //     this.map.getMyLocation().then(location => {
  //       alert(JSON.stringify(location));
  //       let myPositionMarker: MarkerOptions = {
  //         position: location.latLng,
  //         title: "My Location"

  //       };

  //       this.map.addMarker(myPositionMarker).then((marker: Marker) => {
  //         alert('addmarker');
  //         let icon: MarkerIcon = {
  //           url: "http://www.i2clipart.com/cliparts/7/6/3/4/clipart-nioubiteul-7634.png",
  //           size: 5
  //         };
  //         marker.setIcon(icon);
  //         marker.showInfoWindow();

  //         let position = {
  //           target: location.latLng,
  //           zoom: 15,
  //           tilt: 0
  //         }

  //         this.map.moveCamera(position);
  //       });

  //     });
  //   }

  async updateFile(fileIndex, fileLoader) {
    let fileUpload: any = {};

    this.translateService.get(['Select File Type', 'Image', 'Video', 'PDF', 'Audio', 'Cancel']).subscribe(text => {
      fileUpload.title = text['Select File Type'];
      fileUpload.imageText = text['Image'];
      fileUpload.videoText = text['Video'];
      fileUpload.pdfText = text['PDF'];
      fileUpload.audioText = text['Audio'];
      fileUpload.cancelText = text['Cancel'];
  

    });

    let actionSheet = await this.actionSheetCtrl.create({
      header: fileUpload.title,

      buttons: [
        {
          text: fileUpload.imageText,
          icon: 'camera',
          role: 'Image',
          handler: () => {
            this.pickFile(this.updateImage, 'Image', fileIndex, fileLoader)
          }
        }, {
          text: fileUpload.videoText,
          icon: 'videocam',
          role: 'Video',
          handler: () => {
            this.pickFile(this.updateImage, 'Video', fileIndex, fileLoader)

          }
        }, {
          text: fileUpload.pdfText,
          icon: 'document',
          role: 'PDF',
          handler: () => {
            this.pickFile(this.updateImage, 'PDF', fileIndex, fileLoader)
          }
        }, {
          text: fileUpload.audioText,
          icon: 'play',
          role: 'Audio',
          handler: () => {
            this.pickFile(this.updateImage, 'Audio', fileIndex, fileLoader)
          }
        }, {
          text: fileUpload.cancelText,
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  async pickFile(mediaType: number, titlePostFix: string, fileIndex, fileLoader) {

    let fileUpload: any = {};

    this.translateService.get(['Upload ' + titlePostFix + ' From', 'Gallery']).subscribe(text => {
      fileUpload.uploadTitle = text['Upload ' + titlePostFix + ' From'];
      fileUpload.galleryText = text['Gallery'];
     
  

    });


    (await this.alertCtrl.create({
      header: fileUpload.uploadTitle,
      subHeader: '',
      cssClass: "custom-loader",
      buttons: [
        // {
        //   text: 'Camera',
        //   handler: (data: any) => {
        //     console.log('media type when camera is pressed is ', mediaType);
        //     this.takePicture(fileLoader, fileIndex);

        //   }
        // },
        {
          text: fileUpload.galleryText,
          handler: (data: any) => {
            if(titlePostFix == "Image"){
              this.takePicture(fileLoader, fileIndex);
            }
            if(titlePostFix == "Video"){
              this.takeVideo(fileLoader, fileIndex);
            }
            if(titlePostFix == "Audio"){
              this.takeAudio(fileLoader, fileIndex);
            }
            if(titlePostFix == "PDF"){
              this.takePdf(fileLoader, fileIndex);
            }
           
          }
        }
      ]
    })).present();
  }

  takeVideo(fileLoader, fileIndex){
    console.log("fileindex", fileIndex);
    fileLoader.click();
    var that = this;

   console.log("fileLoader", fileLoader);

    fileLoader.onchange = function () {
      var file = fileLoader.files[0];

      // showPicture();

      const reader = new FileReader();

      console.log("image", file);


      


     console.log(this.mediafiles);
    //  for (let i of fileLoader.files) {

      CfsNewPage.instance.ngZone.run(() => {

        console.log("cfsFileIndex",CfsNewPage.instance.cfsFiles[fileIndex]);

        if(CfsNewPage.instance.cfsFiles[fileIndex] != undefined){
          CfsNewPage.instance.cfsFiles[fileIndex]  = fileLoader.files[0]
        }else{
          CfsNewPage.instance.cfsFiles.push(fileLoader.files[0]);
        }
 
        
       


      
        CfsNewPage.instance.mediafiles[fileIndex].fileLocalPath = "file://"+CfsNewPage.instance.cfsFiles[fileIndex].path.split('\\').join('/');;;
        CfsNewPage.instance.mediafiles[fileIndex].isFileAttached = true
        CfsNewPage.instance.mediafiles[fileIndex].fileType = 'video'
        CfsNewPage.instance.mediafiles[fileIndex].fileUploadedUrl = ""
        CfsNewPage.instance.mediafiles[fileIndex].fileTypeId = 2;
        CfsNewPage.instance.mediafiles[fileIndex].fileLocalPathDisplay = '';
        CfsNewPage.instance.mediafiles[fileIndex].filepath = 'assets/img/play.png';
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0]);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0].name);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0].path);
      })

    
      reader.addEventListener("load", function () {

      
      }, false);

      if (file) {
        reader.readAsDataURL(file);
        
      
      }




    }
  }

  takeAudio(fileLoader, fileIndex){
    console.log("fileindex", fileIndex);
    fileLoader.click();
    var that = this;

   console.log("fileLoader", fileLoader);

    fileLoader.onchange = function () {
      var file = fileLoader.files[0];

      // showPicture();

      const reader = new FileReader();

      console.log("image", file);


      


     console.log(this.mediafiles);
    //  for (let i of fileLoader.files) {

      CfsNewPage.instance.ngZone.run(() => {

        console.log("cfsFileIndex",CfsNewPage.instance.cfsFiles[fileIndex]);

        if(CfsNewPage.instance.cfsFiles[fileIndex] != undefined){
          CfsNewPage.instance.cfsFiles[fileIndex]  = fileLoader.files[0]
        }else{
          CfsNewPage.instance.cfsFiles.push(fileLoader.files[0]);
        }
 
        
       


      
        CfsNewPage.instance.mediafiles[fileIndex].fileLocalPath = "file://"+CfsNewPage.instance.cfsFiles[fileIndex].path.split('\\').join('/');
        CfsNewPage.instance.mediafiles[fileIndex].isFileAttached = true
        CfsNewPage.instance.mediafiles[fileIndex].fileType = 'audio'
        CfsNewPage.instance.mediafiles[fileIndex].fileUploadedUrl = ""
        CfsNewPage.instance.mediafiles[fileIndex].fileTypeId = 2;
        CfsNewPage.instance.mediafiles[fileIndex].fileLocalPathDisplay = '';
        CfsNewPage.instance.mediafiles[fileIndex].filepath = '/assets/img/headphone.png';
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0]);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0].name);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0].path);
      })

    
      reader.addEventListener("load", function () {

      
      }, false);

      if (file) {
        reader.readAsDataURL(file);
        
      
      }
    }
  }

  takePdf(fileLoader, fileIndex){
    console.log("fileindex", fileIndex);
    fileLoader.click();
    var that = this;

   console.log("fileLoader", fileLoader);

    fileLoader.onchange = function () {
      var file = fileLoader.files[0];

      // showPicture();

      const reader = new FileReader();

      console.log("image", file);


      


     console.log(this.mediafiles);
    //  for (let i of fileLoader.files) {

      CfsNewPage.instance.ngZone.run(() => {

        console.log("cfsFileIndex",CfsNewPage.instance.cfsFiles[fileIndex]);

        if(CfsNewPage.instance.cfsFiles[fileIndex] != undefined){
          CfsNewPage.instance.cfsFiles[fileIndex]  = fileLoader.files[0]
        }else{
          CfsNewPage.instance.cfsFiles.push(fileLoader.files[0]);
        }
 

        CfsNewPage.instance.mediafiles[fileIndex].fileLocalPath = "file://"+CfsNewPage.instance.cfsFiles[fileIndex].path.split('\\').join('/');
        CfsNewPage.instance.mediafiles[fileIndex].isFileAttached = true
        CfsNewPage.instance.mediafiles[fileIndex].fileType = 'pdf'
        CfsNewPage.instance.mediafiles[fileIndex].fileUploadedUrl = ""
        CfsNewPage.instance.mediafiles[fileIndex].fileTypeId = 2;
        CfsNewPage.instance.mediafiles[fileIndex].fileLocalPathDisplay = '';
        CfsNewPage.instance.mediafiles[fileIndex].filepath = '/assets/img/pdf.png';
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0]);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0].name);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0].path);
      })

    
      reader.addEventListener("load", function () {

      
      }, false);

      if (file) {
        reader.readAsDataURL(file);
        
      
      }
    }
  }

  takePicture(fileLoader, fileIndex) {
    console.log("fileindex", fileIndex);
    fileLoader.click();
    var that = this;

   console.log("fileLoader", fileLoader);

    fileLoader.onchange = function () {
      var file = fileLoader.files[0];

      // showPicture();

      const reader = new FileReader();

      console.log("image", file);


      


     console.log(this.mediafiles);
    //  for (let i of fileLoader.files) {

      CfsNewPage.instance.ngZone.run(() => {

        console.log("cfsFileIndex",CfsNewPage.instance.cfsFiles[fileIndex]);

        if(CfsNewPage.instance.cfsFiles[fileIndex] != undefined){
          CfsNewPage.instance.cfsFiles[fileIndex]  = fileLoader.files[0]
        }else{
          CfsNewPage.instance.cfsFiles.push(fileLoader.files[0]);
        }
 
        
       


      
        CfsNewPage.instance.mediafiles[fileIndex].fileLocalPath = "file://"+CfsNewPage.instance.cfsFiles[fileIndex].path.split('\\').join('/');
        CfsNewPage.instance.mediafiles[fileIndex].isFileAttached = true
        CfsNewPage.instance.mediafiles[fileIndex].fileType = 'video'
        CfsNewPage.instance.mediafiles[fileIndex].fileUploadedUrl = ""
        CfsNewPage.instance.mediafiles[fileIndex].fileTypeId = 2;
        CfsNewPage.instance.mediafiles[fileIndex].fileLocalPathDisplay = '';
        CfsNewPage.instance.mediafiles[fileIndex].filepath ="file://"+CfsNewPage.instance.cfsFiles[fileIndex].path.split('\\').join('/');
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0]);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0].name);
        console.log('that.cfs.cfsFiles', CfsNewPage.instance.cfsFiles[0].path);
      })

    
      reader.addEventListener("load", function () {

      
      }, false);

      if (file) {
        reader.readAsDataURL(file);
        
      
      }




    }

  }
    updateCfsImages() {

     // this.commonService.showLoader("Please wait...");
      let counter = 0;
      if (this.cfsFiles.length > 0) {
        for (let j of this.cfsFiles) {
          counter++;
          this.uploadFile(j, counter);
        }
      } else  {
        this.createCFSSubmit();
      }
    }


    uploadFile(file: File, count) {
      let data = []
      const formData = new FormData();
      formData.append('uploadedfile1', file);
  
      this.http.post(this.applicationConfig.fileUploadUrl + FcmService.phpUpload, formData).subscribe(
        (res) => {
          console.log('ouputresult', res)
        },
        (err) => {
          console.log('errorpage', err)
          if(count == this.cfsFiles.length){
            this.commonService.hideLoader();
          }
          if (err.status == 200 && err.error.text.includes('The file')) {
  
            data = err.error.text.split(" ")


            console.log('spliteed data==>', data);

            this.fileuploadedUrl = this.applicationConfig.fileUploadUrl + data[2]
            this.fileType = this.getImageUploadedExtention(data);
            this.fileName = data[2];

            console.log("filename", data[2]);
  
            if (count == this.cfsFiles.length) {
              this.createCFSSubmit() 
            }
          }
        }
      );
    }

    getImageUploadedExtention(data) {

      console.log(data);
  
  
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


