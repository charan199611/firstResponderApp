import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { CommonServices } from 'src/app/services/common-services/common-services';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { EventsDbService } from 'src/app/services/sqlite-db/events-db.service';
import * as $ from "jquery";
declare var appConfigInfo: any;
declare var tmpl: any;
var mobileMapObj: any;
var getOverlayFeatureDetails: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {



  static instance: MapPage;
  public serviceType: number;
  public showScrollRange: boolean = false;
  public showSearchPoiBox: boolean = false;
  public showBackButton: boolean = false;
  public distanceValue: number = 5;
  public poi = {};
  public poiGroup: Array<Object>;
  navigationButton = false;
  
  public pois: Array<Object>;

  public selectedGroup = 0;

  public nearbyEvents: Array<Object> = [];
  public nearbyResources: Array<Object> = [];

  public createPoi = {
    selectedGroup: 0,
    selectedLayer: 0,
    poiType:"",
    poiName: "",
    latitude: 0.0,
    longitude: 0.0,
    capturedImage: "",
    fileuploadedUrl: "",
    files: []
  };

  cfsLatlng;

  public captureImageUrl = "assets/img/img-placeholder.png";

  language;
  mdtDetails: any = {
    vehicleId: String,
    userName: String,
    callSign: String
  }

  showInfaStructure = false;

  static materialLat;
  static materialLng;

  static filterTypeChanged: boolean = false;
  callback;
  showLocateButton;
  poiData;
  currentLocationData;
  constructor(public httpClient: CustomHttpClient, public customNavService: CustomNavService, private ngZone: NgZone,
    private commonService: CommonServices, private eventService: EventsDbService, private http: HttpClient, private modalCtrl: ModalController,private popoverCtrl: PopoverController) {
    MapPage.instance = this
    this.callback = this.customNavService.get("callback");
    //this.serviceType = 1;

    this.serviceType = this.customNavService.get('serviceType');
     this.poiData = this.customNavService.get('poiData');
     this.currentLocationData = this.customNavService.get("reportService");


     console.log("currentLocation",this.currentLocationData);
    // console.log("cfsDetails", this.cfsLatlng);
    // this.serviceType = navParams.get("serviceType");
    // serviceType ==> 1 -> View Location
    // serviceType ==> 2 -> Search POI
    // serviceType ==> 3 -> Nearby Events
    // serviceType ==> 4 -> Nearby Resources
    // serviceType ==> 5 -> Create POI

  }

  ngOnInit() {
    this.getLanguage();

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
    //  this.setCurrentLocation();
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

   // this.showTheCurrentLocation()
    if (this.serviceType == 1) {
      this.showLocateButton = false;
 
      this.showTheCurrentLocation();
    //  this.showPoiLocation();
    }else{
      this.showLocateButton = true;
      this.showTheCurrentLocation()
    }
  // this.showCurrentLocation();
  }

  showPoiLocation(){
    console.log("latitude", this.poiData.lat);
    this.addMarkerLayerandZoom('poiOverlay', "", '/assets/img/hoysala-icon.png', this.poiData.lat, this.poiData.lon, 35, 60, this.poiData.poi_name)
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

  zoominZoomOutService(){
    console.log("zoomin");
    $('.ol-zoom-in').attr('title', 'تكبير');
    $('.ol-zoom-out').attr('title', 'تصغير');
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
      language: this.language,

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
    layer : "poiOverlay",
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




 
  addPlaceMarker()
  {
    tmpl.Info.getPlace({
        callbackFunc: function clickedLocationInfo(locationinfo){
        console.log("locationinfo:",locationinfo);
      // Add Marker API need to add here
      tmpl.Info.removeGetPlace();
  
      MapPage.instance.updateLocation(locationinfo);
     
      }
      })
    }


    updateLocation(locationinfo){
      this.callback(locationinfo)
      this.customNavService.popPage();
    }
    
  

 



  // async showHazardousLocation(detail){
    
  //     let modal = await this.modalCtrl.create(
  //       {
  //         component: EventHazardousLocationPage, componentProps: { eventDetails: detail },
  //         showBackdrop: true, backdropDismiss: false, cssClass: 'app-event-additional-info'
  //       });
  //     await modal.present();

  // }


 showCFSLocation(){

  console.log("marker");

  this.addMarkerandZoom('ATMOverlay', 'CFS Location', 'assets/img/icons/view-location.png', this.cfsLatlng.latitude, this.cfsLatlng.longitude, 35, 60, '')

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

 

  getMap(map) {
    console.log('getMap', map);

    mobileMapObj = map;
    setTimeout(() => {
     //  MapPage.instance.showTheCurrentLocation(); 
     MapPage.instance.zoominZoomOutService();
   

      

    }, 1000);

    //   LocationServicesMapPage.addMarkerandZoom(CfsMapPage.dummyCFSDetails.eventid,'CFS location', 'assets/img/distress-icon.png', CfsMapPage.dummyCFSDetails.latitude, CfsMapPage.dummyCFSDetails.longitude, 35, 60)
  }

   handleGetPlace(data){
    console.log("address", data.address);
   
  };
 

  getAddress(){
    tmpl.Geocode.getGeocode({
			point : [29.996157,31.744104],
			callbackFunc  : this.handleGetPlace	
		});
  }

  addMarkersandZoom(features, layer) {

    var result = tmpl.Overlay.create({
      map: mobileMapObj,
      features: features,
      layer: layer,
      //callBackFunc: LocationServicesMapPage.getOverlayFeatureDetails
    });


    tmpl.Zoom.toLayer({
      map: mobileMapObj,
      layer: layer,
      zoom: 17

    });

    setTimeout(() => {
      tmpl.Map.resize({
        map: mobileMapObj
      });
    }, 1000)

  }

  //getOverlayFeatureDetails(id,coord,layerName,properties,mapObj);
  getOverlayFeatureDetails(id, latlong, layerName, properties, mobileMapObj) {

    console.log('getOverlayFeatureDetails', 'getOverlayFeatureDetails');

    let detail = '';
    if (properties.type === 'events' && properties.event_id !== undefined) {
      detail = "<div style='color: white;width: 266px;font-size: 2em;'> Event ID: " + properties.event_id + "<br> Status: " + properties.eventstatus + "<br> Event Type: " + properties.eventmain + "<br> Distance: " + properties.distance + " km </div>";
    } else if (properties.type === 'resources' && properties.call_sign !== undefined) {
      detail = "<div style='color: white;width: 266px;font-size: 2em;'> Call Sign: " + properties.call_sign + " <br> Vehicle ID: " + properties.vehicle_id + "<br> Status: " + properties.resource_status + "<br> Distance: " + properties.distance + " km </div>";
    }

    detail = "<div style='color: white;width: 266px;font-size: 2em;'>" + properties.address + '</div>';

    tmpl.Tooltip.add({
      map: mobileMapObj,
      html: detail,
      coordinate: latlong,
      offset: [0, -10],

    });
  }

  showTheCurrentLocation() {
    var addres;
    this.nearbyResources = [];
    this.nearbyEvents = [];


    console.log('showTheCurrentLocation', 'showTheCurrentLocation');

 

    setTimeout(() => {
      tmpl.Map.resize({
        map: mobileMapObj
      });
    }, 1000)


     //this.addMarkerandZoom('myLoc', 'CQ location', 'assets/img/hoysala-icon.png', 12.9716, 77.5946, 35, 60, '')
     if (this.serviceType == 1) {

   this.showPoiLocation();
     }else{
     this.addMarkerandZoom('myLoc', 'CQ location', '/assets/img/hoysala-icon.png',  this.currentLocationData.latitude, this.currentLocationData.longitude, 35, 60, '')
     }
    
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


  this.getAddress();

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

  




  clearAllMarkers() {
try {
  

    tmpl.Layer.clearData({
      map: mobileMapObj,
      layer: 'poiOverlay'
    });


    tmpl.Layer.clearData({
      map: mobileMapObj,
      layer: 'myLoc'
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
  console.log("error",error)
  }
  }














  

 






}
