import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConservatorSupportDetailsComponent } from './conservator-support-details.component';

describe('ConservatorSupportDetailsComponent', () => {
  let component: ConservatorSupportDetailsComponent;
  let fixture: ComponentFixture<ConservatorSupportDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConservatorSupportDetailsComponent]
    });
    fixture = TestBed.createComponent(ConservatorSupportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
