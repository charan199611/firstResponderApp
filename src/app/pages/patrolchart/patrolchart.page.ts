import { Component, OnInit } from '@angular/core';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';

@Component({
  selector: 'app-patrolchart',
  templateUrl: './patrolchart.page.html',
  styleUrls: ['./patrolchart.page.scss'],
})
export class PatrolchartPage implements OnInit {

  patrolList=[];

  constructor(private customHttp: CustomHttpClient, private customNavService: CustomNavService) { }

  ngOnInit() {

    this.getPatrolDetails();
  }

  getPatrolDetails(){
    let simNo = localStorage.getItem('simNo');
   // http://45.113.138.19:8990/NGCADMobileAppService/Responder/patrol_chart
    let param = {
      "sim_no":simNo
    }

    this.customHttp.post('Responder/patrol_chart', param).subscribe(data => {
      // console.log("errorMessage", data.output.workforceUserId);
    //  this.commonService.hideLoader();
    console.log("patrolData", data);
let patrolAll = data.Value;
    for(var i=0; i<patrolAll.length; i++){
      if(patrolAll[i].type == 1){
        this.patrolList.push(patrolAll[i])
      }
    }
    


    }, error => {
     // this.commonService.hideLoader();
    });
  }

  loadPatrolMap(patrol){

   this.customNavService.navigateByUrl("/location-services-map", {patrolDetail: patrol, serviceType: 7})
  }

}
