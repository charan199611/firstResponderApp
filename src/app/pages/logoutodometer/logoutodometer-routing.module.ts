import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutodometerPage } from './logoutodometer.page';

const routes: Routes = [
  {
    path: '',
    component: LogoutodometerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogoutodometerPageRoutingModule {}
