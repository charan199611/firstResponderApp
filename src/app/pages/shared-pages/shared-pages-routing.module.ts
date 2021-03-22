import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedPagesPage } from './shared-pages.page';
import { AudioRecorderPage } from './audio-recorder/audio-recorder.page';
import { OperatorInfoPage } from './operator-info/operator-info';

const routes: Routes = [
  {
    path: '',
    component: SharedPagesPage
  },
  {
    path: 'audio-recorder',
    component:AudioRecorderPage
  },{
    path:'operator-info',
    component:OperatorInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedPagesPageRoutingModule {}
