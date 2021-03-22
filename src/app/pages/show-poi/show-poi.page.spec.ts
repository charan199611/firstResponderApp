import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowPoiPage } from './show-poi.page';

describe('ShowPoiPage', () => {
  let component: ShowPoiPage;
  let fixture: ComponentFixture<ShowPoiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPoiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowPoiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
