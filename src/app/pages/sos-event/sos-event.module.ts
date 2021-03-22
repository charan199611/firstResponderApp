import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SosEventPageRoutingModule } from './sos-event-routing.module';

import { SosEventPage } from './sos-event.page';
import { SosEventListPage } from './sos-event-list/sos-event-list.page';
import { SosEventDetailsPage } from './sos-event-details/sos-event-details.page';
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
    SosEventPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [SosEventPage, SosEventListPage, SosEventDetailsPage]
})
export class SosEventPageModule {}
