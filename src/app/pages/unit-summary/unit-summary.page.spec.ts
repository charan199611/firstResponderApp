import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnitSummaryPage } from './unit-summary.page';

describe('UnitSummaryPage', () => {
  let component: UnitSummaryPage;
  let fixture: ComponentFixture<UnitSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSummaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnitSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
