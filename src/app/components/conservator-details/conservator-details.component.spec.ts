import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConservatorDetailsComponent } from './conservator-details.component';

describe('ConservatorDetailsComponent', () => {
  let component: ConservatorDetailsComponent;
  let fixture: ComponentFixture<ConservatorDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConservatorDetailsComponent]
    });
    fixture = TestBed.createComponent(ConservatorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
