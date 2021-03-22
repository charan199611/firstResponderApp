import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Chart } from 'chart.js';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  showtype;
  type = "TODAY";
  @ViewChild('callsCanvas', {static: true}) callsCanvas: ElementRef;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  chart: any;
  closedEvents=0;
  pendingEvents=0;
  totalEvents=0;

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  simNo;
  vehicleId;
  constructor(private commonService: CommonServices, private customHttp: CustomHttpClient, private translateService: TranslateService) {

   }

  ngOnInit() {
    
   // this.showChart();
    this.simNo = localStorage.getItem("simNo");
    this.vehicleId = localStorage.getItem('vehicleId');

    this.getTodayReport();
  }


  typeChanged() {
    if (this.showtype === "TODAY") {
      this.type = "TODAY";
      this.getTodayReport();
      
    } else if (this.showtype === "WEEK") {
     
      this.type = "WEEK";
      this.getWeeklyReport();
    } else{
   
      this.type = "MONTH";
      this.getMonthlyReport();
   
  }
}

getTodayReport(){
  this.closedEvents=0;
  this.pendingEvents=0;
  this.totalEvents=0;
  this.commonService.showLoader("Loading...");
  let params = {
    "sim_no":this.simNo,
    "days":1,
    "vehicle_id":this.vehicleId
  
  }  
  this.customHttp.post('/Responder/get_cfsreport', params).subscribe(data => {

    this.commonService.hideLoader();
     
    let reportData = data.cfsStatus;

    if(reportData != []){
   this.totalEvents = reportData.length;
  
      for(var i=0; i<reportData.length; i++){
        let reportMission = reportData[i].mission;
  
        if (reportMission.equals("9") || (reportMission.equals("10"))) {
            this.closedEvents++;
  
        } else {
            this.pendingEvents++;
        }
      }
  
      this.showChart();
    }


  }, err=> {
    this.commonService.hideLoader();
    this.commonService.presentAutoHideToast("Please Try Again!")
  });
}

getMonthlyReport(){
  this.closedEvents=0;
  this.pendingEvents=0;
  this.totalEvents=0;
  this.commonService.showLoader("Loading...");
  let params = {
    "sim_no":this.simNo,
    "days":3,
    "vehicle_id":this.vehicleId
  
  }  
  this.customHttp.post('/Responder/get_cfsreport', params).subscribe(data => {

    this.commonService.hideLoader();
     
    let reportData = data.cfsStatus;

  

    
    if(reportData != []){
   this.totalEvents = reportData.length;
  
      for(var i=0; i<reportData.length; i++){
        let reportMission = reportData[i].mission;
  
        if (reportMission.equals("9") || (reportMission.equals("10"))) {
            this.closedEvents++;
  
        } else {
            this.pendingEvents++;
        }
      }
  
      this.showChart();
    }


  }, err=> {
    this.commonService.hideLoader();
    this.commonService.presentAutoHideToast("Please Try Again!")
  });
}

getWeeklyReport(){
  this.closedEvents=0;
  this.pendingEvents=0;
  this.totalEvents=0;
  this.commonService.showLoader("Loading...");
  let params = {
    "sim_no":this.simNo,
    "days":2,
    "vehicle_id":this.vehicleId
  
  }  
  this.customHttp.post('Responder/get_cfsreport', params).subscribe(data => {

    this.commonService.hideLoader();
     
    

     let reportData = data.cfsStatus;

    
    if(reportData != []){
   this.totalEvents = reportData.length;
  
      for(var i=0; i<reportData.length; i++){
        let reportMission = reportData[i].mission;
  
        if ((reportMission == 9) || (reportMission == 10)) {
            this.closedEvents++;
  
        } else {
            this.pendingEvents++;
        }
      }
  
      this.showChart();
    }


  }, err=> {
    this.commonService.hideLoader();
    this.commonService.presentAutoHideToast("Please Try Again!")
  });
}

showChart(){

  let labelChart: any = {};


  this.translateService.get(['Total Event', 'Pending', 'MDT Closed']).subscribe(text => {
    labelChart.totalEventText = text['Total Event'];
    labelChart.pendingText = text['Pending'];
    labelChart.mdtClosedText = text['MDT Closed'];
  
  });

  let dataArray = [this.totalEvents,this.pendingEvents,this.closedEvents];
  let labelsArray = [labelChart.totalEventText,labelChart.pendingText, labelChart.mdtClosedText];
  let bColorArray = [];
  let hColorArray = ["hotpink",
  "blue",
  "green"]
  // this.toolTips = [];

  this.chart = new Chart(this.callsCanvas.nativeElement, {


    type: 'bar',
    data: {
      labels: labelsArray,
      datasets: [{
        data: dataArray,
        backgroundColor: hColorArray
      }]
    },
    options: {
      legend: {
        // position:'bottom'
        display: false
      }
    }

  });
 

  this.chart.update()

 }
}
