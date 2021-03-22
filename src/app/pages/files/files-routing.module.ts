import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilesPage } from './files.page';
import { FileDetailsPage } from './file-details/file-details.page';
import { FileDisplayPage } from './file-display/file-display.page';


const routes: Routes = [
  {
    path: '',
    component: FilesPage
  },
  {
    path: 'file-details',
    component: FileDetailsPage
  },
  {
    path: 'file-display',
    component: FileDisplayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilesPageRoutingModule {}
