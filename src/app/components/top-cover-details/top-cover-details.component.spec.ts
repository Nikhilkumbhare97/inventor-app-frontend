import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCoverDetailsComponent } from './top-cover-details.component';

describe('TopCoverDetailsComponent', () => {
  let component: TopCoverDetailsComponent;
  let fixture: ComponentFixture<TopCoverDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopCoverDetailsComponent]
    });
    fixture = TestBed.createComponent(TopCoverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
