import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPage } from './pages/login/login.page';
import { FormsModule } from '@angular/forms';
import { CustomHttpClient } from './services/http-client/http-client';
import { SqliteDb } from './model/sqlitedb';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LoginodometerPage } from './pages/loginodometer/loginodometer.page';
import { HomePage } from './pages/home/home.page';
import { FcmService } from './services/fcm.service';
import { SharedPagesPageModule } from './shared-pages/shared-pages.module';
import { CfsEventListPage } from './pages/cfs-event/cfs-event-list/cfs-event-list.page';
import { CfsEventDetailsPage } from './pages/cfs-event/cfs-event-details/cfs-event-details.page';
import { AtrPage } from './pages/atr/atr.page';
import { LiveStreamPage } from './pages/live-stream/live-stream.page';
import { ConfigrationsPage } from './pages/configrations/configrations.page';
import { ApplicationConfigProvider } from './services/application-cofig/application-config';
import { AudioRecorderPage } from './pages/shared-pages/audio-recorder/audio-recorder.page';
import { TooltipPage } from './pages/tooltip/tooltip.page';
import { LogoutodometerPage } from './pages/logoutodometer/logoutodometer.page';
import { LocationservicePage } from './pages/locationservice/locationservice.page';
import { LocationServicesMapPage } from './pages/location-services-map/location-services-map.page';
import { CommonServices } from './services/common-services/common-services';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { OperatorInfoPage } from './pages/shared-pages/operator-info/operator-info';
import { ElectronService } from './services/electron.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EventHazardousLocationPage } from './pages/cfs-event/model/event-hazardous-location/event-hazardous-location.page';
import { SopInfoPage } from './pages/sop-info/sop-info.page';
import { MapPage } from './pages/map/map.page';
import { NearbyresourcePage } from './pages/nearbyresource/nearbyresource.page';
import { NearbyeventPage } from './pages/nearbyevent/nearbyevent.page';
import { AttendacePage } from './pages/attendace/attendace.page';
import { PatrolchartPage } from './pages/patrolchart/patrolchart.page';
import { TaskPage } from './pages/task/task.page';
import { ReportPage } from './pages/report/report.page';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { ShowPoiPage } from './pages/show-poi/show-poi.page';


export function HttpLoaderFactory(http: HttpClient) {
  //return new TranslateHttpLoader(http, "../www/assets/i18n/", ".json");
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent,LoginPage, LoginodometerPage,HomePage,AtrPage,LiveStreamPage,ConfigrationsPage,OperatorInfoPage,TooltipPage,LogoutodometerPage,LocationservicePage,LocationServicesMapPage,AudioRecorderPage, SopInfoPage, MapPage,
    NearbyresourcePage, NearbyeventPage, AttendacePage, PatrolchartPage, TaskPage, ReportPage, ShowPoiPage,
  ],
  entryComponents: [AudioRecorderPage,TooltipPage,OperatorInfoPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, HttpClientModule,SharedPagesPageModule, SimplePdfViewerModule,ChartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CustomHttpClient,
    SqliteDb,
    FcmService,
    ApplicationConfigProvider,
    CommonServices,
    ElectronService,
    ThemeService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
