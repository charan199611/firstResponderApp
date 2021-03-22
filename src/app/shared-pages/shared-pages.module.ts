import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedPagesPageRoutingModule } from './shared-pages-routing.module';
import { NewEventAlertPage } from '../pages/cfs-event/model/new-event-alert/new-event-alert.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { EventHazardousLocationPage } from '../pages/cfs-event/model/event-hazardous-location/event-hazardous-location.page';
import { StatusConfigurationPage } from '../pages/cfs-event/model/status-configuration/status-configuration.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedPagesPageRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

  ],
  exports: [NewEventAlertPage, EventHazardousLocationPage, StatusConfigurationPage],
  declarations: [NewEventAlertPage, EventHazardousLocationPage, StatusConfigurationPage],
  entryComponents: [NewEventAlertPage, EventHazardousLocationPage, StatusConfigurationPage]
})
export class SharedPagesPageModule { }
