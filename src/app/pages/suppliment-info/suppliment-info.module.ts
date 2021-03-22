import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplimentInfoPageRoutingModule } from './suppliment-info-routing.module';

import { SupplimentInfoPage } from './suppliment-info.page';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "../www/assets/i18n/", ".json");
  }

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupplimentInfoPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [SupplimentInfoPage]
})
export class SupplimentInfoPageModule {}
