import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { NOTIFICATION_SERVICE_STARTED, NOTIFICATION_SERVICE_ERROR, TOKEN_UPDATED, NOTIFICATION_RECEIVED, START_NOTIFICATION_SERVICE } from 'electron-push-receiver';
import { ModalController, AlertController } from '@ionic/angular';
import { NewEventAlertPage } from '../pages/cfs-event/model/new-event-alert/new-event-alert.page';
import { CustomHttpClient } from './http-client/http-client';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Observable, Subscriber } from 'rxjs';
import { Router } from '@angular/router';
import { MessageServicesService } from './message-services.service';
import { TranslateService } from '@ngx-translate/core';
import { machineIdSync } from 'node-machine-id';


@Injectable()
export class FcmService {
    //http://192.168.8.152:9683/Cad_Cloud_MDT_Webservice/
    //https://trinityng-cad.azurewebsites.net/Cad_Cloud_MDT_Webservice/
    public fcmtoken;
    static serverUrl = 'https://trinityng-cad.azurewebsites.net/Cad_Cloud_MDT_Webservice/';
    static uploadMediaUrl = 'https://cloudfileserver.trinityiot.in:8443/fileUpload/'
    static phpUpload = 'upload_media_test1.php'
     notificationInfo;
     count = 0;
     messagetype;
     hotAllUpdateData;
     newEventData;
     patrolData;
     uuid;
     vehicleDetails = {
        sim_no: '',
        userName: '',
        callSign: '',
    
      }

    constructor(private modalCtrl: ModalController, private httpClient: CustomHttpClient, private eventsDb: EventsDbService,
         private customNavService: CustomNavService, private router: Router,private messageService: MessageServicesService,
         private alertCtrl: AlertController, private translateService: TranslateService, private eventService: EventsDbService) {
        this.fcmInitialization();
        this.uuid = machineIdSync(true);
        //this.getAll();
      
    }

    public setToken(token) {
        this.fcmtoken = token;
    }

    public getToken() {
        return this.fcmtoken;
    }

    fcmInitialization() {
        ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
            console.log('service successfully started', token)
            this.setToken(token);
        })

        // Handle notification errors
        ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
            console.log('notification error', error)
        })

        // Send FCM token to backend
        ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
            console.log('token updated', token)
            this.setToken(token);
        })

        // Display notification
        ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
            // check to see if payload contains a body string, if it doesn't consider it a silent push
            if (serverNotificationPayload.notification) {
                // payload has a body, so show it to the user
                console.log('display notification', serverNotificationPayload)
                let myNotification = new Notification(serverNotificationPayload.notification.title, {
                    body: serverNotificationPayload.notification.body
                })

                myNotification.onclick = () => {
                    console.log('Notification clicked')
                }
            } else {
                // payload has no body, so consider it silent (and just consider the data portion)
                console.log('do something with the key/value pairs in the data', serverNotificationPayload.data)
            }
            console.log('vehicleidinfcm', localStorage.getItem('vehicleId'));

            this.messagetype = serverNotificationPayload.data.messageType;

            console.log("messageType", serverNotificationPayload.data.messageType);

            if(serverNotificationPayload.data.messageType == "CFS" || serverNotificationPayload.data.messageType == "SOS" || serverNotificationPayload.data.messageType == "EventUpdated" || serverNotificationPayload.data.messageType == "IOT"){
            let data = {
                basicId: serverNotificationPayload.data.basicId,
                vehicle_id: localStorage.getItem('vehicleId')
            }

            this.httpClient.post(  'Responder/fetch_event_details', data).subscribe((data) => {
                console.log('eventdata====>', data.event_details);
                this.hotAllUpdateData = ""
                this.notificationInfo = "";
                this.newEventData = "";
                this.patrolData="";
                this.showNewEventAlert(data.event_details);
            })
        }else if(serverNotificationPayload.data.messageType == "HOTUPDATE" ){
            this.hotAllUpdateData = ""
            this.notificationInfo = "";
            this.newEventData = "";
            this.patrolData="";
            //console.log("subtype", this.b64DecodeUnicode(serverNotificationPayload.data.subtype));
            this.showHotUpdateAlert(serverNotificationPayload.data);
        }
        else if(serverNotificationPayload.data.messageType == "ABONNDONED" ){
            this.hotAllUpdateData = ""
            this.notificationInfo = "";
            this.newEventData = "";
            this.patrolData="";
            this.unAssignData(serverNotificationPayload.data);
        }
        else if(serverNotificationPayload.data.messageType == "PRIEMPT" ){
            this.hotAllUpdateData = ""
            this.notificationInfo = "";
            this.newEventData = "";
            this.patrolData="";
            this.showPriemtAlert(serverNotificationPayload.data);
        }
        else if(serverNotificationPayload.data.messageType == "UNASSIGN" ){
            this.hotAllUpdateData = ""
            this.notificationInfo = "";
            this.newEventData = "";
            this.patrolData="";
            this.unAssignData(serverNotificationPayload.data);
        }
        else if(serverNotificationPayload.data.messageType == "PATROL" ){
            this.hotAllUpdateData = ""
            this.notificationInfo = "";
            this.newEventData = "";
            this.patrolData="";
            this.showPatrolData(serverNotificationPayload.data);
        }
        else if(serverNotificationPayload.data.messageType == "TASK" ){
            this.hotAllUpdateData = ""
            this.notificationInfo = "";
            this.newEventData = "";
            this.patrolData="";
            this.showPatrolData(serverNotificationPayload.data);
        }
     

        })
        ipcRenderer.send(START_NOTIFICATION_SERVICE, '271780513393');

    }

    public getAll() {

        this.eventService.getVehicleDetails().then((res: any) => {
          for (let entry of res) {
            // this.vehicleId = entry.vehicleId;
            this.vehicleDetails.callSign = entry.vehicleCallSign;
            this.vehicleDetails.userName = entry.loginUserName;
            // console.log('vehicle----id', this.vehicleId);
    
            
          }
        });

    
      }


    async showPatrolData(patrolData){

        this.patrolData =   patrolData;
        let modal = await this.modalCtrl.create(
          {
              component: NewEventAlertPage, componentProps: { notificationData: this.patrolData, messageType: this.messagetype },
              showBackdrop: true, backdropDismiss: false, cssClass: 'app-event-alert-new'
          });
      await modal.present();
    }

    async showNewEventAlert(notificationData) {
        
        this.newEventData = notificationData;

     this.count = 0;

        console.log("notificationData", JSON.parse(this.newEventData));

         this.notificationInfo = JSON.parse(this.newEventData);
          let modal = await this.modalCtrl.create(
            {
                component: NewEventAlertPage, componentProps: { notificationData: JSON.parse(this.newEventData), messageType: this.messagetype },
                showBackdrop: true, backdropDismiss: false, cssClass: 'app-event-alert-new'
            });
        await modal.present();

        this.updateMdtStatus();
       
    }


    updateMdtStatus(){
        this.eventService.getEventsAll().subscribe(message => {
            let rowData = message;
            console.log("rowData", rowData);
      
            if(rowData.length == 0){
               this.updateAvailableMDTStatus(3);
            }else{
              this.updateAvailableMDTStatus(4);
            }
          
          
          });
    }

    updateAvailableMDTStatus(statusId){

        this.vehicleDetails.callSign = localStorage.getItem("callSign");
        let params = {

          
    
          "imeiNo": this.uuid ,
          "callSign": this.vehicleDetails.callSign,
          "vehicleStatus": statusId
      }
    
      console.log("params", params);
      this.httpClient.post('Responder/updateMdtStatus/', params).subscribe(result => {
        
        console.log("updateMdtStatus",result);
    
        }, error => {
        
        });
      }



    async showHotUpdateAlert(hotUpdatedata){
         this.hotAllUpdateData = hotUpdatedata

        this.count = 0;
        if(this.router.url == '/cfs-event/cfs-event-details'){

            this.eventsDb.getEventDetails(this.hotAllUpdateData.eventid).subscribe((data) => {
          
            if(this.count == 0){

                if (data.length > 0) {  
                  this.eventsDb.updateUnitSummaryDetails(this.hotAllUpdateData);                       
                  this.eventsDb.updateEventDetails(this.hotAllUpdateData);  
                          
                  this.count++;
                  console.log("count", this.count);
                
                } else {
                    this.count++; 
                  this.eventsDb.insertEventDetails(this.hotAllUpdateData);
                  this.eventsDb.insertUnitSummaryDetails(this.hotAllUpdateData);  
                
                }
            }
              })
    
        }else{

            let modal = await this.modalCtrl.create(
                {
                    component: NewEventAlertPage, componentProps: { notificationData: this.hotAllUpdateData, messageType: this.messagetype },
                    showBackdrop: true, backdropDismiss: false, cssClass: 'app-event-alert-new'
                });
            await modal.present();
        }


      
     } 

     unAssignData(data){

        console.log("abandon", data);
        console.log("abandon", data.basicId);

              
      this.eventsDb.deleteEvent(data.basicId).then((value) => {
        console.log('abandonpage', value);
   
        this.customNavService.navigateRoot('/home');

        this.showAbandonAlert(data);
        
        
      }).catch(error => {
      
      });


      this.eventsDb.deleteSOSEvent(data.basicId).then((value) => {
        console.log('abandonpage', value);
   
        this.customNavService.navigateRoot('/home');

        this.showAbandonAlert(data);

        
      }).catch(error => {
      
      });

    }


    async showAbandonAlert(data){

        let updateData: any = {};

        this.translateService.get([data.messageType, 'OK']).subscribe(text => {
            updateData.header = text[data.messageType];
            updateData.okText = text['OK'];

        });
   
            const alert = await this.alertCtrl.create({
              header: updateData.header,
              buttons: [updateData.okText],
            });
        
            await alert.present();
            const result = await alert.onDidDismiss();
            this.customNavService.navigateRoot('/home');

            this.updateMdtStatus();
        
        
    }

   async showPriemtAlert(data){
    
    this.customNavService.navigateRoot('/home');
    
        const alert = await this.alertCtrl.create({
          header: "PREEMPT Alert",
          message: data.eventId,
          buttons: ['Ok'],
        });
    
        await alert.present();
        const result = await alert.onDidDismiss();
        
    
    }

    async showSOSNotification(sosData){

        let modal = await this.modalCtrl.create(
            {
                component: NewEventAlertPage, componentProps: { notificationData: this.hotAllUpdateData, messageType: this.messagetype },
                showBackdrop: true, backdropDismiss: false, cssClass: 'app-event-alert-new'
            });
        await modal.present();
    }

}