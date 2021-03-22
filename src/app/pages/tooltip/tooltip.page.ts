import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { LoginodometerPage } from '../loginodometer/loginodometer.page';
import { Router } from '@angular/router';
import { LogoutodometerPage } from '../logoutodometer/logoutodometer.page';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { CommonServices } from 'src/app/services/common-services/common-services';
import * as moment from 'moment';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { StatusConfigurationPage } from '../cfs-event/model/status-configuration/status-configuration.page';
import { machineIdSync } from 'node-machine-id';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { MqttHelperService } from 'src/app/services/mqtt-helper.service';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.page.html',
  styleUrls: ['./tooltip.page.scss'],
})
export class TooltipPage implements OnInit {

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

  vehicleId;
  logoutStatus;
  logoutType = 1;

  uuid;
  

  ngOnInit() {
  }
  options = [
    {title:'Unit Summary',icon:'',page:'unitsummaryListPage'},
    {title:'Status',icon:'',page:'statusconfigurationPage'},
    {title:'Logout',icon:'logout',page:'logoutodometerPage'},
    

  ]

  constructor(private modalController:ModalController,private customNavService:CustomNavService, private router: Router, private popover: PopoverController,private eventService: EventsDbService,
    private commonService: CommonServices, private http: CustomHttpClient, private modalCtrl: ModalController, private appConfig:ApplicationConfigProvider, private mqttHelperService:MqttHelperService) {
      this.vehicleDetails.workforceUserId = localStorage.getItem('workforceUserId');
      this.vehicleDetails.phoneNumber = localStorage.getItem('phoneNumber');
      this.vehicleDetails.departmentCode = localStorage.getItem('departmentCode');
     this.vehicleDetails.sim_no = localStorage.getItem('simNo');
    
      this.getAll();
      let id = machineIdSync(true);
      this.uuid = id;
  }
  closeToolTip() {
    this.popover.dismiss()
  }
  changeFilterType(type) {
    this.closeToolTip()
  }

  openPage(pageName) {
    console.log('gnm',)
    let page;


    switch (pageName) {
    case 'logoutodometerPage': page = LogoutodometerPage; 
    this.closeToolTip();
    //this.router.navigateByUrl('/logoutodometer');
    this.pageLogout();
    break;

    case 'statusconfigurationPage':
      this.closeToolTip();
      this.openModel();
      break;

    case 'unitsummaryListPage':
    this.closeToolTip();
    this.router.navigateByUrl('/unit-summary/unit-summary-list');
    break;

   

     }
    if (page != undefined) {

    }
  }

  async openModel(){
    let modal = await this.modalCtrl.create(
      {
        component: StatusConfigurationPage,
        showBackdrop: true, backdropDismiss: false, cssClass: 'app-event-additional-info'
      });
    await modal.present();
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
       // this.odometer.startValue = entry.meterReading;


        console.log('vehicle----id', this.vehicleId);
        console.log("cityId", entry.cityId);
        console.log("city_zone_id", entry.cityZoneId);
        console.log("stationId", entry.stationId);
        localStorage.setItem('vehicleId', this.vehicleId);
        localStorage.setItem('callSign', this.vehicleDetails.callSign);

      }
     // this.fetchLastOdometerReading();
    });

}

pageLogout() {


  this.commonService.showLoader("Loading...");
    let params = {
      "user_name": this.vehicleDetails.userName,
      "sim_no": this.vehicleDetails.sim_no,
      "vehicle_id": this.vehicleId,
      "call_sign": this.vehicleDetails.callSign,
      "odometer": 0,
      "logout_type": this.logoutType,
      "offroad_reason": "1",
      "officer_id": null,
      "end_time": moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      "latitude": this.appConfig.latitude,
      "longitude": this.appConfig.longitude,
      "address": "",
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
        // this.router.navigateByUrl('/login');
      }


    },error =>{
      this.commonService.hideLoader();
      this.commonService.presentAutoHideToast("Please Try Again Later!")
     // this.errorMessage = "Plesae Try Again!";
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
       // this.updateMdtStatus();
        this.router.navigateByUrl('/login');
        this.mqttHelperService.disconnectmqtt();

      }


    },error =>{
      this.commonService.hideLoader();
      this.commonService.presentAutoHideToast("Please Try Again Later!")
     // this.errorMessage = "Plesae Try Again!";
    });

  }


  updateMdtStatus(){
  
     // this.commonService.showLoader("Loading...");  
      let params = [{
         
          "imeiNo":this.uuid,   
          "callSign":this.vehicleDetails.callSign,
          "vehicleStatus":3
          
      }];
      this.http.post('/Responder/updateMdtStatus/', params).subscribe(data => {
    
        this.commonService.hideLoader();
       // this.commonService.presentAutoHideToast("Status Updated Successfully!");
        
      
      }, err=> {
        this.commonService.hideLoader();
       // this.commonService.presentAutoHideToast("Please Try Again!")
      });
    
    
  }
}


// @Component({
//   selector: 'app-tooltip',
//   templateUrl:'tooltip.html'
// })

// export class NewsFeedMore {

//   options = [
//     {title:'Edit',icon:'create',page:'edit'},
//     {title:'Delete',icon:'trash',page:'delete'},
//   ]
//   newsFeedPost: any;

//   constructor(private navCtrl:NavController,private customNavService:CustomNavService,
//     private applicationConfig: ApplicationConfigProvider, private customHttp: CustomHttpClient,
//     private alertCtrl: AlertController, private commonService: CommonServiceProvider) {
//     this.newsFeedPost = customNavService.get('newsFeedPost');
//     console.log("newsPostId",this.newsFeedPost)
//   }
//   closeToolTip() {
//    // this.modalController.dismiss()
//   }

//   changeFilterType(type) {
//     this.closeToolTip()
//   }

//   async openPage(pageName) {
//     console.log('gnm',)
   
//     if (pageName === 'edit') {
//       //this.navCtrl.push(PostNews, { newsFeedPost: this.newsFeedPost})
//     } 
//     else if (pageName === 'delete'){

//       let alert =await this.alertCtrl.create({
//       header: "Are you sure you want to Delete ?",
//       buttons: [
//         {
//           text: "No",
//           role: 'cancel',
//           handler: () => {
//             console.log('Cancel clicked');
//           }
//         },
//         {
//           text: "Yes",
//           handler: () => {
//           this.deletePost();
//           }
//         }
//       ]
//     });
//   await  alert.present();
//     }
//   }


//   deletePost(){
//     let postInfo = {
//       id: this.newsFeedPost.id
//     }
//     this.commonService.startPinloader()
//     this.customHttp.post('share/deleteUserCitizenPosts', postInfo).subscribe((data) => {
//       this.commonService.completePinloader()
//       let output = data.json();
//       if (output) {
//         this.commonService.presentAutoHideToast("Successfully Delete Post.")
//       } else {
//         this.commonService.presentAutoHideToast("Please try again after some time")
//       }
//     }, error => {
//       console.log("===Error in Deleting the Post ===" + error);
//       this.commonService.presentAutoHideToast("Please try again after some time")
//       this.commonService.completePinloader()
//     })
//   }
// }





