import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableSvgComponent } from './editable-svg.component';

describe('EditableSvgComponent', () => {
  let component: EditableSvgComponent;
  let fixture: ComponentFixture<EditableSvgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditableSvgComponent]
    });
    fixture = TestBed.createComponent(EditableSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
