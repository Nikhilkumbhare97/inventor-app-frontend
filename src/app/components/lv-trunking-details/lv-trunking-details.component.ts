import {
  Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
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
  selector: 'app-lv-trunking-details',
  templateUrl: './lv-trunking-details.component.html',
  styleUrls: ['./lv-trunking-details.component.scss']
})
export class LvTrunkingDetailsComponent implements OnChanges {
  @ViewChild('svgContainer', { static: false }) svgContainer!: ElementRef;
  @Input() lvTrunkingVisible = false;
  @Input() lvTrunkingDetailsData: any = {};
  @Input() isEditMode = false;
  @Input() topCoverVisible = false;
  @Input() transformerName = '';
  @Output() lvTrunckingDetailsformSubmit = new EventEmitter<any>();
  @Output() lvTrunckingPayloads = new EventEmitter<any>();

  lvTrunckingDetailsForm!: FormGroup;
  fieldConfigurations: FieldConfig[] = [];
  imageList: any = [];
  combinedData: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.lvTrunckingDetailsForm = this.fb.group({});
    if (this.lvTrunkingVisible) {
      this.loadConfiguration(this.transformerName);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lvTrunckingDetailsData'] && this.lvTrunckingDetailsForm) {
      //this.patchlvTrunckingDetailsForm();
      this.loadConfiguration(this.transformerName);
    }
  }

  private loadConfiguration(transformerName: string): void {
    this.http.get<Configuration>(`assets/configurations/lvTrunckingConfigurations/${transformerName}.json`)
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

    this.lvTrunckingDetailsForm = this.fb.group(formGroup);
    this.patchlvTrunckingDetailsForm(); // Ensure form gets data if available
  }

  private patchlvTrunckingDetailsForm(): void {
    if (this.isEditMode && this.lvTrunkingDetailsData && this.lvTrunckingDetailsForm) {
      try {
        const parsedData = typeof this.lvTrunkingDetailsData === 'string'
          ? JSON.parse(this.lvTrunkingDetailsData)
          : this.lvTrunkingDetailsData;

        this.lvTrunckingDetailsForm.patchValue(parsedData);
        this.cdRef.detectChanges();
      } catch (error) {
      }
    }
  }

  onlvTrunckingDetailsFormSubmit(): void {
    if (this.lvTrunckingDetailsForm.valid) {
      this.lvTrunckingDetailsformSubmit.emit(this.lvTrunckingDetailsForm.value);
      this.lvTrunckingDetailsForm.disable();
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
    this.lvTrunckingPayloads.emit(this.combinedData);
  }
}
