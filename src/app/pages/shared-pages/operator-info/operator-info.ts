import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { log } from 'util';

@Component({
    templateUrl: './operator-info.html',
    styleUrls: ['./operator-info.scss']
})
export class OperatorInfoPage {
    cfsData;
    constructor(private navParams: NavParams) {
        this.cfsData = this.navParams.get('cfsData');
        console.log('this.cfsData', this.cfsData);

    }

}