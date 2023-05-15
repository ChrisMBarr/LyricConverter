import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateButtonComponent } from './donate-button.component';

describe('DonateButtonComponent', () => {
  let component: DonateButtonComponent;
  let fixture: ComponentFixture<DonateButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonateButtonComponent],
    });
    fixture = TestBed.createComponent(DonateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
