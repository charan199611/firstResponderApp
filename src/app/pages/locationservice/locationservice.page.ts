import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-locationservice',
  templateUrl: './locationservice.page.html',
  styleUrls: ['./locationservice.page.scss'],
})
export class LocationservicePage implements OnInit {

  constructor(public navCtrl: NavController, public customNavService: CustomNavService , private router: Router) { }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }

  openLocationService(type) {

  //  this.navCtrl.navigateForward('location-services-map' )
  // this.router.navigateByUrl('/location-services-map');

   this.customNavService.navigateByUrl('/location-services-map', { serviceType: type })
   // this.navCtrl.push(HomePage, { serviceType: type });
  }
 
  backFunction(){
    this.customNavService.navigateRoot('/home');
  }



}
