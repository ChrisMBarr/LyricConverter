import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertComponent } from './convert.component';
import { DonateButtonComponent } from '../donate-button/donate-button.component';

describe('ConvertComponent', () => {
  let component: ConvertComponent;
  let fixture: ComponentFixture<ConvertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvertComponent, DonateButtonComponent]
    });
    fixture = TestBed.createComponent(ConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
