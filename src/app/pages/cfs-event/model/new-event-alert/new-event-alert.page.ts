import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { Router } from '@angular/router';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { FcmService } from 'src/app/services/fcm.service';
import { Subscription } from 'rxjs';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-new-event-alert',
  templateUrl: './new-event-alert.page.html',
  styleUrls: ['./new-event-alert.page.scss'],
})
export class NewEventAlertPage implements OnInit {
  notificationData;
  subscription: Subscription;
  count = 0;
  messageHeader;

  cfsvalues = {
    eventId: '',
    basic_id: '',
  }
 notificationInfo = "";


  //   eventid:"CFS004916",
  //   "cityZoneId":1,
  //   "latitude":12.990507622322667,
  //   "deptId":2,
  //   "mobile":"98807322889",
  //   "psId":23,
  //   "starttime":"24-02-2020 22:13:04",
  //   "cityId":2,
  //   "priority":"P2",
  //   "placename":"CleanPro Services Pvt Ltd",
  //   "additionalDetails":"sdfghjk",
  //   "policeStation":"High Grounds Police Station",
  //   "distressPlaceName":"CleanPro Services Pvt Ltd",
  //   "imageUploaded":false,
  //   "messageType":1,
  //   "subtype":"102/07\r\n-BROUGHT/SPOT DEATH",
  //   "distressAddress":"KHR House, 11/1, Behind SBM on Cunningham Road,, Cunningham Rd, Vasanth Nagar, Bengaluru, Karnataka ",
  //   "markType":"",
  //   "eventtype":"102-ACCIDENT",
  //   "landmark":" Cunningham Rd, Vasanth Nagar",
  //   "longitude":77.58956909179686,
  //   "basic_id":622424,
  //   "fromUserType":"2",
  //   "fromUserName":"dws1",
  //   "mdtResponseTime":15
  // }

  public cfsEventList: Array<Object> = [];
   audio = new Audio();
  


  constructor(private navParams: NavParams, private eventsDb: EventsDbService, private router: Router,
    private modalCtrl: ModalController, private customNavService: CustomNavService, private httpClient: CustomHttpClient, private navCtrlr: NavController) {
    this.notificationData = "";
    this.notificationInfo = "";
    
    this.playAudio();
    this.getMessageType();
    console.log('NewEventAlertPage', this.notificationData);
    
    this.initializeData();
  }


  getMessageType(){
   if(this.navParams.get('messageType') == "HOTUPDATE"){
    this.messageHeader = "HOT Event Update!"
   
   }
   if(this.navParams.get('messageType') == "SOS"){
    this.messageHeader = "SOS Event Received!"
   }else{
      this.messageHeader = "New Event Received!"
    }

    if(this.navParams.get('messageType') == "PATROL"){
      this.messageHeader = "New Patrol Received!"
    }
    if(this.navParams.get('messageType') == "TASK"){
      this.messageHeader = "New Task Received!"
    }

    if(this.navParams.get('messageType') == "IOT"){
      this.messageHeader = "New IoT Incident Received!"
    }
    
 
   
   }
  

  ngOnInit() {
    console.log('this.router.url', this.router.url);
    
    if (this.router.url == '/cfs-event/cfs-event-details') {
      this.customNavService.navigateBack('/home');
    }
  }

  getMessageData(){
    return this.navParams.get('messageType');
   
  }

  initializeData() {
  if(this.navParams.get('messageType') != "PATROL" && this.navParams.get('messageType') != "TASK"){
    this.checkEventDetails();
  }else if(this.navParams.get('messageType') == "PATROL" || this.navParams.get('messageType') == "TASK"){
    this.notificationData = this.navParams.get('notificationData');
  }
    

  }



  checkEventDetails() {
    this.notificationData = this.navParams.get('notificationData');

    
  
  this.count = 0;
    console.log("NOTIFICATION DATA", this.notificationData);

    this.notificationInfo = this.notificationData;

    this.cfsvalues = {
      eventId: this.notificationData.eventid,
      basic_id: this.notificationData.basic_id,
    }

    console.log("messageType", this.navParams.get('messageType'));
if(this.navParams.get('messageType') == "IOT"){
  this.eventsDb.getIotEventDetails(this.notificationData.eventid).subscribe((data) => {

    console.log("notificationData", this.notificationInfo);
  
    if(this.count == 0){
    if (data.length > 0) {

      // console.log("notificationDataInsert", this.notificationInfo);
      this.eventsDb.updateIotEventDetails(this.notificationInfo);
       this.eventsDb.updateUnitSummaryDetails(this.notificationInfo);
      

      this.count++;
    } else {
      console.log("notificationDataUpdate", this.notificationInfo);
       this.eventsDb.insertIotEventDetails(this.notificationInfo);
       this.eventsDb.insertUnitSummaryDetails(this.notificationInfo); 
      this.count++;
    }
  }
  })
}
   else if(this.navParams.get('messageType') == "SOS"){

    this.eventsDb.getSOSEventDetails(this.notificationData.eventid).subscribe((data) => {

      console.log("notificationData", this.notificationInfo);
    
      if(this.count == 0){
      if (data.length > 0) {

        // console.log("notificationDataInsert", this.notificationInfo);
        this.eventsDb.updateSOSEventDetails(this.notificationInfo);
         this.eventsDb.updateUnitSummaryDetails(this.notificationInfo);
        

        this.count++;
      } else {
        console.log("notificationDataUpdate", this.notificationInfo);
         this.eventsDb.insertSOSEvent(this.notificationInfo);
         this.eventsDb.insertUnitSummaryDetails(this.notificationInfo); 
        this.count++;
      }
    }
    })

  }else{
    this.eventsDb.getEventDetails(this.notificationData.eventid).subscribe((data) => {

      console.log("notificationData", this.notificationInfo);
    
      if(this.count == 0){
      if (data.length > 0) {

        console.log("notificationDataInsert", this.notificationInfo);
        this.eventsDb.updateEventDetails(this.notificationInfo);
        this.eventsDb.updateUnitSummaryDetails(this.notificationInfo);
        

        this.count++;
      } else {
        console.log("notificationDataUpdate", this.notificationInfo);
        this.eventsDb.insertEventDetails(this.notificationInfo);
        this.eventsDb.insertUnitSummaryDetails(this.notificationInfo); 
        this.count++;
      }
    }
    })
  }

  

  }

  


  closeModal() {
    this.modalCtrl.dismiss();
    // this.notificationData = "";
    this.closeAudio();
    this.customNavService.navigateRoot('/home')
  }

  View() {
    this.closeAudio();
    this.modalCtrl.dismiss();
    this.updateReadStatus();  
    // this.notificationData = "";
    if(this.navParams.get('messageType') == "SOS"){
      this.customNavService.navigateByUrl('/sos-event/sos-event-details', { eventDetails: this.notificationInfo });
    }else if(this.navParams.get('messageType') == "CFS"){
      this.customNavService.navigateByUrl('/cfs-event/cfs-event-details', { eventDetails: this.notificationInfo });
    }else if(this.navParams.get('messageType') == "IOT"){
      this.customNavService.navigateByUrl('/iot-incident/iot-incident-details', { eventDetails: this.notificationInfo });
    }
    
    else if(this.navParams.get('messageType') == "PATROL"){
      this.customNavService.navigateByUrl('/patrolchart') 
    }else if(this.navParams.get('messageType') == "TASK"){
      this.customNavService.navigateByUrl('/task') 
    }
    
  }

  updateReadStatus() {
    let data = {
      event_id: this.notificationData.eventid,
      basic_id: this.notificationData.basic_id,
      vehicle_id: localStorage.getItem('vehicleId'),
      call_sign: localStorage.getItem('callSign'),
      status: 5,
      updated_time: '',
      from_user: this.notificationData.fromUserType,
      city_id: this.notificationData.cityId,
      cityzone_id: this.notificationData.cityZoneId,
      station_id: this.notificationData.psId,
      dept_id: this.notificationData.deptId,
      from_user_name: this.notificationData.fromUserName
    }
    this.httpClient.post('Responder/event_read_status', data).subscribe((data) => {

    });
  }

  playAudio(){
    this.audio.src = "assets/audio/alert_tone.mp3";
    this.audio.load();
    this.audio.play();
  }

  closeAudio(){

    this.audio.pause();
    
    

  }
  

}
