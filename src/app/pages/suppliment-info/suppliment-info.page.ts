import { Component, OnInit } from '@angular/core';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { CommonServices } from 'src/app/services/common-services/common-services';

@Component({
  selector: 'app-suppliment-info',
  templateUrl: './suppliment-info.page.html',
  styleUrls: ['./suppliment-info.page.scss'],
})
export class SupplimentInfoPage implements OnInit {

  showtype;
  type = "LOCATION";
  basicId;

  supplimentOthers:{
    injuries: "",
    deaths:"";
  }

  supplimentLocation:{
    remarks: "",
    hazardous:"";
  }

  supplimentPerson:{
    name : "",
    height : "",
    age : "",
    gender : "",
    color : "",
    demeanor : "",
    race : "",
    contact : "",
    dob : "",
    eye : "",
    hair : "",
    remarks : "",
    weight : "",
    clothing : "",
   personAddress : "",
   personRelationship : "",
   personInvolvedType : ""
  }

  supplimentVehicle:{
    vehicleType : "",
    vehicleNumber : "",
    vehicleColor : "",
    vehicleRegState : "",
    vehicleRegPlateType : "",
    vehicleMake : "",
    vehicleMakeDate : "",
    vehicleModel : "",
    vehicleRegExpDate : "",
    remarks : "",
    vehicleIdentification : "",
 
  }

  


  constructor(private customHttp: CustomHttpClient, private customNav: CustomNavService,
     private commonService: CommonServices) {

    this.basicId = this.customNav.get("basicId");
    this.showtype = 'LOCATION';
    this.typeChanged();

   }

  ngOnInit() {
  }

  typeChanged() {
    if (this.showtype === "OTHERS") {
      this.type = "OTHERS";
       this.getSupplimentInfoOthers();
    } else 
    if (this.showtype === "LOCATION") {
      this.getSupplimentInfoLocation();
      this.type = "LOCATION";
    } else if(this.showtype === "PERSON"){
      this.getSupplimentInfoPerson();
      this.type = "PERSON";
    }else{
      this.getSupplimentInfoVehicle();
      this.type = "VEHICLE";
    }
  }


  getSupplimentInfoOthers(){
    this.commonService.showLoader("Loading...");  
  this.customHttp.get('Responder/getSupplementalInfo/'+this.basicId+'/4').subscribe(supplimentData => {

    this.commonService.hideLoader();
     
    let data = supplimentData.SupplementalInformation[0];
    console.log("supplimentOthers", data);

    this.supplimentOthers = {
      injuries: data.NUMBER_OF_INJURIES,
      deaths: data.NUMBER_OF_DEATH
    }
  
  }, err=> {
    this.commonService.hideLoader();
    this.commonService.presentAutoHideToast("Please Try Again!")
  });
  }


  getSupplimentInfoLocation(){
 
  this.commonService.showLoader("Loading...");  
  this.customHttp.get('Responder/getSupplementalInfo/'+this.basicId+'/3').subscribe(supplimentData => {

    this.commonService.hideLoader();
     
    let data = supplimentData.SupplementalInformation[0];
    console.log("supplimentLocation", data);

    this.supplimentLocation = {
      remarks: data.remarks,
      hazardous:data.hazardous_materials_at_location
    }
  
  }, err=> {
    this.commonService.hideLoader();
    this.commonService.presentAutoHideToast("Please Try Again!")
  });

}


getSupplimentInfoPerson(){

  this.commonService.showLoader("Loading...");
  //  url = jspUrl + APIConstants.FETCH_SUPPLIMENT_DATA+"/"+basicId+"/3";

  this.customHttp.get('Responder/getSupplementalInfo/'+this.basicId+'/1').subscribe(supplimentData => {
     
    this.commonService.hideLoader();
   let data = supplimentData.SupplementalInformation[0];
    console.log("supplimentPerson", data);

    this.supplimentPerson = {
    name : data.person_name,
    height : data.person_height,
    age : data.person_age,
    gender : data.person_gender,
    color : data.person_color,
    demeanor : data.demeanor,
    race : data.race,
    contact : data.contact_number,
    dob : data.date_of_birth,
    eye : data.person_eye_color,
    hair : data.person_hair_color,
    remarks : data.person_remarks,
    weight : data.person_weight,
    clothing : data.person_clothing,
   personAddress : data.person_address,
   personRelationship : data.person_relationship,
   personInvolvedType : data.person_involved_type
  }

  console.log("supplimentPerson", this.supplimentPerson);

  }, err=> {
    this.commonService.hideLoader();
    this.commonService.presentAutoHideToast("Please Try Again!")
  });

}


getSupplimentInfoVehicle(){
  //  url = jspUrl + APIConstants.FETCH_SUPPLIMENT_DATA+"/"+basicId+"/3";
  this.commonService.showLoader("Loading...");
  this.customHttp.get('Responder/getSupplementalInfo/'+this.basicId+'/2').subscribe(supplimentData => {
 
    this.commonService.hideLoader();

    let data = supplimentData.SupplementalInformation[0];

    console.log("supplimentVehicle", data);
    
    this.supplimentVehicle = {
      vehicleType : data.vehicle_type,
      vehicleNumber : data.vehicle_number,
      vehicleColor : data.vehicle_color,
      vehicleRegState : data.vehicle_reg_state,
      vehicleRegPlateType : data.vehicle_reg_plate_type,
      vehicleMake : data.vehicle_make,
      vehicleMakeDate : data.vehicle_make_date,
      vehicleModel : data.vehicle_model,
      vehicleRegExpDate : data.vehicle_reg_exp_date,
      remarks : data.vehicle_remarks,
      vehicleIdentification : data.vehicle_identification_number,
    }
  }, err => {

    this.commonService.hideLoader();
    this.commonService.presentAutoHideToast("Please Try Again!")


  });

}



}
