import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

// import { HomePage } from './../home/home';
// import { Customizer } from './../../providers/customizer';
// import { HttpClient } from './../../providers/http-client';
// import { StompService } from './../../providers/stomp-service';
// import { ApplicationConfig } from './../../providers/application-config';
// import { LocationTracker } from './../../providers/location-tracker';
// import { NativeStorage } from '@ionic-native/native-storage';
// import { LoginPage } from './../login/login';
// import { Component } from '@angular/core';
// import { NavController, NavParams, AlertController } from 'ionic-angular';

import * as moment from 'moment';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { Router } from '@angular/router';
import { FcmService } from 'src/app/services/fcm.service';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { IonRadioGroup } from '@ionic/angular';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';



interface OffRoadReason {

  offroad_reasons: string;
  id: string
}


@Component({
  selector: 'app-logoutodometer',
  templateUrl: './logoutodometer.page.html',
  styleUrls: ['./logoutodometer.page.scss'],
})
export class LogoutodometerPage implements OnInit {
  // @ViewChild('radioGroup') radioGroup: IonRadioGroup

  public odometer = {
    startValue: 0,
    endValue: undefined,
    status: 1
  }
  selectedRadioGroup: any;
  logoutStatus;
  logoutType;
  offroad_reason;


  vehicleDetails = {
    sim_no: '',
    userName: '',
    callSign: '',

    departmentId: "",
    city_id: "",
    station_id: "",
    city_zone_id: "",
    workforceUserId: "",

    phoneNumber: "",
    departmentCode: "",


  }

  offRoadData = [];

  loginUser = {
    uuid: ''
  }
  vehicleId;

  offRoadReasons: Array<OffRoadReason>;
  selectedReason: string;
  offRoadReasonId: string = "";
  offroadReasonHidden = true;
  errorMessage = "";

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, private http: CustomHttpClient,
     private router: Router, private fcmService: FcmService, private eventService: EventsDbService, private commonService: CommonServices,
      private translateService: TranslateService, private appConfig:ApplicationConfigProvider) {

    this.selectedRadioGroup = "1";
    this.logoutStatus = "1"
    // let id = machineIdSync(true);
    // this.loginUser.uuid = id;

    this.vehicleDetails.workforceUserId = localStorage.getItem('workforceUserId');
    this.vehicleDetails.phoneNumber = localStorage.getItem('phoneNumber');
    this.vehicleDetails.departmentCode = localStorage.getItem('departmentCode');
    this.vehicleDetails.sim_no = localStorage.getItem('simNo');

    console.log(this.vehicleDetails.workforceUserId);
    console.log(this.vehicleDetails.phoneNumber);
    console.log(this.vehicleDetails.departmentCode);

  }

  ngOnInit() {
    this.getAll();
    this.fetchOffRoadData();
  }
  fetchLastOdometerReading() {

    let vehicleData = {
      vehicle_id: this.vehicleId
    }
    this.http.post('Responder/fetch_last_odometer', vehicleData).subscribe(data => {
      let outPut = data
      console.log('fetchVehicleId', outPut);
      this.odometer.startValue = outPut.odometer_value
      //this.odometerreading.nativeElement.value = outPut.odometer_value
      this.odometer.startValue = outPut.odometer_value
    }, error => {

    });

  }


  radioGroupChange(event) {

    this.selectedRadioGroup = event.detail;
    if (event.detail.value == "1") {
      this.logoutType = 1;
      this.offroad_reason = 1;
    }

    if (event.detail.value == "2") {
      this.offroad_reason = "";
      this.radiogroupAlertPage();
    }
  }

  async radiogroupAlertPage() {

    //  let radioButtonAlert = await this.alertCtrl.create({
    //   cssClass: "custom-loader",
    //   // header: "nvnvbn",
    //   // subHeader: "selectOptions",


    // });
    let offRoadReasonAlert: any = {};

    this.translateService.get(['Please Choose any OffRoad Reason', 'Cancel', 'Ok']).subscribe(text => {
      offRoadReasonAlert.title = text['Please Choose any OffRoad Reason'],
      offRoadReasonAlert.cancelButton = text['Cancel'],
      offRoadReasonAlert.okButton = text['Ok']

    });

    let options = {
     
      header: offRoadReasonAlert.title,
      message: '',
      inputs: [],
      buttons: [
        {
          text: offRoadReasonAlert.cancelButton,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: offRoadReasonAlert.okButton,
          handler: data => {
            this.logoutType = 2;
            this.offroad_reason = data;

            console.log("data", data);

          }
        }
      ]
    };

    options.inputs = [];
    // Now we add the radio buttons

    console.log("length", this.offRoadData.length);
    for (let i = 0; i < this.offRoadData.length; i++) {

      console.log(this.offRoadData[i].reason_id);
      options.inputs.push({ name: 'options', value: this.offRoadData[i].reason_id, label: this.offRoadData[i].reason, type: 'radio' })



    }

    // Create the alert with the options
    let radioButtonAlert = await this.alertCtrl.create(options);

    radioButtonAlert.present();
  }


  fetchOffRoadData() {

    this.http.get('Responder/get_abandonreasons').subscribe(data => {
      console.log("offRoadData", data.Value);

      this.offRoadData = data.Value;
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutOdometerPage');
  }

   logoutOdometerFormSubmit() {

console.log("odometer start value","Start value:"+this.odometer.startValue);
console.log("odometer previous value","previous value:"+this.odometer.endValue);

if(this.odometer.endValue == undefined){
  this.errorMessage = "Please Enter Current Odometer Reading!"; 
} 
else if(this.odometer.startValue > this.odometer.endValue){

    this.errorMessage = "Current Reading should be greater than or equal to Previous Reading!"; 

  }else if(this.offroad_reason == "" && this.offRoadReasons == undefined){
    this.errorMessage = "Please select any of the offRoad Reason!"; 
  }else{
    this.errorMessage = "";
    this.logoutOdometer();
  }


  }

  async  logoutOdometer(){

    let logoutConfirmAlert: any = {};

    this.translateService.get(['Confirmation','Are You Sure Want to Logout?', 'No', 'Yes']).subscribe(text => {
      logoutConfirmAlert.header = text['Confirmation'],
      logoutConfirmAlert.subHeader = text['Are You Sure Want to Logout?'];
      logoutConfirmAlert.yesButton = text['Yes'],
      logoutConfirmAlert.noButton = text['No']

    });
    
    let confirm = await this.alertCtrl.create({
      cssClass: "custom-loader",
      header: logoutConfirmAlert.header ,
      subHeader: logoutConfirmAlert.subHeader,
      buttons: [
        {
          text: logoutConfirmAlert.noButton,
          handler: () => {


          }
        }, {
          text: logoutConfirmAlert.yesButton,
          handler: () => {
            this.pageLogout();
          }
        }
      ]
    });

    confirm.present();
  }




  public getAll() {

    this.eventService.getVehicleDetails().then((res: any) => {
      for (let entry of res) {
        this.vehicleId = entry.vehicleId;
        this.vehicleDetails.callSign = entry.vehicleCallSign;
        this.vehicleDetails.userName = entry.loginUserName;
        this.vehicleDetails.departmentId = entry.departmentId;
        this.vehicleDetails.city_id = entry.cityId;
        this.vehicleDetails.station_id = entry.stationId;
        this.vehicleDetails.city_zone_id = entry.cityZoneId;
        this.odometer.startValue = entry.meterReading;


        console.log('vehicle----id', this.vehicleId);
        console.log("cityId", entry.cityId);
        console.log("city_zone_id", entry.cityZoneId);
        console.log("stationId", entry.stationId);
        localStorage.setItem('vehicleId', this.vehicleId);
        localStorage.setItem('callSign', this.vehicleDetails.callSign);

      }
      this.fetchLastOdometerReading();
    });



  }


  pageLogout() {


  this.commonService.showLoader("Loading...");
    let params = {
      "user_name": this.vehicleDetails.userName,
      "sim_no": this.vehicleDetails.sim_no,
      "vehicle_id": this.vehicleId,
      "call_sign": this.vehicleDetails.callSign,
      "odometer": this.odometer.endValue,
      "logout_type": this.logoutType,
      // "offroad_reason": this.offroad_reason,
      "offroad_reason": this.offroad_reason,
      "officer_id": null,
      "end_time": moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      "latitude": this.appConfig.latitude,
      "longitude": this.appConfig.longitude,
      "address": "afdagdsag",
      "dept_id": this.vehicleDetails.departmentId,
      "city_id": this.vehicleDetails.city_id,
      "station_id": this.vehicleDetails.station_id,
      "city_zone_id": this.vehicleDetails.city_zone_id

    };


    this.http.post('Responder/mdt_logout', params).subscribe(data => {
      this.commonService.hideLoader();
      console.log(JSON.stringify(data));
      let result = data
      // this.router.navigateByUrl('home');
      // if (response.contains("Success") && (!response.contains("Failure"))
      // && (!response.equals(""))) {

      if (data.Result == "Success") {
       // this.router.navigateByUrl('/login');
         this.logoutFunction();
      }


    },error =>{
      this.commonService.hideLoader();
      this.errorMessage = "Plesae Try Again!";
    });
  }




  logoutFunction() {

    let params = {
      "workforceUserId": this.vehicleDetails.workforceUserId,
      "phoneNumber": this.vehicleDetails.phoneNumber,
      "departmentCode": this.vehicleDetails.departmentCode,
    };



    this.http.postWorkForce('loginlogoutService/logout', params).subscribe(data => {
      console.log(JSON.stringify(data));
      let result = data
      // this.router.navigateByUrl('home');
      // if (response.contains("Success") && (!response.contains("Failure"))
      // && (!response.equals(""))) {

      if (data.result == true) {
        this.router.navigateByUrl('/login');

      }


    });

  }



  //   let confirm = this.alertCtrl.create({
  //     // title: 'Logout',
  //     message: '<h1> Are you sure to submit the details?</h1>',
  //     cssClass: "custom-loader",
  //     buttons: [{
  //       text: 'No',
  //       handler: () => {
  //         console.log('Disagree clicked');
  //       }
  //     }, {
  //       text: 'Yes',
  //       handler: () => {

  //         this.customizer.showLoader('Please wait..')

  //         var param = {
  //           "odometerReading": 0,
  //           "odometerReadingTime": moment().format("YYYY-MM-DD HH:mm:ss"),
  //           "userName": ApplicationConfig.loggedInUser,
  //           "vehicleNo": ApplicationConfig.vehicleNo,
  //           "simNo": ApplicationConfig.simNo,
  //           "resourceStatus": this.odometer.status,
  //           "resource4Sub": this.offRoadReasonId,
  //           "officerId": "",
  //           "logoutTime": moment().format("YYYY-MM-DD HH:mm:ss")
  //         };

  //         this.http.post("Responder/logoutdetails", param).subscribe(data => {
  //           this.logger.log(LoggerService.INFO, LogoutOdometerPage.name, "logoutOdometerFormSubmit Responder/logoutdetails" + JSON.stringify(data))
  //           console.log(JSON.stringify(data));
  //           var result = data.json();
  //           if (result.Result) {
  //             clearInterval(HomePage.trackVehicleInterval);
  //             clearInterval(HomePage.trackPacketValidateInterval)
  //             clearInterval(HomePage.sendStoredPacketInterval)

  //             this.nativeStorage.setItem("loginStatus", false).then(() => {
  //               this.nativeStorage.setItem("odometerLastUpdatedValue", this.odometer.endValue);
  //               this.nativeStorage.setItem("odometerStartValue", this.odometer.endValue);
  //               this.locationTracker.stopTracking();
  //               this.stompService.close();
  //               this.customizer.hideLoader()
  //               this.navCtrl.setRoot(LoginPage);
  //             });
  //           } else {
  //             this.customizer.hideLoader()
  //             this.customizer.presentAutoHideToast(result.Output);
  //           }
  //         },error=>{
  //           this.customizer.hideLoader()
  //           this.customizer.presentAutoHideToast('Please Try after some time');
  //         });
  //       }
  //     }
  //     ]

  //   });

  //   confirm.present();
  // }


  // getOffRoadReasons() {
  //   this.offRoadReasonId = "";
  //   let alertBox = this.alertCtrl.create({ enableBackdropDismiss: false })
  //   alertBox.setTitle('Off Road Reason')

  //   alertBox.addButton({
  //     text: 'Cancel',
  //     handler: data => {
  //       this.odometer.status = 1;
  //       this.selectedReason = null;
  //       this.offroadReasonHidden = true;
  //     }
  //   });


  //   if (this.odometer.status === 2) {
  //     this.http.get('Responder/get_offroadreasons').subscribe(res => {
  //       this.logger.log(LoggerService.INFO, LogoutOdometerPage.name, "getOffRoadReasons Responder/get_offroadreasons" + JSON.stringify(res))
  //       this.offRoadReasons = res.json();

  //       alertBox.setCssClass('label');

  //       for (let i = 0; i < this.offRoadReasons.length; i++) {

  //         alertBox.addInput({
  //           type: 'radio',
  //           label: this.offRoadReasons[i].offroad_reasons,
  //           value: this.offRoadReasons[i].id
  //         });

  //       }
  //       alertBox.addButton({
  //         text: 'Select',
  //         handler: data => {

  //           this.selectedReason = this.offRoadReasons[data - 1].offroad_reasons;
  //           this.offRoadReasonId = this.offRoadReasons[data - 1].id;
  //           this.offroadReasonHidden = false;
  //         }
  //       });
  //       alertBox.present();
  //     })

  //   }

  //   else {
  //     this.offroadReasonHidden = true;
  //     this.selectedReason = null
  //   }


  // }


}
