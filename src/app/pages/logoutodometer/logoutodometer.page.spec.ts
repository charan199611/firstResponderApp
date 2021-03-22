import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogoutodometerPage } from './logoutodometer.page';

describe('LogoutodometerPage', () => {
  let component: LogoutodometerPage;
  let fixture: ComponentFixture<LogoutodometerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutodometerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutodometerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
