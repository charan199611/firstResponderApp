import { Component, OnInit, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { Router } from '@angular/router';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { MessageServicesService } from 'src/app/services/message-services.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { OperatorInfoPage } from '../../shared-pages/operator-info/operator-info';

@Component({
  selector: 'app-sos-event-details',
  templateUrl: './sos-event-details.page.html',
  styleUrls: ['./sos-event-details.page.scss'],
})
export class SosEventDetailsPage implements OnInit {

  selectedSOS: Sos = new Sos()


  mdtDetails: any = {
    vehicleId: String,
    userName: String,
    callSign: String
  }

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
  missionStatus;
  eventTypeList: any;

  count = 0;
  subScribeCount = 0;

  static updateChanged: boolean = false;
  static instance: SosEventDetailsPage;



  constructor(private theDB: SqliteDb, private eventService: EventsDbService, private http: CustomHttpClient, private ngZone: NgZone,
    private alertCtrl: AlertController, private customNavService: CustomNavService, private httpClient: CustomHttpClient,
    private commonService: CommonServices, private router: Router, private navController: NavController,
    private messageService: MessageServicesService, private modalCtrl: ModalController,
    private translateService: TranslateService, private applicationConfigProvider: ApplicationConfigProvider) {
      SosEventDetailsPage.instance = this;

    if (this.applicationConfigProvider.missionStatus) {
      this.missionStatus = this.applicationConfigProvider.missionStatus;

    } else {
      this.missionStatus = [{ "event_status_id": 6, "color_hex": "#4d94ff", "status_description": "Acknowledge" }, { "event_status_id": 7, "color_hex": "#339900", "status_description": "On Action" }, { "event_status_id": 8, "color_hex": "#990099", "status_description": "At Scene" }, { "event_status_id": 9, "color_hex": "#730099", "status_description": "Close" }, { "event_status_id": 10, "color_hex": "#4d94ff", "status_description": "Abandon" }];
    }


  }





  refresh() {
    this.ngZone.run(() => {

      console.log('force update the screen');
    });
  }



  ionViewDidEnter() {

    console.log("ionview");

  }


  ngOnInit() {




    this.getAbandonReasons();
    this.eventDetails = this.customNavService.get('eventDetails');
    this.setEventData();
    this.selectedSOS.currentStatus = this.selectedSOS.currentStatus
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
      componentProps: { cfsData: this.selectedSOS }
    });
    details.onDidDismiss().then(data => {
      console.log('onDidDismiss', data);
    })
    details.present();
  }
  backFunction() {
    //this.customNavService.navigateUrlReplace('/home');	
  }


  openSuppliment(){
    this.customNavService.navigateByUrl('/suppliment-info', {basicId: this.selectedSOS.basicid})
  }



  setEventData() {
    // subscribe to home component messages
    this.subscription = this.eventService.getSOSEventDetails(this.eventDetails.eventid).subscribe(message => {
      console.log('setdatatirggered', message);

      let data = message[0];

      this.selectedSOS = {
        eventid: data.event_id,
        basicid: data.basic_id,
        priority: data.priority,
        eventtype: data.incident_type,
        subtype: data.incident_subtype,
        station: data.nearest_police_station,
        address: data.distress_address,
        landmark: data.landmark,
        mobile: data.mobile_no,
        additionaldetails: data.additional,
        latitude: data.latitude,
        longitude: data.longitude,
        msgtype: data.msg_type,
        distressname: data.distress_name,
        receivedDateTime: moment(data.received_date_time).format("DD-MM-YYYY HH:mm:ss"),
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


      console.log("selectedCfs", this.selectedSOS);
    });




  }

 
  showCompletedStatus(statusId, currentStatus) {
    let result = true;
    if (currentStatus == 1) {
      result = false;
    } else {
      if (statusId == currentStatus) {
        result = false;
      } else if (statusId == 10 || statusId == 9) {
        result = false;
      } else if (statusId > currentStatus) {
        result = false;
      } else {
        result = true;
      }
    }
    return result;
  }

  checkDisabledStatus(statusId, currentStatus) {

    let result = true;


    if (currentStatus == 1) {
      if (statusId == 6) {
        result = false;
      }
    } else {
      if (statusId == 10) {
        result = false;

      } else if (statusId == currentStatus + 1) {
        result = false;

      } else if (currentStatus == 8 && statusId == 9) {
        result = false;

      } else if (currentStatus == 6 && statusId == 7) {
        result = false;
      } else if (currentStatus == 7 && statusId == 8) {
        result = false;
      } else {
        result = true;
      }

    }


    console.log('checkDisabledStatus', statusId, currentStatus, result);

    return result;
  }

  
  updateCFS(basicId, eventid, statusId, fromUserType, cityId, cityZoneId, deptId, psId, fromUserName, priority) {
    console.log('statusId', statusId);
    let latitude = 0.0;
    let longitude = 0.0;

    if (statusId === 8) {
      console.log('ifstatusId', statusId);
      this.updateMissionStatusConfirm(basicId, eventid, statusId, latitude, longitude, fromUserType, false, cityId, cityZoneId, deptId, psId, fromUserName, priority);
    }
    else {
      let isAtrAvailable = false;
      if (statusId === 9) {
        let params = {
          basicId: basicId
        };
        this.http.post('Responder/Lastupdate/' + basicId, params).subscribe((data) => {
          console.log('look here............ last atr update' + typeof (data.Result));
          if (data.Result === true) {
            isAtrAvailable = true;

          }
          if (data.Result == 'true') {
            isAtrAvailable = true;
          }
          /* if (this.officer_id !== undefined) { */
          this.updateEventStatus(basicId, eventid, statusId, latitude, longitude, fromUserType, isAtrAvailable, cityId, cityZoneId, deptId, psId, fromUserName, priority)
          /* } else {

          } */
        })
      }
      else {
        this.updateEventStatus(basicId, eventid, statusId, latitude, longitude, fromUserType, isAtrAvailable, cityId, cityZoneId, deptId, psId, fromUserName, priority)
      }

    }
  }

  async updateEventStatus(basicId, eventid, statusId, latitude, longitude, fromUserType, isAtrAvailable, cityId, cityZoneId, deptId, psId, fromUserName, priority) {

    console.log("statusIdUpdate", statusId);
    let isSubmitforClose = false;
    if (statusId === 9 && isAtrAvailable === false) {
      this.commonService.presentAutoHideToast("Please Submit ATR text!");
    }
    else if (statusId === 9 && isAtrAvailable === true) {

      let updateForClose: any = {};

      this.translateService.get(['Confirmation', 'Are You Sure Want to submit for close?', 'Yes', 'No']).subscribe(text => {
        updateForClose.header = text['Confirmation'];
        updateForClose.subHeader = text['Are You Sure Want to submit for close?'];
        updateForClose.yesButton = text['Yes'];
        updateForClose.noButton = text['No'];
      });

      let confirmAlert = await this.alertCtrl.create({
        cssClass: "custom-loader",
        header: updateForClose.header,
        subHeader: updateForClose.subHeader,
        buttons: [
          {
            text: updateForClose.noButton,
            handler: () => {
              console.log('in update button');
              //this.selectedCFS.statusid = this.selectedCFS.currentStatus;
              this.updateMissionStatusConfirm(basicId, eventid, statusId, latitude, longitude, fromUserType, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          }, {
            text: updateForClose.yesButton,
            handler: () => {
              isSubmitforClose = true;
              this.updateMissionStatusConfirm(basicId, eventid, statusId, latitude, longitude, fromUserType, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          }
        ]
      });
      confirmAlert.present();
    } else {

      let updateStatus: any = {};

      this.translateService.get(['Confirmation', 'Are You Sure Want to Update?', 'Yes', 'No']).subscribe(text => {
        updateStatus.header = text['Confirmation'];
        updateStatus.subHeader = text['Are You Sure Want to Update?'];
        updateStatus.yesButton = text['Yes'];
        updateStatus.noButton = text['No'];
      });

      let confirmAlert = await this.alertCtrl.create({
        cssClass: "custom-loader",
        header: updateStatus.header,
        subHeader: updateStatus.subHeader,
        buttons: [
          {
            text: updateStatus.noButton,
            handler: () => {
              console.log('in update button');
              //this.selectedCFS.statusid = this.selectedCFS.currentStatus;
            }
          }, {
            text: updateStatus.yesButton,
            handler: () => {
              this.updateMissionStatusConfirm(basicId, eventid, statusId, latitude, longitude, fromUserType, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          }
        ]
      });
      confirmAlert.present();
    }
  }

  async updateMissionStatusConfirm(basicId, eventid, statusId, latitude, longitude, fromUserType, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority) {

    if (statusId === 8) {
      console.log('ifstatusIdelse', statusId);
      let updateLocation: any = {};

      this.translateService.get(['Status Update', 'Do you want to update this location as Event location ?', 'Yes', 'No']).subscribe(text => {
        updateLocation.header = text['Status Update'];
        updateLocation.subHeader = text['Do you want to update this location as Event location ?'];
        updateLocation.yesButton = text['Yes'];
        updateLocation.noButton = text['No'];
      });


      let confirmAlert = await this.alertCtrl.create({
        cssClass: "custom-loader",
        header: updateLocation.header,
        subHeader: updateLocation.subHeader,
        buttons: [
          {
            text: updateLocation.noButton,
            handler: () => {
              console.log('Disagree clicked');
              this.updateMissionStatusConfirmToDB(basicId, eventid, statusId, latitude, longitude, fromUserType, false, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          }, {
            text: updateLocation.yesButton,
            handler: () => {
              this.updateMissionStatusConfirmToDB(basicId, eventid, statusId, latitude, longitude, fromUserType, true, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          }
        ]
      });

      confirmAlert.present();
    } else {
      this.updateMissionStatusConfirmToDB(basicId, eventid, statusId, latitude, longitude, fromUserType, false, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority)
    }

  }


  updateMissionStatusConfirmToDB(basicId, eventid, statusId, latitude, longitude, fromUserType, considerAtSceneLoc, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority) {

    let filteredStatus = this.missionStatus.filter((status) => {
      return status.event_status_id == statusId;
    });
    console.log('updateMissionStatusConfirmToDB ===>', filteredStatus);
    var statusName = filteredStatus[0].status_description;

    let data =
    {
      event_id: eventid,
      basic_id: basicId,
      mission_status: statusId,
      vehicle_id: this.mdtDetails.vehicleId,
      status_name: statusName == 'Close' ? 'MDT Closed' : statusName,
      user_name: this.mdtDetails.userName,
      call_sign: this.mdtDetails.callSign,
      updated_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      abandon_reason_code: 0,
      latitude: 12.98309551,
      longitude: 77.59877667,
      address: "21\/F, Cunningham Main Rd, Sampangi Rama Nagar, Bengaluru, Karnataka 560001, India\n",
      dept_id: deptId,
      city_id: cityId,
      cityzone_id: cityZoneId,
      station_id: psId,
      from_user: fromUserType,
      atscene_loc: "false",
      from_user_name: fromUserName,
      priorityId: priority
    }

    this.commonService.showLoader("Loading...");

    this.http.post('Responder/update_event_status', data).subscribe(data => {

      this.commonService.hideLoader();

      console.log("statusId", statusId);
      console.log("statusIdtype", typeof (statusId));
      console.log("statusName", statusName);
      console.log("eventid", eventid);

      this.eventService.updateUnitSummaryEventStatus(statusId, statusName, eventid);

      this.eventService.updateSOSEventStatus(statusId, statusName, eventid);
     
      this.selectedSOS.currentStatus = statusId;
      this.selectedSOS.status = statusName;
      this.selectedSOS.statusid = statusId;


      if (statusId === 9 || statusId == '9') {

        this.eventService.deleteSOSEvent(basicId).then((value) => {
          console.log('abandonpage', value);
          this.updateMdtAvailableStatus();
          this.customNavService.navigateBack('/home');
        }).catch(error => {
          this.commonService.hideLoader();
        });
      }





    }, (error) => {
      this.commonService.hideLoader();
    });
  }


  async openAbandonedReasons(status, basicId, eventId, lastStatus, fromUserType, cityId, cityZoneId, deptId, psId, fromUserName, priority) {
    console.log('openAbandonedReasons', this.abandonReasons.length);
    console.log('openAbandonedReasonsdata', this.abandonReasons);
    console.log('openAbandonedReasonsdataStatus', status);
    console.log('openAbandonedReasonsdataStatus', lastStatus);

    let abandonAlert: any = {};

    this.translateService.get(['Select Abandon Reason', 'Okay', 'Cancel']).subscribe(text => {
      abandonAlert.title = text['Select Abandon Reason'];
      abandonAlert.okayButton = text['Okay'];
      abandonAlert.cancelButton = text['Cancel'];
    });

    if (status == 10) {
      let radio_options = [];
      //   let remarks = ['Drainage Problem', 'Water Leaking Problem', 'Electricity Problem', 'Pothole Problem'];

      for (var index = 0; index < this.abandonReasons.length; index++) {
        console.log('openAbandonedReasons===0', this.abandonReasons[index]);
        radio_options.push({
          type: 'radio',
          label: this.abandonReasons[index].reason,
          value: this.abandonReasons[index],
        });
      }

      let alertBox = await this.alertCtrl.create({
        header: abandonAlert.title,
        cssClass: "remarksBox",
        inputs: radio_options,
        buttons: [{
          text: abandonAlert.cancelButton,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            alertBox.dismiss();
          }
        }, {
          text: abandonAlert.okayButton,
          handler: (data) => {
            console.log('Confirm Okay');

            this.confirmAbandonReason(status, basicId, eventId, lastStatus, fromUserType, cityId, cityZoneId, deptId, psId, fromUserName, priority, data);

          }
        }]
      });

      alertBox.present().then(() => {

      });
    }
   
  }

  async confirmAbandonReason(status, basicId, eventId, lastStatus, fromUserType, cityId, cityZoneId, deptId, psId, fromUserName, priority, data) {
    let confirmAlert = await this.alertCtrl.create({
      cssClass: "custom-loader",
      header: "Confirmation",
      subHeader: "Are You Sure Want to submit for close?",
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('in update button');
          }
        }, {
          text: 'Yes',
          handler: () => {
            //  isSubmitforClose = true;	
            let params = {
              abandon_reason_name: data.reason,
              event_id: eventId,
              basic_id: basicId,
              mission_status: status,
              vehicle_id: this.mdtDetails.vehicleId,
              status_name: 'MDT Abandoned',
              user_name: this.mdtDetails.userName,
              call_sign: this.mdtDetails.callSign,
              updated_time: moment().format("YYYY-MM-DD hh:mm A"),
              abandon_reason_code: data.reason_id,
              latitude: 12.98309551,
              longitude: 77.59877667,
              address: "21\/F, Cunningham Main Rd, Sampangi Rama Nagar, Bengaluru, Karnataka 560001, India\n",
              dept_id: deptId,
              city_id: cityId,
              cityzone_id: cityZoneId,
              station_id: psId,
              from_user: fromUserType,
              atscene_loc: "false",
              from_user_name: fromUserName,
              priorityId: priority
            };
            this.commonService.showLoader("Loading...");
            this.http.post('Responder/update_event_status', params).subscribe(result => {
              this.commonService.hideLoader();

            this.eventService.updateUnitSummaryEventStatus(status, "MDT Abandoned", eventId);

              this.eventService.deleteEvent(basicId).then((value) => {
                console.log('abandonpage', value);
                this.updateMdtAvailableStatus();
                this.customNavService.navigateBack('/home');
              }).catch(error => {
                this.commonService.hideLoader();
              });
              this.testCheckboxOpen = false;
              this.testCheckboxResult = data;
            }, error => {
              this.commonService.hideLoader();
            });
          }
        }
      ]
    });
    confirmAlert.present();
  }



  updateMdtAvailableStatus() {
    this.eventService.getAllSOSEvents().subscribe((res) => {
      console.log('updateMdtAvailableStatus', res.length == 0);

      if (res.length == 0) {
        let data = {
          avlsStatus: '3',
          vehicle_id: localStorage.getItem('vehicleId')
        }
        this.httpClient.post('Responder/updateResourceStatusOnEventClose', data).subscribe((res) => {

        });
      }

    });

  }

  showMapPage(cfsDetails) {

    this.customNavService.navigateByUrl('/location-services-map', { serviceType: 6, cfsLatlng: cfsDetails });
  }



  loadATRPage(selectedCFS) {
    let data = { eventDetails: selectedCFS,servicedata: "sosEvent" }
    this.customNavService.navigateByUrl('/atr', data);
  }

  async openDetailsModal(data) {
    let a: any = {};

    this.translateService.get('Alert').subscribe(t => {
      a.title = t;
    });
    this.translateService.get('OK').subscribe(t => {
      a.button = t;
    });


    const alert = await this.alertCtrl.create({
      header: a.title,
      message: data,
      buttons: [a.button]
    });

    await alert.present();
    const result = await alert.onDidDismiss();


  }

  openAtachmentsModal(image) {

    this.customNavService.navigateByUrl('files/file-details', { basicId: this.selectedSOS.basicid, vehicleId: this.mdtDetails.vehicleId });

  }



  abandonReasons = []
  getAbandonReasons() {
    this.httpClient.get('Responder/get_abandonreasons').subscribe(data => {
      console.log('getAbandonReasons==>', data);
      console.log('getAbandonReasons', data.Value);

      this.abandonReasons = data.Value;
      console.log('getAbandonReasons-0-0', this.abandonReasons);


    })
  }




}




class Sos {
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
  receivedDateTime: string
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