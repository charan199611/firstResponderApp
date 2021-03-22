import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NearbyeventPage } from './nearbyevent.page';

describe('NearbyeventPage', () => {
  let component: NearbyeventPage;
  let fixture: ComponentFixture<NearbyeventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearbyeventPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NearbyeventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
