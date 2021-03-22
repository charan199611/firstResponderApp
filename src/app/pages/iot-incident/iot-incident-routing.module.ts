import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IotIncidentDetailsPage } from './iot-incident-details/iot-incident-details.page';
import { IotIncidentListPage } from './iot-incident-list/iot-incident-list.page';

import { IotIncidentPage } from './iot-incident.page';

const routes: Routes = [
  {
    path: '',
    component: IotIncidentPage
  },
  {
    path: 'iot-incident-list',
    component:IotIncidentListPage
  },
  {
    path: 'iot-incident-details',
    component:IotIncidentDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IotIncidentPageRoutingModule {}
