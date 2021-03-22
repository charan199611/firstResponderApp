import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnitSummaryListPage } from './unit-summary-list.page';

describe('UnitSummaryListPage', () => {
  let component: UnitSummaryListPage;
  let fixture: ComponentFixture<UnitSummaryListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSummaryListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnitSummaryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
