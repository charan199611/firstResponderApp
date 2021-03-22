import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SqliteDb } from 'src/app/model/sqlitedb';


@Injectable()
export class ApplicationConfigProvider {
  appServerBackendUrl = '';
  workForceServerBackendUrl = '';
  fileUploadUrl = '';
  mqttUrl = '';
  simNo = '';
  tenantCode = 'demo';
  mqttport = 8083;
  mqttUsername = "SUPER";
  mqttPassword = "123456";
  liveStreamUrl = "http://192.168.1.44:8080/SBILiveStreamingService/honeywell/?cameraId=2";
  missionStatus: any;

  latitude = 29.996157;
  longitude = 31.744104;
  RMCTrackAngle = 0;
  Altitude = 0;
  
  numOfSatellites = 0;
  interval = 5000;


  language;
  trackingStatus = "Tracking";
  constructor(private theDB: SqliteDb, private http: HttpClient) {
    console.log('ApplicationConfigProvider', 'inizialized');
    this.theDB.getValue().subscribe((value) => {
      console.log('this.myapp.getValue()', value);
      if (value) {
        console.log('this.myapp.getValue()56789', value);
        this.getAll();
      }

    });
    if(localStorage.getItem("mqttUsername") != undefined){
      this.mqttUsername = localStorage.getItem("mqttUsername")
    }
    if(localStorage.getItem("mqttPassword") != undefined){
      this.mqttPassword = localStorage.getItem("mqttPassword")
    }

    if(localStorage.getItem("interval") != undefined){
      this.interval = Number(localStorage.getItem("interval"));
    }

    
  }


 


  public getAll(): Promise<Object> {
    const sql = `SELECT  *  FROM urlConfigrations`;
    const values = {};
    let data;
    this.theDB.selectAll(sql, values)
      .subscribe((rows) => {
        console.log('this.theDB.selectAll Observable', rows[0]);
        data = rows[0];
        console.log('this.theDB.selectAll Observable', data.mdtUrl);
        this.appServerBackendUrl = data.mdtUrl;
       // this.workForceServerBackendUrl = data.workForceUrl;
       this.workForceServerBackendUrl = 'http://182.71.101.94:9093/WorkforceAppService/';
        this.fileUploadUrl = data.uploadUrl;
        this.mqttUrl=data.mqttUrl;
        this.simNo = data.simNo;
        this.tenantCode= data.tenant;
        this.liveStreamUrl = data.liveStreamUrl;
        this.mqttport = data.mqttport;
        this.setMissionStatus();

      });

    return data;
  }

  setMissionStatus() {

    this.http.post('http://192.168.1.103:8085/MobileWebServer/' + 'responder/missionStatus/', {}).subscribe((data) => {
      console.log('setMissionStatus', data);
      this.missionStatus = data
    }, err => {
      console.log('httperror', err);

    })

  }


}


