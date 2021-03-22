import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SosEventListPage } from './sos-event-list.page';

describe('SosEventListPage', () => {
  let component: SosEventListPage;
  let fixture: ComponentFixture<SosEventListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SosEventListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SosEventListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
