import { Component, OnInit } from '@angular/core';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-show-poi',
  templateUrl: './show-poi.page.html',
  styleUrls: ['./show-poi.page.scss'],
})
export class ShowPoiPage implements OnInit {



  poiResult: any;
  poiResponseData = [];
  displayKeys;
  keys: Array<string>;
  constructor(public customNav: CustomNavService, public navController: NavController, private translateService: TranslateService) {

     

      this.poiResult = customNav.get('poiResponseData');
      this.poiResponseData = this.poiResult.values;
      

      console.log("poiResponseData", this.poiResponseData);
      console.log("poiResponseData", this.poiResponseData.values);
      // alert(JSON.stringify(this.boloResponseData))

  }

  ngOnInit() {
  }

  ionViewWillEnter() {

      this.keys = Object.keys(this.poiResponseData[0]);
      this.displayKeys = Object.keys(this.poiResponseData[0]);

      console.log("keys", this.keys);
      console.log("keys", this.displayKeys);

      let a: any = {};

      let poiService: any = {};

    // this.translateService.get(['Poi Name', 'Lat', 'Lon']).subscribe(text => {
    //   this.displayKeys[0].poiName = text['Poi Name'];
    //   this.displayKeys[0].latitude = text['Lat'];
    //   this.displayKeys[0].longitude = text['Lon'];
    // });


      // this.keys.splice(4, this.keys.length-4)

      for (let i = 0; i < this.displayKeys.length; i++) {
          this.displayKeys[i] = this.displayKeys[i].replace('_', ' ')

          // this.translateService.get([this.displayKeys[i]]).subscribe(text => {
          //   this.displayKeys[i] = text[this.displayKeys[i]];
          //   this.displayKeys[i].latitude = text['Lat'];
          //   this.displayKeys[0].longitude = text['Lon'];
          // });
      }

  }

  showPoiInMap(data){
    console.log("poi data", data);
    console.log("poi data", data.lat);
    this.customNav.navigateForward('/map', {poiData: data, serviceType: 1});
  }

  backFunction(){
    
      this.customNav.navigateRoot('/locationservice');
    
  }

}

