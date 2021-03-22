import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, PopoverController, AlertController } from '@ionic/angular';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { Subscription } from 'rxjs';
import * as moment from "moment"
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonServices } from 'src/app/services/common-services/common-services';



@Component({
  selector: 'app-cfs-event-list',
  templateUrl: './cfs-event-list.page.html',
  styleUrls: ['./cfs-event-list.page.scss'],
})
export class CfsEventListPage implements OnInit {


  public cfs: {
    eventid: string,
    basicid: number,
    priority: string,
    eventtype: string,
    subtype: string,
    station: string,
    address: string,
    landmark: string,
    mobile: string,
    additionaldetails: string,
    latitude: number,
    longitude: number,
    msgtype: number,
    distressname: string,
    starttime: string,
    statusid: number,
    status: string,
    color_hex: string,
    currentStatus: number,
    fromUserType: number,
    placename: string,
    townname: string,
    cityId: number,
    cityZoneId: string,
    deptId: number,
    psId: number

  };
  cfsWeekList: any;

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
  //missionStatus = [{ "event_status_id": 13, "color_hex": "#4d94ff", "status_description": "Accepted" }, { "event_status_id": 14, "color_hex": "#339900", "status_description": "On Action" }, { "event_status_id": 15, "color_hex": "#990099", "status_description": "At Scene" }, { "event_status_id": 9, "color_hex": "#730099", "status_description": "Close" }];

  rowData = [];
  popover;
  viewType;

  missionStatus =
    [{ "color_hex": "#730099", "status_description": "All", "status_level": "All"  },
    { "color_hex": "#4d94ff", "status_description": "Acknowledge", "status_level": "Acknowledge"  },
    { "color_hex": "#339900", "status_description": "On Action", "status_level": "On Action"  },
    { "color_hex": "#990099", "status_description": "At Scene", "status_level": "At Scene"  },
    { "color_hex": "#730099", "status_description": "Close", "status_level": "Close"  },
    { "color_hex": "#730099", "status_description": "CFS RECEIVED", "status_level": "CFS RECEIVED" }];

  filterStatus = "All";

  selectedStatus: any = [];


  ngOnInit() {
    this.rowData = []
  }


  public database: SqliteDb;
  public cfsList: Array<Object> = [];
  public selectedTimePeriod: number = 1;

  public firstTime: boolean = true;
  showRow = true;

  // constructor(private navCtrl: NavController, private platform: Platform, private http: HttpClient, public logger: LoggerService, private modalCtrl: ModalController) {

  constructor(private router: Router, private navCtrl: NavController, private theDB: SqliteDb, private eventService: EventsDbService,
    private customNavService: CustomNavService, private navController: NavController, private modalCtrl: ModalController, private popoverController: PopoverController,
    private alertCtrl: AlertController, private translateService: TranslateService, private commonService:CommonServices) {

     
      
  //  this.translateService.
    // this.fetch7DaysCFSData();
    //this.platform.ready().then(() => {

    //    this.database = new SqliteDb();
    //   this.database.OpenDatabase({ name: "data.db", location: "default" }).then(() => {
    //     this.firstTime = false;
    //     this.fetchTodayCFSData();
    //   }, (error) => {
    //     this.logger.log(LoggerService.ERROR, CfsPage.name, "Unable to open database. ERROR: " + error);
    //  });
    //  });
  }



  ionViewWillEnter() {

    this.fetchTodayCFSData();
    //this.fetchTodayCFS();
    // if (!this.firstTime) {
    //   this.fetchTodayCFSData();
    // }
    localStorage.setItem('currentPage', "");
  }

  ionViewDidLoad() {
    // this.logger.log(LoggerService.INFO, CfsPage.name, 'ionViewDidLoad CfsPage');
  }

  openCreateEventPage(event) {
    // this.navCtrl.push((CfsDetailsPage, );
  }

  loadCFSDetails(cfsId, unreadStatus, basicId, fromUserType) {
    let data: any = { eventDetails: { eventid: cfsId } }

    this.customNavService.navigateByUrl('/cfs-event/cfs-event-details', data)

    // if (unreadStatus === 1) {
    //   this.navCtrl.push(CfsEventDetailsPage, { cfsId: cfsId });
    // } else {

    //   let params = {
    //     read_time: new Date(),
    //     cfsid: cfsId,
    //     basic_id: basicId,
    //     read_status: "5",
    //     sim_no: ApplicationConfig.simNo,
    //     fromUserType: fromUserType
    //   };

    //   this.logger.log(LoggerService.INFO, CfsPage.name, "CFS read status params: " + JSON.stringify(params));

    //   this.http.post("Responder/cfsreadStatus", params).subscribe(data => {
    //     console.log("loadCFSDetails--->data"+JSON.stringify(data))
    //     let result = data.json();
    //     this.logger.log(LoggerService.INFO, CfsPage.name, "loadCFSDetails() Responder/cfsreadStatus"+JSON.stringify(result))
    //     this.database.executeSql("UPDATE cfs_details SET unread = ? WHERE basicid = ?", [1, basicId]).then(() => {
    //       console.log("CFS read status updated successfully.");
    //       this.logger.log(LoggerService.INFO, CfsPage.name, "CFS read status updated successfully.");
    //       this.navCtrl.push(CfsDetailsPage, { cfsId: cfsId });
    //     }).catch(error => {
    //       console.log("CFS read status update failed ==> " + JSON.stringify(error));
    //       this.logger.log(LoggerService.ERROR, CfsPage.name, "error in loadCFSDetails()"+JSON.stringify(error))
    //       this.navCtrl.push(CfsDetailsPage, { cfsId: cfsId });
    //     });
    //   });
    // }
  }

  fetchTodayCFS() {

    console.log("fetchToday data");

    this.subscription = this.eventService.getEventsAll().subscribe(message => {
      this.rowData = message;
      this.cfsList = [];

      this.showStatus(this.filterStatus);
      // if (this.rowData.length > 0) {
      //   for (var i = 0; i < this.rowData.length; i++) {
      //     this.cfsList.push(this.rowData[i]);

      //     let data = this.rowData[i];
      //     console.log('cfslist', this.rowData[i]);

      //   }
      // }
    });
  }

  fetchTodayCFSData() {
    this.eventService.getWeekCfsList(moment().subtract(0, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')).then((message: any[]) => {
      this.rowData = message;
      this.cfsList = [];
      console.log("todayslist", this.rowData);
      console.log("todayslistlength", this.rowData.length);
      this.showStatus(this.filterStatus);
      // if (this.rowData.length > 0) {
      //   for (var i = 0; i < this.rowData.length; i++) {
      //     this.cfsList.push(this.rowData[i]);
      //     console.log('cfslist', this.rowData[i]);

      //   }
      // }

    });

  }





  fetch7DaysCFSData() {


    this.eventService.getWeekCfsList(moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')).then((message: any[]) => {
      this.rowData = message;
      this.cfsList = [];
      this.showStatus(this.filterStatus);
      // if (this.rowData.length > 0) {
      //   for (var i = 0; i < this.rowData.length; i++) {
      //     this.cfsList.push(this.rowData[i]);

      //     console.log('cfslist', this.rowData[i]);

      //   }
      // }

    });


  }

  fetch30DaysCFSData() {
    this.eventService.getWeekCfsList(moment().subtract(30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss').toString(), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss').toString()).then((message: any[]) => {
      this.rowData = message;
      this.cfsList = [];
      this.showStatus(this.filterStatus);
      //  if (this.rowData.length > 0) {
      //   for (var i = 0; i < this.rowData.length; i++) {
      //     this.cfsList.push(this.rowData[i]);
      //     console.log('cfslist', this.rowData[i]);
      //   }
      // } 
    });
  }

  showStatus(filterStatus) {

    this.cfsList = [];

    if (this.rowData.length > 0) {
      for (var i = 0; i < this.rowData.length; i++) {

        console.log("rowdata", this.rowData[i].status);

        if (filterStatus == "All") {
          this.cfsList.push(this.rowData[i]);
        } else {
          if (this.rowData[i].status == filterStatus) {
            this.cfsList.push(this.rowData[i]);
          }
        }
      }
    }

  }

  openPanicPage() {
    // this.navCtrl.push(PanicPage);
  }


  cfsNewPage() {
    this.router.navigateByUrl('/cfs-event/cfs-new');
  }

  async filterCfsList() {
    let isStatusChecked = false;
    let filterCFS: any = {};


    this.translateService.get(['Please Choose any Status', 'Cancel', 'Ok', 'All', 'Acknowledge', 'On Action', 'At Scene', 'Close', 'CFS RECEIVED']).subscribe(text => {
      filterCFS.title = text['Please Choose any Status'];
      filterCFS.cancelButton = text['Cancel'];
      filterCFS.okButton = text['Ok'];
      this.missionStatus[0].status_level = text['All'];
      this.missionStatus[1].status_level = text['Acknowledge'];
      this.missionStatus[2].status_level = text['On Action'];
      this.missionStatus[3].status_level = text['At Scene'];
      this.missionStatus[4].status_level = text['Close'];
      this.missionStatus[5].status_level = text['CFS RECEIVED'];
    });


    let options = {
      header: filterCFS.title,
      message: '',
      inputs: [],
      buttons: [
        {
          text: filterCFS.cancelButton,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: filterCFS.okButton,
          handler: data => {
            this.filterStatus = data;
            console.log("data", data);
            this.showStatus(this.filterStatus)

          }
        }
      ]
    };

    options.inputs = [];
    // // Now we add the radio buttons

    // console.log("length", this.missionStatus.length);
    for (let i = 0; i < this.missionStatus.length; i++) {

      if (this.missionStatus[i].status_description == this.filterStatus) {
        isStatusChecked = true;
      } else {
        isStatusChecked = false;
      }

      console.log(this.missionStatus[i].status_description);
      options.inputs.push({ name: 'options', value: this.missionStatus[i].status_description, label: this.missionStatus[i].status_level, type: 'radio', checked: isStatusChecked })
    }

    // Create the alert with the options
    let radioButtonAlert = await this.alertCtrl.create(options);

    radioButtonAlert.present();
  }


  backFunction(){
    this.customNavService.navigateRoot('/home');
  }

  getNumberInArabic(numberVal){
    return this.commonService.transform(numberVal);
  }




}
