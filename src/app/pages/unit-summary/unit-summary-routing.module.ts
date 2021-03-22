import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnitSummaryPage } from './unit-summary.page';
import { UnitSummaryListPage } from './unit-summary-list/unit-summary-list.page';
import { UnitSummaryDetailsPage } from './unit-summary-details/unit-summary-details.page';

const routes: Routes = [
  {
    path: '',
    component: UnitSummaryPage
  },
  {
    path: 'unit-summary-list',
    component: UnitSummaryListPage
  },
  {
    path: 'unit-summary-details',
    component: UnitSummaryDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitSummaryPageRoutingModule {}
