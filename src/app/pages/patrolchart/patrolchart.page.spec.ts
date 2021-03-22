import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PatrolchartPage } from './patrolchart.page';

describe('PatrolchartPage', () => {
  let component: PatrolchartPage;
  let fixture: ComponentFixture<PatrolchartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrolchartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatrolchartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
