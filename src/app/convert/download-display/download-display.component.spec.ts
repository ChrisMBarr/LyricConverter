import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDisplayComponent } from './download-display.component';

describe('DownloadDisplayComponent', () => {
  let component: DownloadDisplayComponent;
  let fixture: ComponentFixture<DownloadDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadDisplayComponent]
    });
    fixture = TestBed.createComponent(DownloadDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
