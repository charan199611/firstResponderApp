import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { TooltipPage } from '../tooltip/tooltip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [TooltipPage],
  entryComponents:[TooltipPage]
})
export class HomePageModule {}
