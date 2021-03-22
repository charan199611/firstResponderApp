import { Component, OnInit } from '@angular/core';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  patrolList=[];

  constructor(private customHttp: CustomHttpClient, private customNavService: CustomNavService) { }

  ngOnInit() {

    this.getTaskDetails();
  }

  getTaskDetails(){
    let simNo = localStorage.getItem('simNo');
   // http://45.113.138.19:8990/NGCADMobileAppService/Responder/patrol_chart
    let param = {
     "sim_no":simNo
    //  "sim_no":"8328926945"
    }

    // this.customHttp.postData('http://45.113.138.19:8990/NGCADMobileAppService/Responder/patrol_chart', param).subscribe(data => {
      this.customHttp.post('Responder/patrol_chart', param).subscribe(data => {
      // console.log("errorMessage", data.output.workforceUserId);
    //  this.commonService.hideLoader();
    console.log("patrolData", data);
let patrolAll = data.Value;
    for(var i=0; i<patrolAll.length; i++){
      if(patrolAll[i].type == 2){
        this.patrolList.push(patrolAll[i])
      }
    }
    


    }, error => {
     // this.commonService.hideLoader();
    });
  }

  loadPatrolMap(task){

   this.customNavService.navigateByUrl("/location-services-map", {taskDetails: task, serviceType: 8})
  }

}
