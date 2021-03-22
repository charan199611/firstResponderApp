import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilesPageRoutingModule } from './files-routing.module';

import { FilesPage } from './files.page';
import { FileDetailsPage } from './file-details/file-details.page';
import { FileDisplayPage } from './file-display/file-display.page';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
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
    FilesPageRoutingModule,
    SimplePdfViewerModule,
    TranslateModule.forChild()
  
  ],
  declarations: [FilesPage, FileDetailsPage, FileDisplayPage]
})
export class FilesPageModule {}
