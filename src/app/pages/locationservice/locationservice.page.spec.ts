import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationservicePage } from './locationservice.page';

describe('LocationservicePage', () => {
  let component: LocationservicePage;
  let fixture: ComponentFixture<LocationservicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationservicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationservicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
