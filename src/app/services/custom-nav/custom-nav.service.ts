import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CustomNavService {
  data: any = {};

  constructor(private router: Router, private navCtrl: NavController) { }

  navigateByUrl(url: string, data: any = '') {
    this.data = data;
    this.router.navigateByUrl('/' + url);
  }

  navigateBack(url, data: any = '') {
    this.data = data;
    this.navCtrl.navigateBack('/' + url);
  }

  navigateForward(url, data: any = '') {
    this.data = data;
    this.navCtrl.navigateForward('/' + url);
  }

  navigateRoot(url, data: any = '') {
    this.data = data
    this.navCtrl.navigateRoot(url);
  }

  popPage() {
    this.navCtrl.pop()
  }

  get(key: string) {
    return this.data[key];
  }

  navigateUrlReplace(url: string, data: any = ''){
    this.data = data;
    this.navCtrl.navigateForward('/' + url, { replaceUrl: true });
  }

  popRoute(){
    this.navCtrl.pop();
  }
  
}
