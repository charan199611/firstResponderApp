import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { machineIdSync } from 'node-machine-id';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';

@Component({
  selector: 'app-status-configuration',
  templateUrl: './status-configuration.page.html',
  styleUrls: ['./status-configuration.page.scss'],
})
export class StatusConfigurationPage implements OnInit {


  statusList;

mdtDetails: any = {
  vehicleId: String,
  userName: String,
  callSign: String
}

uuid;

statusId;
currentstatus;

  constructor(private modalCtrl: ModalController, private commonService: CommonServices, private customHttp: CustomHttpClient, private eventService: EventsDbService) { }

  ngOnInit() {

  this.getStatusName();
  this.getVehicleDetails();
  let id = machineIdSync(true);
  this.uuid = id;
  }

 getVehicleDetails(){
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

  getStatusName(){

    this.customHttp.get('/Responder/getVehicleStatus/').subscribe(data => {
  
      console.log("status", data);
      console.log("statusList", data.Value);
      this.statusList = data.Value;
      
    
    }, err=> {
    
      this.commonService.presentAutoHideToast("Please Try Again!")
    });
  
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  updateStatus(){
    this.commonService.showLoader("Loading...");  
    let params = {
       
        "imeiNo":this.uuid,   
        "callSign":this.mdtDetails.callSign,
        "vehicleStatus":this.currentstatus
        
    };
    this.customHttp.post('Responder/updateMdtStatus/', params).subscribe(data => {
  
      this.commonService.hideLoader();
      this.commonService.presentAutoHideToast("Status Updated Successfully!");
      this.modalCtrl.dismiss();
    
    }, err=> {
      this.modalCtrl.dismiss();
      this.commonService.hideLoader();
      this.commonService.presentAutoHideToast("Please Try Again!")
    });
  
  }

}
