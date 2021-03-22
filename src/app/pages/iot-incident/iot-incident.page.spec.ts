import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IotIncidentPage } from './iot-incident.page';

describe('IotIncidentPage', () => {
  let component: IotIncidentPage;
  let fixture: ComponentFixture<IotIncidentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotIncidentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IotIncidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
