import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventAdditionalInfoPage } from './event-additional-info.page';

describe('EventAdditionalInfoPage', () => {
  let component: EventAdditionalInfoPage;
  let fixture: ComponentFixture<EventAdditionalInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAdditionalInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventAdditionalInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
