import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tank-details',
  templateUrl: './tank-details.component.html',
  styleUrls: ['./tank-details.component.scss']
})
export class TankDetailsComponent {
  @ViewChild('svgContainer', { static: false }) svgContainer!: ElementRef;
  @Input() tankSection = false;
  @Input() topCoverVisible = false;
  @Output() tankDetailsformSubmit: EventEmitter<any> = new EventEmitter<any>();
  tankDetailsForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.tankDetailsForm = this.fb.group({
      tankType: ['', Validators.required],
      jackingPad: ['', Validators.required],
      centreShifter: ['', Validators.required],
      tankMaterial: ['', Validators.required],
      d1: ['', Validators.required],
      d2: ['', Validators.required]
    })
  }

  onTankDetailsFormSubmit(): void {
    if (this.tankDetailsForm.valid) {
      this.tankDetailsformSubmit.emit(this.tankDetailsForm.value);
    }
  }

  onSubmit() {
    const inputs = this.svgContainer.nativeElement.querySelectorAll('input');
    const updatedData: any[] = [];

    inputs.forEach((input: any) => {
      updatedData.push({ placeholder: input.placeholder, value: input.value });
    });

    console.log('Updated Input Data:', updatedData);
  }
}
