import { Component } from '@angular/core';
import * as fs from 'fs';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Settings } from './model/settings';
import { SqliteDb } from './model/sqlitedb';
// import 'core-js/shim';
import { Menu, MenuItemConstructorOptions, OpenDialogOptions, remote, ipcRenderer, SaveDialogOptions } from 'electron';
import {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED,
} from 'electron-push-receiver'
import { FcmService } from './services/fcm.service';
import { ApplicationConfigProvider } from './services/application-cofig/application-config';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { ElectronService } from './services/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { MqttHelperService } from './services/mqtt-helper.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public port: any;
  public rL: any;
  public portOpts = { baudRate: 9600, autoOpen: false };
  option = {
    truncate: false, // truncate the file before reading / writing
    readable: true, // should the file be opened as readable?
    writable: true,  // should the file be opened as writable?

  }
  // Store = require('electron-store');
  storage;
 public textDir;  
 direction : string = "ltr";
  

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcmService: FcmService,
    public electronService: ElectronService,
    private translateService: TranslateService,
    private applicationConfig: ApplicationConfigProvider
   
   
  ) {
    
    //  this.textDir = 'ltr';
    console.log('Appcomponent xecites');

    /* Settings.initialize();
    this.checkIfDBCreated(); */
    this.initializeApp();
 
   // this.translateService.setDefaultLang('arb');
    

  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
      
    });
  }


  private initTranslate() 
  {
     // Set the default language for translation strings, and the current language.
     this.translateService.setDefaultLang('en');
     console.log("laanguage",window.localStorage.getItem("language"));
 

     if (window.localStorage.getItem("language") === null || window.localStorage.getItem("language") === undefined) {
      this.translateService.use('en'); 
      document.dir = "ltr";
    } else if(window.localStorage.getItem("language") == "arb"){
      this.translateService.use(window.localStorage.getItem("language"));
      document.dir = "rtl";
    } else if(window.localStorage.getItem("language") == "en") {
      this.translateService.use(window.localStorage.getItem("language"));
      document.dir = "ltr";
      
    }


  }

  checkIfDBCreated() {
    console.log('Settings.dbPath', Settings.dbPath);
    if (fs.existsSync(Settings.dbPath)) {
      this.openDb(Settings.dbPath);
      console.log('if');
    } else if (Settings.hasFixedDbLocation) {
      this.createDb(Settings.dbPath);
      console.log('else if');
    } else {
      this.createDb();
      console.log('else');
    }
  }

  public async createDb(filename?: string) {
    if (!filename) {
      const options: SaveDialogOptions = {
        title: 'Create file',
        defaultPath: remote.app.getPath('documents'),
        filters: [
          {
            name: 'Database',
            extensions: ['db'],
          },
        ],
      };
      filename = await remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), options);
    }

    if (!filename) {
      return;
    }

    SqliteDb.createDb(filename)
      .then((dbPath) => {
        console.log('Settings.hasFixedDbLocation', Settings.hasFixedDbLocation);
        if (!Settings.hasFixedDbLocation) {
          Settings.dbPath = dbPath;
          console.log('Settings.write');
          Settings.write();


        }
      })
      .then(() => {
        // this.getHeroes();


      })
      .catch((reason) => {
        console.log(reason);
      });

  }

  public openDb(filename: string) {
    SqliteDb.openDb(filename)
      .then(() => {
        if (!Settings.hasFixedDbLocation) {
          Settings.dbPath = filename;
          Settings.write();
        }
      })
      .then(() => {

      })
      .catch((reason) => {
        // Handle errors
        console.log('Error occurred while opening database: ', reason);
      });
  }

}
