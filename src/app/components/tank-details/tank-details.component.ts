import {
  Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

interface FieldConfig {
  type: string;
  name: string;
  label: string;
  options?: { value: string; label: string }[];
  validators?: string[];
  defaultValue?: string;
}

interface Configuration {
  fields: FieldConfig[];
  images: [];
}

@Component({
  selector: 'app-tank-details',
  templateUrl: './tank-details.component.html',
  styleUrls: ['./tank-details.component.scss']
})
export class TankDetailsComponent implements OnChanges {
  @ViewChild('svgContainer', { static: false }) svgContainer!: ElementRef;
  @Input() tankSection = false;
  @Input() tankDetailsData: any = {};
  @Input() isEditMode = false;
  @Input() lvTrunkingVisible = false;
  @Input() transformerName = '';
  @Output() tankDetailsformSubmit = new EventEmitter<any>();
  @Output() tankPayloads = new EventEmitter<any>();

  tankDetailsForm!: FormGroup;
  fieldConfigurations: FieldConfig[] = [];
  imageList: any = [];
  combinedData: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.tankDetailsForm = this.fb.group({});
    if (this.tankSection) {
      this.loadConfiguration(this.transformerName);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tankDetailsData'] && this.tankDetailsForm) {
      this.patchTankDetailsForm();
    }
  }

  private loadConfiguration(transformerName: string): void {
    this.http.get<Configuration>(`assets/configurations/tankConfigurations/${transformerName}.json`)
      .pipe(
        catchError(error => {
          return of(null);
        })
      )
      .subscribe(config => {
        this.fieldConfigurations = config?.fields || [];
        this.imageList = config?.images || []; // Store images separately
        this.buildForm();
      });
  }

  private buildForm(): void {
    const formGroup: Record<string, FormControl> = {};

    this.fieldConfigurations.forEach(field => {
      const validators: ValidatorFn[] = (field.validators || [])
        .map(v => (v === 'required' ? Validators.required : null))
        .filter(Boolean) as ValidatorFn[];

      const defaultValue = this.isEditMode ? '' : field.defaultValue || '';

      formGroup[field.name] = new FormControl(defaultValue, validators);
    });

    this.tankDetailsForm = this.fb.group(formGroup);
    this.patchTankDetailsForm(); // Ensure form gets data if available
  }

  private patchTankDetailsForm(): void {
    if (this.isEditMode && this.tankDetailsData && this.tankDetailsForm) {
      try {
        const parsedData = typeof this.tankDetailsData === 'string'
          ? JSON.parse(this.tankDetailsData)
          : this.tankDetailsData;

        this.tankDetailsForm.patchValue(parsedData);
        this.cdRef.detectChanges();
      } catch (error) {
      }
    }
  }

  onTankDetailsFormSubmit(): void {
    if (this.tankDetailsForm.valid) {
      this.tankDetailsformSubmit.emit(this.tankDetailsForm.value);
      this.tankDetailsForm.disable();
    }
  }

  handleModifiedData(event: any, imageName: string): void {
    // Attach the image name for reference
    const modifiedEvent = { imageName, ...event };

    // Update existing entry if the same image was modified, otherwise add a new one
    const index = this.combinedData.findIndex(data => data.imageName === imageName);
    if (index !== -1) {
      this.combinedData[index] = modifiedEvent;
    } else {
      this.combinedData.push(modifiedEvent);
    }

    // Emit the combined data
    this.tankPayloads.emit(this.combinedData);
  }
}
