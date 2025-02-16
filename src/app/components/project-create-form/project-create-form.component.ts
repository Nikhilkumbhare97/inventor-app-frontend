import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GenerateService } from '../../services/generate.service';
import { AssemblyService } from '../../services/assembly.service';
import { TransformerService } from '../../services/transformer.service';
import { TransformerConfigService } from '../../services/transformerConfig.service';

@Component({
  selector: 'app-project-create-form',
  templateUrl: './project-create-form.component.html',
  styleUrls: ['./project-create-form.component.scss']
})
export class ProjectCreateFormComponent implements OnInit {
  transformerDetailsForm!: FormGroup;
  transformerSection = false;
  tankSection = false;
  lvTrunkingVisible = false;
  topCoverVisible = false;
  tankDetailsData: any;
  topCoverDetailsData: any;
  isEditMode = false;
  projectUniqueId: string | null = null;
  tankDBPayload: any;
  tankInventorPayload: any;
  transformerSaveButtonVisibility: boolean = true;
  generatedProjectUniqueId: string | null = null;
  transformerName: any = '66KV';
  tankSuppressionData: any = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private generateService: GenerateService,
    private assemblyService: AssemblyService,
    private transformerService: TransformerService,
    private transformerConfigService: TransformerConfigService) { }

  ngOnInit(): void {
    this.transformerDetailsForm = this.fb.group({
      transformerType: ['', Validators.required],
      designType: ['', Validators.required]
    })
    this.route.params.subscribe(params => {
      if (params['projectUniqueId']) {
        this.isEditMode = true;
        this.projectUniqueId = params['projectUniqueId'];
      }
    });

    this.transformerDetailsForm.get('transformerType')?.valueChanges.subscribe((value) => {
      this.transformerSaveButtonVisibility = false;
      this.transformerName = value;
    });

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

                this.assemblyService.suppressComponents(this.tankSuppressionData).subscribe({
                  next: response => {
                    console.log('Success:', response);
                    alert(response.message);
                  },
                  error: error => {
                    console.error('Error:', error);
                    alert('Failed to suppress components.');
                  }
                });
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

    if (this.transformerDetailsForm.valid) {
      const transformerDeatils = this.transformerDetailsForm.value;
      const updateData = {
        projectUniqueId: this.generatedProjectUniqueId ? this.generatedProjectUniqueId : (this.projectUniqueId ? this.projectUniqueId : ''),
        transformerType: transformerDeatils.transformerType,
        designType: transformerDeatils.designType
      };

      if (this.isEditMode && this.projectUniqueId) {
        this.transformerService.updateTransformerDetails(this.projectUniqueId, updateData)
          .subscribe({
            next: () => {
              this.transformerDetailsForm.disable();
              this.tankSection = true;
              this.lvTrunkingVisible = true;
              this.transformerSaveButtonVisibility = true;

            },
            error: () => {
              // Handle error (show error message to user)
            }
          });
      } else {
        this.transformerService.saveTransformerDetails(updateData)
          .subscribe({
            next: () => {
              this.transformerDetailsForm.disable();
              this.tankSection = true;
              this.lvTrunkingVisible = true;
              this.transformerSaveButtonVisibility = true;
              this.generateTankSuppressionDetails();
            },
            error: () => {
            }
          });
      }
    }

  }

  loadTransformerDetails() {
    if (!this.projectUniqueId) return;

    this.transformerSection = true;

    this.transformerService.getTransformerDetailsById(this.projectUniqueId).subscribe({
      next: (transformerData) => {
        // Update form with project data
        this.transformerDetailsForm.patchValue({
          transformerType: transformerData.transformerType,
          designType: transformerData.designType,
        });
        if (this.projectUniqueId) { // Ensure it's not null before passing
          this.transformerConfigService.getTransformerConfigDetailsById(String(this.projectUniqueId)).subscribe({
            next: (transformerConfigData) => {
              this.tankDetailsData = transformerConfigData.tankDetails;
              this.tankSection = true;
              this.lvTrunkingVisible = true;
            },
            error: (error) => {
              // Handle error (show error message to user)
            }
          });
        }
      },
      error: (error) => {
        // Handle error (show error message to user)
      }
    });
  }

  showTransformerDetails(eventData: boolean): void {
    this.transformerSection = eventData;
  }

  projectDataLoaded(event: boolean) {
    if (this.isEditMode && this.projectUniqueId && event) {
      this.loadTransformerDetails();
    }
  }

  handleTankDetailsFormSubmit(formData: any): void {
    this.tankDetailsData = formData;

    if (formData) {
      const updatedData = {
        tankDetails: JSON.stringify(formData),
        projectUniqueId: this.generatedProjectUniqueId ? this.generatedProjectUniqueId : (this.projectUniqueId ? this.projectUniqueId : ''),
      }

      if (this.isEditMode && this.projectUniqueId) {
        this.transformerConfigService.updateTransformerConfigDetails(this.projectUniqueId, updatedData)
          .subscribe({
            next: () => {
              this.generateTankSuppressionDetails();
            },
            error: () => {
              // Handle error (show error message to user)
            }
          });
      } else {
        this.transformerConfigService.saveTransformerConfigDetails(updatedData)
          .subscribe({
            next: () => {

              this.generateTankSuppressionDetails();
            },
            error: () => {
            }
          });
      }
    }

  }

  handleLVTrunkingDetailsFormSubmit(formData: any): void {
  }

  handleTopcoverDetailsFormSubmit(formData: any): void {
    this.topCoverDetailsData = formData;
  }

  handleTankPayloads(event: any[]): void {
    this.tankDBPayload = event.flatMap(imageData => imageData.allDimensions);
    this.tankInventorPayload = event.flatMap(imageData => imageData.modifiedFields);

    console.log("Merged allDimensions:", this.tankDBPayload);
    console.log("Merged modifiedFields:", this.tankInventorPayload);
  }

  handleLVTrunkingPayloads(event: any[]): void {

  }

  createdProjectUniqueId(event: any) {
    this.generatedProjectUniqueId = event
  }

  generateTankSuppressionDetails() {
    this.generateService.getSuppressionData(this.tankDetailsData, this.transformerName).subscribe((suppressionData: any) => {
      console.log('Generated Suppression Data:', suppressionData);
      this.tankSuppressionData = suppressionData

      // this.generateService.sendSuppressionData(suppressionData).subscribe((response: any) => {
      //   console.log('Suppression Response:', response);
      // });
    });
  }
}
