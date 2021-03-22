import { Component, OnInit, NgZone } from '@angular/core';
import { SqliteDb } from 'src/app/model/sqlitedb';
import * as moment from "moment"
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { Subscription, Observable } from 'rxjs';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { FcmService } from 'src/app/services/fcm.service';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { Router } from '@angular/router';
import { MessageServicesService } from 'src/app/services/message-services.service';
import { OperatorInfoPage } from '../../shared-pages/operator-info/operator-info';
import { TranslateService } from '@ngx-translate/core';
import { EventAdditionalInfoPage } from '../model/event-additional-info/event-additional-info.page';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { machineId, machineIdSync } from 'node-machine-id';

declare var MediaRecorder: any;


@Component({
  selector: 'app-cfs-event-details',
  templateUrl: './cfs-event-details.page.html',
  styleUrls: ['./cfs-event-details.page.scss'],
})
export class CfsEventDetailsPage implements OnInit {

  selectedCFS: Cfs = new Cfs()


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
  static instance: CfsEventDetailsPage;
  imieNum = "";
 language="";



  constructor(private theDB: SqliteDb, private eventService: EventsDbService, private http: CustomHttpClient, private ngZone: NgZone,
    private alertCtrl: AlertController, private customNavService: CustomNavService, private httpClient: CustomHttpClient,
    private commonService: CommonServices, private router: Router, private navController: NavController,
    private messageService: MessageServicesService, private modalCtrl: ModalController,
    private translateService: TranslateService, private applicationConfigProvider: ApplicationConfigProvider) {

      this.imieNum = machineIdSync(true);
    CfsEventDetailsPage.instance = this;

    if (this.applicationConfigProvider.missionStatus) {
      this.missionStatus = this.applicationConfigProvider.missionStatus;

    } else {
      this.missionStatus = [{ "event_status_id": 6, "color_hex": "#4d94ff", "status_description": "Acknowledge" }, { "event_status_id": 7, "color_hex": "#339900", "status_description": "On Action" }, { "event_status_id": 8, "color_hex": "#990099", "status_description": "At Scene" }, { "event_status_id": 9, "color_hex": "#730099", "status_description": "Close" }, { "event_status_id": 10, "color_hex": "#4d94ff", "status_description": "Abandon" }];
    }


    localStorage.setItem('currentPage', "cfsDetailsPage");
    this.pagesubscription = this.messageService.getMessage().subscribe(message => {

      let getMessgae = message.text;

      console.log("isTrue", (getMessgae == "hotUpdate"));

      if (getMessgae == "hotUpdate") {
        this.eventDetails = "";




        console.log("subscribbeMessage", message);
        // this.messageService.sendMessage("eventReceived")
        // this.setEventData();


        this.ngZone.run(() => {

          this.eventDetails = this.customNavService.get('eventDetails');
          console.log("force update the screen eventDetails", this.eventDetails);
          //  //  CfsEventDetailsPage.instance.setEventData();

          this.subscription = this.eventService.getEventDetails(this.eventDetails.eventid).subscribe(message => {
            console.log('setdatatirggered123', message);

            let data = message[0];


            this.selectedCFS = {
              eventid: data.event_id,
              basicid: data.basic_id,
              priority: data.priority,
              eventtype: data.incident_type,
              subtype: data.incident_subtype,
              station: data.nearest_police_station,
              address: data.location,
              landmark: data.landmark,
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
              image: '',
              subeventTypeId: data.subeventTypeId
            };

            console.log("selectedCfs", this.selectedCFS);




          });

          this.messageService.sendMessage("event");
          //     this.subscription.unsubscribe();


        });


      } else {
        // clear messages when empty message received

      }
    });


  }

  ngOnDestroy() {
    this.pagesubscription.unsubscribe();
  }


  setTranslate() {
    if (window.localStorage.getItem("language") === null || window.localStorage.getItem("language") === undefined) {

      this.translateService.use("en")
    } else {

      this.translateService.use(window.localStorage.getItem("language"));
    }
  }



  refresh() {
    this.ngZone.run(() => {

      console.log('force update the screen');
    });
  }



  ionViewDidEnter() {
  
  

  }


  ngOnInit() {

    this.getLanguage();

    console.log('cfsdetails', this.customNavService.get('eventDetails'));
    this.getAbandonReasons();
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

  async operatorInfo() {
    let details = await this.modalCtrl.create({
      component: OperatorInfoPage,
      showBackdrop: true, backdropDismiss: true, cssClass: 'app-event-operator-info',
      componentProps: { cfsData: this.selectedCFS }
    });
    details.onDidDismiss().then(data => {
      console.log('onDidDismiss', data);
    })
    details.present();
  }
  backFunction() {
  this.customNavService.navigateRoot('/cfs-event/cfs-event-list');	
  }


  openSuppliment(){
    this.customNavService.navigateByUrl('/suppliment-info', {basicId: this.selectedCFS.basicid})
  }

  openSOP(){
    this.customNavService.navigateByUrl('/sop-info', {subeventTypeId: this.selectedCFS.subeventTypeId})
  }



  setEventData() {
    // subscribe to home component messages
    this.subscription = this.eventService.getEventDetails(this.eventDetails.eventid).subscribe(message => {
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
        landmark: data.landmark,
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
        image: '',
        subeventTypeId: data.subeventTypeId
      };


      console.log("selectedCfs", this.selectedCFS);
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
            text: updateForClose.yesButton,
            handler: () => {
              isSubmitforClose = true;
              this.updateMissionStatusConfirm(basicId, eventid, statusId, latitude, longitude, fromUserType, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          },
          {
            text: updateForClose.noButton,
            handler: () => {
              console.log('in update button');
              //this.selectedCFS.statusid = this.selectedCFS.currentStatus;
             // this.updateMissionStatusConfirm(basicId, eventid, statusId, latitude, longitude, fromUserType, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          }, 
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
            text: updateStatus.yesButton,
            handler: () => {
              this.updateMissionStatusConfirm(basicId, eventid, statusId, latitude, longitude, fromUserType, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          },
          {
            text: updateStatus.noButton,
            handler: () => {
              console.log('in update button');
              //this.selectedCFS.statusid = this.selectedCFS.currentStatus;
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
            text: updateLocation.yesButton,
            handler: () => {
              this.updateMissionStatusConfirmToDB(basicId, eventid, statusId, latitude, longitude, fromUserType, true, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          },
          {
            text: updateLocation.noButton,
            handler: () => {
              console.log('Disagree clicked');
              this.updateMissionStatusConfirmToDB(basicId, eventid, statusId, latitude, longitude, fromUserType, false, isSubmitforClose, cityId, cityZoneId, deptId, psId, fromUserName, priority);
            }
          },
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
      latitude: this.applicationConfigProvider.latitude,
      longitude: this.applicationConfigProvider.longitude,
      address: "",
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



      this.eventService.updateEventStatus(statusId, statusName, eventid);
      this.eventService.updateUnitSummaryEventStatus(statusId, statusName, eventid);
      this.selectedCFS.currentStatus = statusId;
      this.selectedCFS.status = statusName;
      this.selectedCFS.statusid = statusId;


      if (statusId === 9 || statusId == '9') {

        this.eventService.deleteEvent(basicId).then((value) => {
          console.log('abandonpage', value);
          this.checkupdateMdtStatus();
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

        if(this.language == "ar"){
          this.abandonReasons[index].reason = this.abandonReasons[index].reason_arabic
        }


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
        buttons: [
          {
          text: abandonAlert.okayButton,
          handler: (data) => {
            console.log('Confirm Okay');


            this.confirmAbandonReason(status, basicId, eventId, lastStatus, fromUserType, cityId, cityZoneId, deptId, psId, fromUserName, priority, data);

          }
        },
        {
          text: abandonAlert.cancelButton,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            alertBox.dismiss();
          }
        }
      ]
      });

      alertBox.present().then(() => {

      });
    }
    /* if (status == 4) {
      let alertBox = await this.alertCtrl.create({
        backdropDismiss: false
      });
      alertBox.setTitle('Abandoned Reason');

      for (let index = 1; index < this.abandonedReasons.length; index++) {
        alertBox.addInput({
          type: 'radio',
          label: this.abandonedReasons[index].reason,
          value: this.abandonedReasons[index].reason_id
        });
      }

      alertBox.addButton({
        text: 'Cancel',
        handler: data => {
          this.selectedCFS.statusid = lastStatus;
        }
      });

      alertBox.addButton({
        text: 'Update',
        handler: data => {
          let latitude = 0.0;
          let longitude = 0.0;
           if (LocationTracker.locationBean !== undefined) {
            latitude = LocationTracker.locationBean.latitude
            longitude = LocationTracker.locationBean.longitude
          } 

          let params = {
            basicId: basicId,
            missionStatus: status,
            subMissionStatus: data,
            vehicelID: this.mdtDetails.vehicleId,
            updatedDateTime: moment().format('x'),
            latitude: latitude,
            longitude: longitude,
            fromUserType: fromUserType,
            cityid: cityId,
            cityzoneid: cityZoneId,
            deptId: deptId,
            psId: psId
          };

          
          this.http.post("Responder/updateMissionStatus", params).subscribe(result => {
            this.database.executeSql("DELETE FROM cfs_details WHERE basicid = ?", [basicId]).then((value) => {
              this.navCtrl.popTo(CfsPage);
            }).catch(error => {
              
            });
            this.testCheckboxOpen = false;
            this.testCheckboxResult = data;
          }, error => {
            
          });

        }
      });

      alertBox.present().then(() => {
        this.testCheckboxOpen = true;
      });
    }*/
    /* else if (status == 9) {
      let alertBox = await this.alertCtrl.create({
        backdropDismiss: false
      });
      alertBox.setheader('Officer Name');

      alertBox.setCssClass('selectOfficerAlert')

      for (let index = 0; index < this.officerDetails.length; index++) {
        alertBox.addInput({
          type: 'radio',
          label: this.officerDetails[index].officer_name,
          value: this.officerDetails[index].contacts_id
        });
      }

      alertBox.addButton({
        text: 'Cancel',
        handler: data => {
          this.customizer.presentAutoHideToast('Please select Officer Name to close the Event')
        }
      });

      alertBox.addButton({
        text: 'Update',
        handler: data => {
          console.log("data in cfs details" + data)
          this.officer_id = data;
          //this.confirmationPopupForCloseEvent(data);
        }
      });

      alertBox.present().then(() => {
        alertBoxthis.testCheckboxOpen = true;
      });
    } */

  }

  async confirmAbandonReason(status, basicId, eventId, lastStatus, fromUserType, cityId, cityZoneId, deptId, psId, fromUserName, priority, data) {
   
    let abandonAlert: any = {};
    this.translateService.get(['Confirmation', 'Are You Sure Want to submit for Abandon?', 'Yes', 'No']).subscribe(text => {
      abandonAlert.header = text['Confirmation'];
      abandonAlert.subHeader = text['Are You Sure Want to submit for Abandon?'];
      abandonAlert.yesButton = text['Yes'];
      abandonAlert.noButton = text['No'];
    });
   
    let confirmAlert = await this.alertCtrl.create({
      cssClass: "custom-loader",
      header: abandonAlert.header,
      subHeader: abandonAlert.subHeader,
      buttons: [
        {
          text: abandonAlert.yesButton,
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

                this.checkupdateMdtStatus();
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
        },
        {
          text: abandonAlert.noButton,
          handler: () => {
            console.log('in update button');
          }
        },
      ]
    });
    confirmAlert.present();
  }

  checkupdateMdtStatus(){
  
    this.subscription = this.eventService.getEventsAll().subscribe(message => {
      let rowData = message;
      console.log("rowData", rowData);

      if(rowData.length == 0){
         this.updateAvailableMDTStatus();
      }
    
    
    });

      
    
  }

  updateAvailableMDTStatus(){
    let params = {

      "imeiNo":this.imieNum,
      "callSign":this.mdtDetails.callSign,
      "vehicleStatus":3
  }

  console.log("params", params);
  this.httpClient.post('Responder/updateMdtStatus/', params).subscribe(result => {
    
    console.log("updateMdtStatus",result);

    }, error => {
    
    });
  }



  updateMdtAvailableStatus() {
    this.eventService.getEventsAll().subscribe((res) => {
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


    console.log("cfsDetails", cfsDetails);
    this.customNavService.navigateByUrl('/location-services-map', { callback: this.myCallbackFunction, serviceType: 6, cfsLatlng: cfsDetails });
  }

  myCallbackFunction = (_params) => {
    return new Promise((resolve, reject) => {
        console.log("after Call Back the return params are :::=>", _params);
        this.updateEventId(_params);
    });
  }

  updateEventId(eventDetails){
    this.getLanguage();

    console.log('cfsdetails', this.customNavService.get('eventDetails'));
    this.getAbandonReasons();
    this.eventDetails = eventDetails;
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


  // showMapPage(data) {
  //   navigator.mediaDevices.getUserMedia({ audio: true })
  //     .then(stream => {
  //       const mediaRecorder = new MediaRecorder(stream);
  //       mediaRecorder.start();

  //       const audioChunks = [];
  //       mediaRecorder.addEventListener("dataavailable", event => {
  //         console.log('eventdata', event);
  //         audioChunks.push(event.data);
  //       });

  //       mediaRecorder.addEventListener("stop", () => {
  //         const audioBlob = new Blob(audioChunks);
  //         const audioUrl = URL.createObjectURL(audioBlob);
  //         const audio = new Audio(audioUrl);
  //         console.log('stopevent', audioUrl);

  //         audio.play();
  //       });

  //       setTimeout(() => {
  //         mediaRecorder.stop();
  //         console.log('recording stoped');
  //       }, 10000);
  //     });
  // }

  loadATRPage(selectedCFS) {
    let data = { eventDetails: selectedCFS, servicedata: "cfsevent" }
    this.customNavService.navigateByUrl('/atr', data);
  }

  loadLiveStram(selectedCFS){
    let data = { eventDetails: selectedCFS }
    this.customNavService.navigateByUrl('/live-stream', data);
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

    this.customNavService.navigateByUrl('files/file-details', { basicId: this.selectedCFS.basicid, vehicleId: this.mdtDetails.vehicleId });

  }

  changeEventType(eventid) {

    let eventTypeAlert: any = {};

    this.translateService.get(['Select Event Type', 'Okay', 'Cancel']).subscribe(text => {
      eventTypeAlert.title = text['Select Event Type'];
      eventTypeAlert.okayButton = text['Okay'];
      eventTypeAlert.cancelButton = text['Cancel'];
    });

    console.log('changeEventType');
    this.httpClient.post('Responder/event_type/'+this.language, {}).subscribe(async (data) => {
      console.log('Responder/event_type', data.eventtyperesult);
      this.eventTypeList = data.eventtyperesult;
      let radio_options = [];
      let remarks = this.eventTypeList;
    
        if(this.language == "ar"){
          for(var i=0; i<this.eventTypeList.length; i++){
            this.eventTypeList[i].event_name = this.eventTypeList[i].event_name_arabic;

            radio_options.push({
              type: 'radio',
              label: remarks[i].event_name,
              value: remarks[i],
    
            });
          }
        }else{
          for (var index = 0; index < remarks.length; index++) {
           

            radio_options.push({
              type: 'radio',
              label: remarks[index].event_name,
              value: remarks[index],
    
            });
          }
        
      

      }

      let alertBox = await this.alertCtrl.create({
        header: eventTypeAlert.title,
        cssClass: "remarksBox",
        inputs: radio_options,
        buttons: [
         {
          text: eventTypeAlert.okayButton,
          handler: (data) => {
            console.log('Confirm Okay', data);
            this.ngZone.run(() => {
              this.selectedCFS.eventtype = data.event_name
            })

            this.getSubType(data.event_id, data.event_name);

          }
        },
        {
          text: eventTypeAlert.cancelButton,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            alertBox.dismiss();
          }
        }
      ]
      });

      alertBox.present().then(() => {

      });
    });


  }
  getSubType(event_id: any, eventType) {

    let eventSubTypeAlert: any = {};

    this.translateService.get(['Select Event Sub Type', 'Okay', 'Cancel']).subscribe(text => {
      eventSubTypeAlert.title = text['Select Event Sub Type'];
      eventSubTypeAlert.okayButton = text['Okay'];
      eventSubTypeAlert.cancelButton = text['Cancel'];
    });

    this.httpClient.post('Responder/event_subtype/'+this.language+"/"+ event_id, {}).subscribe(async (data) => {
      console.log('Responder/event_subtype/', data.layerresult);
      this.eventTypeList = data.layerresult;
      let radio_options = [];
      let remarks = this.eventTypeList;

      if(this.language == "ar"){
        for(var i=0; i<remarks.length; i++){
          remarks[i].event_name = remarks[i].event_name_arabic;

          radio_options.push({
            type: 'radio',
            label: remarks[i].event_name,
            value: remarks[i],
  
          });
        }
      }else{
      for (var index = 0; index < remarks.length; index++) {

        radio_options.push({
          type: 'radio',
          label: remarks[index].event_name,
          value: remarks[index],

        });

      }
    }

      let alertBox = await this.alertCtrl.create({
        header: eventSubTypeAlert.title,
        cssClass: "remarksBox",
        inputs: radio_options,
        buttons: [{
          text: eventSubTypeAlert.cancelButton,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            alertBox.dismiss();
          }
        }, {
          text: eventSubTypeAlert.okayButton,
          handler: (data) => {
            console.log('Confirm Okay', data);
            this.ngZone.run(() => {
              CfsEventDetailsPage.instance.selectedCFS.subtype = data.event_name;
              CfsEventDetailsPage.instance.selectedCFS.eventtype = eventType;
              CfsEventDetailsPage.instance.selectedCFS.subeventTypeId = data.event_id
              let eventmainId = event_id;
              console.log("this.selectedCFS.subtype", this.selectedCFS.subtype);


             
              this.updateEventTypeSubTypeDetails(CfsEventDetailsPage.instance.selectedCFS.subeventTypeId,eventmainId, CfsEventDetailsPage.instance.selectedCFS.subtype, CfsEventDetailsPage.instance.selectedCFS.eventtype);

            })
          }
        }]
      });

      alertBox.present().then(() => {

      });
    });

  }


  updateEventTypeSubTypeDetails(subeventTypeId, eventTypeId, subtypeName, typeName){
let params;
    if(this.language == 'ar'){
       params = {
  
        "basicId": this.selectedCFS.basicid,
        "eventId": this.selectedCFS.eventid,
        "mainEventTypeId":eventTypeId,
        "subEventTypeId" : subeventTypeId,
        "vehicleId" : this.mdtDetails.vehicleId,
        "deptId":"2",
        "userName":this.selectedCFS.fromUserName,
        "mainEventTypeName":"",
        "subEventTypeName":"",
        "mainEventTypeNameHindi":typeName,
        "subEventTypeNameHindi":subtypeName
    
    }
    }else{
       params = {
  
        "basicId": this.selectedCFS.basicid,
        "eventId": this.selectedCFS.eventid,
        "mainEventTypeId":eventTypeId,
        "subEventTypeId" : subeventTypeId,
        "vehicleId" : this.mdtDetails.vehicleId,
        "deptId":"2",
        "userName":this.selectedCFS.fromUserName,
        "mainEventTypeName":typeName,
        "subEventTypeName":subtypeName,
        "mainEventTypeNameHindi":"",
        "subEventTypeNameHindi":""
    
    }
    }

 this.commonService.showLoader("Loading...");
 this.httpClient.post('Responder/updateEventFromMDT', params).subscribe(result => {
  this.commonService.hideLoader();
    console.log("updatedEventFromMDT",result);
    
    if(result.STATUS == true){

        this.eventService.updateEventTypeSubType(typeName, subtypeName, subeventTypeId, eventTypeId)
      this.eventService.updateUnitSummaryEventTypeSubType(typeName, subtypeName, this.selectedCFS.eventid)
      // this.eventService.updateEventTypeSubType(CfsEventDetailsPage.instance.selectedCFS.eventtype, CfsEventDetailsPage.instance.selectedCFS.subtype, CfsEventDetailsPage.instance.selectedCFS.subeventTypeId, this.selectedCFS.eventid)
      // this.eventService.updateUnitSummaryEventTypeSubType(CfsEventDetailsPage.instance.selectedCFS.eventtype, CfsEventDetailsPage.instance.selectedCFS.subtype, this.selectedCFS.eventid)
      this.commonService.presentAutoHideToast("Event Updated Successfully!");
    }else{
      this.commonService.presentAutoHideToast("Event Not Updated");
    }

    }, error => {
      this.commonService.hideLoader();
      console.log("error", error);
    });
  }

  abandonReasons = []
  getAbandonReasons() {
    this.httpClient.get('Responder/get_abandonreasons/'+this.language).subscribe(data => {
      console.log('getAbandonReasons==>', data);
      console.log('getAbandonReasons', data.Value);

      this.abandonReasons = data.Value;
      console.log('getAbandonReasons-0-0', this.abandonReasons);


    })
  }


  async openCasualities() {
    let modal = await this.modalCtrl.create(
      {
        component: EventAdditionalInfoPage, componentProps: { eventDetails: this.selectedCFS.eventid },
        showBackdrop: true, backdropDismiss: false, cssClass: 'app-event-additional-info'
      });
    await modal.present();
  }

  async openSop(){
    this.customNavService.navigateByUrl('/sop-info', {basicId: this.selectedCFS.basicid})

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
  subeventTypeId: string
}