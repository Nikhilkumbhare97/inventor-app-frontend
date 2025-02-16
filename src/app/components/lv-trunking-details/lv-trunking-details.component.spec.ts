import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LvTrunkingDetailsComponent } from './lv-trunking-details.component';

describe('LvTrunkingDetailsComponent', () => {
  let component: LvTrunkingDetailsComponent;
  let fixture: ComponentFixture<LvTrunkingDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LvTrunkingDetailsComponent]
    });
    fixture = TestBed.createComponent(LvTrunkingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
