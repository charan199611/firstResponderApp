import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CfsEventPage } from './cfs-event.page';
import { CfsEventListPage } from './cfs-event-list/cfs-event-list.page';
import { CfsEventDetailsPage } from './cfs-event-details/cfs-event-details.page';
import { CfsNewPage } from './cfs-new/cfs-new.page';
import { EventAdditionalInfoPage } from './model/event-additional-info/event-additional-info.page';
import { EventHazardousLocationPage } from './model/event-hazardous-location/event-hazardous-location.page';

const routes: Routes = [
  {
    path: '',
    component: CfsEventPage
  },
  {
    path: 'cfs-event-list',
    component: CfsEventListPage
  },
  {
    path: 'cfs-event-details',
    component: CfsEventDetailsPage
  },
  {
    path: 'cfs-new',
    component: CfsNewPage
  },
  {
    path: 'event-additional-info',
    component: EventAdditionalInfoPage
  },





];

 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CfsEventPageRoutingModule { }
