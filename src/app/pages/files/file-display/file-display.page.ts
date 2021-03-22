import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomNavService } from 'src/app/services/custom-nav/custom-nav.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SimplePdfViewerComponent } from 'simple-pdf-viewer';
import { TranslateService } from '@ngx-translate/core';

import { CustomHttpClient } from 'src/app/services/http-client/http-client';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.page.html',
  styleUrls: ['./file-display.page.scss'],
})
export class FileDisplayPage implements OnInit {

  mediaType: any;
  mediaFile: any;
  mediaImage: any;
  mediaVideo: any;
  mediaPdf: any;
  mediaAudio: any;
  mediaExcel: any;

  showimage = false;
  showVideo = false;
  showPdf = false;
  showAudio = false;
  showExcel = false;
  
 
   private pdfViewer: SimplePdfViewerComponent;
  constructor(private customNavService: CustomNavService,
    public sanitizer: DomSanitizer, private translateService: TranslateService, private httpClient: CustomHttpClient,
    private http: HttpClient) {

    this.mediaType = this.customNavService.get('mediaType');
  
    this.mediaFile = this.customNavService.get('media');

    console.log(this.mediaFile);
    console.log(this.mediaType);

    this.showMedia();
  

   }

 

   showFile(){

    saveAs("http://oss.sheetjs.com/test_files/formula_stress_test.xlsx", "GSDSADH.xlsx");

   }

   showMedia(){
     if(this.mediaType == 1){

       this.showimage = true;
       this.showVideo = false;
       this.showPdf = false;
       this.showAudio = false;
       this.showExcel = false;
       this.mediaImage = this.mediaFile;
      this.mediaVideo= "movie.mp4";
      

     }else if(this.mediaType == 2){
       
      this.showimage = false;
      this.showVideo = true;
      this.showPdf = false;
      this.showAudio = false;
      this.showExcel = false;
      this.mediaVideo = this.mediaFile;
      this.mediaImage = "show.png"
     }else if(this.mediaType == 3){

      this.showimage = false;
      this.showVideo = false;
      this.showPdf = true;
      this.showAudio = false;
      this.showExcel = false;
      this.mediaPdf = this.mediaFile;

      console.log("pdf", this.mediaFile);
    

     }else if(this.mediaType == 4){
      this.showimage = false;
      this.showVideo = false;
      this.showPdf = false;
      this.showAudio = true;
      this.showExcel = false;
      this.mediaAudio = this.mediaFile;

      console.log("audio", this.mediaFile);
     }else if(this.mediaType == 5){
      this.showimage = false;
      this.showVideo = false;
      this.showPdf = false;
      this.showAudio = false;
      this.showExcel = true;
      this.mediaExcel = this.mediaFile;
     
      console.log("Excel", this.mediaFile);
     }
   }

 

  ngOnInit() {


  }

  // showExcel(){
   
  //  }




}
