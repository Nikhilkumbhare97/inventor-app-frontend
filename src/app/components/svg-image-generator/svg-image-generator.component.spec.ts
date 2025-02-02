import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgImageGeneratorComponent } from './svg-image-generator.component';

describe('SvgImageGeneratorComponent', () => {
  let component: SvgImageGeneratorComponent;
  let fixture: ComponentFixture<SvgImageGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgImageGeneratorComponent]
    });
    fixture = TestBed.createComponent(SvgImageGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
