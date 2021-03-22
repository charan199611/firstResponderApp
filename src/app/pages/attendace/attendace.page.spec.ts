import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttendacePage } from './attendace.page';

describe('AttendacePage', () => {
  let component: AttendacePage;
  let fixture: ComponentFixture<AttendacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendacePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
