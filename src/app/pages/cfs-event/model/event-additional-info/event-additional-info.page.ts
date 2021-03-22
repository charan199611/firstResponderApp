import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-event-additional-info',
  templateUrl: './event-additional-info.page.html',
  styleUrls: ['./event-additional-info.page.scss'],
})
export class EventAdditionalInfoPage implements OnInit {

  constructor(private modalCtrl: ModalController ) { }

  ngOnInit() {
  }


  cancel(){
    console.log("closeModal")
    this.closeModal();
  }


  closeModal() {
    this.modalCtrl.dismiss();
    // this.notificationData = "";
  
  }

}
