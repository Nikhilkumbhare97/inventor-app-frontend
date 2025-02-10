import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GenerateService } from '../../services/generate.service';
import { AssemblyService } from '../../services/assembly.service';

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
  tankDBPayload: any;
  tankInventorPayload: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private generateService: GenerateService, private assemblyService: AssemblyService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      if (params['projectUniqueId']) {
        this.isEditMode = true;
        this.projectUniqueId = params['projectUniqueId'];
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
    const assemblyPath = "D:\\Project_task\\Projects\\TRANSFORMER\\WIP\\PC0300949_01_01\\MODEL\\PC0300949_03_01.iam";

    this.generateService.createFolder('PC0300949_01_01').subscribe({
      next: (response) => {
        console.log('Folder creation response:', response);
        // Now calling openAssembly
        this.assemblyService.openAssembly(assemblyPath).subscribe({
          next: (assemblyResponse) => {
            console.log('Assembly opened successfully:', assemblyResponse);
            alert(assemblyResponse.message);
          },
          error: (assemblyError) => {
            console.error('Error opening assembly:', assemblyError);
            alert('Failed to open assembly.');
          }
        });
      },
      error: (error) => {
        console.error('Error creating folder:', error);
        alert('Failed to create folder');
        this.assemblyService.openAssembly(assemblyPath).subscribe({
          next: (assemblyResponse) => {
            console.log('Assembly opened successfully:', assemblyResponse);
            alert(assemblyResponse.message);

            const partFilePath = "D:\\Project_task\\Projects\\TRANSFORMER\\WIP\\PC0300949_01_01\\MODEL\\PC0300949_03_01.ipt";
            const parameters = this.tankInventorPayload;

            this.assemblyService.changeParameters(partFilePath, parameters).subscribe({
              next: response => {
                console.log('Success:', response);
                alert(response.message);
              },
              error: error => {
                console.error('Error:', error);
                alert('Failed to update parameters.');
              }
            });
          },
          error: (assemblyError) => {
            console.error('Error opening assembly:', assemblyError);
            alert('Failed to open assembly.');
          }
        });
      }
    });
  }

  ContinueTransformerDetails(): void {
    this.tankSection = true;
  }

  showTransformerDetails(eventData: boolean): void {
    this.transformerSection = eventData;
  }

  handleTankDetailsFormSubmit(formData: any): void {
    this.tankDetailsData = formData;
    //this.topCoverVisible = true;
  }
  handleTopcoverDetailsFormSubmit(formData: any): void {
    this.topCoverDetailsData = formData;
  }

  handleTankPayloads(event: any) {
    this.tankDBPayload = event.allDimensions;
    this.tankInventorPayload = event.modifiedFields
  }
}
