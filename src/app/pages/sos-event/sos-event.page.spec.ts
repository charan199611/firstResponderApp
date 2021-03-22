import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SosEventPage } from './sos-event.page';

describe('SosEventPage', () => {
  let component: SosEventPage;
  let fixture: ComponentFixture<SosEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SosEventPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SosEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
