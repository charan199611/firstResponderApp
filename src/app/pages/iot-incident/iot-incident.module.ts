import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IotIncidentPageRoutingModule } from './iot-incident-routing.module';

import { IotIncidentPage } from './iot-incident.page';
import { IotIncidentListPage } from './iot-incident-list/iot-incident-list.page';
import { IotIncidentDetailsPage } from './iot-incident-details/iot-incident-details.page';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "../www/assets/i18n/", ".json");
  }

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IotIncidentPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [IotIncidentPage, IotIncidentListPage, IotIncidentDetailsPage]
})
export class IotIncidentPageModule {}
