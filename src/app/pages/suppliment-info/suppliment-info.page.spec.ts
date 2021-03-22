import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupplimentInfoPage } from './suppliment-info.page';

describe('SupplimentInfoPage', () => {
  let component: SupplimentInfoPage;
  let fixture: ComponentFixture<SupplimentInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplimentInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplimentInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
