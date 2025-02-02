import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-top-cover-details',
  templateUrl: './top-cover-details.component.html',
  styleUrls: ['./top-cover-details.component.scss']
})
export class TopCoverDetailsComponent implements OnInit {
  @Input() topCoverVisible = false;
  @Output() topCoverFormSubmit: EventEmitter<any> = new EventEmitter<any>();
  topCoverDetailsForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.topCoverDetailsForm = this.fb.group({
      topCoverType: ['', Validators.required],
      bigPipe: ['', Validators.required],
      jobLocking: ['', Validators.required]
    });
  }

  onTopCoverDetailsFormSubmit(): void {
    if (this.topCoverDetailsForm.valid) {
      this.topCoverFormSubmit.emit(this.topCoverDetailsForm.value);
    }
  }
}
