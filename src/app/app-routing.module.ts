import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, NoPreloading } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { LoginodometerPage } from './pages/loginodometer/loginodometer.page';
import { HomePage } from './pages/home/home.page';
import { AtrPage } from './pages/atr/atr.page';
import { LiveStreamPage } from './pages/live-stream/live-stream.page';
import { ConfigrationsPage } from './pages/configrations/configrations.page';
import { AudioRecorderPage } from './pages/shared-pages/audio-recorder/audio-recorder.page';
import { LogoutodometerPage } from './pages/logoutodometer/logoutodometer.page';
import { LocationservicePage } from './pages/locationservice/locationservice.page';
import { LocationServicesMapPage } from './pages/location-services-map/location-services-map.page';
import { MapPage } from './pages/map/map.page';
import { SopInfoPage } from './pages/sop-info/sop-info.page';
import { NearbyeventPage } from './pages/nearbyevent/nearbyevent.page';
import { NearbyresourcePage } from './pages/nearbyresource/nearbyresource.page';
import { AttendacePage } from './pages/attendace/attendace.page';
import { PatrolchartPage } from './pages/patrolchart/patrolchart.page';
import { TaskPage } from './pages/task/task.page';
import { ReportPage } from './pages/report/report.page';
import { ShowPoiPage } from './pages/show-poi/show-poi.page';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'loginodometer',
    component: LoginodometerPage
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'cfs-event',
    loadChildren: () => import('./pages/cfs-event/cfs-event.module').then(m => m.CfsEventPageModule)
  },
  {
    path: 'new-event-alert',
    loadChildren: () => import('./pages/cfs-event/model/new-event-alert/new-event-alert.module').then(m => m.NewEventAlertPageModule)
  },
  {
    path: 'event-hazardous-location',
    loadChildren: () => import('./pages/cfs-event/model/event-hazardous-location/event-hazardous-location.module').then(m => m.EventHazardousLocationPageModule)
  },
  {
    path: 'status-configuration',
    loadChildren: () => import('./pages/cfs-event/model/status-configuration/status-configuration.module').then(m => m.StatusConfigurationPageModule)
  },

  {
    path: 'shared-pages',
    loadChildren: () => import('./shared-pages/shared-pages.module').then(m => m.SharedPagesPageModule)
  },
  {
    path: 'atr',
    component: AtrPage
  },
  {
    path: 'live-stream',
    component: LiveStreamPage
  },
  {
    path: 'configrations',
    component: ConfigrationsPage
  },
  {
    path: 'shared-pages',
    loadChildren: () => import('./pages/shared-pages/shared-pages.module').then(m => m.SharedPagesPageModule)
  }, {
    path: 'logoutodometer',
    component:LogoutodometerPage
  },
  {
    path: 'locationservice',
    component:LocationservicePage
  },
  {
    path: 'location-services-map',
    component:LocationServicesMapPage
  },
  {
    path: 'files',
    loadChildren: () => import('./pages/files/files.module').then( m => m.FilesPageModule)
  },
  {
    path: 'unit-summary',
    loadChildren: () => import('./pages/unit-summary/unit-summary.module').then( m => m.UnitSummaryPageModule)
  },
  {
    path: 'show-poi',
    component:ShowPoiPage
  },
  {
    path: 'suppliment-info',
    loadChildren: () => import('./pages/suppliment-info/suppliment-info.module').then( m => m.SupplimentInfoPageModule)
  },
  {
    path: 'sos-event',
    loadChildren: () => import('./pages/sos-event/sos-event.module').then( m => m.SosEventPageModule)
  },
  {
    path: 'sop-info',
    component:SopInfoPage
  },
  {
    path: 'map',
    component:MapPage
  },
  {
    path: 'status-configuration',
    loadChildren: () => import('./pages/cfs-event/model/status-configuration/status-configuration.module').then( m => m.StatusConfigurationPageModule)
  },
  {
    path: 'nearbyevent',
    component: NearbyeventPage
  },
  {
    path: 'nearbyresource',
    component: NearbyresourcePage
  },
  {
    path: 'attendace',
    component:AttendacePage
  },
  {
    path: 'patrolchart',
    component:PatrolchartPage
  },
  {
    path: 'task',
    component: TaskPage
  },
  {
    path: 'report',
    component:ReportPage
  },
  {
    path: 'iot-incident',
    loadChildren: () => import('./pages/iot-incident/iot-incident.module').then( m => m.IotIncidentPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
