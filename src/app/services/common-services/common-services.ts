import { Injectable } from '@angular/core';
// import { ApplicationConfigProvider } from '../application-config/application-config';
//import { NativeStorage } from '@ionic-native/native-storage';
import { ToastController, AlertController, LoadingController, Platform, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
name: 'numberFormate'
})
// import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { NativeStorage } from '@ionic-native/native-storage/ngx';
// import { Network } from '@ionic-native/network/ngx';
// import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CommonServices implements PipeTransform {

  public customAutoHideToast: any;
  public customToast: any;
  public customAlert: any;
  public customLoader: any;
  public pinLoaderpercent = 0
  progressinterval;
  isLoaderStarted = false;
  isNetworkConnected: boolean = false;
  isCordovaPlatform: boolean = false;

  userInfo: any;
  localData: any;
  language: any;

  constructor(public loadingCtrl: LoadingController,public toastCtrl: ToastController, public alertCtrl: AlertController,
      public translateService: TranslateService) { }


      transform(value: any, args?: any): any {
        // alert(localStorage.getItem("languageId"));
        if(window.localStorage.getItem("language")=="arb"){
        this.localData = { language: "ar", country_code: "EG" };
        this.language = localStorage.getItem("language");
         }else{
        this.localData = { language: "en", country_code: "IN" };
        this.language = localStorage.getItem("language");
         }
        if (value == undefined)
        return;
        let arabic = "۰۱۲۳۴۵۶۷۸۹";
        let hindi = "०१२३४५६७८९";
        let kannada = "೦೧೨೩೪೫೬೭೮೯";
        let english = "0123456789";
        let numbers: any;
        console.log(this.language);
        // let val: string = value.toString();
        let val: string = Intl.NumberFormat(this.localData.language + '-' + this.localData.country_code).format(value);
        switch (this.language) {
        case 'kn': return val.replace(/\d/g, function (m) {
        return kannada.split("")[parseInt(m)];
         });
         
        case 'hi': return val.replace(/\d/g, function (m) {
        return hindi.split("")[parseInt(m)];
         }); 
        case 'ar': return val.replace(/\d/g, function (m) {
        return arabic.split("")[parseInt(m)];
         }); 
        default: return val.replace(/\d/g, function (m) {
        return english.split("")[parseInt(m)];
         }); 
         }
        // Intl.NumberFormat(localeObj.language+'-'+localeObj.country_code, { maximumSignificantDigits: 3 }).format(value);
         }
    

  
  // async  presentAutoHideToast(message) {
  //   this.customAutoHideToast = await this.toastCtrl.create({
  //     message: message,
  //     duration: this.applicationConfig.toastConfigurations.timeOut,
  //     position: "middle"
  //   });

      

  //   this.customAutoHideToast.present();
  // }

  // getToastPosition() {
  //   let position = this.applicationConfig.toastConfigurations.position
  //   if (position === 'middle') {
  //     return position
  //   }
  // }

  async presentshowCloseButtonToast(message) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 10000,
      // showCloseButton: true,
      // closeButtonText: "OK"
    });

    /* toast.onDidDismiss(() => {
      console.log("Toast buton clicked");
    }); */
    toast.present();
  }

  async customDurationToast(message) {
    let toast = await this.toastCtrl.create({
      message: message,
      position: "bottom",
      duration: 1000

    });

    /* toast.onDidDismiss(() => {
      console.log("Toast buton clicked");
    }); */
    toast.present();
  }

  async showAlert(title, subtitle) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: subtitle,
      cssClass: "custom-loader",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }]
    });

    await alert.present();
  }

  hideAlert() {
    this.customAlert.dismiss();
  }

async showLoginLoading(message){
      this.customLoader = await this.loadingCtrl.create({
      message: message,
      duration: 1000,
      //dismissOnPageChange: true
    });

    this.customLoader.present();
}


  isLoading;

  async showLoader(message) {

    let loaderText: any = {};

    this.translateService.get([message]).subscribe(text => {
      loaderText.title = text[message];
    });

    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: loaderText.title,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });

  }


  async showUploadFileLoader(message) {
    this.customLoader = await this.loadingCtrl.create({
      message: message,
      //dismissOnPageChange: true
    });

    this.customLoader.present();
  }


  async hideLoader() {

    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
    // this.modalcontroller.dismiss();
  }

  startPinloader() {
    if (!this.isLoaderStarted) {
      this.isLoaderStarted = true;
      //this.applicationConfig.isScreenDisabled = true;
      this.clearPinloader()
      this.progressinterval = setInterval(() => {
        if (this.pinLoaderpercent == 100) {
          this.clearPinloader()
          //this.applicationConfig.isScreenDisabled = false;
        }
        else {
          this.pinLoaderpercent = this.pinLoaderpercent + 1;
        }
      }, 75);
    }
  }

  // changeLang(key) {
  //   let observable = Observable.create(observer => {
  //     this.translate.get(key).subscribe(value => {
  //       let textValue = value;
  //       observer.next(textValue);
  //     }, error => {
  //       observer.error(error);
  //     })
  //   })
  //   return observable;
  // }

  clearPinloader() {
    clearInterval(this.progressinterval)
    this.pinLoaderpercent = 0;
  }

  completePinloader() {
    if (this.isLoaderStarted) {
      this.isLoaderStarted = false;
      clearInterval(this.progressinterval)
      if (this.pinLoaderpercent < 80) {
        let upgradeInterval = setInterval(() => {
          this.pinLoaderpercent = this.pinLoaderpercent + 1;
          if (this.pinLoaderpercent == 100) {
            //this.applicationConfig.isScreenDisabled = false;
            clearInterval(upgradeInterval)
            this.clearPinloader()
          }
        }, 7)
      } else {
        this.pinLoaderpercent = 100;
      }
    }
  }

 


  static getCurrentDBStandardTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
  }

  static timeSince(date) {
    return moment(date).fromNow()
  }

  async  presentAutoHideToast(message) {
    let toastText: any = {};

    this.translateService.get([message]).subscribe(text => {
      toastText.title = text[message];

    });

    this.customAutoHideToast = await this.toastCtrl.create({
      message: toastText.title,
      duration: 2000,
      position: "middle"
    });

    this.customAutoHideToast.present();
  }
 

 
}
