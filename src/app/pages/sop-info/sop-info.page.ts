import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';

@Component({
  selector: 'app-sop-info',
  templateUrl: './sop-info.page.html',
  styleUrls: ['./sop-info.page.scss'],
})
export class SopInfoPage implements OnInit {

  subeventTypeId;
  infoGathering=[];
  behavioural=[];
  operational = [];
  showtype;
  type = "INFO GATHERING";

  constructor(private commonService: CommonServices, private customHttp: CustomHttpClient, private customNav: CustomNavService) {
    this.subeventTypeId = this.customNav.get("subeventTypeId");
    this.showtype = 'INFO GATHERING';
    this.typeChanged();
    
   }

  ngOnInit() {

    this.getSopInfoDetails();
  }

  typeChanged() {
    if (this.showtype === "INFO GATHERING") {
      this.type = "INFO GATHERING";
      
    } else if (this.showtype === "BEHAVIOURAL") {
     
      this.type = "BEHAVIOURAL";
    } else{
   
      this.type = "OPERATIONAL";
   
  }
}


  getSopInfoDetails(){

    if(this.subeventTypeId == null || this.subeventTypeId == undefined ){
      this.subeventTypeId =  2
    }

    this.commonService.showLoader("Loading...");  
    this.customHttp.get('/Responder/getSOPDetails/'+this.subeventTypeId+'/54').subscribe(data => {
  
      this.commonService.hideLoader();
       
   

    if(data != []){
      for(var i=0; i<data.length; i++){
        if(data[i].CATEGORY == 1){
          this.infoGathering.push(data[i]);

        }if(data[i].CATEGORY == 2){
          this.behavioural.push(data[i]);
        }
        if(data[i].CATEGORY == 3){
          this.operational.push(data[i]);
          console.log("operational", this.operational);
          console.log("sopText", this.operational[i].SOP_TEXT);
        }
      }
    }


      // console.log("supplimentOthers", data);
  
      // this.supplimentOthers = {
      //   injuries: data.NUMBER_OF_INJURIES,
      //   deaths: data.NUMBER_OF_DEATH
      // }
    
    }, err=> {
      this.commonService.hideLoader();
      this.commonService.presentAutoHideToast("Please Try Again!")
    });
  }

}
