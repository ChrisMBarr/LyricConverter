import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  xit('should redirect to Paypal when the button is clicked', () => {
    const btn = fixture.debugElement.query(By.css('.btn'));
    const form: HTMLFormElement = fixture.debugElement.query(By.css('form')).nativeElement;

    spyOn(form, 'submit');
    btn.triggerEventHandler('click', {});

    fixture.detectChanges();

    expect(form.submit).toHaveBeenCalled();
  });
});
