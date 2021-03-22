import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IotIncidentListPage } from './iot-incident-list.page';

describe('IotIncidentListPage', () => {
  let component: IotIncidentListPage;
  let fixture: ComponentFixture<IotIncidentListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotIncidentListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IotIncidentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
