import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { Router } from '@angular/router';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { FcmService } from 'src/app/services/fcm.service';
import { CommonServices } from 'src/app/services/common-services/common-services';

@Component({
  selector: 'app-loginodometer',
  templateUrl: './loginodometer.page.html',
  styleUrls: ['./loginodometer.page.scss'],
})
export class LoginodometerPage implements OnInit {
  //@ViewChild('odometer', { static: false }) odometerreading: ElementRef;
  odometer = {
    previousValue: 0,
    startValue: undefined,
  };

   errorMessage = "";

  vehicleDetails = {
    sim_no: '',
    userName: '',
    callSign: '',

  }
  vehicleId;
  constructor(private http: CustomHttpClient, private router: Router, private eventService: EventsDbService, private fcmService: FcmService, private commonService: CommonServices) { }

  ngOnInit() {
    this.getAll();
    this.updateFcmtoken();
  }
  updateFcmtoken() {
    let data = {
      token_id: this.fcmService.getToken(),
      vehicle_id: localStorage.getItem('vehicleId')
    }
    this.http.post( 'Responder/update_token_key', data).subscribe((data) => {

    })
  }

  fetchVehicleId() {

    let vehicleData = {
      vehicle_id: this.vehicleId
    }
    this.http.post( 'Responder/fetch_last_odometer', vehicleData).subscribe(data => {
      let outPut = data
      console.log('fetchVehicleId', outPut);
      this.odometer.previousValue = outPut.odometer_value
      //this.odometerreading.nativeElement.value = outPut.odometer_value
      this.odometer.previousValue = outPut.odometer_value
    }, error => {

    });
  }

  public getAll() {

    this.eventService.getVehicleDetails().then((res: any) => {
      for (let entry of res) {
        this.vehicleId = entry.vehicleId;
        this.vehicleDetails.callSign = entry.vehicleCallSign;
        this.vehicleDetails.userName = entry.loginUserName;
        console.log('vehicle----id', this.vehicleId);
        localStorage.setItem('vehicleId', this.vehicleId);
        localStorage.setItem('callSign', this.vehicleDetails.callSign);
        this.fetchVehicleId();
      }
    });

  }

odometerFormSubmit(){
console.log("odometer start value","Start value:"+this.odometer.startValue);
console.log("odometer previous value","previous value:"+this.odometer.previousValue);

if(this.odometer.startValue == undefined){
  this.errorMessage = "Please Enter Current Odometer Reading!"; 
} 
else if(this.odometer.previousValue > this.odometer.startValue){

    this.errorMessage = "Current Reading should be greater than or equal to Previous Reading!"; 

  }else{
    this.errorMessage = "";
    this.commonService.showLoader("Loading...");

    this.inserOddometer();
  }
}

  inserOddometer() {

  

   let params = {
      "start_time": new Date(),
      "odometer": this.odometer.startValue,
      "sim_no": this.vehicleDetails.sim_no,
      "vehicle_id": this.vehicleId,
      "call_sign": this.vehicleDetails.callSign,
      "user_name": this.vehicleDetails.userName
    };

    

    this.http.post( 'Responder/insert_odometer', params).subscribe(data => {
      this.commonService.hideLoader();
      console.log(JSON.stringify(data));
      let result = data
      this.router.navigateByUrl('home');
      if (result.Result) {
        // localStorage.setItem('odometerStartValue');
      } else {

      }
    }, error => {
      this.commonService.hideLoader();
      this.errorMessage = "Please Try Again!"; 
    });
  }

}
