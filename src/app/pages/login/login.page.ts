import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { machineId, machineIdSync } from 'node-machine-id';
import { FcmService } from 'src/app/services/fcm.service';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { AppComponent } from 'src/app/app.component';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { ElectronService } from 'src/app/services/electron.service';
import { MessageServicesService } from 'src/app/services/message-services.service';
import { MqttHelperService } from 'src/app/services/mqtt-helper.service';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { NewEventAlertPage } from '../cfs-event/model/new-event-alert/new-event-alert.page';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  buttonColor: string = '#087380';
  myCheck = true;
  simNo
  public logoTapped: number = 0;
  message: any;
  subscription: Subscription;
  public loginUser = {

    password: '',
    simNo: '',
    loginName: '',
    phoneNumber: '',
    fcmId: '',
    tenantCode: '',
    uuid: ''
  };

  errorMessage = "";
  selectLanguage;
  constructor(private http: CustomHttpClient, private router: Router, private theDB: SqliteDb,
    private fcmService: FcmService, private appConfig: ApplicationConfigProvider,
     public myapp: AppComponent, public commonService: CommonServices,private electronServices: ElectronService,
     private messageService: MessageServicesService, private mqttHelperService: MqttHelperService, private eventService: EventsDbService,
     private customNavService: CustomNavService, private modalCtrl: ModalController, private translateService:TranslateService) {

    let id = machineIdSync(true);
    this.loginUser.uuid = id;
    console.log('machineIdSync', id, ',' + this.loginUser.fcmId);

    if (localStorage.getItem("login.username") === null) {
      console.log("login.username");
    } else {
      let value = localStorage.getItem("login.username")
      this.myCheck = true;
    }

    if (localStorage.getItem("login.password") === null) {
      //...
    } else {
      let value = localStorage.getItem("login.password")
      this.loginUser.password = value;
    }

    if (localStorage.getItem("loginStatus") === null) {
      //...
    } else {
      let value = localStorage.getItem("loginStatus")
      this.loginUser.password = value;
    }

   // this.startLocation();
  }

  ngOnInit() {
    console.log("init", "init");
    this.setTranslate();
    this.theDB.getValue().subscribe((value) => {
      console.log("value", "init"+value);
      if (value) {
        setTimeout(() => {
        this.fetchSimNo();
          
        }, 3000)
      }
    });

    
  }

  updateFcmtoken() {
    let data = {
      token_id: this.fcmService.getToken(),
      vehicle_id: localStorage.getItem('vehicleId')
    }
    this.http.post( 'Responder/update_token_key', data).subscribe((data) => {

    })
  }

  checkLogin(form) {
    this.commonService.showLoader("Loading...");
    console.log("form", form.value);

    console.log("username", form.value.userName);

    if (form.value.userName == "") {
      this.commonService.hideLoader();
      console.log("Username Required");
      this.errorMessage = "* Sorry, field username is required!";
    } else if (form.value.password == "") {
      this.commonService.hideLoader();
      console.log("Password Required");
      this.errorMessage = "* Sorry, field password is required!";
    } else {
   // this.mdtLogin();
  this.checkLoginUser();
      this.errorMessage = "";
   // this.checkLoginUser2();
    // this.checkLoginUser2();
     //this.mdtLogin();
  // this.checkLoginUser1();
    }
  }

  async checkLoginUser2(){
     this.commonService.hideLoader();
    // this.mqttHelperService.connectClient();
  this.router.navigateByUrl('/home');
  //this.router.navigateByUrl('/locationservice');
  // this.customNavService.navigateByUrl('/atr', {eventDetails:""});

//   let patrolData = {fromDate: "2020-12-30", Id: "170058", messageType: "PATROL", message: "Accident"}
//   let modal = await this.modalCtrl.create(
//     {
//         component: NewEventAlertPage, componentProps: { notificationData: patrolData, messageType: "PATROL" },
//         showBackdrop: true, backdropDismiss: false, cssClass: 'app-event-alert-new'
//     });
// await modal.present();
   }
   
  checkLoginUser1(){
    // localStorage.setItem('simNo', "7022606162");
    // localStorage.setItem('vehicleId', "PCR1");
   // this.router.navigateByUrl('/home');
   this.commonService.hideLoader();
   this.mqttHelperService.connectClient();
  }

  checkLoginUser() {
    this.buttonColor = '#346546';
    //this.loginUser.simNo =      this.simNo

    this.loginUser.fcmId = this.fcmService.getToken();
    console.log('checkLogin==>', this.loginUser.fcmId);
    console.log('checkLogin==>', this.fcmService.getToken());

    this.loginUser.tenantCode=this.appConfig.tenantCode;
    console.log("tenentCode", this.loginUser.tenantCode);

    this.http.postWorkForce('loginlogoutService/login', this.loginUser).subscribe(data => {
      // console.log("errorMessage", data.output.workforceUserId);
      this.commonService.hideLoader();
      if (data.status == false) {
        this.commonService.hideLoader();
        this.errorMessage = data.errorMessage;
      } else {
      localStorage.setItem('workforceUserId', data.output.workforceUserId);
      localStorage.setItem('phoneNumber', data.output.phoneNumber);
      localStorage.setItem('departmentCode', data.output.departmentCode);
      // localStorage.setItem('simNo', data.output.phoneNumber);
    //  this.commonService.showLoader("Loading...");
     // this.mdtLogin();
     this.router.navigateByUrl('/home');
      }


    }, error => {
      this.commonService.hideLoader();
    });
  }

fetchSimNoData(){
  let data = {
    uuid: this.loginUser.uuid
  }
  this.http.post('/Responder/get_vehicle_sim', data).subscribe(data => {
    this.commonService.hideLoader();
    console.log("data", data);
    console.log('fetchSimNo', data.result.split(',', 2)[0]);
    this.loginUser.phoneNumber = data.result.split(',', 2)[0];

    console.log("phoneNumber", this.loginUser.phoneNumber)
    this.update(data.result.split(',', 2)[0]).subscribe(res => {
      console.log('final data result', res);

    })
    this.simNo = data.result.split(',', 2)[0];

    if(this.loginUser.phoneNumber == "" || this.loginUser.phoneNumber == "Failure"){
      this.commonService.hideLoader();
      this.errorMessage = "Please Configure the Device!"
    }else{
      this.commonService.showLoader("Loading...");
      this.mdtLogin();
    }
    

  }, error => {
    this.errorMessage = "Please Try Again!"
     this.commonService.hideLoader();
  });
}


  mdtLogin() {
    if(this.loginUser.phoneNumber == "" || this.loginUser.phoneNumber == "Failure"){
      this.fetchSimNoData();
     
    }else{

    let data = {
      user_name: this.loginUser.loginName,
      password: this.loginUser.password,
      sim_no: this.loginUser.phoneNumber,
      latitude: '12.346',
      longitude: '77.23456',
      address: 'Bengaluru',
      uuId: this.loginUser.uuid
    }
    localStorage.setItem('simNo', this.loginUser.phoneNumber);
    
    this.http.post('Responder/mdt_login', data).subscribe(data => {
      this.commonService.hideLoader();
      let outPut = data.Login_Status
      console.log('data.Login_Status', outPut);
      this.commonService.hideLoader();
      if (outPut.includes('Success')) {
        this.commonService.hideLoader();
        console.log('sucess ====>', outPut);
       // this.router.navigateByUrl('/loginodometer');
       this.router.navigateByUrl('/home');
       this.checkupdateMdtStatus(outPut);
       this.updateVehicleDetails(outPut);
       this.startLocation();
      }
      
   
      
     

    }, error => {
      this.commonService.hideLoader();
      this.errorMessage = "Please Try Again!"; 
    });
  }
  }
callSign;

  checkupdateMdtStatus(vehicleData){

    
    console.log('vehicleCallSign', vehicleData.split(',', 7));
    vehicleData = vehicleData.split(',', 7);
    console.log('vehicleCallSign1', vehicleData[7]);
   
     let callSign = vehicleData[2];
      
  
    this.subscription = this.eventService.getEventsAll().subscribe(message => {
      let rowData = message;
      console.log("rowData", rowData);

      if(rowData.length == 0){
         this.updateAvailableMDTStatus(3, callSign);
      }else{
        this.updateAvailableMDTStatus(4, callSign);
      }
    
    
    });

      
    
  }

  updateAvailableMDTStatus(statusId, callsign){
    let params = {

      "imeiNo": this.loginUser.uuid ,
      "callSign": callsign,
      "vehicleStatus": statusId
  }

  console.log("params", params);
  this.http.post('Responder/updateMdtStatus/', params).subscribe(result => {
    
    console.log("updateMdtStatus",result);

    }, error => {
    
    });
  }


  rememberUserDetails() {

    if (this.myCheck) {
      localStorage.setItem("login.username", this.loginUser.loginName)
      localStorage.setItem("login.password", this.loginUser.password)

    } else {
      localStorage.remove("login.username");
      localStorage.remove("login.password");
    }
  }

  fetchSimNo() {
    let data = {
      uuid: this.loginUser.uuid
    }
    this.http.post('/Responder/get_vehicle_sim', data).subscribe(data => {

      console.log("data", data);
      console.log('fetchSimNo', data.result.split(',', 2)[0]);
      this.loginUser.phoneNumber = data.result.split(',', 2)[0];

      console.log("phoneNumber", this.loginUser.phoneNumber)
      this.update(data.result.split(',', 2)[0]).subscribe(res => {
        console.log('final data result', res);

      })
      this.simNo = data.result.split(',', 2)[0];

    }, error => {

    });
  }

  public update(data) {
    let value;
    const sql = `
    UPDATE urlConfigrations
    SET simNo = $name`;

    const values = {
      $name: data,
    };

    let obeservable = Observable.create(observer => {
      this.theDB.update(sql, values).subscribe(res => {
        console.log('Observable data', res);
        observer.next(res);
      });
    })


    return obeservable;

  }

  public getAll(): Promise<Object> {
    const sql = `SELECT  *  FROM vehicleDetails`;
    const values = {};
    let data;
    this.theDB.selectAll(sql, values)
      .subscribe((rows) => {
        console.log('this.theDB.selectAll Observable', rows[0]);
        data = rows[0];

      });

    return data;
  }

  updateVehicleDetails(vehicleData: any) {
    const sql = `
    UPDATE vehicleDetails
    SET vehicleCallSign = $callsign,
    vehicleId = $vehicleId,
    stationId=$stationId,
    departmentId=$departmentId,
    cityId=$cityId,
    cityZoneId=$cityZoneId,
    login_status=$login_status,
    loginUserName=$loginUserName `;

    console.log('vehicleCallSign', vehicleData.split(',', 7));
    vehicleData = vehicleData.split(',', 7);
    console.log('vehicleCallSign1', vehicleData[7]);
    const values = {
      $callsign: vehicleData[2],
      $vehicleId: vehicleData[3],
      $stationId: vehicleData[4],
      $departmentId: vehicleData[5],
      $cityId: vehicleData[5],
      $cityZoneId: vehicleData[6],
      $login_status: 'loggedIn',
      $loginUserName: this.loginUser.loginName
    };

localStorage.setItem("callSign", vehicleData[2]);
    this.theDB.update(sql, values).subscribe(res => {
      console.log('Updated Value', res);
      this.getAll();

    })

    localStorage.setItem('vehicleId', vehicleData[3]);
    this.updateFcmtoken();
   // console.log("mqttservice", this.mqttHelperService.mqttConnect);
    // if(this.mqttHelperService.mqttConnect){
    
    // }else{
      this.mqttHelperService.connectClient();
    //}
   
  }

  openSettingPage() {
    console.log('openSettingPage', 'tabed');
    this.router.navigateByUrl('/configrations');
  }

  startLocation() {

   


    this.electronServices.openLineByLine().subscribe((data) => {
      
        this.appConfig.RMCTrackAngle = data.RMCTrackAngle;
        // {Latitude: 12.983741016666666, Longitude: 77.59793551666667, NumOfSatellites: 5, Altitude: 932.9, RMCTrackAngle: 300.6}
        if(data.Latitude == "NaN"){
          this.appConfig.latitude = 0;
          this.appConfig.longitude = 0;
        }else{
          this.appConfig.longitude = data.Longitude;
          this.appConfig.latitude = data.Latitude;
        }
        this.appConfig.Altitude = data.Altitude;
       
        this.appConfig.numOfSatellites = data.NumOfSatellites

        console.log('startLocation', data);
        this.appConfig.trackingStatus = "Tracking";
      
        
      
 
                          
    }, err => {

      console.log('startLocationerr', err);

    })

  }

  radioGroupLanguageChange(event){
 
    console.log("languageselect", event);
    if (event.detail.value !== null) {
      this.translateService.use(event.detail.value); 
      
     // this.store.setItem("language", event.detail.name);
    // this.storage.set("language", event.detail.name);
  
      window.localStorage.setItem("language", event.detail.value)

      if(event.detail.value == "arb"){
        document.dir = "rtl";
      }else if(event.detail.value == "en"){
        document.dir = "ltr";
      }
    }

    
   
  }

  setTranslate(){
    if (window.localStorage.getItem("language") === null || window.localStorage.getItem("language") === undefined) {
      this.selectLanguage = "en"
    } else {

      this.selectLanguage = window.localStorage.getItem("language");
    }
  }
}
