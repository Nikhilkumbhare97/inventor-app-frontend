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
  @Output() tankPayloads: EventEmitter<any> = new EventEmitter<any>();
  imageName!: string;
  tankDetailsForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.imageName = '66kv-tank-part1';
    this.tankDetailsForm = this.fb.group({
      tankType: ['', Validators.required],
      jackingPad: ['', Validators.required],
      centreShifter: ['', Validators.required],
      tankMaterial: ['', Validators.required]
    })
  }

  onTankDetailsFormSubmit(): void {
    if (this.tankDetailsForm.valid) {
      this.tankDetailsformSubmit.emit(this.tankDetailsForm.value);
    }
  }

  handleModifiedData(event: any) {
    this.tankPayloads.emit(event);
  }
}
