import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';

@Component({
  selector: 'app-nearbyevent',
  templateUrl: './nearbyevent.page.html',
  styleUrls: ['./nearbyevent.page.scss'],
})
export class NearbyeventPage implements OnInit {

 
  nearbyEvents= [];

  constructor( private customNav: CustomNavService, private http: HttpClient) {

    
   
   // this.nearbyEvents = JSON.parse(this.customNav.get("nearbyEvents"));
  }

  closeModel() {
    this.customNav.popPage();
  }

  ionViewDidEnter() {
    console.log("NearbyEvents", this.customNav.get("nearbyEvents"));
    if(this.customNav.get("nearbyEvents") != "undefined" || this.customNav.get("nearbyEvents") != undefined){
      this.nearbyEvents = this.customNav.get("nearbyEvents").jaEvents;
      }else{
        this.nearbyEvents = [];
      }
      console.log("nearbyEvents", this.nearbyEvents);

  }

  ngOnInit(){
    
  }

}
