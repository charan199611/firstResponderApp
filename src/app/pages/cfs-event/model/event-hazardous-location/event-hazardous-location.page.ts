import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { LocationServicesMapPage } from 'src/app/pages/location-services-map/location-services-map.page';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';

@Component({
  selector: 'app-event-hazardous-location',
  templateUrl: './event-hazardous-location.page.html',
  styleUrls: ['./event-hazardous-location.page.scss'],
})
export class EventHazardousLocationPage implements OnInit {

  statusName;
  eventId;

  statusList = [{
    "Name":"dsfgds",
    "Distance":"2km",
    "latitude":"",
    "longitude":"",
 },
{
  "Name":"dsfjs",
    "Distance":"3km",
    "latitude":"",
    "longitude":"",
}
]


  constructor(private modalCtrl: ModalController, private popoverCtrl: PopoverController, private customNavService: CustomNavService, private navParams: NavParams) {


   }

  ngOnInit() {
  
  }

  ionViewDidEnter() {
    this.statusName = [];
  
    this.statusName = this.navParams.get("status");
  
    console.log("status", this.statusName);

  }

  

  getDistance(distance){

    return distance.toFixed(2);

  }

  cancel(){
    console.log("closeModal")
    this.closeToolTip();
  }


  closeToolTip() {
    this.popoverCtrl.dismiss();
    // this.notificationData = "";
  
  }



  moveToHazardousLocation(lat,lng,address){

    console.log("tooltip",lat,lng,address )

    LocationServicesMapPage.materialLat = lat;
    LocationServicesMapPage.materialLng = lng;
    LocationServicesMapPage.matrialAddress = address;
    LocationServicesMapPage.filterTypeChanged = true;
    this.closeToolTip();


  }

}
