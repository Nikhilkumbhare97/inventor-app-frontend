import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { SvgDataService } from '../../services/svg-data.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-editable-svg',
  templateUrl: './editable-svg.component.html',
  styleUrls: ['./editable-svg.component.scss']
})
export class EditableSvgComponent implements OnInit {
  @Input() imageName: string = '';
  @Input() inputOnlyMode: boolean = false;
  @Output() modifiedData = new EventEmitter<any>();
  images: string[] = [];
  selectedImage: string = '';
  svgData: any;
  @ViewChild('svgContainer') svgContainer!: ElementRef;
  svgImageElement: any;
  modifiedFields: any[] = [];
  buttonDisabled: boolean = false;

  constructor(private svgDataService: SvgDataService, private renderer: Renderer2) {

  }

  ngOnInit() {
    if (this.imageName) {
      this.loadImageAndConfig(this.imageName);
    } else {
      this.loadImages();
    }
  }

  loadImages() {
    this.svgDataService.getImageList().subscribe(
      (response: any) => {
        this.images = response;
      },
      (error) => {
        alert(error);
      }
    );
  }

  onImageSelect(event: any) {
    this.selectedImage = event;
    this.loadImageAndConfig(event);
  }

  loadImageAndConfig(imageName: string) {
    this.svgDataService.getSvgData(imageName).subscribe(
      (data: any) => {
        this.svgData = JSON.parse(data.config);
        if (this.inputOnlyMode) {
          this.svgData.dimensions.forEach((dim: any) => {
            dim.inputValue = dim.defaultValue; // Initialize values
          });
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  onDragEnd(event: CdkDragEnd, dim: any) {
    const transform = event.source.getFreeDragPosition();

    // Convert px to rem (assuming 1rem = 16px)
    const deltaX = transform.x / 16;
    const deltaY = transform.y / 16;

    // Add delta to the existing position
    dim.x += deltaX;
    dim.y += deltaY;

    // Reset drag position to avoid accumulation
    event.source._dragRef.reset();

  }

  saveSvgData() {
    if (!this.svgData) return;

    const updatedConfig = {
      imageName: this.selectedImage,
      config: JSON.stringify(this.svgData)
    };

    this.svgDataService.saveSvgData(this.selectedImage, updatedConfig).subscribe(
      (response) => {
        alert('SVG data saved successfully!');
      },
      (error) => {
        alert('Failed to save SVG data.');
      }
    );
  }

  trackChanges(dim: any) {
    const isModified = dim.inputValue !== dim.defaultValue;

    if (isModified) {
      const existingIndex = this.modifiedFields.findIndex(f => f.parameterName === dim.label);
      if (existingIndex === -1) {
        this.modifiedFields.push({
          parameterName: dim.label,
          newValue: dim.inputValue
        });
      } else {
        this.modifiedFields[existingIndex].newValue = dim.inputValue;
      }
    } else {
      this.modifiedFields = this.modifiedFields.filter(f => f.parameterName !== dim.label);
    }

  }

  saveModifiedData() {
    const modifiedFields = this.modifiedFields;
    // Emit modified data to parent
    const allDimensions = this.svgData.dimensions.map((dim: any) => ({
      label: dim.label,
      defaultValue: dim.defaultValue,
      inputValue: dim.inputValue
    }));
    this.modifiedData.emit({ modifiedFields, allDimensions });
    this.buttonDisabled = true;
  }
}
