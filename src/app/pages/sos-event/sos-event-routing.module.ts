import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SosEventPage } from './sos-event.page';
import { SosEventListPage } from './sos-event-list/sos-event-list.page';
import { SosEventDetailsPage } from './sos-event-details/sos-event-details.page';

const routes: Routes = [
  {
    path: '',
    component: SosEventPage
  },
  {
    path: 'sos-event-list',
    component: SosEventListPage
  },
  {
    path: 'sos-event-details',
    component: SosEventDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SosEventPageRoutingModule {}
