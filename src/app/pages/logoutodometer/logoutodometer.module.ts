import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogoutodometerPageRoutingModule } from './logoutodometer-routing.module';

import { LogoutodometerPage } from './logoutodometer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogoutodometerPageRoutingModule
  ],
  declarations: [LogoutodometerPage]
})
export class LogoutodometerPageModule {}
