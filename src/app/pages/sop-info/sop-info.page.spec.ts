import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SopInfoPage } from './sop-info.page';

describe('SopInfoPage', () => {
  let component: SopInfoPage;
  let fixture: ComponentFixture<SopInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SopInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
