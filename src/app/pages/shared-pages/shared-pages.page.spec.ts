import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharedPagesPage } from './shared-pages.page';

describe('SharedPagesPage', () => {
  let component: SharedPagesPage;
  let fixture: ComponentFixture<SharedPagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedPagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
