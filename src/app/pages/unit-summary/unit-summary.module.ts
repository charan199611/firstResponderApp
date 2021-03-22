import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnitSummaryPageRoutingModule } from './unit-summary-routing.module';

import { UnitSummaryPage } from './unit-summary.page';
import { UnitSummaryListPage } from './unit-summary-list/unit-summary-list.page';
import { UnitSummaryDetailsPage } from './unit-summary-details/unit-summary-details.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "../www/assets/i18n/", ".json");
  }

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnitSummaryPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [UnitSummaryPage, UnitSummaryListPage, UnitSummaryDetailsPage]
})
export class UnitSummaryPageModule {}
