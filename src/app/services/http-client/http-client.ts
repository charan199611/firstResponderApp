import { Injectable, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ApplicationConfigProvider } from '../application-cofig/application-config';

@Injectable()
export class CustomHttpClient {

  watch
  static selectedCompany
  static appUrl = ''
  static operatorUrl = ''
  static adminUrl = ''


  constructor(public http: HttpClient,private appConfig:ApplicationConfigProvider
  ) {


  }

  createAuthorizationHeader1(headers: HttpHeaders) {
    headers.append('content-type', '"application/json;charset=UTF-8"');
    // headers.append('client-id', "TRINITY");
  }

  createAuthorizationHeader(headers: HttpHeaders) {
      // let cc = btoa("admin:admin")
      //   headers.append('Authorization', cc)
      // headers.set('Access-Control-Allow-Origin', '*').set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT').
      // set('Accept', 'application/json').set('content-type', '"application/json;charset=UTF-8"')
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', '"application/json;charset=UTF-8"');
      /*     headers.append('Origin', "http://www.nativescript.org"); */
  }

  createAuthorizationHeaderNg(headers: HttpHeaders) {
    headers.append('content-type', '"application/json;charset=UTF-8"');
    headers.append('client-id', "TRINITY");
  }

  post(url, data) {
    let headers = new HttpHeaders();
  
    // headers.append('content-type', "application/json;charset=utf-8");
    // headers.append('Accept-Charset', 'utf-8');
    // headers.append('content-type','charset=UTF-8;')
    this.createAuthorizationHeader(headers);
    let observable;
          observable = Observable.create(observer => {
        this.http.post(this.appConfig.appServerBackendUrl+url, data, {headers : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })}).subscribe(data => {
          observer.next(data);
        }, error => {
          observer.error(error);
        })
      })
      return observable;
    }

    postWorkForce(url, data) {
      let headers = new HttpHeaders();
      this.createAuthorizationHeader(headers);
      let observable;
            observable = Observable.create(observer => {
          this.http.post(this.appConfig.workForceServerBackendUrl+url, data, {
          }).subscribe(data => {
            observer.next(data);
          }, error => {
            observer.error(error);
          })
        })
        return observable;
      }

      get(url) {
        let headers = new HttpHeaders();
        this.createAuthorizationHeader(headers);
        let observable = Observable.create(observer => {
          this.http.get(this.appConfig.appServerBackendUrl+url,  {
          }).subscribe(data => {
            observer.next(data);
          }, error => {
            observer.error(error);
          })
        })
        return observable;
      }


      getSop(url) {
        let headers = new HttpHeaders();
        this.createAuthorizationHeader(headers);
        let observable = Observable.create(observer => {
          this.http.get(url,  {
          }).subscribe(data => {
            observer.next(data);
          }, error => {
            observer.error(error);
          })
        })
        return observable;
      }

      postData(url, data) {
        let headers = new HttpHeaders();
        this.createAuthorizationHeader(headers);
        let observable;
              observable = Observable.create(observer => {
            this.http.post(url, data, {
            }).subscribe(data => {
              observer.next(data);
            }, error => {
              observer.error(error);
            })
          })
          return observable;
        }

 
    
  }







