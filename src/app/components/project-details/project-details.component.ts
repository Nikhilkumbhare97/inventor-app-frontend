import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnChanges {
  @Output() transformerSection = new EventEmitter<boolean>();
  @Output() projectDataLoaded = new EventEmitter<boolean>();
  @Output() createdProjectUniqueId = new EventEmitter<any>();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectUniqueId'] && this.isEditMode) {
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
        this.showSection2 = true;
        this.projectDetailsForm.patchValue({
          ...projectData,
          date: new Date(projectData.date) // Ensure proper date format
        });
        this.projectDataLoaded.emit(true);
      },
      error: (error) => console.error("❌ Error fetching project data:", error)
    });
  }

  get isSection1Valid(): boolean {
    return ['projectName', 'projectNumber', 'clientName'].every(field => this.projectDetailsForm.get(field)?.valid);
  }

  get isSection2Valid(): boolean {
    return ['createdBy', 'preparedBy', 'checkedBy', 'date'].every(field => this.projectDetailsForm.get(field)?.valid);
  }

  nextSection(): void {
    if (this.isSection1Valid) {
      this.showSection2 = true;
    }
  }

  onProjectFormSave(): void {
    if (this.projectDetailsForm.invalid) return;

    const projectData = this.projectDetailsForm.value;
    const saveOperation = this.isEditMode && this.projectUniqueId
      ? this.projectService.updateProject(this.projectUniqueId, projectData)
      : this.projectService.createProject(projectData);

    saveOperation.subscribe({
      next: (data) => {
        this.createdProjectUniqueId.emit(data.projectUniqueId)
        this.showTransformerDetails();
      },
      error: (error) => console.error("❌ Error saving project:", error)
    });
  }

  showTransformerDetails(): void {
    this.projectDetailsForm.disable();
    this.transformerSection.emit(true);
  }
}
