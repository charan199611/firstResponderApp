import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedPagesPageRoutingModule } from './shared-pages-routing.module';

import { SharedPagesPage } from './shared-pages.page';
import { AudioRecorderPage } from './audio-recorder/audio-recorder.page';
import { OperatorInfoPage } from './operator-info/operator-info';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "../www/assets/i18n/", ".json");
  }

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedPagesPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [SharedPagesPage,AudioRecorderPage,OperatorInfoPage],
  exports:[AudioRecorderPage,OperatorInfoPage]
})
export class SharedPagesPageModule {}
