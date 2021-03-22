import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FileDisplayPage } from './file-display.page';

describe('FileDisplayPage', () => {
  let component: FileDisplayPage;
  let fixture: ComponentFixture<FileDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDisplayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FileDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
