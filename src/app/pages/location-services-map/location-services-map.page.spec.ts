import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationServicesMapPage } from './location-services-map.page';

describe('LocationServicesMapPage', () => {
  let component: LocationServicesMapPage;
  let fixture: ComponentFixture<LocationServicesMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationServicesMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationServicesMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
