import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CfsNewPage } from './cfs-new.page';

describe('CfsNewPage', () => {
  let component: CfsNewPage;
  let fixture: ComponentFixture<CfsNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfsNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CfsNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
