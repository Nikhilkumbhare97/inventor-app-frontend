import {
  Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges,
  OnInit,
  QueryList,
  ViewChildren
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
  selector: 'app-conservator-details',
  templateUrl: './conservator-details.component.html',
  styleUrls: ['./conservator-details.component.scss']
})
export class ConservatorDetailsComponent implements OnChanges {

  @ViewChild('svgContainer', { static: false }) svgContainer!: ElementRef;
  @ViewChildren('accordionBody') accordionBodies!: QueryList<ElementRef>;
  @Input() conservatorVisible = false;
  @Input() transformerName = '';
  @Input() isEditMode = false;
  @Input() conservatorDetailsData: any = {};
  @Output() conservatorFormSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() conservatorPayloads = new EventEmitter<any>();
  conservatorDetailsForm!: FormGroup;
  fieldConfigurations: FieldConfig[] = [];
  imageList: any = [];
  combinedData: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.conservatorDetailsForm = this.fb.group({});
    if (this.conservatorVisible) {
      this.loadConfiguration(this.transformerName);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conservatorDetailsData'] && this.conservatorDetailsForm) {
      this.patchconservatorDetailsForm();
    }
  }

  private loadConfiguration(transformerName: string): void {
    this.http.get<Configuration>(`assets/configurations/conservatorConfigurations/${transformerName}.json`)
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

    this.conservatorDetailsForm = this.fb.group(formGroup);
    this.patchconservatorDetailsForm(); // Ensure form gets data if available
  }

  private patchconservatorDetailsForm(): void {

    if (this.isEditMode && this.conservatorDetailsData && this.conservatorDetailsForm) {
      try {
        const parsedData = typeof this.conservatorDetailsData === 'string'
          ? JSON.parse(this.conservatorDetailsData)
          : this.conservatorDetailsData;

        this.conservatorDetailsForm.patchValue(parsedData);

        this.cdRef.detectChanges();
      } catch (error) {
      }
    }
  }

  onconservatorDetailsFormSubmit(): void {
    if (this.conservatorDetailsForm.valid) {
      this.conservatorFormSubmit.emit(this.conservatorDetailsForm.value);
      this.conservatorDetailsForm.disable();
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
    this.conservatorPayloads.emit(this.combinedData);
  }

  scrollToBody(imageName: string) {
    const bodyRef = this.accordionBodies.find(ref =>
      ref.nativeElement.closest('.accordion-collapse')?.id === 'collapse' + imageName
    );
    if (bodyRef) {
      bodyRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
