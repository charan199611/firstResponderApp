import { Component, ViewChild, ElementRef, OnInit, NgZone, ɵConsole } from '@angular/core';
// import { Customizer } from './../../providers/customizer';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { CommonServices } from 'src/app/services/common-services/common-services';
import * as moment from 'moment';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import { FcmService } from 'src/app/services/fcm.service';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController, NavParams, PopoverController } from '@ionic/angular';

import { NewEventAlertPage } from '../cfs-event/model/new-event-alert/new-event-alert.page';
import { EventHazardousLocationPage } from '../cfs-event/model/event-hazardous-location/event-hazardous-location.page';
import { EventAdditionalInfoPage } from '../cfs-event/model/event-additional-info/event-additional-info.page';
import { EventHazardousLocationPageModule } from '../cfs-event/model/event-hazardous-location/event-hazardous-location.module';
import { ApplicationConfigProvider } from 'src/app/services/application-cofig/application-config';
import { getLocaleNumberFormat, NumberFormatStyle, NumberSymbol } from '@angular/common';
import translate from 'translate'; 
import { templateJitUrl } from '@angular/compiler';
import * as $ from "jquery";
import { createOptional } from '@angular/compiler/src/core';
// import { MediaCapture } from '@ionic-native/media-capture';
// import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
// import { ApplicationConfig } from './../../providers/application-config';
// import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
// import { ShowPoi } from "../show-poi/show-poi";

declare var appConfigInfo: any;
declare var tmpl: any;
var mobileMapObj: any;
var getOverlayFeatureDetails: any;
@Component({
  selector: 'app-location-services-map',
  templateUrl: './location-services-map.page.html',
  styleUrls: ['./location-services-map.page.scss'],
})
export class LocationServicesMapPage implements OnInit {

  static instance: LocationServicesMapPage;
  public serviceType: number;
  public showScrollRange: boolean = false;
  public showSearchPoiBox: boolean = false;
  public showBackButton: boolean = false;
  public distanceValue: number = 2;
  public poi = {};
  public poiGroup: Array<Object>;
  navigationButton = false;
  public poiLayer = [{ "group_id": 1, "group_name": "Admimistrative Office" },
  { "group_id": 2, "group_name": "Airport" },
  { "group_id": 3, "group_name": "Ambulance Service" },
  { "group_id": 13, "group_name": "Apartment" },
  { "group_id": 4, "group_name": "Art Gallery" },
  { "group_id": 60, "group_name": "Atm" },
  { "group_id": 5, "group_name": "Auditorium" },
  { "group_id": 6, "group_name": "Bank" },
  { "group_id": 7, "group_name": "Blood Bank" },
  { "group_id": 8, "group_name": "Bus Stand" },
  { "group_id": 9, "group_name": "Categories" },
  { "group_id": 10, "group_name": "Checkpost" },
  { "group_id": 11, "group_name": "Cinema Theatre" },
  { "group_id": 12, "group_name": "Clinic" },
  { "group_id": 14, "group_name": "Companies" },
  { "group_id": 15, "group_name": "Court" },
  { "group_id": 16, "group_name": "Educational Institute" },
  { "group_id": 17, "group_name": "Educational Others" },
  { "group_id": 18, "group_name": "Fire Station" },
  { "group_id": 19, "group_name": "Garden" },
  { "group_id": 20, "group_name": "Govt Intstitutions" },
  { "group_id": 21, "group_name": "Govt Office" },
  { "group_id": 22, "group_name": "Helipads" },
  { "group_id": 23, "group_name": "Historical Places" },
  { "group_id": 24, "group_name": "Hospital" },
  { "group_id": 25, "group_name": "Hostel" },
  { "group_id": 26, "group_name": "Hotel Restaurant" },
  { "group_id": 27, "group_name": "Industrial Area" },
   { "group_id": 28, "group_name": "Information Centre" },
    { "group_id": 29, "group_name": "Jail" },
     { "group_id": 30, "group_name": "Jewellery Location" },
      { "group_id": 31, "group_name": "Library" },
       { "group_id": 32, "group_name": "Market" }, 
       { "group_id": 33, "group_name": "Medical Shop" }, 
       { "group_id": 34, "group_name": "Museum" },
        { "group_id": 35, "group_name": "Office" }, 
        { "group_id": 36, "group_name": "Other Police Installations" }, 
        { "group_id": 37, "group_name": "Others" }, 
        { "group_id": 38, "group_name": "Park" }, 
        { "group_id": 39, "group_name": "Parking Lot" },
         { "group_id": 40, "group_name": "Petrol Pump" }, 
         { "group_id": 41, "group_name": "Place Worship" },
          { "group_id": 42, "group_name": "Police Chowki" }, 
          { "group_id": 43, "group_name": "Police Head Quarters" },
           { "group_id": 44, "group_name": "Police Station" }, 
           { "group_id": 45, "group_name": "Postoffice" },
            { "group_id": 46, "group_name": "Prohibitedarea" }, 
            { "group_id": 47, "group_name": "Pub Bar" }, 
            { "group_id": 48, "group_name": "Railway Reservation Centre" },
             { "group_id": 49, "group_name": "Railway Track" }, 
             { "group_id": 50, "group_name": "Residence" }, 
             { "group_id": 61, "group_name": "Restaurant" },
              { "group_id": 51, "group_name": "Shelter Locations" },
               { "group_id": 52, "group_name": "Shopping Complex" },
                { "group_id": 53, "group_name": "Showroom" },
                 { "group_id": 54, "group_name": "Stadium" }, 
                 { "group_id": 55, "group_name": "Substation" }, 
                 { "group_id": 56, "group_name": "Touristspot" },
                  { "group_id": 57, "group_name": "Travel Agency" }, 
                  { "group_id": 58, "group_name": "Vip Buildings" },
                   { "group_id": 59, "group_name": "Waterbodies" }];
  public pois: Array<Object>;

  public selectedGroup = 0;

  public nearbyEvents=[];
  public nearbyResources= [];

  public createPoi = {
    selectedGroup: 0,
    selectedLayer: 0,
    poiType:"",
    poiName: "",
    latitude: this.applicationConfig.latitude,
    longitude: this.applicationConfig.longitude,
    capturedImage: "",
    fileuploadedUrl: "",
    files: []
  };

  cfsLatlng;

  //public captureImageUrl = "assets/img/img-placeholder.png";

  public captureImageUrl = "assets/camera.png";
  mdtDetails: any = {
    vehicleId: String,
    userName: String,
    callSign: String
  }

  showInfaStructure = false;

  static materialLat;
  static materialLng;
  static matrialAddress;

  static filterTypeChanged: boolean = false;

  infrastructureList = [];
  hazardousList = [];
  callback;
  patrolData = "";
  taskData;
  language;


  
  constructor(public httpClient: CustomHttpClient, public customNavService: CustomNavService, private ngZone: NgZone,
    private commonService: CommonServices, private eventService: EventsDbService, private http: HttpClient, private modalCtrl: ModalController,private popoverCtrl: PopoverController,
    private applicationConfig: ApplicationConfigProvider, private navCtrl: NavController) {
    LocationServicesMapPage.instance = this
    //this.serviceType = 1;

    this.serviceType = this.customNavService.get('serviceType');
    this.cfsLatlng = this.customNavService.get('cfsLatlng');
    this.patrolData = this.customNavService.get('patrolDetail');
    this.taskData = this.customNavService.get('taskDetails');

    console.log(this.serviceType);
    console.log("cfsDetails", this.cfsLatlng);
    // this.serviceType = navParams.get("serviceType");
    // serviceType ==> 1 -> View Location
    // serviceType ==> 2 -> Search POI
    // serviceType ==> 3 -> Nearby Events
    // serviceType ==> 4 -> Nearby Resources
    // serviceType ==> 5 -> Create POI
    this.callback = this.customNavService.get("callback");
   

  }

//   async convertNumber(){
//     const text = await translate(this.createPoi.latitude, 'ar');
// console.log(text);
//   }

  ngOnInit() {

    // this.convertNumber();

    this.loadMap();
    this.eventService.getVehicleDetails().then((res: any) => {

      for (let entry of res) {
        console.log('entry===>', entry.vehicleId);
        /* Object.keys(entry).forEach(key => {
          let value = entry[key];
          console.log('entry===>',value); // 1, "string", false
        }); */

        /* for (let elem in entry) {
          console.log('element==12>', entry[elem])
        } */

        this.mdtDetails.vehicleId = entry.vehicleId
        this.mdtDetails.userName = entry.loginUserName
        this.mdtDetails.callSign = entry.vehicleCallSign

        console.log('entry===>', this.mdtDetails);

      }
    });

      this.getLanguage();
    
    //  this.setCurrentLocation();
  }


  getLanguage(){
    if (window.localStorage.getItem("language") === null || window.localStorage.getItem("language") === undefined) {
      this.language = "en";
    } else if(window.localStorage.getItem("language") == "arb"){
      this.language="ar";
    }else if(window.localStorage.getItem("language") == "en"){
      this.language="en";
      // this.translateService.use(window.localStorage.getItem("language"));
    }
  }

  getOverlayFeatureDetails(id, latlong, layerName, properties, mobileMapObj) {

    console.log('getOverlayFeatureDetails', id,latlong,layerName,properties,mobileMapObj);

    let detail = '';

    if (properties.type === 'events' && properties.event_id !== undefined) {
      detail = "<div style='color: white;width: 266px;font-size: 2em;'> Event ID: " + properties.event_id + "<br> Status: " + properties.eventstatus + "<br> Event Type: " + properties.eventmain + "<br> Distance: " + properties.distance + " km </div>";
    } else if (properties.type === 'resources' && properties.call_sign !== undefined) {
      detail = "<div style='color: white;width: 266px;font-size: 2em;'> Call Sign: " + properties.call_sign + " <br> Vehicle ID: " + properties.vehicle_id + "<br> Status: " + properties.resource_status + "<br> Distance: " + properties.distance + " km </div>";
    }

    detail = '<div> <table> <tr> <td> Address </td> <td> Test Address </td> </tr> </table> </div>';

    tmpl.Tooltip.add({
      map: mobileMapObj,
      html:detail,
      coordinate: latlong,
      offset: [0, -10],

    });
  }

  setCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('Pos: ', position);
      this.CfsNewPage.latitude = position.coords.latitude
      this.CfsNewPage.longitude = position.coords.longitude
    }, function (error) {
      console.log('Errer', error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationServicesMapPage');
    //this.setCurrentLocation();
    //this.getLayers();
  }

  loadMap() {
    appConfigInfo.mapData = 'pentab'
    appConfigInfo.mapDataService = 'google'
    appConfigInfo.type = 'google'
    tmpl.Map.createMap({
      target: 'locmap',
      name: 'e',
      callBackFunc: this.getMap,

    });

    this.navigationButton = false;
    //this.showRoute();
   
    if (this.serviceType == 1) {
      this.showSearchPoiBox = false;
      this.showScrollRange = false;
      this.showBackButton = false;
      this.showInfaStructure = false;
      this.showcurrentUnitLocation();
  
    //  this.viewLocationService();
    } else if (this.serviceType == 2) {
      this.showSearchPoiBox = true;
      this.showScrollRange = false;
      this.showBackButton = false;
      this.showInfaStructure = false;
      this.showcurrentLocation();
      // this.searchPOIService();

      }else if (this.serviceType == 3) {
        this.showSearchPoiBox = false;
        this.showScrollRange = true;
        this.showBackButton = false;
        this.showInfaStructure = false;
        this.showcurrentLocation();
       // this.nearbyEventsService();
        
      } else if (this.serviceType == 4) {
        this.showSearchPoiBox = false;
        this.showScrollRange = true;
        this.showBackButton = false;
        this.showInfaStructure = false;
        this.showcurrentLocation();
       // this.nearbyResourcesService();
        
      
    }  else if (this.serviceType == 5) {
      this.showSearchPoiBox = false;
      this.showScrollRange = false;
      this.showBackButton = false;
      this.showInfaStructure = false;
      this.showcurrentLocation();
      // this.createPOIService();
    } else if (this.serviceType == 6) {
      this.showSearchPoiBox = false;
      this.showScrollRange = false;
      this.showBackButton = false;
      this.navigationButton = true;
      this.showInfaStructure = true;
      this.showCFSLocation();
      this.showInfrastructure();
      this.showHazardous();
    }
    else if (this.serviceType == 7) {
      this.showSearchPoiBox = false;
      this.showScrollRange = false;
      this.showBackButton = false;
      this.navigationButton = false;
      this.showInfaStructure = false;
     // this.showcurrentLocation();
      this.showPatrol();
    }
    else if (this.serviceType == 8) {
      this.showSearchPoiBox = false;
      this.showScrollRange = false;
      this.showBackButton = false;
      this.navigationButton = false;
      this.showInfaStructure = false;
      // this.showcurrentLocation();
      this.showTask();
    }

    // console.log("distancevalue", this.getdistanceValue())

   // this.zoominZoomOutService();
  }
  showTask(){
    this.addMarkerandZoom('myLoc', '', '/assets/img/hoysala-icon.png', this.taskData.latitude, this.taskData.longitude, 35, 60, '')
  }

  showPatrol(){
   this.clearAllMarkers();
  
   // var line_geometry = "POLYGON ((72.716703414916992 18.901376724243164, 72.730093002319336 18.896570205688477, 72.7254581451416 18.890218734741211, 72.700052261352539 18.888330459594727, 72.716703414916992 18.901376724243164))"
  //  var line_geometry = "LINESTRING(77.60954618453978 13.000271705806455,77.61787176132201 13.003533284087126,77.62263536453246 12.998808163157364)";
  //  var line_geometry = this.patrolData;
  // console.log("show Patrol", line_geometry);

  // setTimeout(()=>{
  // tmpl.Overlay.addGeometryWithColor({
	// 		map : mobileMapObj,
	// 		geometry : line_geometry,
	// 		properties : {
	// 			id : 1,
	// 			name : "path",
	// 			type : "visited",
				
	// 		},
	// 		layer : 'route1',
	// 		color : '#1E88E5'
  //   });
  // },10000);

  //var line_geometry = "LINESTRING(77.60954618453978 13.000271705806455,77.61787176132201 13.003533284087126,77.62263536453246 12.998808163157364)";

  var line_geometry = this.patrolData;
  setTimeout(()=>{
  tmpl.Overlay.addGeometryWithColor({map :mobileMapObj,
    geometry :line_geometry,
    properties : {id :1,name :"path",type :"visited"},layer :'route1',color :'#1E88E5'});
  tmpl.Zoom.toLayer({map : mobileMapObj,layer : 'route1'});

 

  tmpl.Layer.changeVisibility({map : mobileMapObj,layer : 'RoutePoint',visible : true});
  tmpl.Layer.changeVisibility({map : mobileMapObj,layer : 'route1',visible : true});

},10000);
    
    
  }



  showInfrastructure(){
   // this.commonService.showLoader("Loading...");  
    this.httpClient.get('Responder/getNearCriticalInfra/'+this.cfsLatlng.latitude+'/'+this.cfsLatlng.longitude).subscribe(data => {
  
      //this.commonService.hideLoader();
      this.infrastructureList = data;
      
    
    }, err=> {
      this.commonService.hideLoader();
     // this.commonService.presentAutoHideToast("Please Try Again!")
    });
  }

  showHazardous(){
    //this.commonService.showLoader("Loading...");  
    this.httpClient.get('/Responder/getNearHazardous/'+this.cfsLatlng.latitude+'/'+this.cfsLatlng.longitude).subscribe(data => {
  
    //  this.commonService.hideLoader();
      this.hazardousList = data;
      
    
    }, err=> {
      this.commonService.hideLoader();
     // this.commonService.presentAutoHideToast("Please Try Again!")
    });
  }

  async showInfrastructureLocation() {
    const popover = await this.popoverCtrl.create({
      component: EventHazardousLocationPage,
      event: event,
      translucent: true,
      componentProps: {status:this.infrastructureList}
    });
    popover.present();

    popover.onDidDismiss().then(data => {
      if (LocationServicesMapPage.filterTypeChanged) {
        console.log("filter")
        // this.getStationWise();
        this.showMaterialLocation();
        LocationServicesMapPage.filterTypeChanged = false;
      }
    });
  }

  async showHazardousLocation() {
    const popover = await this.popoverCtrl.create({
      component: EventHazardousLocationPage,
      event: event,
      translucent: true,
      componentProps: {status:this.hazardousList}
    });
    popover.present();

    popover.onDidDismiss().then(data => {
      if (LocationServicesMapPage.filterTypeChanged) {
        console.log("filter", LocationServicesMapPage.matrialAddress);
        // this.getStationWise();
        this.showMaterialLocation();
        LocationServicesMapPage.filterTypeChanged = false;
      }
    });
  }

  showMaterialLocation(){

   
    this.addMaterialLayerandZoom('materialLoc', 'CQ location', '/assets/img/hoysala-icon.png', LocationServicesMapPage.materialLat, LocationServicesMapPage.materialLng, 35, 60, LocationServicesMapPage.matrialAddress)

  }


  
  addMaterialLayerandZoom(id, label, imgUrl, lat, lng, height, width, address) {
    let features = [];

    console.log("latitude",lat,lng);
    console.log("mobileMapObj", mobileMapObj)
    console.log("mobileMapObj", address);

    this.clearAllMaterialMarkers()

     features = [{
      id: id,
      label: "",
      label_color: "#FF00FF",
      img_url: "assets/img/home/pin_filled.png",
      lat: lat,
      lon: lng,
      height: 35,
      width: 35,
      address: address,
      language:this.language,

    }
    ];
    console.log('mobileMapObj', mobileMapObj);
setTimeout(()=>{
  console.log('mobileMapObj', mobileMapObj);
  tmpl.Overlay.create({
    map: mobileMapObj,
    features: features,
    //layer: id,
    layer: id
    //   callBackFuncntion: LocationServicesMapPage.getOverlayFeatureDetails
  });

  tmpl.Layer.changeVisibility({
    map : mobileMapObj,
    layer : id,
    visible : true
  });
  

  tmpl.Zoom.toXYcustomZoom({
    map: mobileMapObj,
    latitude: lat,
    longitude: lng,
    zoom: 14
  });
 
},1000)
   
  }

  clearAllMaterialMarkers(){
    try {
    
    
      tmpl.Layer.remove({map : mobileMapObj,layer : 'RouteLineLayer'});
      tmpl.Layer.remove({map : mobileMapObj,layer : 'RoutePoint'});
      tmpl.Layer.clearData({map : mobileMapObj,layer : 'RoutePoint'});
      tmpl.Layer.clearData({map : mobileMapObj,layer : 'RouteLineLayer'});
    } catch (error) {
      console.log("remove", error)
    }
    
        try {
          tmpl.Layer.clearData({
            map: mobileMapObj,
            layer: 'materialLoc'
          });
          
        } catch (error) {
          console.log("clearData", error)
        }
    
      
  }




  showcurrentLocation(){
    this.addMarkerandZoom('myLoc', '', '/assets/img/hoysala-icon.png', this.applicationConfig.latitude, this.applicationConfig.longitude, 35, 60, '')

  }

  showcurrentUnitLocation(){
    this.addMarkerNameandZoom('myLoc', '', '/assets/img/hoysala-icon.png', this.applicationConfig.latitude, this.applicationConfig.longitude, 35, 60, '')
  }


  addMarkerNameandZoom(id, label, imgUrl, lat, lng, height, width, address){
    setTimeout(()=>{
      console.log('mobileMapObj', mobileMapObj);
    
    
      // tmpl.Overlay.addMarker({
      //   map: mobileMapObj,
      //   point: [lng,lat],
      //   id: 'MarkerLayer',
      //   img_url: "https://image.flaticon.com/icons/png/512/37/37134.png",
      //   //img_url: imgUrl,
      //   height: 35,
      //   width: 35,
      //   offset: [0, -20]
        
      // });
    
      tmpl.Overlay.markerWithName({
        map: mobileMapObj,
        point: [lng,lat],
        id: 'MarkerLayer',
        img_url: "assets/img/car.png",
        //img_url: imgUrl,
        height: 35,
        width: 35,
        offset: [0,0],
        imgoffset:[0, -20],
        name:this.mdtDetails.callSign
        
      });

     
    
      tmpl.Zoom.toXYcustomZoom({
        map: mobileMapObj,
        latitude: lat,
        longitude: lng,
        zoom: 14
      });
    
    },1000)
       
  }

  addZoom(id, label, imgUrl, lat, lng, height, width, address) {

    console.log("latitude",lat,lng);
    console.log("mobileMapObj", mobileMapObj)

    // this.clearAllMarkers()

    var features = [{
      id: id,
      label: label,
      label_color: "#FF00FF",
      img_url: imgUrl,
      lat: lat,
      lon: lng,
      height: height,
      width: width,
      address: address,

    }
    ];
    console.log('mobileMapObj', mobileMapObj);
setTimeout(()=>{
  console.log('mobileMapObj', mobileMapObj);
  // tmpl.Overlay.create({
  //   map: mobileMapObj,
  //   features: features,
  //   //layer: id,
  //   layer: 'MarkerLayer'
  //   //    callBackFuncntion: LocationServicesMapPage.getOverlayFeatureDetails
  // });

  tmpl.Overlay.addMarker({
    map: mobileMapObj,
    point: [lng,lat],
    id: 'MarkerLayer',
    img_url: "https://image.flaticon.com/icons/png/512/37/37134.png",
    //img_url: imgUrl,
    height: 35,
    width: 35,
    offset: [0, -20]
  });

  tmpl.Zoom.toXYcustomZoom({
    map: mobileMapObj,
    latitude: lat,
    longitude: lng,
    zoom: 14
  });
  // tmpl.Layer.changeVisibility ({
  //   map: mobileMapObj,
  //   layer: 'MarkerLayer',
  //   visible:true
  // });
  // tmpl.Zoom.toLayer({
  //   map : mobileMapObj,
  //   layer : 'MarkerLayer'
  // });
},1000)
   
  }



  showIncidentLocation(){
    this.addMarkerLayerandZoom('ATMOverlay', this.cfsLatlng.eventid, '/assets/img/hoysala-icon.png', this.cfsLatlng.latitude, this.cfsLatlng.longitude, 35, 60, '')
  }




 showCFSLocation(){

  console.log("marker");

  this.addMarkerLayerandZoom('ATMOverlay', this.cfsLatlng.eventid, 'assets/img/icons/view-location.png', this.cfsLatlng.latitude, this.cfsLatlng.longitude, 35, 60, this.cfsLatlng.address)

  // tmpl.Overlay.addMarker({
  //   map : mobileMapObj,
  //  // point : [this.cfsLatlng.latitude,this.cfsLatlng.longitude],
  //   point : [12.9676,77.7510],
  //   id : 'ATMOverlay',
  //   img_url : 'assets/img/icons/view-location.png',
  //   height : 200,
  //   width : 200,
  //   offset : [0,-20]
  // });
 }

  showRoute() {
    let stops = [
      { "lat": 12.96199, "lon": 77.6128 },
      { "lat": 12.9735, "lon": 77.6213 }
    ];
    tmpl.Route.getRoute({
      map: mobileMapObj,
      // source: [77.5964, 12.9647],
      // destination: [77.6324, 12.9590],
      source: [this.applicationConfig.longitude,this.applicationConfig.latitude],
      destination: [this.cfsLatlng.longitude, this.cfsLatlng.latitude],
      sourceIcon: "assets/img/car.png",
      destinationIcon: "assets/img/car.png",
      // waypoints: stops,
      waypointsIcon: "assets/img/car.png",
      route_width: 3
    });

    tmpl.Feature.changeVisibility({map : mobileMapObj,layer : 'RouteLineLayer',visible : true});
    tmpl.Layer.changeVisibility({map : mobileMapObj,layer : 'RouteLineLayer',visible : true});
    tmpl.Feature.changeVisibility({map : mobileMapObj,layer : 'RoutePoint',visible : true});
    tmpl.Layer.changeVisibility({map : mobileMapObj,layer : 'RoutePoint',visible : true});
    
  }

  getMap(map) {
    console.log('getMap', map);

    mobileMapObj = map;
    setTimeout(() => {
       LocationServicesMapPage.instance.showTheCurrentLocation(); 

       LocationServicesMapPage.instance.zoominZoomOutService();

       

    }, 1000);
   //  LocationServicesMapPage.instance.showCFSLocation();
   // LocationServicesMapPage.instance.zoominZoomOutService();

    //   LocationServicesMapPage.addMarkerandZoom(CfsMapPage.dummyCFSDetails.eventid,'CFS location', 'assets/img/distress-icon.png', CfsMapPage.dummyCFSDetails.latitude, CfsMapPage.dummyCFSDetails.longitude, 35, 60)
  }

  zoominZoomOutService(){
    console.log("zoomin");

    if(this.language == "ar"){
      $('.ol-zoom-in').attr('title', 'تكبير');
      $('.ol-zoom-out').attr('title', 'تصغير');
    }
    
  }



  addMarkersandZoom(features, layer, latitude, longitude) {

  


    // tmpl.Zoom.toLayer({
    //   map: mobileMapObj,
    //   layer: layer,
    //   zoom: 17

    // });
    if(features != []){
      console.log( "Layercreated:",features,mobileMapObj,layer);
      var result = tmpl.Overlay.create({
        map: mobileMapObj,
        features: features,
        layer: layer
       // callBackFunc: LocationServicesMapPage.getOverlayFeatureDetails
      });
      tmpl.Layer.changeVisibility({
        map : mobileMapObj,
        layer : layer,
        visible : true
      });
    console.log("features", features)

    tmpl.Zoom.toXYcustomZoom({
      map: mobileMapObj,
      latitude: latitude,
      longitude: longitude,
      zoom: 14
    });

    setTimeout(() => {
      tmpl.Map.resize({
        map: mobileMapObj
      });
    }, 1000)
  }

  }

  //getOverlayFeatureDetails(id,coord,layerName,properties,mapObj);

  getdistanceValue(){
    return this.commonService.transform(this.distanceValue);
  }

  showTheCurrentLocation() {
    var addres;
    // this.nearbyResources = [];
    // this.nearbyEvents = [];


    console.log('showTheCurrentLocation', 'showTheCurrentLocation');

   

    setTimeout(() => {
      tmpl.Map.resize({
        map: mobileMapObj
      });

      if (this.serviceType == 1) {
    
        this.showcurrentUnitLocation();
      } else if (this.serviceType == 2) {
       
        this.showcurrentLocation();
     
  
        }else if (this.serviceType == 3) {
       
          this.showcurrentLocation();
         
          
        } else if (this.serviceType == 4) {
      
          this.showcurrentLocation();
        
          
        
      }  else if (this.serviceType == 5) {
   
        this.showcurrentLocation();
      
      } else if (this.serviceType == 6) {
        this.showCFSLocation();
       
      }
    
      
      
    }, 1000)


     //this.addMarkerandZoom('myLoc', 'CQ location', 'assets/img/hoysala-icon.png', 12.9716, 77.5946, 35, 60, '')
     
   //  this.addMarkerandZoom('myLoc', 'CQ location', '/assets/img/hoysala-icon.png', this.cfsLatlng.latitude, this.cfsLatlng.longitude, 35, 60, '')

  }


   addMarkerLayerandZoom(id, label, imgUrl, lat, lng, height, width, address) {
    let features = [];

    console.log("latitude",lat,lng);
    console.log("mobileMapObj", mobileMapObj)

    this.clearAllMarkers()

     features = [{
      id: id,
      label: label,
      label_color: "#FF00FF",
      img_url: "assets/img/hoysala-icon.png",
      lat: lat,
      lon: lng,
      height: 35,
      width: 35,
      address: address,
      language: this.language

    }
    ];
    console.log('mobileMapObj', mobileMapObj);
setTimeout(()=>{
  console.log('mobileMapObj', mobileMapObj);
  tmpl.Overlay.create({
    map: mobileMapObj,
    features: features,
    //layer: id,
    layer: id
    //   callBackFuncntion: LocationServicesMapPage.getOverlayFeatureDetails
  });

  tmpl.Layer.changeVisibility({
    map : mobileMapObj,
    layer : "ATMOverlay",
    visible : true
  });
  // tmpl.Overlay.addMarker({
  //   map: mobileMapObj,
  //   point: [lng,lat],
  //   id: 'MarkerLayer',
  //   img_url: "https://image.flaticon.com/icons/png/512/37/37134.png",
  //   //img_url: imgUrl,
  //   height: 35,
  //   width: 35,
  //   offset: [0, -20]
    
  // });

  // tmpl.Overlay.markerWithName({
  //   map: mobileMapObj,
  //   point: [lng,lat],
  //   id: 'MarkerLayer',
  //   img_url: "https://image.flaticon.com/icons/png/512/37/37134.png",
  //   //img_url: imgUrl,
  //   height: 35,
  //   width: 35,
  //   offset: [0,0],
  //   name:label
    
  // });

  tmpl.Zoom.toXYcustomZoom({
    map: mobileMapObj,
    latitude: lat,
    longitude: lng,
    zoom: 14
  });
  // tmpl.Layer.changeVisibility ({
  //   map: mobileMapObj,
  //   layer: 'MarkerLayer',
  //   visible:true
  // });
  // tmpl.Zoom.toLayer({
  //   map : mobileMapObj,
  //   layer : 'MarkerLayer'
  // });
},1000)
   
  }



  addMarkerandZoom(id, label, imgUrl, lat, lng, height, width, address) {

    console.log("latitude",lat,lng);
    console.log("mobileMapObj", mobileMapObj)

    this.clearAllMarkers()

    var features = [{
      id: id,
      label: label,
      label_color: "#FF00FF",
      img_url: imgUrl,
      lat: lat,
      lon: lng,
      height: height,
      width: width,
      address: address,

    }
    ];
    console.log('mobileMapObj', mobileMapObj);
setTimeout(()=>{
  console.log('mobileMapObj', mobileMapObj);
  // tmpl.Overlay.create({
  //   map: mobileMapObj,
  //   features: features,
  //   //layer: id,
  //   layer: 'MarkerLayer'
  //   //    callBackFuncntion: LocationServicesMapPage.getOverlayFeatureDetails
  // });
  // tmpl.Overlay.addMarker({
  //   map: mobileMapObj,
  //   point: [lng,lat],
  //   id: 'MarkerLayer',
  //   img_url: "https://image.flaticon.com/icons/png/512/37/37134.png",
  //   //img_url: imgUrl,
  //   height: 35,
  //   width: 35,
  //   offset: [0, -20]
    
  // });

  tmpl.Overlay.markerWithName({
    map: mobileMapObj,
    point: [lng,lat],
    id: 'MarkerLayer',
    img_url: "https://image.flaticon.com/icons/png/512/37/37134.png",
    //img_url: imgUrl,
    height: 35,
    width: 35,
    offset: [0,0],
    name:label
    
  });

  tmpl.Zoom.toXYcustomZoom({
    map: mobileMapObj,
    latitude: lat,
    longitude: lng,
    zoom: 14
  });
  // tmpl.Layer.changeVisibility ({
  //   map: mobileMapObj,
  //   layer: 'MarkerLayer',
  //   visible:true
  // });
  // tmpl.Zoom.toLayer({
  //   map : mobileMapObj,
  //   layer : 'MarkerLayer'
  // });
 if (this.serviceType == 3) {
 
  this.nearbyEventsService();
  
  } else if (this.serviceType == 4) {

  this.nearbyResourcesService();
 }


},1000)
   
  }


  nearbyResourcesService() {

    this.nearbyResources = [];
    this.nearbyEvents = []
    let nearestVehicleResult = [];

    //this.customizer.showLoader("Please wait...");
    let params = {

      dblLat: this.applicationConfig.latitude,
      dblLon: this.applicationConfig.longitude,
      distance: this.distanceValue,
      //sim_no: ApplicationConfig.simNo,
      language: this.language
    }
   // this.commonService.showLoader("Loading...");
    this.httpClient.post("Responder/nearest_Vehicles", params).subscribe(value => {
      console.log('Responder/nearestVehicles', value);
      this.commonService.hideLoader();
      this.nearbyResources = value;
      let result = value.jaVehicles;
      nearestVehicleResult = value.jaVehicles;
      console.log('Responder/nearestVehicles.jaVehicles', result);
      this.clearAllMarkers()
      //this.customizer.hideLoader();
      let features = []
      for (var index = 0; index < result.length; index++) {
        //var vehicleDetail = " Call Sign: " + result[index].call_sign + " \r\n Vehicle ID: " + result[index].vehicle_id + "\r\n Status: " + result[index].resource_status + "\r\n Distance: " + result[index].distance + " km";
        let feature = {
          id: result[index].vehno,
          label: result[index].vehno,
          label_color: "#FF00FF",
          img_url: 'assets/img/hoysala-icon.png',
          lat: result[index].lat,
          lon: result[index].lon,
          height: 35,
          width: 60,
          type: 'resources',
          call_sign: result[index].vehno,
          vehicle_id: result[index].vehid,
          resource_status: result[index].status,
          distance: result[index].distance,
          language:this.language,

        }
        features.push(feature);

      }
     
      this.addMarkersandZoom(features, 'nearest_resources', nearestVehicleResult[0].lat, nearestVehicleResult[0].lon)
      this.commonService.hideLoader();
    }, error => {
      this.commonService.hideLoader();
      //  this.customizer.hideLoader();
      //  this.customizer.presentAutoHideToast("Error fetching in nearest vehicles.");
    });
  }




  nearbyEventsService() {

    this.nearbyResources = [];
    this.nearbyEvents = []

    //this.customizer.showLoader("Please wait...");
    let params = {
      dblLat: this.applicationConfig.latitude,
      dblLon: this.applicationConfig.longitude,
      distance: this.distanceValue,
      //sim_no: ApplicationConfig.simNo,
      language: this.language
    }

    let feature1 = {
      id: 'CFS024352',
      label: 'CFS024352',
      label_color: "#FF00FF",
      img_url: 'assets/img/hoysala-icon.png',
      lon: '31.744104',
      lat: '29.996157',
      height: 35,
      width: 60,
      type: 'resources',
      call_sign: 'PCR1',
      vehicle_id: 'PCR1',
      resource_status: 'Available',
      distance: '5km'
    }

    let features = []
    this.commonService.showLoader("Loading...");
    let nearestEventResult = [];

    this.httpClient.post("Responder/nearest_events", params).subscribe(value => {
      console.log('Responder/nearestVehicles', value);
      this.commonService.hideLoader();

      this.nearbyEvents = value;
      // this.nearbyEvents = value.jaEvents;
      console.log("nearBy")
      let result = value.jaEvents;
      nearestEventResult = value.jaEvents;
      console.log('Responder/nearestVehicles.jaEvents', result);
      //this.customizer.hideLoader();
      this.clearAllMarkers()
      for (var index = 0; index < result.length; index++) {
        //var vehicleDetail = " Call Sign: " + result[index].call_sign + " \r\n Vehicle ID: " + result[index].vehicle_id + "\r\n Status: " + result[index].resource_status + "\r\n Distance: " + result[index].distance + " km";
        let feature = {
          id: result[index].eventno,
          label: result[index].eventno,
          label_color: "#FF00FF",
          img_url:'assets/img/hoysala-icon.png',
          lat: result[index].lat,
          lon: result[index].lon,
          height: 35,
          width: 60,
          type: 'resources',
          call_sign: result[index].call_sign,
          vehicle_id: result[index].vehicle_id,
          resource_status: result[index].resource_status,
          distance: result[index].distance,
          language:this.language

        }
 
        features.push(feature);

      }
     
      this.addMarkersandZoom(features, 'nearest_events', nearestEventResult[0].lat,nearestEventResult[0].lon)

    }, error => {
      this.commonService.hideLoader();
      features.push(feature1);
      this.clearAllMarkers()
    //  this.addMarkersandZoom(features, 'nearest_resources')
      //  this.customizer.hideLoader();
      //  this.customizer.presentAutoHideToast("Error fetching in nearest vehicles.");
    });
  }

  clearMarker(){
    
  }

  clearAllMarkers() { 

try {
  tmpl.Layer.remove({
    map :mobileMapObj,
    layer : 'nearest_events'
  });

  tmpl.Layer.remove({
    map :mobileMapObj,
    layer : 'nearest_resources'
  });

  tmpl.Layer.remove({map : mobileMapObj,layer : 'RouteLineLayer'});
  tmpl.Layer.remove({map : mobileMapObj,layer : 'RoutePoint'});
  tmpl.Layer.clearData({map : mobileMapObj,layer : 'RoutePoint'});
  tmpl.Layer.clearData({map : mobileMapObj,layer : 'RouteLineLayer'});
} catch (error) {
  console.log("remove", error)
}

    try {
      tmpl.Overlay.removeMarker({
        map : mobileMapObj,
        id : 'MarkerLayer'
      });
      
  
      tmpl.Layer.clearData({
        map: mobileMapObj,
        layer: 'ATMOverlay'
      });
  
      tmpl.Layer.clearData({
        map: mobileMapObj,
        layer: 'nearest_resources'
      });
  
      tmpl.Layer.clearData({
        map: mobileMapObj,
        layer: 'nearest_events'
      });
  
      tmpl.Layer.clearData({
        map: mobileMapObj,
        layer: 'poi_marker'
      });
    } catch (error) {
      console.log("clearData", error)
    }

  
  }

  fetchData() {
    if (this.serviceType == 3) {
       this.nearbyEventsService();
    } else if (this.serviceType == 4) {
      this.nearbyResourcesService();
    }
  }


  getPois(layer) {

    let params = {
      layer: layer
    }

    console.log("layer", layer);
    this.commonService.showLoader("Please wait...");


    this.httpClient.post("Responder/search_Poi" , params).subscribe((value) => {
      // this.logger.log(LoggerService.INFO, LocationServicesMapPage.name, "getPois" + JSON.stringify(value))
      this.commonService.hideLoader();
      let result = value;
      this.pois = result;
      this.customNavService.popPage();
       this.customNavService.navigateByUrl('/show-poi', { poiResponseData: this.pois });
    }, error => {
      this.commonService.presentAutoHideToast("Please try again!")
      this.commonService.hideLoader();
    });
  }


  captureImage(fileLoader) {

    LocationServicesMapPage.instance.createPoi.files = [];


    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      var reader = new FileReader();

      console.log('fileloader', fileLoader.files);

   
          LocationServicesMapPage.instance.createPoi.files.push(fileLoader.files[0]);
          LocationServicesMapPage.instance.ngZone.run(() => {
            LocationServicesMapPage.instance.createPoi.capturedImage = LocationServicesMapPage.instance.createPoi.files[0].name;
            LocationServicesMapPage.instance.captureImageUrl =  "file://"+LocationServicesMapPage.instance.createPoi.files[0].path.split('\\').join('/');;
        
            console.log('that.atr.atrVideos', LocationServicesMapPage.instance.createPoi.files);
            console.log('that.atr.atrVideos', LocationServicesMapPage.instance.createPoi.capturedImage);
          })

      //   }
      // }

      reader.addEventListener("load", function () {
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }


  uploadPOI() {
    let counter = 0;
    if (this.createPoi.files.length > 0) {
      for (let j of this.createPoi.files) {
        counter++;
        this.uploadFile(j, counter);
      }
    } else{
      this.saveNewPOI();
     // this.commonService.presentAutoHideToast("Plesae Attach a file!")
    }
  }

  uploadFile(file: File, count) {
    let data = []
    const formData = new FormData();
    formData.append('uploadedfile1', file);

    this.http.post(this.applicationConfig.fileUploadUrl + FcmService.phpUpload, formData).subscribe(
      (res) => {
        console.log('ouputresult', res)
      },
      (err) => {
        console.log('errorpage', err)
        if (err.status == 200 && err.error.text.includes('The file')) {

          data = err.error.text.split(" ")
          console.log('spliteed data==>', data);
          this.createPoi.fileuploadedUrl = this.applicationConfig.fileUploadUrl + data[2]
        
          console.log('this.atr.atrType', this.createPoi.fileuploadedUrl);

          if (count == this.createPoi.files.length) {
            this.saveNewPOI();
          }
        }
      }
    );
  }


  saveNewPOI() {

    if (this.createPoi.poiName.length === 0 && this.createPoi.selectedLayer < 1) {
      this.commonService.presentAutoHideToast("Please Fill the field!");
    }  else {
      this.commonService.showLoader("Please wait...");
      let params = {

        "vehicleId": this.mdtDetails.vehicleId,
        "userName": this.mdtDetails.userName,
        "poiType": this.createPoi.poiType,
        "poiName": this.createPoi.poiName,
        "poiId": this.createPoi.selectedLayer,
        "imagePath": this.createPoi.fileuploadedUrl,
        "latitude":this.createPoi.latitude,
        "longitude": this.createPoi.longitude,
        "time": moment().format("YYYY-MM-DD hh:mm:ss")
      }

     
      this.httpClient.post("Responder/create_mdt_poi", params).subscribe(result => {
     
         this.commonService.hideLoader();
         console.log("POI response", result);
     
        if (result.Result) {
          this.commonService.presentAutoHideToast("Sucessfully submitted!");
          this.customNavService.popPage();
        } else {
          this.commonService.presentAutoHideToast(result.Output);
        }
      }, error => {
       
        this.commonService.hideLoader();
        this.commonService.presentAutoHideToast("Please Try Again!")
      });
    }


  }

  selectPoiLayer(event){

    console.log("poiEvent", event);
  
    this.createPoi.selectedLayer = event.detail.value.group_id;
    this.createPoi.poiType = event.detail.value.group_name;

    console.log("group_id", this.createPoi.selectedLayer);
    console.log("poiType", this.createPoi.poiType);

  }



  serchPOI() {

    if(this.selectedGroup  != 0){
    console.log('searchpoi', this.selectedGroup);
    this.getPois(this.selectedGroup);
    }else{
      this.commonService.presentAutoHideToast("Please Select Layer!")
    }
  }



    showGridView() {
      if (this.serviceType == 3) {
        this.customNavService.navigateByUrl('/nearbyevent', { nearbyEvents: this.nearbyEvents});
      } else if (this.serviceType === 4) {
        this.customNavService.navigateByUrl('/nearbyresource', { nearbyResources: this.nearbyResources});
      }
    }

    addPlaceMarker()
    {
      tmpl.Info.getPlace({
          callbackFunc: function clickedLocationInfo(locationinfo){
          console.log("locationinfo:",locationinfo);
        // Add Marker API need to add here
        console.log("locationInfo", locationinfo.latitude)
        console.log("locationInfo", locationinfo.place[0]);
      
        LocationServicesMapPage.instance.addMarkerandZoom('myLoc', 'CQ location', '/assets/img/hoysala-icon.png', locationinfo.latitude, locationinfo.longitude, 35, 60, '');
        LocationServicesMapPage.instance.updateLocation(locationinfo.place[0], locationinfo.latitude, locationinfo.longitude);

        // this.callback(locationinfo)
        // this.customNavService.popPage();
        tmpl.Info.removeGetPlace();
       
        }
        })
      }

      updateLocation(placename, latitude, longitude){
        let params = {

          "basic_id":this.cfsLatlng.basicid,
          "event_status":this.cfsLatlng.status,
          "lat":latitude,
          "lon":longitude,
          "location":placename,
          "landmark":placename,
          "mark_type":"1",
          "vehicle_id":this.mdtDetails.vehicleId,
          "call_sign":this.mdtDetails.callSign

        
        }
  
       
        this.httpClient.post("Responder/relocate_event", params).subscribe(result => {
       
           this.commonService.hideLoader();
           console.log("Update Response", result);
       
          if (result.Result) {
            this.commonService.presentAutoHideToast("Location Updated Successfully!");
            this.eventService.updateEventLocation(placename, placename, placename, latitude, longitude, this.cfsLatlng.basicid)
            // this.eventService.updateEventLocation(location, distress_place_name, landmark, latitude, longitude, basicId)
            this.callback(this.cfsLatlng)
            this.customNavService.popPage();
          } else {
            this.commonService.presentAutoHideToast(result.Output);
          }
        }, error => {
         
          this.commonService.hideLoader();
          this.commonService.presentAutoHideToast("Error connecting to server. Please try again later.")
        });
      }


      relocatePOI(){
        tmpl.Info.getPlace({
          callbackFunc: function clickedLocationInfo(locationinfo){
          console.log("locationinfo:",locationinfo);
        // Add Marker API need to add here
        console.log("locationInfo", locationinfo.latitude)
        console.log("locationInfo", locationinfo.place[0]);
        LocationServicesMapPage.instance.createPoi.latitude = locationinfo.latitude;
        LocationServicesMapPage.instance.createPoi.longitude = locationinfo.longitude;
        LocationServicesMapPage.instance.createPoi.poiName = locationinfo.place[0];
      
        LocationServicesMapPage.instance.addMarkerandZoom('myLoc', 'CQ location', '/assets/img/hoysala-icon.png', locationinfo.latitude, locationinfo.longitude, 35, 60, '');
        //LocationServicesMapPage.instance.updateLocation(locationinfo.place[0], locationinfo.latitude, locationinfo.longitude);

        // this.callback(locationinfo)
        // this.customNavService.popPage();
        tmpl.Info.removeGetPlace();
       
        }
        })
      }
  
      


}

