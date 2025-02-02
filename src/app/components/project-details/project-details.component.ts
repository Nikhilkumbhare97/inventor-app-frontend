import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
  @Output() transformerSection: EventEmitter<boolean> = new EventEmitter<boolean>();
  projectDetailsForm!: FormGroup;
  showSection2 = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.projectDetailsForm = this.fb.group({
      projectName: ['', Validators.required],
      projectNumber: ['', Validators.required],
      projectId: [''],
      clientName: ['', Validators.required],
      createdBy: ['', Validators.required],
      preparedBy: ['', Validators.required],
      checkedBy: ['', Validators.required],
      date: ['', Validators.required]
    });

  }

  get projectDetailsFormSection1Valid(): boolean {
    return !!this.projectDetailsForm.get('projectName')?.valid && !!this.projectDetailsForm.get('projectNumber')?.valid && !!this.projectDetailsForm.get('clientName')?.valid;
  }

  get projectDetailsFormSection2Valid(): boolean {
    return !!this.projectDetailsForm.get('createdBy')?.valid && !!this.projectDetailsForm.get('preparedBy')?.valid && !!this.projectDetailsForm.get('checkedBy')?.valid && !!this.projectDetailsForm.get('date')?.valid;
  }

  nextSection(): void {
    if (this.projectDetailsFormSection1Valid) {
      this.showSection2 = true;
    }
  }

  onProjectFormSubmit(): void {
    if (this.projectDetailsForm.valid) {
      // Handle form submission
      console.log(this.projectDetailsForm.value);

      // Disable all controls after submission
      this.projectDetailsForm.disable();
    }
  }

  showTransformerDetails(): void {
    this.transformerSection.emit(true);
  }
}
