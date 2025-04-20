import {
  Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges,
  OnInit
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
  selector: 'app-conservator-support-details',
  templateUrl: './conservator-support-details.component.html',
  styleUrls: ['./conservator-support-details.component.scss']
})
export class ConservatorSupportDetailsComponent implements OnChanges {

  @ViewChild('svgContainer', { static: false }) svgContainer!: ElementRef;
  @Input() conservatorSupportVisible = false;
  @Input() transformerName = '';
  @Input() isEditMode = false;
  @Input() conservatorSupportDetailsData: any = {};
  @Output() conservatorSupportFormSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() conservatorSupportPayloads = new EventEmitter<any>();
  conservatorSupportDetailsForm!: FormGroup;
  fieldConfigurations: FieldConfig[] = [];
  imageList: any = [];
  combinedData: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.conservatorSupportDetailsForm = this.fb.group({});
    if (this.conservatorSupportVisible) {
      this.loadConfiguration(this.transformerName);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conservatorSupportDetailsData'] && this.conservatorSupportDetailsForm) {
      this.patchconservatorSupportDetailsForm();
    }
  }

  private loadConfiguration(transformerName: string): void {
    this.http.get<Configuration>(`assets/configurations/conservatorSupportConfigurations/${transformerName}.json`)
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

    this.conservatorSupportDetailsForm = this.fb.group(formGroup);
    this.patchconservatorSupportDetailsForm(); // Ensure form gets data if available
  }

  private patchconservatorSupportDetailsForm(): void {

    if (this.isEditMode && this.conservatorSupportDetailsData && this.conservatorSupportDetailsForm) {
      try {
        const parsedData = typeof this.conservatorSupportDetailsData === 'string'
          ? JSON.parse(this.conservatorSupportDetailsData)
          : this.conservatorSupportDetailsData;

        this.conservatorSupportDetailsForm.patchValue(parsedData);

        this.cdRef.detectChanges();
      } catch (error) {
      }
    }
  }

  onconservatorSupportDetailsFormSubmit(): void {
    if (this.conservatorSupportDetailsForm.valid) {
      this.conservatorSupportFormSubmit.emit(this.conservatorSupportDetailsForm.value);
      this.conservatorSupportDetailsForm.disable();
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
    this.conservatorSupportPayloads.emit(this.combinedData);
  }

}
