import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDialogComponent } from './status-dialog.component';

describe('StatusDialogComponent', () => {
  let component: StatusDialogComponent;
  let fixture: ComponentFixture<StatusDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusDialogComponent]
    });
    fixture = TestBed.createComponent(StatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
