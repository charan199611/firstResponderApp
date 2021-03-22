import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NearbyresourcePage } from './nearbyresource.page';

describe('NearbyresourcePage', () => {
  let component: NearbyresourcePage;
  let fixture: ComponentFixture<NearbyresourcePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearbyresourcePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NearbyresourcePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
