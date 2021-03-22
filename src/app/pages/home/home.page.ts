import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { Subscription } from 'rxjs';
import { TooltipPage } from '../tooltip/tooltip.page';
import { PopoverController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { CommonServices } from 'src/app/services/common-services/common-services';




@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  appVersion: string = require( '../../../../package.json').version;
  public totalCFSCount;
  public database: SqliteDb;
  totalSOSCount;
  totalCQCount;
  totalIotCount;
  popover;
  viewType;
  eventType;
  basicId;
  eventId;
  loginUser;
  trackingStatus;



  constructor(private router: Router, private theDB: SqliteDb, private eventService: EventsDbService, 
    private _ngZone: NgZone,private popoverController:PopoverController, private customNav: CustomNavService, private alertCtrl: AlertController,
    private appConfig: ApplicationConfigProvider, private commonService: CommonServices) {

      // console.log("version", data.version);


  }
 
  ionViewDidEnter() {

    this.fetchAllCfsEvent();

    this.fetchAllSOSEvents();
    this.fetchAllIotEvent();

    this.trackingStatus = this.appConfig.trackingStatus;

    // this.appVersion = this.commonService.transform(this.appVersion);
  
  }




  ngOnInit() {

    this.getVehicleData();

  }

  getVehicleData(){

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

      
        this.loginUser = entry.vehicleCallSign

        console.log('entry===>', this.loginUser);

      }
    });
  }

  loadCFSPage() {
    this.router.navigateByUrl('cfs-event/cfs-event-list');
  }

  fetchAllCfsEvent() {
    /* this.eventService.getEventsAll().subscribe(message => {
      console.log('fetchAllCfsEventy', message);

      let rowData = message;
      console.log('fetchAllCfsEventy', rowData.length);
      this._ngZone.run(() => {
        if (rowData.length > 0) {
          console.log('rowData.length > 0', rowData.length);
          this.totalCFSCount = rowData.length;
        } else {
          this.totalCFSCount = 0;
        }

      })

    }); */

    this.eventService.getWeekCfsList(moment().subtract(0, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')).then((message: any[]) => {
      let rowData = message;
      console.log('fetchAllCfsEventy', rowData.length);
      this._ngZone.run(() => {
        if (rowData.length > 0) {
          console.log('rowData.length > 0', rowData.length);
          this.totalCFSCount = rowData.length;
        } else {
          this.totalCFSCount = 0;
        }

      })

    });
  }

  fetchAllSOSEvents(){
    
    this.eventService.getWeekSOSList(moment().subtract(0, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')).then((message: any[]) => {
      let rowData = message;
      console.log('fetchAllSOS', rowData.length);
      this._ngZone.run(() => {
        if (rowData.length > 0) {
          console.log('rowData.length > 0', rowData.length);
          this.totalSOSCount = rowData.length;
        } else {
          this.totalSOSCount = 0;
        }

      })

    });
  }


  fetchAllIotEvent() {
   

    this.eventService.getWeekCfsIotList(moment().subtract(0, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')).then((message: any[]) => {
      let rowData = message;
      console.log('fetchAllCfsEventy', rowData.length);
      this._ngZone.run(() => {
        if (rowData.length > 0) {
          console.log('rowData.length > 0', rowData.length);
          this.totalIotCount = rowData.length;
        } else {
          this.totalIotCount = 0;
        }

      })

    });
  }

  loadSOSPage() {
    this.router.navigateByUrl('sos-event/sos-event-list');
  }

  loadCQPage() {

  }

  loadMissingPerson() {

  }

  loadVehicleLost() {

  }

  loadUnidentifiedBody() {

  }

  loadLocationPage() {

    this.router.navigateByUrl('/locationservice');

  }

  loadPatrolPage() {
    this.router.navigateByUrl('/patrolchart');
  }

  loadTaskPage() {
    this.router.navigateByUrl('/task');
  }
  
  loadLiveStreamPage(){
    this.router.navigateByUrl('/live-stream');
  }

  loadIotIncident(){
    this.router.navigateByUrl('/iot-incident/iot-incident-list');
  }

  loadReportsPage() {
    this.router.navigateByUrl('/report');
  }

  async presentToolTips(event) {
    this.popover = await this.popoverController.create({
      component: TooltipPage,
      componentProps: {
        viewType: this.viewType
        },
			event: event,
      translucent: true
      
      });
      
      console.log('logmessage',event);
			  return await this.popover.present();
			this.popover.onDidDismiss().then(data => {

			  });

  }

  loadAttendancePage(){
    this.router.navigateByUrl('/attendace');
  }

  getCfsCount(numberVal){
    return this.commonService.transform(numberVal);
  }



}
