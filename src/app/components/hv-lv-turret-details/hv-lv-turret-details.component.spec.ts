import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HvLvTurretDetailsComponent } from './hv-lv-turret-details.component';

describe('HvLvTurretDetailsComponent', () => {
  let component: HvLvTurretDetailsComponent;
  let fixture: ComponentFixture<HvLvTurretDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HvLvTurretDetailsComponent]
    });
    fixture = TestBed.createComponent(HvLvTurretDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
