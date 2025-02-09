import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  isEditMode = false;
  projectUniqueId: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      if (params.projectUniqueId) {
        this.isEditMode = true;
        this.projectUniqueId = params.projectUniqueId;
      }
    });
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
  }
  handleTopcoverDetailsFormSubmit(formData: any): void {
    this.topCoverDetailsData = formData;
  }
}
