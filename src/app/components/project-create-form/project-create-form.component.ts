import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  lvhvTurretVisible = false;
  conservatorSupportVisible = false;
  conservatorVisible = false;
  tankDetailsData: any;
  lvTrunkingDetailsData: any;
  topCoverDetailsData: any;
  lvhvTurretDetailsData: any;
  conservatorSupportDetailsData: any;
  conservatorDetailsData: any;
  isEditMode = false;
  projectUniqueId: string | null = null;
  tankDBPayload: any;
  lvTrunkingDBPayload: any;
  topCoverDBPayload: any;
  lvhvTurretDBPayload: any;
  conservatorSupportDBPayload: any;
  conservatorDBPayload: any;
  tankInventorPayload: any;
  lvTrunkingInventorPayload: any;
  topCoverInventorPayload: any;
  lvhvTurretInventorPayload: any;
  conservatorSupportInventorPayload: any;
  conservatorInventorPayload: any;
  transformerSaveButtonVisibility: boolean = true;
  generatedProjectUniqueId: string | null = null;
  transformerName: any = '';
  tankSuppressionData: any = {};
  lvTrunkingSuppressionData: any = {};
  topCoverSuppressionData: any = {};
  lvhvTurretSuppressionData: any = {};
  conservatorSupportSuppressionData: any = {};
  conservatorSuppressionData: any = {};
  tankIpartsIassembliesData: any = {};
  lvTrunkingIpartsIassembliesData: any = {};
  topCoverIpartsIassembliesData: any = {};
  lvhvTurretIpartsIassembliesData: any = {};
  conservatorSupportIpartsIassembliesData: any = {};
  conservatorIpartsIassembliesData: any = {};
  modelRepresentationData: any = {};
  projectDataPayload: any;

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
    });
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
    this.generateService.createFolder('PC0300949_01_01').subscribe({
      next: (response) => {
        if (response.status === 200) {
          alert(response.body.message);  // Success
          this.updateModelStateandRepresentations();
        }
      },
      error: (error) => {
        if (error.status === 409) {
          alert('Folder already exists.');
          this.updateModelStateandRepresentations();
        } else if (error.status === 400) {
          alert('Source folder does not exist.');
        } else if (error.status === 500) {
          alert(error.error?.message || 'Server error during folder copy.');
        } else {
          alert('Unexpected error occurred.');
        }
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
              this.topCoverVisible = true;
              this.lvhvTurretVisible = true;
              this.conservatorSupportVisible = true;
              this.conservatorVisible = true;
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
              this.topCoverVisible = true;
              this.lvhvTurretVisible = true;
              this.conservatorSupportVisible = true;
              this.conservatorVisible = true;
              this.transformerSaveButtonVisibility = true;
              this.generateTankSuppressionDetails();
              this.generateLVTrunkingSuppressionDetails();
              this.generateTopCoverSuppressionDetails();
              this.generateLVHVTurretSuppressionDetails();
              this.generateConservatorSupportSuppressionDetails();
              this.generateConservatorSuppressionDetails();
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
              this.lvTrunkingDetailsData = transformerConfigData.lvTrunkingDetails;
              this.topCoverDetailsData = transformerConfigData.topCoverDetails;
              this.lvhvTurretDetailsData = transformerConfigData.lvHvTurretDetails;
              this.conservatorSupportDetailsData = transformerConfigData.conservatorSupportDetails;
              this.conservatorDetailsData = transformerConfigData.conservatorDetails;
              this.tankSection = true;
              this.lvTrunkingVisible = true;
              this.topCoverVisible = true;
              this.lvhvTurretVisible = true;
              this.conservatorSupportVisible = true;
              this.conservatorVisible = true;
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

  projectData(event: any) {
    if (event) {
      this.projectDataPayload = event;
    }
  }

  handleTankDetailsFormSubmit(formData: any): void {
    this.tankDetailsData = formData;

    if (formData) {
      const updatedData = {
        tankDetails: JSON.stringify(formData),
        projectUniqueId: this.generatedProjectUniqueId ? this.generatedProjectUniqueId : (this.projectUniqueId ? this.projectUniqueId : ''),
      };

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
    this.lvTrunkingDetailsData = formData;

    if (formData) {
      const updatedData = {
        lvTrunkingDetails: JSON.stringify(formData),
        projectUniqueId: this.generatedProjectUniqueId ? this.generatedProjectUniqueId : (this.projectUniqueId ? this.projectUniqueId : ''),
      };

      if (this.isEditMode && this.projectUniqueId) {
        this.transformerConfigService.updateTransformerConfigDetails(this.projectUniqueId, updatedData)
          .subscribe({
            next: () => {
              this.generateLVTrunkingSuppressionDetails();
            },
            error: () => {
              // Handle error (show error message to user)
            }
          });
      } else {
        this.transformerConfigService.saveTransformerConfigDetails(updatedData)
          .subscribe({
            next: () => {

              this.generateLVTrunkingSuppressionDetails();
            },
            error: () => {
            }
          });
      }
    }

  }

  handleTopcoverDetailsFormSubmit(formData: any): void {
    this.topCoverDetailsData = formData;
    if (formData) {
      const updatedData = {
        topCoverDetails: JSON.stringify(formData),
        projectUniqueId: this.generatedProjectUniqueId ? this.generatedProjectUniqueId : (this.projectUniqueId ? this.projectUniqueId : ''),
      };

      if (this.isEditMode && this.projectUniqueId) {
        this.transformerConfigService.updateTransformerConfigDetails(this.projectUniqueId, updatedData)
          .subscribe({
            next: () => {
              this.generateTopCoverSuppressionDetails();
            },
            error: () => {
              // Handle error (show error message to user)
            }
          });
      } else {
        this.transformerConfigService.saveTransformerConfigDetails(updatedData)
          .subscribe({
            next: () => {

              this.generateTopCoverSuppressionDetails();
            },
            error: () => {
            }
          });
      }
    }

  }

  handlelvhvTurretDetailsFormSubmit(formData: any): void {
    this.lvhvTurretDetailsData = formData;
    if (formData) {
      const updatedData = {
        lvHvTurretDetails: JSON.stringify(formData),
        projectUniqueId: this.generatedProjectUniqueId ? this.generatedProjectUniqueId : (this.projectUniqueId ? this.projectUniqueId : ''),
      };

      if (this.isEditMode && this.projectUniqueId) {
        this.transformerConfigService.updateTransformerConfigDetails(this.projectUniqueId, updatedData)
          .subscribe({
            next: () => {
              this.generateLVHVTurretSuppressionDetails();
            },
            error: () => {
              // Handle error (show error message to user)
            }
          });
      } else {
        this.transformerConfigService.saveTransformerConfigDetails(updatedData)
          .subscribe({
            next: () => {

              this.generateLVHVTurretSuppressionDetails();
            },
            error: () => {
            }
          });
      }
    }
  }

  handleConservatorSupportDetailsFormSubmit(formData: any): void {
    this.conservatorSupportDetailsData = formData;
    if (formData) {
      const updatedData = {
        conservatorSupportDetails: JSON.stringify(formData),
        projectUniqueId: this.generatedProjectUniqueId ? this.generatedProjectUniqueId : (this.projectUniqueId ? this.projectUniqueId : ''),
      };

      if (this.isEditMode && this.projectUniqueId) {
        this.transformerConfigService.updateTransformerConfigDetails(this.projectUniqueId, updatedData)
          .subscribe({
            next: () => {
              this.generateConservatorSupportSuppressionDetails();
            },
            error: () => {
              // Handle error (show error message to user)
            }
          });
      } else {
        this.transformerConfigService.saveTransformerConfigDetails(updatedData)
          .subscribe({
            next: () => {

              this.generateConservatorSupportSuppressionDetails();
            },
            error: () => {
            }
          });
      }
    }
  }

  handleConservatorDetailsFormSubmit(formData: any): void {
    this.conservatorDetailsData = formData;
    if (formData) {
      const updatedData = {
        conservatoDetails: JSON.stringify(formData),
        projectUniqueId: this.generatedProjectUniqueId ? this.generatedProjectUniqueId : (this.projectUniqueId ? this.projectUniqueId : ''),
      };

      if (this.isEditMode && this.projectUniqueId) {
        this.transformerConfigService.updateTransformerConfigDetails(this.projectUniqueId, updatedData)
          .subscribe({
            next: () => {
              this.generateConservatorSuppressionDetails();
            },
            error: () => {
              // Handle error (show error message to user)
            }
          });
      } else {
        this.transformerConfigService.saveTransformerConfigDetails(updatedData)
          .subscribe({
            next: () => {

              this.generateConservatorSuppressionDetails();
            },
            error: () => {
            }
          });
      }
    }
  }

  handleTankPayloads(event: any[]): void {
    this.tankDBPayload = event.flatMap(imageData => imageData.allDimensions);
    this.tankInventorPayload = event.flatMap(imageData => imageData.modifiedFields);
  }

  handleLVTrunkingPayloads(event: any[]): void {
    this.lvTrunkingDBPayload = event.flatMap(imageData => imageData.allDimensions);
    this.lvTrunkingInventorPayload = event.flatMap(imageData => imageData.modifiedFields);
  }
  handleTopCoverPayloads(event: any[]): void {
    this.topCoverDBPayload = event.flatMap(imageData => imageData.allDimensions);
    this.topCoverInventorPayload = event.flatMap(imageData => imageData.modifiedFields);
  }

  handlelvhvTurretPayloads(event: any[]): void {
    this.lvhvTurretDBPayload = event.flatMap(imageData => imageData.allDimensions);
    this.lvhvTurretInventorPayload = event.flatMap(imageData => imageData.modifiedFields);
  }

  handleConservatorSupportPayloads(event: any[]): void {
    this.conservatorSupportDBPayload = event.flatMap(imageData => imageData.allDimensions);
    this.conservatorSupportInventorPayload = event.flatMap(imageData => imageData.modifiedFields);
  }

  handleConservatorPayloads(event: any[]): void {
    this.conservatorDBPayload = event.flatMap(imageData => imageData.allDimensions);
    this.conservatorInventorPayload = event.flatMap(imageData => imageData.modifiedFields);
  }

  createdProjectUniqueId(event: any) {
    this.generatedProjectUniqueId = event;
  }

  generateTankSuppressionDetails() {
    this.generateService.getSuppressionData(this.tankDetailsData, this.transformerName, 'tankConfigurations').subscribe((suppressionData: any) => {
      this.tankSuppressionData = suppressionData;
    });
    this.generateService.getIpartsIassembliesData(this.tankDetailsData, this.transformerName, 'tankConfigurations').subscribe((ipartsIassemblies: any) => {
      this.tankIpartsIassembliesData = ipartsIassemblies;
    });
    this.generateService.getModelStateRepresentation(this.tankDetailsData, this.transformerName).subscribe((modelStateData: any) => {
      this.modelRepresentationData = modelStateData?.modelStateObj;
    });
  }

  generateLVTrunkingSuppressionDetails() {
    this.generateService.getSuppressionData(this.lvTrunkingDetailsData, this.transformerName, 'lvTrunckingConfigurations').subscribe((suppressionData: any) => {
      this.lvTrunkingSuppressionData = suppressionData;
    });
    this.generateService.getIpartsIassembliesData(this.lvTrunkingDetailsData, this.transformerName, 'lvTrunckingConfigurations').subscribe((ipartsIassemblies: any) => {
      this.lvTrunkingIpartsIassembliesData = ipartsIassemblies;
    });
  }

  generateTopCoverSuppressionDetails() {
    this.generateService.getSuppressionData(this.topCoverDetailsData, this.transformerName, 'topCoverConfigurations').subscribe((suppressionData: any) => {
      this.topCoverSuppressionData = suppressionData;
    });
    this.generateService.getIpartsIassembliesData(this.topCoverDetailsData, this.transformerName, 'topCoverConfigurations').subscribe((ipartsIassemblies: any) => {
      this.topCoverIpartsIassembliesData = ipartsIassemblies;
    });
  }

  generateLVHVTurretSuppressionDetails() {
    this.generateService.getSuppressionData(this.lvhvTurretDetailsData, this.transformerName, 'lvhvTurretConfigurations').subscribe((suppressionData: any) => {
      this.lvhvTurretSuppressionData = suppressionData;
    });
    this.generateService.getIpartsIassembliesData(this.lvhvTurretDetailsData, this.transformerName, 'lvhvTurretConfigurations').subscribe((ipartsIassemblies: any) => {
      this.lvhvTurretIpartsIassembliesData = ipartsIassemblies;
    });
  }

  generateConservatorSupportSuppressionDetails() {
    this.generateService.getSuppressionData(this.conservatorSupportDetailsData, this.transformerName, 'conservatorSupportConfigurations').subscribe((suppressionData: any) => {
      this.conservatorSupportSuppressionData = suppressionData;
    });
    this.generateService.getIpartsIassembliesData(this.conservatorSupportDetailsData, this.transformerName, 'conservatorSupportConfigurations').subscribe((ipartsIassemblies: any) => {
      this.conservatorSupportIpartsIassembliesData = ipartsIassemblies;
    });
  }

  generateConservatorSuppressionDetails() {
    this.generateService.getSuppressionData(this.conservatorDetailsData, this.transformerName, 'conservatorConfigurations').subscribe((suppressionData: any) => {
      this.conservatorSuppressionData = suppressionData;
    });
    this.generateService.getIpartsIassembliesData(this.conservatorDetailsData, this.transformerName, 'conservatorConfigurations').subscribe((ipartsIassemblies: any) => {
      this.conservatorIpartsIassembliesData = ipartsIassemblies;
    });
  }

  updateModelStateandRepresentations() {
    if (this.modelRepresentationData && this.modelRepresentationData.length > 1) {
      const modelRepresentationPayload = { 'assemblyUpdates': this.modelRepresentationData };
      this.assemblyService.updateModelStateandRepresenation(modelRepresentationPayload).subscribe({
        next: response => {
          alert(response.message);
          this.updateParameters();
        },
        error: error => {
          alert(error.error?.message || 'Failed to update parameters.');
        }
      });
    } else {
      this.updateParameters();
    }
  }

  // Update parameters method
  updateParameters() {

    const parametersPayload = [
      ...(this.tankInventorPayload || []),
      ...(this.lvTrunkingInventorPayload || []),
      ...(this.topCoverInventorPayload || []),
      ...(this.lvhvTurretInventorPayload || []),
      ...(this.conservatorSupportInventorPayload || []),
      ...(this.conservatorInventorPayload || [])
    ];

    //const partFilePath = 'D:\\Project_task\\Projects\\TRANSFORMER\\WIP\\PC0300949_01_01\\MODEL\\PC0300949_03_01.ipt';
    const partFilePath = 'D:\\PROJECTS\\VECTOR\\3D Modelling\\TRANSFORMER\\WIP\\PC0300949_01_01\\MODEL\\PC0300949_03_01.ipt';
    const parameters = parametersPayload;

    if (parametersPayload && parametersPayload.length > 1) {
      this.assemblyService.changeParameters(partFilePath, parameters).subscribe({
        next: response => {
          alert(response.message);
          this.updateSuppressions();
        },
        error: error => {
          alert(error.error?.message || 'Failed to update parameters.');
        }
      });
    } else {
      this.updateSuppressions();
    }
  }

  // Update suppression method
  updateSuppressions() {
    const suppressionsPayload = {
      suppressActions: [
        ...(this.tankSuppressionData?.suppressActions || []),
        ...(this.lvTrunkingSuppressionData?.suppressActions || []),
        ...(this.topCoverSuppressionData?.suppressActions || []),
        ...(this.lvhvTurretSuppressionData?.suppressActions || []),
        ...(this.conservatorSupportSuppressionData?.suppressActions || []),
        ...(this.conservatorSuppressionData?.suppressActions || [])
      ]
    };

    if (suppressionsPayload && suppressionsPayload.suppressActions && suppressionsPayload.suppressActions.length > 1) {
      this.assemblyService.suppressComponents(suppressionsPayload).subscribe({
        next: response => {
          alert(response.message);
          this.updateIpartsIassemblies();
        },
        error: error => {
          alert(error.error?.message || 'Failed to suppress components.');
        }
      });
    } else {
      this.updateIpartsIassemblies();
    }
  }

  // Update IpartsIassemblies method
  updateIpartsIassemblies() {
    const ipartsiassembliesPayload = {
      assemblyUpdates: [
        ...(this.tankIpartsIassembliesData?.iPartsIAssemblies || []),
        ...(this.lvTrunkingIpartsIassembliesData?.iPartsIAssemblies || []),
        ...(this.topCoverIpartsIassembliesData?.iPartsIAssemblies || []),
        ...(this.lvhvTurretIpartsIassembliesData?.iPartsIAssemblies || []),
        ...(this.conservatorSupportIpartsIassembliesData?.iPartsIAssemblies || []),
        ...(this.conservatorIpartsIassembliesData?.iPartsIAssemblies || [])
      ]
    };

    if (ipartsiassembliesPayload && ipartsiassembliesPayload.assemblyUpdates && ipartsiassembliesPayload.assemblyUpdates.length > 1) {
      this.assemblyService.updateIpartsIassemblies(ipartsiassembliesPayload).subscribe({
        next: response => {
          alert(response.message);
          this.updateIproperties();
        },
        error: error => {
          alert(error.error?.message || 'Failed to update iparts iassemblies components.');
        }
      });
    } else {
      this.updateIproperties();
    }
  }

  // Update iproperties method
  updateIproperties() {
    const payload = {
      //drawingspath: "D:\\Project_task\\Projects\\TRANSFORMER\\WIP\\PC0300949_01_01\\MODEL",
      drawingspath: "D:\\PROJECTS\\VECTOR\\3D Modelling\\TRANSFORMER\\WIP\\PC0300949_01_01\\MODEL",
      ipropertiesdetails: {
        "partPrefix": this.projectDataPayload.projectNumber,
        "Project": this.projectDataPayload.projectName,
        "Company": this.projectDataPayload.clientName,
        "Designer": this.projectDataPayload.createdBy,
        "Checked By": this.projectDataPayload.checkedBy,
        "Engr Approved By": this.projectDataPayload.preparedBy,
        "Creation Time": this.formatDate(this.projectDataPayload.date)
      }
    };

    if (payload) {
      this.assemblyService.updateIproperties(payload).subscribe({
        next: response => {
          alert(response.message);
        },
        error: error => {
          alert(error.error?.message || 'Failed to update iparts iassemblies components.');
        }
      });
    } else {
    }
  }

  formatDate(date: string | number | Date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
