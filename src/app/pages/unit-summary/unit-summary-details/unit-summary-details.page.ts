import { Component, OnInit, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { MessageServicesService } from 'src/app/services/message-services.service';
import { Router } from '@angular/router';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { OperatorInfoPage } from '../../shared-pages/operator-info/operator-info';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-unit-summary-details',
  templateUrl: './unit-summary-details.page.html',
  styleUrls: ['./unit-summary-details.page.scss'],
})
export class UnitSummaryDetailsPage implements OnInit {

 
  selectedCFS: Cfs = new Cfs()


  mdtDetails: any = {
    vehicleId: String,
    userName: String,
    callSign: String
  }

  //public missionStatus;
  public abandonedReasons: any;
  public static lastUpdatedTime: any;
  update_button;
  testCheckboxOpen: boolean;
  testCheckboxResult;
  public officerDetails: any;
  public officer_id: number;
  cfsId;
  public isSubmitforClose = false;
  subscription: Subscription;
  pagesubscription: Subscription;

  eventDetails;
  missionStatus = [{ "event_status_id": 6, "color_hex": "#4d94ff", "status_description": "Acknowledge" }, { "event_status_id": 7, "color_hex": "#339900", "status_description": "On Action" }, { "event_status_id": 8, "color_hex": "#990099", "status_description": "At Scene" }, { "event_status_id": 9, "color_hex": "#730099", "status_description": "Close" }, { "event_status_id": 10, "color_hex": "#4d94ff", "status_description": "Abandon" }];
  eventTypeList: any;

  count=0;

  static updateChanged: boolean = false;
  static instance: UnitSummaryDetailsPage;

    

  constructor(private theDB: SqliteDb, private eventService: EventsDbService, private http: CustomHttpClient, private ngZone: NgZone,
    private alertCtrl: AlertController, private customNavService: CustomNavService, private httpClient: CustomHttpClient,
     private commonService: CommonServices, private router: Router, private navController: NavController,private messageService: MessageServicesService,private modalCtrl: ModalController, private translateService: TranslateService) {
      UnitSummaryDetailsPage.instance = this;
   
     
    
  }






  ionViewDidEnter() {

    console.log("ionview");
   

  }




  ngOnInit() {
   
    console.log('cfsdetails', this.customNavService.get('eventDetails'));

    this.eventDetails = this.customNavService.get('eventDetails');
    this.setEventData();
    this.selectedCFS.currentStatus = this.selectedCFS.currentStatus
    this.eventService.getVehicleDetails().then((res: any) => {

      for (let entry of res) {
        console.log('entry===>', entry.vehicleId);
        /* Object.keys(entry).forEach(key => {
          let value = entry[key];
          console.log('entry===>',value); // 1, "string", false
        }); */

        /* for (let elem in entry) {
          console.log('element==12>', entry[elem])
        } */

        this.mdtDetails.vehicleId = entry.vehicleId
        this.mdtDetails.userName = entry.loginUserName
        this.mdtDetails.callSign = entry.vehicleCallSign

        console.log('entry===>', this.mdtDetails);

      }
    });
  }

  async operatorInfo() {	
    let details = await this.modalCtrl.create({	
      component: OperatorInfoPage,	
      showBackdrop: true, backdropDismiss: true, cssClass: 'app-event-operator-info',	
      componentProps: {cfsData:this.selectedCFS}	
    });	
    details.onDidDismiss().then(data => {	
      console.log('onDidDismiss', data);	
    })	
    details.present();	
  }	
  backFunction() {	
    //this.customNavService.navigateUrlReplace('/home');	
  }



  setEventData() {
    // subscribe to home component messages
    this.subscription = this.eventService.getUnitSummaryDetails(this.eventDetails.eventid).subscribe(message => {
      console.log('setdatatirggered', message);

      let data = message[0];

      this.selectedCFS = {
        eventid: data.event_id,
        basicid: data.basic_id,
        priority: data.priority,
        eventtype: data.incident_type,
        subtype: data.incident_subtype,
        station: data.nearest_police_station,
        address: data.location,
        landmark: data.distress_place_name,
        mobile: data.mobile_no,
        additionaldetails: data.additional,
        latitude: data.latitude,
        longitude: data.longitude,
        msgtype: data.msg_type,
        distressname: data.distress_name,
        starttime: moment(data.starttime).format("DD-MM-YYYY HH:mm:ss"),
        statusid: data.statusId,
        status: data.status,
        color_hex: data.color_hex,
        currentStatus: data.statusId,
        fromUserType: data.from_user_type,
        placename: data.place_name,
        townname: data.town_name,
        cityId: data.city_id,
        cityZoneId: data.city_zone_id,
        deptId: data.department_id,
        psId: data.ps_id,
        fromUserName: data.from_user_name,
        image: ''
      };


      console.log("selectedCfs", this.selectedCFS);
    });

  }


}
  
class Cfs {
  eventid: string
  basicid: number
  priority: string
  eventtype: string
  subtype: string
  station: string
  address: string
  landmark: string
  mobile: string
  additionaldetails: string
  latitude: number
  longitude: number
  msgtype: number
  distressname: string
  starttime: string
  statusid: number
  status: string
  color_hex: string
  currentStatus: number
  fromUserType: number
  placename: string
  townname: string
  cityId: number
  cityZoneId: string
  deptId: number
  psId: number
  fromUserName: String
  image: string
}
  

