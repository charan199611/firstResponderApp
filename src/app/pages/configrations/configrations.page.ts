import { Component, OnInit } from '@angular/core';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { machineIdSync } from 'node-machine-id';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-configrations',
  templateUrl: './configrations.page.html',
  styleUrls: ['./configrations.page.scss'],
})
export class ConfigrationsPage implements OnInit {
  tenantList = [];
  appServerBackendUrl='';
  workForceServerBackendUrl='';
  fileUploadUrl = '';
  uuid = '';
  selectedTenant = 'demo';
  sim = '';
  mqttUrl = '45.113.138.19';
  liveStreamUrl='';
  mqttport;
  mqttUsername;
  mqttPassword;
  interval;

selectLanguage;

  constructor(private appConfig: ApplicationConfigProvider, private theDB: SqliteDb, private router: Router,
    private translateService: TranslateService) {

    

    console.log('this.appConfig.appServerBackendUrl', this.appConfig.appServerBackendUrl);
    

    this.appServerBackendUrl = this.appConfig.appServerBackendUrl;
     this.workForceServerBackendUrl = this.appConfig.workForceServerBackendUrl;
    this.fileUploadUrl = this.appConfig.fileUploadUrl;
    this.mqttUrl = this.appConfig.mqttUrl;
    this.liveStreamUrl = this.appConfig.liveStreamUrl;
    this.mqttport = this.appConfig.mqttport;
    this.mqttUsername = this.appConfig.mqttUsername;
    this.mqttPassword = this.appConfig.mqttPassword;
     this.interval = this.appConfig.interval;

    this.setTranslate();
  }

  ngOnInit() {
    let id = machineIdSync(true);
    this.uuid = id;
  }


  setTranslate(){
    if (window.localStorage.getItem("language") === null || window.localStorage.getItem("language") === undefined) {
      this.selectLanguage = "en"
    } else {

      this.selectLanguage = window.localStorage.getItem("language");
    }
  }

 

  save() {

    const sql = `
    UPDATE urlConfigrations
    SET mdtUrl = $mdtUrl,
    workForceUrl = $workForceUrl,
    uploadUrl=$uploadUrl,
    mqttUrl=$mqttUrl,
    mqttport=$mqttport,
    tenant=$tenant,
    uuid=$uuid,
    liveStreamUrl=$liveStreamUrl`;
    

    const values = {
      $mdtUrl: this.appServerBackendUrl,
      $workForceUrl: this.workForceServerBackendUrl,
      $uploadUrl: this.fileUploadUrl,
      $mqttUrl:this.mqttUrl,
      $mqttport:this.mqttport,
      $tenant: this.selectedTenant,
      $uuid: this.uuid,
      $liveStreamUrl: this.liveStreamUrl
    };


    this.theDB.update(sql, values).subscribe(res => {
      console.log('Updated Value', res);
      this.appConfig.appServerBackendUrl = this.appServerBackendUrl;
      this.appConfig.workForceServerBackendUrl = this.workForceServerBackendUrl;
      this.appConfig.fileUploadUrl = this.fileUploadUrl;
      this.appConfig.mqttUrl = this.mqttUrl;
      this.appConfig.tenantCode = this.selectedTenant;
      this.appConfig.liveStreamUrl = this.liveStreamUrl;
      this.appConfig.mqttport = this.mqttport;
      this.appConfig.mqttUsername = this.mqttUsername;
      this.appConfig.mqttPassword = this.mqttPassword;
      this.appConfig.interval = this.interval;

      localStorage.setItem("mqttUsername", this.mqttUsername);
      localStorage.setItem("mqttPassword", this.mqttPassword);
      localStorage.setItem("interval", this.interval);

    })

    this.router.navigate(['/login'], { replaceUrl: true });
  }

  radioGroupLanguageChange(event){
 
    console.log("languageselect", event);
    if (event.detail.value !== null) {
      this.translateService.use(event.detail.value); 
      
     // this.store.setItem("language", event.detail.name);
    // this.storage.set("language", event.detail.name);
  
      window.localStorage.setItem("language", event.detail.value)

      if(event.detail.value == "arb"){
        document.dir = "rtl";
      }else if(event.detail.value == "en"){
        document.dir = "ltr";
      }
    }

    
   
  }

}
