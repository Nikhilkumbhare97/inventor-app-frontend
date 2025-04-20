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
  selector: 'app-hv-lv-turret-details',
  templateUrl: './hv-lv-turret-details.component.html',
  styleUrls: ['./hv-lv-turret-details.component.scss']
})
export class HvLvTurretDetailsComponent implements OnChanges {

  @ViewChild('svgContainer', { static: false }) svgContainer!: ElementRef;
  @Input() lvhvTurretVisible = false;
  @Input() transformerName = '';
  @Input() isEditMode = false;
  @Input() lvhvTurretDetailsData: any = {};
  @Output() lvhvTurretFormSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() lvhvTurretPayloads = new EventEmitter<any>();
  lvhvTurretDetailsForm!: FormGroup;
  fieldConfigurations: FieldConfig[] = [];
  imageList: any = [];
  combinedData: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.lvhvTurretDetailsForm = this.fb.group({});
    if (this.lvhvTurretVisible) {
      this.loadConfiguration(this.transformerName);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lvhvTurretDetailsData'] && this.lvhvTurretDetailsForm) {
      this.patchlvhvTurretDetailsForm();
    }
  }

  private loadConfiguration(transformerName: string): void {
    this.http.get<Configuration>(`assets/configurations/lvhvTurretConfigurations/${transformerName}.json`)
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

    this.lvhvTurretDetailsForm = this.fb.group(formGroup);
    this.patchlvhvTurretDetailsForm(); // Ensure form gets data if available
  }

  private patchlvhvTurretDetailsForm(): void {

    if (this.isEditMode && this.lvhvTurretDetailsData && this.lvhvTurretDetailsForm) {
      try {
        const parsedData = typeof this.lvhvTurretDetailsData === 'string'
          ? JSON.parse(this.lvhvTurretDetailsData)
          : this.lvhvTurretDetailsData;

        this.lvhvTurretDetailsForm.patchValue(parsedData);

        this.cdRef.detectChanges();
      } catch (error) {
      }
    }
  }

  onlvhvTurretDetailsFormSubmit(): void {
    if (this.lvhvTurretDetailsForm.valid) {
      this.lvhvTurretFormSubmit.emit(this.lvhvTurretDetailsForm.value);
      this.lvhvTurretDetailsForm.disable();
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
    this.lvhvTurretPayloads.emit(this.combinedData);
  }

}
