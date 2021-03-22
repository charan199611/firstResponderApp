import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CfsEventPageRoutingModule } from './cfs-event-routing.module';

import { CfsEventPage } from './cfs-event.page';
import { CfsEventListPage } from './cfs-event-list/cfs-event-list.page';
import { CfsEventDetailsPage } from './cfs-event-details/cfs-event-details.page';
import { CfsNewPage } from './cfs-new/cfs-new.page';
import { AudioRecorderPage } from '../shared-pages/audio-recorder/audio-recorder.page';
import { SharedPagesPageModule } from 'src/app/shared-pages/shared-pages.module';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';
import { EventAdditionalInfoPage } from './model/event-additional-info/event-additional-info.page';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "../www/assets/i18n/", ".json");
  }
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CfsEventPageRoutingModule,
    TranslateModule.forChild()
     ],
  declarations: [CfsEventPage, CfsEventListPage, CfsEventDetailsPage, CfsNewPage, EventAdditionalInfoPage],
  entryComponents: [EventAdditionalInfoPage]
})
export class CfsEventPageModule { }
