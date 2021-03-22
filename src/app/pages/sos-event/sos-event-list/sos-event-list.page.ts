import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { Router } from '@angular/router';
import { NavController, ModalController, PopoverController, AlertController } from '@ionic/angular';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-sos-event-list',
  templateUrl: './sos-event-list.page.html',
  styleUrls: ['./sos-event-list.page.scss'],
})
export class SosEventListPage implements OnInit {

  
  public sos: {
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
    [
      
      { "color_hex": "#730099", "status_description": "All", "status_level": "All"  },
      { "color_hex": "#4d94ff", "status_description": "Acknowledge", "status_level": "Acknowledge"  },
      { "color_hex": "#339900", "status_description": "On Action", "status_level": "On Action"  },
      { "color_hex": "#990099", "status_description": "At Scene", "status_level": "At Scene"  },
      { "color_hex": "#730099", "status_description": "Close", "status_level": "Close"  },
      { "color_hex": "#730099", "status_description": "SOS RECEIVED", "status_level": "SOS RECEIVED" }];
      
   

  filterStatus = "All";

  selectedStatus: any = [];


  ngOnInit() {
    this.rowData = []
  }


  public database: SqliteDb;
  public sosList: Array<Object> = [];
  public selectedTimePeriod: number = 1;

  public firstTime: boolean = true;
  showRow = true;

  // constructor(private navCtrl: NavController, private platform: Platform, private http: HttpClient, public logger: LoggerService, private modalCtrl: ModalController) {

  constructor(private router: Router, private navCtrl: NavController, private theDB: SqliteDb, private eventService: EventsDbService,
    private customNavService: CustomNavService, private navController: NavController, private modalCtrl: ModalController, private popoverController: PopoverController,
    private alertCtrl: AlertController, private translateService: TranslateService) {

     
      

  }



  ionViewWillEnter() {

    this.fetchTodayCFSData();
 
  }

  ionViewDidLoad() {
   
  }

  openCreateEventPage(event) {
 
  }

  loadCFSDetails(sosId, unreadStatus, basicId, fromUserType) {
    let data: any = { eventDetails: { eventid: sosId } }

    this.customNavService.navigateByUrl('/sos-event/sos-event-details', data)

  }

  fetchTodayCFS() {

    console.log("fetchToday data");

    this.subscription = this.eventService.getAllSOSEvents().subscribe(message => {
      this.rowData = message;
      this.sosList = [];

      this.showStatus(this.filterStatus);
   
    });
  }

  fetchTodayCFSData() {
    this.eventService.getWeekSOSList(moment().subtract(0, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')).then((message: any[]) => {
      this.rowData = message;
      this.sosList = [];
      console.log("todayslist", this.rowData);
      console.log("todayslistlength", this.rowData.length);
      this.showStatus(this.filterStatus);
    

    });

  }





  fetch7DaysCFSData() {


    this.eventService.getWeekSOSList(moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')).then((message: any[]) => {
      this.rowData = message;
      this.sosList = [];
      this.showStatus(this.filterStatus);
   

    });


  }

  fetch30DaysCFSData() {
    this.eventService.getWeekSOSList(moment().subtract(30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss').toString(), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss').toString()).then((message: any[]) => {
      this.rowData = message;
      this.sosList = [];
      this.showStatus(this.filterStatus);

    });
  }

  showStatus(filterStatus) {

    this.sosList = [];

    if (this.rowData.length > 0) {
      for (var i = 0; i < this.rowData.length; i++) {

        console.log("rowdata", this.rowData[i].status);

        if (filterStatus == "All") {
          this.sosList.push(this.rowData[i]);
        } else {
          if (this.rowData[i].status == filterStatus) {
            this.sosList.push(this.rowData[i]);
          }
        }
      }
    }

  }

  openPanicPage() {
    // this.navCtrl.push(PanicPage);
  }




  async filterCfsList() {
    let isStatusChecked = false;
    let filterCFS: any = {};

    this.translateService.get(['Please Choose any Status', 'Cancel', 'Ok', 'All', 'Acknowledge', 'On Action', 'At Scene', 'Close', 'SOS RECEIVED']).subscribe(text => {
      filterCFS.title = text['Please Choose any Status'];
      filterCFS.cancelButton = text['Cancel'];
      filterCFS.okButton = text['Ok'];
      this.missionStatus[0].status_level = text['All'];
      this.missionStatus[1].status_level = text['Acknowledge'];
      this.missionStatus[2].status_level = text['On Action'];
      this.missionStatus[3].status_level = text['At Scene'];
      this.missionStatus[4].status_level = text['Close'];
      this.missionStatus[5].status_level = text['SOS RECEIVED'];

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


}
