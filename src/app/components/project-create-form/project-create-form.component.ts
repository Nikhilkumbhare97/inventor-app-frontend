import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-create-form',
  templateUrl: './project-create-form.component.html',
  styleUrls: ['./project-create-form.component.scss']
})
export class ProjectCreateFormComponent implements OnInit {
  transformerDetailsForm!: FormGroup;
  transformerSection = false;
  tankSection = false;
  topCoverVisible = false;
  tankDetailsData: any;
  topCoverDetailsData: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.transformerDetailsForm = this.fb.group({
      transformerType: ['', Validators.required],
      designType: ['', Validators.required]
    })
  }

  onDesignTypeChange(): void {
    // Placeholder for handling design type changes
  }

  generate(): void {
    // Placeholder for generate logic
    console.log('Generate clicked');
  }

  ContinueTransformerDetails(): void {
    this.tankSection = true;
  }

  showTransformerDetails(eventData: boolean): void {
    this.transformerSection = eventData;
  }

  handleTankDetailsFormSubmit(formData: any): void {
    this.tankDetailsData = formData;
    this.topCoverVisible = true;
    console.log('Received tank details form data:', formData);
  }
  handleTopcoverDetailsFormSubmit(formData: any): void {
    this.topCoverDetailsData = formData;
  }
}
