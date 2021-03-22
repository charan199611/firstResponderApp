import { Injectable } from '@angular/core';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { MessageServicesService } from '../message-services.service';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
  // [x: string]: any;
})
export class EventsDbService {
  //private eventDetails = new BehaviorSubject({});
  subject = new Subject<any>();

  constructor(private sqliteDb: SqliteDb, private messageService: MessageServicesService, private router: Router) {

  }

  updateEventDetails(eventDetails) {

    //const sql = "UPDATE cfsDetails SET priority = $priority, incident_type = $incident_type, incident_subtype = $incident_subtype WHERE event_id = $eventId";
    console.log('updateeventDetails===>', eventDetails);


    const sql = `UPDATE cfsDetails SET priority = $priority, incident_type = $incident_type, incident_subtype = $incident_subtype,
     nearest_police_station = $nearestPoliceStation, location = $location, distress_place_name = $distressPlaceName, landmark = $landmark,
     mobile_no = $mobileNo, additional = $additional, latitude = $latitude, longitude = $longitude, distress_name = $distress_name,
     start_time = $start_time, place_name = $place_name, geome = $geome, town_name = $town_name, from_user_type = $from_user_type, city_zone_id = $city_zone_id,
     city_id = $city_id, department_id = $department_id, ps_id = $ps_id, received_date_time = $received_date_time,
     read_unread_status = $read_unread_status, msg_type = $msg_type, reply_msg_id = $reply_msg_id, expire_time = $expire_time, from_user_name = $from_user_name, subeventTypeId = $subeventTypeId WHERE event_id = $eventId`;

    const Updatevalues = {
      $eventId: eventDetails.eventid,
      $priority: eventDetails.priority,
      $incident_type: eventDetails.eventtype,
      $incident_subtype: eventDetails.subtype,
      $nearestPoliceStation: eventDetails.policeStation,
      $location: eventDetails.distressAddress,
      $distressPlaceName: eventDetails.distressPlaceName,
      $landmark: eventDetails.landmark,
      $mobileNo: eventDetails.mobile,
      $additional: eventDetails.additionalDetails,
      $latitude: eventDetails.latitude,
      $longitude: eventDetails.longitude,
      $distress_name: eventDetails.distressName,
      $start_time: eventDetails.start_time == null ? moment().format('DD-MM-YYYY HH:mm:ss') : eventDetails.tart_time.trim(),
      $place_name: eventDetails.placename,
      $geome: "",
      $town_name: "",
      $from_user_type: eventDetails.fromUserType,
      $city_zone_id: eventDetails.cityZoneId,
      $city_id: eventDetails.cityId,
      $department_id: eventDetails.deptId,
      $ps_id: eventDetails.psId,
      $received_date_time: "",
      $read_unread_status: "",
      $msg_type: eventDetails.messageType,
      $reply_msg_id: "",
      // $status: 'CFS RECEIVED',
      $expire_time: '',
      $from_user_name: eventDetails.fromUserName,
      $subeventTypeId: eventDetails.eventSubTypeId
      // $statusId: 1
    };



    this.sqliteDb.update(sql, Updatevalues).subscribe(res => {

      console.log(sql);
      console.log(Updatevalues);
      console.log('update res====>', res);
      if (this.router.url == '/cfs-event/cfs-event-details') {
        this.messageService.sendMessage("hotUpdate");
      }
    }, err => {
      console.log('update err====>', err);
    });


  }



  insertEventDetails(eventDetails) {

    if (eventDetails != "") {

      console.log('eventDetails===>', eventDetails);
      console.log('eventDetails===>', eventDetails.eventid, ',,', eventDetails.cityZoneId);
      const sql = `
            INSERT INTO cfsDetails (event_id,basic_id,priority,incident_type,incident_subtype,nearest_police_station,
              location,distress_place_name,landmark,mobile_no,additional,latitude,longitude,distress_name,
              start_time,place_name,geome,town_name,from_user_type,city_zone_id,city_id,department_id,ps_id,received_date_time,
              read_unread_status,msg_type,reply_msg_id,status,expire_time,from_user_name,statusId, subeventTypeId)
            VALUES($eventId,$basic_id,$priority,$incident_type,$incident_subtype,$nearestPoliceStation,$location,
              $distressPlaceName,$landmark,$mobileNo,$additional,$latitude,$longitude,$distress_name,$start_time,
              $place_name,$geome,$town_name,$from_user_type,$city_zone_id,$city_id,$department_id,$ps_id,$received_date_time,
              $read_unread_status,$msg_type,$reply_msg_id,$status,$expire_time,$from_user_name,$statusId, $subeventTypeId)`;


      const values = {
        $eventId: eventDetails.eventid,
        $basic_id: eventDetails.basic_id,
        $priority: eventDetails.priority,
        $incident_type: eventDetails.eventtype,
        $incident_subtype: eventDetails.subtype,
        $nearestPoliceStation: eventDetails.policeStation,
        $location: eventDetails.distressAddress,
        $distressPlaceName: eventDetails.distressPlaceName,
        $landmark: eventDetails.landmark,
        $mobileNo: eventDetails.mobile,
        $additional: eventDetails.additionalDetails,
        $latitude: eventDetails.latitude,
        $longitude: eventDetails.longitude,
        $distress_name: eventDetails.distressName,
        $start_time: eventDetails.starttime == null ? moment().format('YYYY-MM-DD HH:mm:ss') : eventDetails.starttime.trim(),
        $place_name: eventDetails.placename,
        $geome: "",
        $town_name: "",
        $from_user_type: eventDetails.fromUserType,
        $city_zone_id: eventDetails.cityZoneId,
        $city_id: eventDetails.cityId,
        $department_id: eventDetails.deptId,
        $ps_id: eventDetails.psId,
        $received_date_time: "",
        $read_unread_status: "",
        $msg_type: eventDetails.messageType,
        $reply_msg_id: "",
        $status: 'CFS RECEIVED',
        $expire_time: '',
        $from_user_name: eventDetails.fromUserName,
        $statusId: 1,
        $subeventTypeId:eventDetails.eventSubTypeId
      };
      this.sqliteDb.insert(sql, values).subscribe(res => {

        console.log('res====>', res);
      }, err => {
        console.log('err====>', err);
      });
    }
  }

  getEventDetails(eventId) {
    const sql = `SELECT  * FROM cfsDetails WHERE event_id=$id`;
    const values = { $id: eventId };
    /*  this.sqliteDb.selectEventUpdate(sql, values).subscribe((rows) => {
       console.log("row", rows);
        this.subject.next(rows); 
       }, err => {
     });
     return this.subject.asObservable(); */

    this.sqliteDb.selectEventUpdate(sql, values).then((rows) => {
      console.log("row", rows);
      this.subject.next(rows);
    }, err => {
      console.log("row", err);
    }).catch((error) => {
      console.log("row", error);
    })
    return this.subject.asObservable();
  }





  updateEventStatus(statusId, status, eventId) {

    const sql = `UPDATE cfsDetails SET statusId = $statusId,status = $status WHERE event_id=$id`
    const values = { $statusId: statusId, $status: status, $id: eventId };

    this.sqliteDb.update(sql, values).subscribe(res => {
      console.log('updateEventStatus data', res);
    });
  }


  updateEventTypeSubType(incident_type, incident_subtype, subeventTypeId, eventId) {

    console.log("eventId", eventId);

    const sql = `UPDATE cfsDetails SET incident_type = $incident_type,incident_subtype = $incident_subtype,subeventTypeId = $subeventTypeId WHERE event_id=$id`
    const values = { $incident_type: incident_type, $incident_subtype: incident_subtype, $id: eventId, $subeventTypeId: subeventTypeId };

    this.sqliteDb.update(sql, values).subscribe(res => {
      console.log('updateEventStatus data', res);
    });
  }



  updateEventLocation(location, distress_place_name, landmark, latitude, longitude, basicId) {

    console.log("eventId", basicId);

    const sql = `UPDATE cfsDetails SET location = $location,distress_place_name = $distress_place_name, landmark= $landmark, latitude = $latitude, longitude = $longitude  WHERE basic_id=$id`
    const values = { $location: location, $distress_place_name: distress_place_name, $landmark: landmark, $latitude: latitude, $longitude: longitude, $id: basicId };

    this.sqliteDb.update(sql, values).subscribe(res => {
      console.log('updatelocation data', res);
    });
  }

// --------------------IOT DB------------------

updateIotEventDetails(eventDetails) {

  //const sql = "UPDATE cfsDetails SET priority = $priority, incident_type = $incident_type, incident_subtype = $incident_subtype WHERE event_id = $eventId";
  console.log('updateeventDetails===>', eventDetails);


  const sql = `UPDATE iotDetails SET priority = $priority, incident_type = $incident_type, incident_subtype = $incident_subtype,
   nearest_police_station = $nearestPoliceStation, location = $location, distress_place_name = $distressPlaceName, landmark = $landmark,
   mobile_no = $mobileNo, additional = $additional, latitude = $latitude, longitude = $longitude, distress_name = $distress_name,
   start_time = $start_time, place_name = $place_name, geome = $geome, town_name = $town_name, from_user_type = $from_user_type, city_zone_id = $city_zone_id,
   city_id = $city_id, department_id = $department_id, ps_id = $ps_id, received_date_time = $received_date_time,
   read_unread_status = $read_unread_status, msg_type = $msg_type, reply_msg_id = $reply_msg_id, expire_time = $expire_time, from_user_name = $from_user_name, subeventTypeId = $subeventTypeId, livestreamUrl = $livestreamUrl WHERE event_id = $eventId`;

  const Updatevalues = {
    $eventId: eventDetails.eventid,
    $priority: eventDetails.priority,
    $incident_type: eventDetails.eventtype,
    $incident_subtype: eventDetails.subtype,
    $nearestPoliceStation: eventDetails.policeStation,
    $location: eventDetails.distressAddress,
    $distressPlaceName: eventDetails.distressPlaceName,
    $landmark: eventDetails.landmark,
    $mobileNo: eventDetails.mobile,
    $additional: eventDetails.additionalDetails,
    $latitude: eventDetails.latitude,
    $longitude: eventDetails.longitude,
    $distress_name: eventDetails.distressName,
    $start_time: eventDetails.start_time == null ? moment().format('DD-MM-YYYY HH:mm:ss') : eventDetails.tart_time.trim(),
    $place_name: eventDetails.placename,
    $geome: "",
    $town_name: "",
    $from_user_type: eventDetails.fromUserType,
    $city_zone_id: eventDetails.cityZoneId,
    $city_id: eventDetails.cityId,
    $department_id: eventDetails.deptId,
    $ps_id: eventDetails.psId,
    $received_date_time: "",
    $read_unread_status: "",
    $msg_type: eventDetails.messageType,
    $reply_msg_id: "",
    // $status: 'CFS RECEIVED',
    $expire_time: '',
    $from_user_name: eventDetails.fromUserName,
    $subeventTypeId: eventDetails.eventSubTypeId,
    $livestreamUrl: eventDetails.livestreamUrl
    // $statusId: 1
  };



  this.sqliteDb.update(sql, Updatevalues).subscribe(res => {

    console.log(sql);
    console.log(Updatevalues);
    console.log('update res====>', res);
    if (this.router.url == '/iot-incident/iot-incident-details') {
      this.messageService.sendMessage("hotUpdate");
    }
  }, err => {
    console.log('update err====>', err);
  });


}



insertIotEventDetails(eventDetails) {

  if (eventDetails != "") {

    console.log('eventDetails===>', eventDetails);
    console.log('eventDetails===>', eventDetails.eventid, ',,', eventDetails.cityZoneId);
    const sql = `
          INSERT INTO iotDetails (event_id,basic_id,priority,incident_type,incident_subtype,nearest_police_station,
            location,distress_place_name,landmark,mobile_no,additional,latitude,longitude,distress_name,
            start_time,place_name,geome,town_name,from_user_type,city_zone_id,city_id,department_id,ps_id,received_date_time,
            read_unread_status,msg_type,reply_msg_id,status,expire_time,from_user_name,statusId, subeventTypeId, $livestreamUrl)
          VALUES($eventId,$basic_id,$priority,$incident_type,$incident_subtype,$nearestPoliceStation,$location,
            $distressPlaceName,$landmark,$mobileNo,$additional,$latitude,$longitude,$distress_name,$start_time,
            $place_name,$geome,$town_name,$from_user_type,$city_zone_id,$city_id,$department_id,$ps_id,$received_date_time,
            $read_unread_status,$msg_type,$reply_msg_id,$status,$expire_time,$from_user_name,$statusId, $subeventTypeId, $$livestreamUrl)`;


    const values = {
      $eventId: eventDetails.eventid,
      $basic_id: eventDetails.basic_id,
      $priority: eventDetails.priority,
      $incident_type: eventDetails.eventtype,
      $incident_subtype: eventDetails.subtype,
      $nearestPoliceStation: eventDetails.policeStation,
      $location: eventDetails.distressAddress,
      $distressPlaceName: eventDetails.distressPlaceName,
      $landmark: eventDetails.landmark,
      $mobileNo: eventDetails.mobile,
      $additional: eventDetails.additionalDetails,
      $latitude: eventDetails.latitude,
      $longitude: eventDetails.longitude,
      $distress_name: eventDetails.distressName,
      $start_time: eventDetails.starttime == null ? moment().format('YYYY-MM-DD HH:mm:ss') : eventDetails.starttime.trim(),
      $place_name: eventDetails.placename,
      $geome: "",
      $town_name: "",
      $from_user_type: eventDetails.fromUserType,
      $city_zone_id: eventDetails.cityZoneId,
      $city_id: eventDetails.cityId,
      $department_id: eventDetails.deptId,
      $ps_id: eventDetails.psId,
      $received_date_time: "",
      $read_unread_status: "",
      $msg_type: eventDetails.messageType,
      $reply_msg_id: "",
      $status: 'IOT EVENT RECEIVED',
      $expire_time: '',
      $from_user_name: eventDetails.fromUserName,
      $statusId: 1,
      $subeventTypeId:eventDetails.eventSubTypeId,
      $$livestreamUrl: eventDetails.livestreamUrl
    };
    this.sqliteDb.insert(sql, values).subscribe(res => {

      console.log('res====>', res);
    }, err => {
      console.log('err====>', err);
    });
  }
}

getIotEventDetails(eventId) {
  const sql = `SELECT  * FROM iotDetails WHERE event_id=$id`;
  const values = { $id: eventId };
  /*  this.sqliteDb.selectEventUpdate(sql, values).subscribe((rows) => {
     console.log("row", rows);
      this.subject.next(rows); 
     }, err => {
   });
   return this.subject.asObservable(); */

  this.sqliteDb.selectEventUpdate(sql, values).then((rows) => {
    console.log("row", rows);
    this.subject.next(rows);
  }, err => {
    console.log("row", err);
  }).catch((error) => {
    console.log("row", error);
  })
  return this.subject.asObservable();
}





updateIotEventStatus(statusId, status, eventId) {

  const sql = `UPDATE iotDetails SET statusId = $statusId,status = $status WHERE event_id=$id`
  const values = { $statusId: statusId, $status: status, $id: eventId };

  this.sqliteDb.update(sql, values).subscribe(res => {
    console.log('updateEventStatus data', res);
  });
}


updateIotEventTypeSubType(incident_type, incident_subtype, subeventTypeId, eventId) {

  console.log("eventId", eventId);

  const sql = `UPDATE iotDetails SET incident_type = $incident_type,incident_subtype = $incident_subtype,subeventTypeId = $subeventTypeId WHERE event_id=$id`
  const values = { $incident_type: incident_type, $incident_subtype: incident_subtype, $id: eventId, $subeventTypeId: subeventTypeId };

  this.sqliteDb.update(sql, values).subscribe(res => {
    console.log('updateEventStatus data', res);
  });
}



updateIotEventLocation(location, distress_place_name, landmark, latitude, longitude, basicId) {

  console.log("eventId", basicId);

  const sql = `UPDATE iotDetails SET location = $location,distress_place_name = $distress_place_name, landmark= $landmark, latitude = $latitude, longitude = $longitude  WHERE basic_id=$id`
  const values = { $location: location, $distress_place_name: distress_place_name, $landmark: landmark, $latitude: latitude, $longitude: longitude, $id: basicId };

  this.sqliteDb.update(sql, values).subscribe(res => {
    console.log('updatelocation data', res);
  });
}


getIotEventsAll() {
  const sql = 'SELECT * FROM iotDetails';
  this.sqliteDb.selectAll(sql, {}).subscribe((rows) => {
    this.subject.next(rows);
    console.log("rows", rows);
  }, err => {
  });
  return this.subject.asObservable();
}

deleteIotEvent(basicId) {
  const promise = new Promise((resolve, reject) => {
    const sql = `DELETE FROM iotDetails WHERE basic_id=$id`;
    const values = { $id: basicId };
    this.sqliteDb.selectAll(sql, values).subscribe((rows) => {

      console.log('getvehicleDetails', rows);
      resolve(rows)
    }, err => {
      reject(err)
    });
  });

  return promise
}

getWeekCfsIotList(begin, end) {

  const promise = new Promise((resolve, reject) => {
    const sql = "SELECT * FROM iotDetails WHERE strftime('%Y-%m-%d %H:%M:%S', substr(start_time,7,4)||'-'||substr(start_time,4,2)||'-'||substr(start_time,1,2)||' '||substr(start_time,12,8)) >= strftime('%Y-%m-%d %H:%M:%S', $begindate) AND strftime('%Y-%m-%d %H:%M:%S', substr(start_time,7,4)||'-'||substr(start_time,4,2)||'-'||substr(start_time,1,2)||' '||substr(start_time,12,8)) <= strftime('%Y-%m-%d %H:%M:%S', $endDate)";

    //const sql = "SELECT * FROM cfsDetails WHERE "+this.convertDateTime("start_time")+" >= $begindate>";
    const values = { $begindate: begin, $endDate: end };
    this.sqliteDb.selectAll(sql, values).subscribe((rows) => {
      console.log('getWeekCfsList', rows);
      resolve(rows)
    }, err => {
      console.log('getWeekCfsListerr', err.VALUES);
      reject(err)
    });
  });
  return promise;
}



// -----------------End Of IOT DB ---------------




  getVehicleDetails() {

    const promise = new Promise((resolve, reject) => {
      const sql = `SELECT  * FROM vehicleDetails`;
      const values = {};
      this.sqliteDb.selectAll(sql, values).subscribe((rows) => {
        console.log('getvehicleDetails', rows);
        resolve(rows)
      }, err => {
        reject(err)
      });
    });
    return promise
  }

  getEventsAll() {
    const sql = 'SELECT * FROM cfsDetails';
    this.sqliteDb.selectAll(sql, {}).subscribe((rows) => {
      this.subject.next(rows);
      console.log("rows", rows);
    }, err => {
    });
    return this.subject.asObservable();
  }

  deleteEvent(basicId) {
    const promise = new Promise((resolve, reject) => {
      const sql = `DELETE FROM cfsDetails WHERE basic_id=$id`;
      const values = { $id: basicId };
      this.sqliteDb.selectAll(sql, values).subscribe((rows) => {

        console.log('getvehicleDetails', rows);
        resolve(rows)
      }, err => {
        reject(err)
      });
    });

    return promise
  }

  getWeekCfsList(begin, end) {

    const promise = new Promise((resolve, reject) => {
      const sql = "SELECT * FROM cfsDetails WHERE strftime('%Y-%m-%d %H:%M:%S', substr(start_time,7,4)||'-'||substr(start_time,4,2)||'-'||substr(start_time,1,2)||' '||substr(start_time,12,8)) >= strftime('%Y-%m-%d %H:%M:%S', $begindate) AND strftime('%Y-%m-%d %H:%M:%S', substr(start_time,7,4)||'-'||substr(start_time,4,2)||'-'||substr(start_time,1,2)||' '||substr(start_time,12,8)) <= strftime('%Y-%m-%d %H:%M:%S', $endDate)";

      //const sql = "SELECT * FROM cfsDetails WHERE "+this.convertDateTime("start_time")+" >= $begindate>";
      const values = { $begindate: begin, $endDate: end };
      this.sqliteDb.selectAll(sql, values).subscribe((rows) => {
        console.log('getWeekCfsList', rows);
        resolve(rows)
      }, err => {
        console.log('getWeekCfsListerr', err.VALUES);
        reject(err)
      });
    });
    return promise;
  }


  updateUnitSummaryDetails(eventDetails) {


    const sql = `UPDATE unitSummaryDetails SET priority = $priority, incident_type = $incident_type, incident_subtype = $incident_subtype,
     nearest_police_station = $nearestPoliceStation, location = $location, distress_place_name = $distressPlaceName, landmark = $landmark,
     mobile_no = $mobileNo, additional = $additional, latitude = $latitude, longitude = $longitude, distress_name = $distress_name,
     start_time = $start_time, place_name = $place_name, geome = $geome, town_name = $town_name, from_user_type = $from_user_type, city_zone_id = $city_zone_id,
     city_id = $city_id, department_id = $department_id, ps_id = $ps_id, received_date_time = $received_date_time,
     read_unread_status = $read_unread_status, msg_type = $msg_type, reply_msg_id = $reply_msg_id, expire_time = $expire_time, from_user_name = $from_user_name, subeventTypeId = $subeventTypeId WHERE event_id = $eventId`;

    const Updatevalues = {
      $eventId: eventDetails.eventid,
      $priority: eventDetails.priority,
      $incident_type: eventDetails.eventtype,
      $incident_subtype: eventDetails.subtype,
      $nearestPoliceStation: eventDetails.policeStation,
      $location: eventDetails.distressAddress,
      $distressPlaceName: eventDetails.distressPlaceName,
      $landmark: eventDetails.landmark,
      $mobileNo: eventDetails.mobile,
      $additional: eventDetails.additionalDetails,
      $latitude: eventDetails.latitude,
      $longitude: eventDetails.longitude,
      $distress_name: eventDetails.distressName,
      $start_time: eventDetails.start_time == null ? moment().format('DD-MM-YYYY HH:mm:ss') : eventDetails.tart_time.trim(),
      $place_name: eventDetails.placename,
      $geome: "",
      $town_name: "",
      $from_user_type: eventDetails.fromUserType,
      $city_zone_id: eventDetails.cityZoneId,
      $city_id: eventDetails.cityId,
      $department_id: eventDetails.deptId,
      $ps_id: eventDetails.psId,
      $received_date_time: "",
      $read_unread_status: "",
      $msg_type: eventDetails.messageType,
      $reply_msg_id: "",
      // $status: 'CFS RECEIVED',
      $expire_time: '',
      $from_user_name: eventDetails.fromUserName,
      $subeventTypeId: eventDetails.eventSubTypeId
      // $statusId: 1
    };



    this.sqliteDb.update(sql, Updatevalues).subscribe(res => {

      console.log(sql);
      console.log(Updatevalues);
      console.log('update res====>', res);
    }, err => {
      console.log('update err====>', err);
    });
  }



  insertUnitSummaryDetails(eventDetails) {

    console.log("unitsummaryInsert", eventDetails);

    if (eventDetails != "") {

      console.log('eventUnitSummaryDetails===>', eventDetails);
      console.log('eventDetails===>', eventDetails.eventid, ',,', eventDetails.cityZoneId);
      const sql = `
            INSERT INTO unitSummaryDetails (event_id,basic_id,priority,incident_type,incident_subtype,nearest_police_station,
              location,distress_place_name,landmark,mobile_no,additional,latitude,longitude,distress_name,
              start_time,place_name,geome,town_name,from_user_type,city_zone_id,city_id,department_id,ps_id,received_date_time,
              read_unread_status,msg_type,reply_msg_id,status,expire_time,from_user_name,statusId,subeventTypeId)
            VALUES($eventId,$basic_id,$priority,$incident_type,$incident_subtype,$nearestPoliceStation,$location,
              $distressPlaceName,$landmark,$mobileNo,$additional,$latitude,$longitude,$distress_name,$start_time,
              $place_name,$geome,$town_name,$from_user_type,$city_zone_id,$city_id,$department_id,$ps_id,$received_date_time,
              $read_unread_status,$msg_type,$reply_msg_id,$status,$expire_time,$from_user_name,$statusId,$subeventTypeId)`;


      const values = {
        $eventId: eventDetails.eventid,
        $basic_id: eventDetails.basic_id,
        $priority: eventDetails.priority,
        $incident_type: eventDetails.eventtype,
        $incident_subtype: eventDetails.subtype,
        $nearestPoliceStation: eventDetails.policeStation,
        $location: eventDetails.distressAddress,
        $distressPlaceName: eventDetails.distressPlaceName,
        $landmark: eventDetails.landmark,
        $mobileNo: eventDetails.mobile,
        $additional: eventDetails.additionalDetails,
        $latitude: eventDetails.latitude,
        $longitude: eventDetails.longitude,
        $distress_name: eventDetails.distressName,
        $start_time: eventDetails.starttime == null ? moment().format('YYYY-MM-DD HH:mm:ss') : eventDetails.starttime.trim(),
        $place_name: eventDetails.placename,
        $geome: "",
        $town_name: "",
        $from_user_type: eventDetails.fromUserType,
        $city_zone_id: eventDetails.cityZoneId,
        $city_id: eventDetails.cityId,
        $department_id: eventDetails.deptId,
        $ps_id: eventDetails.psId,
        $received_date_time: "",
        $read_unread_status: "",
        $msg_type: eventDetails.messageType,
        $reply_msg_id: "",
        $status: 'CFS RECEIVED',
        $expire_time: '',
        $from_user_name: eventDetails.fromUserName,
        $statusId: 1,
        $subeventTypeId: eventDetails.eventSubTypeId
      };
      this.sqliteDb.insert(sql, values).subscribe(res => {

        console.log('res====>', res);
      }, err => {
        console.log('err====>', err);
      });
    }
  }

  updateUnitSummaryEventStatus(statusId, status, eventId) {

    const sql = `UPDATE unitSummaryDetails SET statusId = $statusId,status = $status WHERE event_id=$id`
    const values = { $statusId: statusId, $status: status, $id: eventId };

    this.sqliteDb.update(sql, values).subscribe(res => {
      console.log('updateEventStatus data', res);
    });
  }


  updateUnitSummaryEventTypeSubType(incident_type, incident_subtype, eventId) {

    console.log("eventId", eventId);

    const sql = `UPDATE unitSummaryDetails SET incident_type = $incident_type,incident_subtype = $incident_subtype WHERE event_id=$id`
    const values = { $incident_type: incident_type, $incident_subtype: incident_subtype, $id: eventId };

    this.sqliteDb.update(sql, values).subscribe(res => {
      console.log('updateEventStatus data', res);
    });
  }

  getUnitSummaryAll() {
    const sql = 'SELECT * FROM unitSummaryDetails';
    this.sqliteDb.selectAll(sql, {}).subscribe((rows) => {
      this.subject.next(rows);
      console.log("rows", rows);
    }, err => {
    });
    return this.subject.asObservable();
  }

  getWeekUnitSummaryList(begin, end) {

    const promise = new Promise((resolve, reject) => {
      const sql = "SELECT * FROM unitSummaryDetails WHERE strftime('%Y-%m-%d %H:%M:%S', substr(start_time,7,4)||'-'||substr(start_time,4,2)||'-'||substr(start_time,1,2)||' '||substr(start_time,12,8)) >= strftime('%Y-%m-%d %H:%M:%S', $begindate) AND strftime('%Y-%m-%d %H:%M:%S', substr(start_time,7,4)||'-'||substr(start_time,4,2)||'-'||substr(start_time,1,2)||' '||substr(start_time,12,8)) <= strftime('%Y-%m-%d %H:%M:%S', $endDate)";

      //const sql = "SELECT * FROM cfsDetails WHERE "+this.convertDateTime("start_time")+" >= $begindate>";
      const values = { $begindate: begin, $endDate: end };
      this.sqliteDb.selectAll(sql, values).subscribe((rows) => {
        console.log('getWeekCfsList', rows);
        resolve(rows)
      }, err => {
        console.log('getWeekCfsListerr', err.VALUES);
        reject(err)
      });
    });
    return promise;
  }

  getUnitSummaryDetails(eventId) {
    const sql = `SELECT  * FROM unitSummaryDetails WHERE event_id=$id`;
    const values = { $id: eventId };
    this.sqliteDb.selectAll(sql, values).subscribe((rows) => { this.subject.next(rows); }, err => {
    });
    return this.subject.asObservable();
  }


  insertSOSEvent(eventDetails){

    if (eventDetails != "") {

      console.log('eventDetails===>', eventDetails);
      console.log('eventDetails===>', eventDetails.eventid, ',,', eventDetails.cityZoneId);
      const sql = `
            INSERT INTO SOSDetails (event_id,basic_id,location,latitude,longitude,nearest_police_station,status,
              received_date_time,priority,incident_subtype,landmark,mobile_no,read_unread_status,image,additional,
              sos_username,department_id,ps_id,city_zone_id,source,sos_user_contact,sos_contact_name1,sos_contact_num1,sos_contact_name2,sos_contact_num2,
              sos_video,reply_msg_id,from_user_type,incident_type,distress_address,city_id,from_user_name,place_name,distress_name,statusId)
            VALUES($event_id,$basic_id,$location,$latitude,$longitude,$nearest_police_station,$status,
              $received_date_time,$priority,$incident_subtype,$landmark,$mobile_no,$read_unread_status,$image,$additional,
              $sos_username,$department_id,$ps_id,$city_zone_id,$source,$sos_user_contact,$sos_contact_name1,$sos_contact_num1,$sos_contact_name2,$sos_contact_num2,
              $sos_video,$reply_msg_id,$from_user_type,$incident_type,$distress_address,$city_id,$from_user_name,$place_name,$distress_name,$statusId)`;


      const values = {
        $event_id: eventDetails.eventid,
        $basic_id: eventDetails.basic_id,
        $location: eventDetails.location,
        $latitude: eventDetails.latitude,
        $longitude: eventDetails.longitude,
        $nearest_police_station: eventDetails.policeStation,
        $status: 'SOS Received',
        $received_date_time: moment().format('DD-MM-YYYY HH:mm:ss'),
        $priority: eventDetails.priority,
        $incident_subtype: eventDetails.subtype,
        $landmark: eventDetails.landmark,
        $mobile_no: eventDetails.mobile,
        $read_unread_status: 'unread',
        $image: eventDetails.image,
        $additional: eventDetails.additionalDetails,
        $sos_username: "",
        $department_id:eventDetails.deptId,
        $ps_id:eventDetails.psId,
        $city_zone_id: eventDetails.cityzoneId,
        $source: "",
        $sos_user_contact:"",
        $sos_contact_name1:"",
        $sos_contact_num1:"",
        $sos_contact_name2:"",
        $sos_contact_num2:"",
        $sos_video:"",
        $reply_msg_id:"",
        $from_user_type: eventDetails.fromUserType,
        $incident_type: eventDetails.eventtype,
        $distress_address: eventDetails.distressAddress,
        $city_id: eventDetails.cityId,
        $from_user_name: eventDetails.fromUserName,
        $place_name:eventDetails.placename,
        $distress_name:eventDetails.distressName,
        $statusId: 1



      };
      this.sqliteDb.insert(sql, values).subscribe(res => {

        console.log('res====>', res);
      }, err => {
        console.log('err====>', err);
      });
    }


  }

  updateSOSEventDetails(eventDetails) {

    const sql = `UPDATE SOSDetails SET location=$location,latitude=$latitude,longitude=$longitude, incident_type=$incident_type,
    nearest_police_station=$nearest_police_station, received_date_time=$received_date_time, priority=$priority,
    incident_subtype=$incident_subtype, landmark=$landmark, mobile_no=$mobile_no,image=$image,additional=$additional,
    sos_username=$sos_username, department_id=$department_id, ps_id= $ps_id, city_zone_id=$city_zone_id, source = $source,
    sos_user_contact = $sos_user_contact, sos_contact_name1= $sos_contact_name1, sos_contact_num1=$sos_contact_num1,sos_contact_name2 = $sos_contact_name2,
    sos_contact_num2= $sos_contact_num2, sos_video = $sos_video,
    reply_msg_id = $reply_msg_id WHERE event_id = $eventId`;

     const Updatevalues = {
      $event_id: eventDetails.eventid,
      $basic_id: eventDetails.basic_id,
      $location: eventDetails.location,
      $latitude: eventDetails.latitude,
      $longitude: eventDetails.longitude,
      $incident_type: eventDetails.eventtype,
      $nearest_police_station: eventDetails.policeStation,
      // $status: 'SOS Received',
      $received_date_time: moment().format('DD-MM-YYYY HH:mm:ss'),
      $priority: eventDetails.priority,
      $incident_subtype: eventDetails.subtype,
      $landmark: eventDetails.landmark,
      $mobile_no: eventDetails.mobile,
      // $read_unread_status: 'unread',
      $image: eventDetails.image,
      $additional: eventDetails.additionalDetails,
      $sos_username: "",
      $department_id:eventDetails.deptId,
      $ps_id:eventDetails.psId,
      $city_zone_id: eventDetails.cityzoneId,
      $source: "",
      $sos_user_contact:"",
      $sos_contact_name1:"",
      $sos_contact_num1:"",
      $sos_contact_name2:"",
      $sos_contact_num2:"",
      $sos_video:"",
      $reply_msg_id:"",
  
     }



    this.sqliteDb.update(sql, Updatevalues).subscribe(res => {

      console.log(sql);
      console.log(Updatevalues);
      console.log('update res====>', res);
    }, err => {
      console.log('update err====>', err);
    });
  }




  getSOSEventDetails(eventId) {
    const sql = `SELECT  * FROM SOSDetails WHERE event_id=$id`;
    const values = { $id: eventId };
    /*  this.sqliteDb.selectEventUpdate(sql, values).subscribe((rows) => {
       console.log("row", rows);
        this.subject.next(rows); 
       }, err => {
     });
     return this.subject.asObservable(); */

    this.sqliteDb.selectEventUpdate(sql, values).then((rows) => {
      console.log("row", rows);
      this.subject.next(rows);
    }, err => {
      console.log("row", err);
    }).catch((error) => {
      console.log("row", error);
    })
    return this.subject.asObservable();
  }

  getAllSOSEvents() {
    const sql = 'SELECT * FROM SOSDetails';
    this.sqliteDb.selectAll(sql, {}).subscribe((rows) => {
      this.subject.next(rows);
      console.log("rows", rows);
    }, err => {
    });
    return this.subject.asObservable();
  }

  getWeekSOSList(begin, end) {

    const promise = new Promise((resolve, reject) => {
      const sql = "SELECT * FROM SOSDetails WHERE strftime('%Y-%m-%d %H:%M:%S', substr(received_date_time,7,4)||'-'||substr(received_date_time,4,2)||'-'||substr(received_date_time,1,2)||' '||substr(received_date_time,12,8)) >= strftime('%Y-%m-%d %H:%M:%S', $begindate) AND strftime('%Y-%m-%d %H:%M:%S', substr(received_date_time,7,4)||'-'||substr(received_date_time,4,2)||'-'||substr(received_date_time,1,2)||' '||substr(received_date_time,12,8)) <= strftime('%Y-%m-%d %H:%M:%S', $endDate)";

      //const sql = "SELECT * FROM cfsDetails WHERE "+this.convertDateTime("start_time")+" >= $begindate>";
      const values = { $begindate: begin, $endDate: end };
      this.sqliteDb.selectAll(sql, values).subscribe((rows) => {
        console.log('getWeekSOSList', rows);
        resolve(rows)
      }, err => {
        console.log('getWeekSOSListner', err.VALUES);
        reject(err)
      });
    });
    return promise;
  }


  deleteSOSEvent(basicId) {
    const promise = new Promise((resolve, reject) => {
      const sql = `DELETE FROM SOSDetails WHERE basic_id=$id`;
      const values = { $id: basicId };
      this.sqliteDb.selectAll(sql, values).subscribe((rows) => {

        console.log('getvehicleDetails', rows);
        resolve(rows)
      }, err => {
        reject(err)
      });
    });

    return promise
  }


  updateSOSEventStatus(statusId, status, eventId) {

    const sql = `UPDATE SOSDetails SET statusId = $statusId,status = $status WHERE event_id=$id`
    const values = { $statusId: statusId, $status: status, $id: eventId };

    this.sqliteDb.update(sql, values).subscribe(res => {
      console.log('updateSOSEventStatus data', res);
    });
  }


  inserAtrOption(atrText){
    const sql = `
    INSERT INTO atr_options (atr_texts)
    VALUES($atr_texts)`;


const values = {
$atr_texts: atrText,
};
this.sqliteDb.insert(sql, values).subscribe(res => {

console.log('res====>', res);
}, err => {
console.log('err====>', err);
});
}
  

fetchAtrOption(){
  const promise = new Promise((resolve, reject) => {
    const sql = `SELECT  * FROM atr_options`;
    const values = {};
    this.sqliteDb.selectAll(sql, values).subscribe((rows) => {
      console.log('getAtrOption', rows);
      resolve(rows)
    }, err => {
      reject(err)
    });
  });
  return promise
}


}
