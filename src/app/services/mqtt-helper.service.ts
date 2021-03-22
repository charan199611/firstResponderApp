import { Injectable } from '@angular/core';
import * as MqttClient from 'mqtt';
import { Paho } from 'ng2-mqtt/mqttws31';
import { connect } from 'mqtt';
import { machineId, machineIdSync } from 'node-machine-id';
import { MessageServicesService } from './message-services.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';
import { ElectronService } from './electron.service';
import { EventsDbService } from './sqlite-db/events-db.service';
import { ApplicationConfigProvider } from './application-cofig/application-config';
import * as moment from "moment"
const mqtt = require('mqtt') 
// window.mqtt = mqtt


@Injectable({
  providedIn: 'root'
})
export class MqttHelperService {
  mqttClient: typeof MqttClient;
  //  private client;
   // mqttbroker = '45.113.138.19';
  mqttbroker;
  mqttPort;
  

   deviceId;
   pagesubscription: Subscription;
   
  vehicleDetails = {
    sim_no: '',
    userName: '',
    callSign: '',

  }
  vehicleId;
  packetId=0;
  username;
  password;


   client = null

 options = {
  keepalive: 30,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
  // rejectUnauthorized: false,
  clientId:"",
  username:"",
  password:"",
 

}

  static instance: MqttHelperService;
  
 // private client  = connect('tcp://test.trinityiot.in:1883');
  constructor(private messageService: MessageServicesService, private electronServices: ElectronService,
    private eventService: EventsDbService, private appConfig: ApplicationConfigProvider) {

    this.deviceId = machineIdSync(true);
  
    MqttHelperService.instance = this
  

  }


connectClient1(){
 
   // const { host, port, clientId, username, password } = connection
   // const connectUrl = 'mqtt://123.201.255.70:1883'
   const connectUrl = 'mqtt://'+this.appConfig.mqttUrl;
    this.options.clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

      this.options.username = 'SUPER'
    this.options.password = '123456'
    // this.options.username = this.appConfig.mqttUsername
    // this.options.password = this.appConfig.mqttPassword
    console.log('connecting mqtt client')
    this.client = mqtt.connect(connectUrl, this.options)
    this.client.on('error', (err) => {
      console.error('Connection error: ', err)
      this.client.end()
    })
    this.client.on('reconnect', () => {
      console.log('Reconnecting...')
    })
    this.client.on('connect', () => {
     // console.log('Client connected:' + this.options.clientId);
       this.onSend();

   
      // connectBtn.innerText = 'Connected'
    })
    this.client.on('message', (topic, message, packet) => {
      console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
    })
  
   
  
}



onSend () {
  if (this.client.connected) {

    this.getAll();
    setInterval(()=>{
        
      // this.appConfig.latitude = data.Latitude;
      // this.appConfig.longitude = data.Longitude;
    
      if (this.packetId >= 999) {
        this.packetId = 0;
    } else {
  
        this.packetId = this.packetId + 1;
    }

    console.log("packetId", this.packetId);
      let packetData =
      
      { 
        "type":"MDT",  
         data:{
        "trackStatus":0,
        "trackAngle":this.appConfig.RMCTrackAngle,
        "strengthAmplitude":"",
        "altitude":this.appConfig.Altitude,
        "powerStatus":"",
        "date_time":moment().format("YYYY-MM-DD HH:mm:ss"),
        "gpsAvailable":'1',
        "accuracy":'',
        "speed":"",
        "batteryLevel":"",
        "macId": this.deviceId,
        "lat": this.appConfig.latitude,
        "longi":this.appConfig.longitude,
        "workforceName": "",
        "satelliteCount":this.appConfig.numOfSatellites,
        "gpsProvider":"",
        "batteryStatus":"",
        "vehicleId":this.vehicleId,
        "callSign": this.vehicleDetails.callSign,
        "packetId":this.packetId,
        "simNo":this.appConfig.simNo,
        "validType":"A"
        }
      }
 

     //   this.sendMessage(JSON.stringify(packetData));
     
        // console.log('startLocation', data);
        console.log('startLocation==', this.appConfig.latitude);

        this.client.subscribe('device/'+this.deviceId+'/messages', {
                    qos: 0
                  },(error, res) => {
                    if (error) {
                      console.error('Subscribe error: ', error)
                    } else {
                      console.log('Subscribed: ', res)
                         
                  this.client.publish('device/'+this.deviceId+'/messages', JSON.stringify(packetData), {
                    qos: 0,
                    retain: false
                  },(error, res) => {
                    if (error) {
                      console.error('PUBLISH error: ', error)
                    } else {
                      console.log('PUBLISHED: ', res)
                    }
                  });
                    }
                  });
     
      },10000); 


    
    console.log('mqtt onConnect');
 
}
}







// -------old--------

  connectClient(){
    if (this.isElectron()) {
  console.log("this.client", this.client);
  // console.log("this.client connected", "client:"+this.client.isConnected());
      //  if((this.client === "undefined") || ((this.client === undefined) || (!this.client.isConnected()))){
      this.mqttbroker = this.appConfig.mqttUrl;
      this.mqttPort = this.appConfig.mqttport;
      this.username = this.appConfig.mqttUsername;
      this.password = this.appConfig.mqttPassword;
      console.log("mqttbroker", this.mqttbroker);
      this.client = new Paho.MQTT.Client(this.mqttbroker, Number(this.mqttPort), 'mqttjs_' + Math.random().toString(16).substr(2, 8));
     //  this.client.option.username='SUPER';
     //  this.client.option.password='123456'
     
       this.client.onConnectionLost = this.onConnectionLost.bind(this);
       this.client.onMessageArrived = this.onMessageArrived.bind(this);

       this.client.connect({userName: this.username, password: this.password, onSuccess: this.onConnect.bind(this)});
       //this.client.connect({userName: 'SUPER', password: '123456', onSuccess: this.onConnect.bind(this), onFailure: this.onConnectionError.bind(this)});
      // this.client.connect({userName: 'SUPER', password: '123456', onSuccess: this.onConnect.bind(this)});
   
     
     
   //  }
    }
  }

 

  onConnectionError(){
    console.log('Connection Error');


  }



  public getAll() {

    this.eventService.getVehicleDetails().then((res: any) => {
      for (let entry of res) {
        this.vehicleId = entry.vehicleId;
        this.vehicleDetails.callSign = entry.vehicleCallSign;
        this.vehicleDetails.userName = entry.loginUserName;
        console.log('vehicle----id', this.vehicleId);

        
      }
    });



  }

  sendMessage(message: String) {
    let packet = new Paho.MQTT.Message(message);
    packet.destinationName = 'device/'+this.deviceId+'/messages';
    this.client.send(packet);
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  onMessageArrived(message) {
    console.log('mqtt message',message);
    
  }

  onConnectionLost(responseObject) {
    
      console.log('mqtt onConnectionLost:' , responseObject);
   
    
  }

  onConnect(){

    console.log("interval", this.appConfig.interval);
   

      this.getAll();
    let timerid=  setInterval(()=>{
          
        // this.appConfig.latitude = data.Latitude;
        // this.appConfig.longitude = data.Longitude;
      
        if (this.packetId >= 999) {
          this.packetId = 0;
      } else {
    
          this.packetId = this.packetId + 1;
      }
  
      console.log("packetId", this.packetId);
        let packetData =
        
        { 
          "type":"MDT",  
           data:{
          "trackStatus":0,
          "trackAngle":this.appConfig.RMCTrackAngle,
          "strengthAmplitude":"",
          "altitude":this.appConfig.Altitude,
          "powerStatus":"",
          "date_time":moment().format("YYYY-MM-DD HH:mm:ss"),
          "gpsAvailable":'1',
          "accuracy":'',
          "speed":"",
          "batteryLevel":"",
          "macId": this.deviceId,
          "lat": this.appConfig.latitude,
          "longi":this.appConfig.longitude,
          "workforceName": "",
          "satelliteCount":this.appConfig.numOfSatellites,
          "gpsProvider":"",
          "batteryStatus":"",
          "vehicleId":this.vehicleId,
          "callSign": this.vehicleDetails.callSign,
          "packetId":this.packetId,
          "simNo":this.appConfig.simNo,
          "validType":"A"
          }
        }

        console.log('startLocation', packetData);
        this.sendMessage(JSON.stringify(packetData));

        if (this.client && this.client.isConnected()) {
          console.log("connected")
          this.sendMessage(JSON.stringify(packetData));
        }else{
          console.log("disconnected")
          this.client.disconnect();
          clearInterval(timerid);
          this.connectClient();


        }

        
      },this.appConfig.interval); 
  }

  onConnect1() {

    this.getAll();
    console.log('mqtt onConnect');
    this.electronServices.openLineByLine().subscribe((data) => {

      this.appConfig.trackingStatus = "Tracking";
      setInterval(()=>{
        
        this.appConfig.latitude = data.Latitude;
        this.appConfig.longitude = data.Longitude;
      
        if (this.packetId >= 999) {
          this.packetId = 0;
      } else {
    
          this.packetId = this.packetId + 1;
      }

      console.log("packetId", this.packetId);
        let packetData =
        
        { 
          "type":"MDC",  
           data:{
          "trackStatus":0,
          "trackAngle":data.RMCTrackAngle,
          "strengthAmplitude":"",
          "altitude":data.Altitude,
          "powerStatus":"",
          "date_time":moment().format("DD-MM-YYYY HH:mm:ss"),
          "gpsAvailable":'1',
          "accuracy":'',
          "speed":"",
          "batteryLevel":"",
          "macId": this.deviceId,
          "lat": data.Latitude,
          "longi":data.Longitude,
          "workforceName": "",
          "satelliteCount":data.NumOfSatellites,
          "gpsProvider":"",
          "batteryStatus":"",
          "vehicleId":this.vehicleId,
          "callSign": this.vehicleDetails.callSign,
          "packetId":this.packetId,
          "simNo":this.appConfig.simNo,
          "validType":"A"
          }
        }
   
  
          this.sendMessage(JSON.stringify(packetData));
       
          console.log('startLocation', data);
          console.log('startLocation==', data.Latitude);
       
        },10000); 
                  
      }, err => {
        
        console.log('startLocationerr', err);
        setInterval(()=>{

          // this.appConfig.latitude = data.Latitude;
          // this.appConfig.longitude = data.Longitude;
        
        
       

        // this.appConfig.latitude = data.Latitude;
        // this.appConfig.longitude = data.Longitude;
      
        if (this.packetId >= 999) {
          this.packetId = 0;
      } else {
    
          this.packetId = this.packetId + 1;
      }

      console.log("packetId", this.packetId);
        let packetData =
        
        { 
          "type":"MDC",  
           data:{
          "trackStatus":0,
          "trackAngle":0,
          "strengthAmplitude":"",
          "altitude":0,
          "powerStatus":"",
          "date_time":moment().format("DD-MM-YYYY HH:mm:ss"),
          "gpsAvailable":'1',
          "accuracy":'',
          "speed":"",
          "batteryLevel":"",
          "macId": this.deviceId,
          "lat": this.appConfig.latitude,
          "longi":this.appConfig.longitude,
          "workforceName": "",
          "satelliteCount":2,
          "gpsProvider":"",
          "batteryStatus":"",
          "vehicleId":this.vehicleId,
          "callSign": this.vehicleDetails.callSign,
          "packetId":this.packetId,
          "simNo":this.appConfig.simNo,
          "validType":"A"
          }
        }
   
  
          this.sendMessage(JSON.stringify(packetData));
       
          console.log('startLocation', packetData);
          // console.log('startLocation==', data.Latitude);
       
        },10000); 
  
      })
      // this.pagesubscription = this.messageService.getMessage().subscribe(message => {

      //   console.log("Mqtt message", message)

      //   this.sendMessage(message);
      // });
    
  }

  disconnectmqtt(){
    if (this.client && this.client.isConnected) {
      this.client.disconnect()
      //this.client.connect()
    }
  }


}
