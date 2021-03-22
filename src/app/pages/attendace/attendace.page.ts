import { Component, OnInit } from '@angular/core';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import * as moment from "moment"
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';

@Component({
  selector: 'app-attendace',
  templateUrl: './attendace.page.html',
  styleUrls: ['./attendace.page.scss'],
})
export class AttendacePage implements OnInit {


  public newAttendance = {
    officername: "",
    officerId: "",
    designation: "designation",
    phoneNo: "",
  };
  designationData;

  vehicleId;
  vehicleCallSign;
  language = "en";
  constructor(private httpClient: CustomHttpClient, private commonService: CommonServices, private customNavService: CustomNavService) { }

  ngOnInit() {
    this.getLanguage();
  
    this.getVehicle();
  
  }


  getLanguage(){
    if (window.localStorage.getItem("language") === null || window.localStorage.getItem("language") === undefined) {
      this.language = "en";
      this.getDesignation();
    } else if(window.localStorage.getItem("language") == "arb"){
      this.language="ar";
      this.getDesignation();
    }else if(window.localStorage.getItem("language") == "en"){
      this.language="en";
      this.getDesignation();
      // this.translateService.use(window.localStorage.getItem("language"));
    }
  }
  getVehicle(){

    this.vehicleId = localStorage.getItem('vehicleId');
    this.vehicleCallSign = localStorage.getItem('callSign');
   
  }


  getDesignation(){
    this.httpClient.get('Responder/get_designation/'+this.language).subscribe(data => {
  
      //this.commonService.hideLoader();
      this.designationData = data.Value;
      
    
    }, err=> {
      this.commonService.hideLoader();
     // this.commonService.presentAutoHideToast("Please Try Again!")
    });
  }

  updateAttendance(){

    if(this.newAttendance.officername != "" && this.newAttendance.officerId != "" && this.newAttendance.phoneNo !=""){

    if(this.newAttendance.designation != "Choose Designation"){

     
      let params = {
        "officer_id":this.newAttendance.officerId,
        "officer_name":this.newAttendance.officername,
        "designation":this.newAttendance.designation,
        "contact_no":this.newAttendance.phoneNo,
        "login_time":moment().format("DD-MM-YYYY HH:mm:ss"),
        "vehicle_id":this.vehicleId,
        "call_sign":this.vehicleCallSign
      }

      this.httpClient.post('Responder/insert_attendance', params).subscribe(result => {
    
        console.log("updatedEventFromMDT",result);
        
        // if(result.status == true){
          this.commonService.presentAutoHideToast("Attendance Inserted Successfully!");
          this.customNavService.popPage();
       // }
    
        }, error => {
        
          console.log("error", error);
        });
      

    }else{
      this.commonService.presentAutoHideToast("Please Select Designation!")
    }
  }else{
    this.commonService.presentAutoHideToast("Please Fill the field!")
  }

  }

}
