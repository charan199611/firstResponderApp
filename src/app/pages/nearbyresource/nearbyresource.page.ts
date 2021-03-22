import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';

@Component({
  selector: 'app-nearbyresource',
  templateUrl: './nearbyresource.page.html',
  styleUrls: ['./nearbyresource.page.scss'],
})
export class NearbyresourcePage implements OnInit {
  nearbyResources = [];

  constructor( private customNav: CustomNavService) {
  
  }

  closeModel() {
    this.customNav.popPage();
  }

  ionViewDidEnter() {
    console.log("nearbyResources", this.customNav.get("nearbyResources"));
    if(this.customNav.get("nearbyResources") != "undefined" || this.customNav.get("nearbyResources") != undefined){
      this.nearbyResources = this.customNav.get("nearbyResources").jaVehicles;
      }else{
        this.nearbyResources = [];
      }
      console.log("nearbyResources", this.nearbyResources);

  }

  ngOnInit(){
    
  }


}
