import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
  @Output() transformerSection: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() projectUniqueId: string | null = null;
  @Input() isEditMode = false;
  projectDetailsForm!: FormGroup;
  showSection2 = false;

  constructor(private fb: FormBuilder, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.initForm();

    if (this.isEditMode && this.projectUniqueId) {
      this.loadProjectData();
    }

  }

  private initForm(): void {
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

  private loadProjectData(): void {
    if (!this.projectUniqueId) return;

    this.projectService.getProjectById(this.projectUniqueId).subscribe({
      next: (projectData) => {
        // Show both sections when in edit mode
        this.showSection2 = true;

        // Update form with project data
        this.projectDetailsForm.patchValue({
          projectName: projectData.projectName,
          projectNumber: projectData.projectNumber,
          projectId: projectData.projectId,
          clientName: projectData.clientName,
          createdBy: projectData.createdBy,
          preparedBy: projectData.preparedBy,
          checkedBy: projectData.checkedBy,
          date: new Date(projectData.date)
        });
      },
      error: (error) => {
        // Handle error (show error message to user)
      }
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

  onProjectFormSave(): void {
    if (this.projectDetailsForm.valid) {
      const projectData = this.projectDetailsForm.value;

      if (this.isEditMode && this.projectUniqueId) {
        // In edit mode, only send editable fields
        const updateData = {
          projectName: projectData.projectName,
          projectNumber: projectData.projectNumber,
          projectId: projectData.projectId,
          clientName: projectData.clientName,
          createdBy: projectData.createdBy,
          preparedBy: projectData.preparedBy,
          checkedBy: projectData.checkedBy,
          date: projectData.date
        };

        this.projectService.updateProject(this.projectUniqueId, updateData)
          .subscribe({
            next: (response) => {
              this.showTransformerDetails();
            },
            error: (error) => {
              // Handle error (show error message to user)
            }
          });
      } else {
        // Create new project
        this.projectService.createProject(projectData)
          .subscribe({
            next: (response) => {
              this.showTransformerDetails();
            },
            error: (error) => {
              // Handle error (show error message to user)
            }
          });
      }
    }
  }

  showTransformerDetails(): void {
    this.projectDetailsForm.disable();
    this.transformerSection.emit(true);
  }
}
