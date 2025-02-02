import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-svg-image-generator',
  templateUrl: './svg-image-generator.component.html',
  styleUrls: ['./svg-image-generator.component.scss']
})
export class SvgImageGeneratorComponent implements AfterViewInit {
  svgForm: FormGroup;
  inputFields: any[] = [];
  imageUrl: string | ArrayBuffer | null = '';
  private svgBlobUrl: string | null = null;
  imgWidth: number = 1000;
  imgHeight: number = 700;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.svgForm = this.fb.group({});
  }

  ngAfterViewInit() {
    this.addDragAndDrop();
  }

  ngOnDestroy() {
    if (this.svgBlobUrl) {
      URL.revokeObjectURL(this.svgBlobUrl);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const svgContent = e.target?.result as string || '';

        if (file.type === 'image/svg+xml') {
          try {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');

            if (svgDoc.querySelector('parsererror')) {
              console.error('Error parsing SVG file');
              return;
            }

            const foreignObjects = svgDoc.querySelectorAll('foreignObject');
            this.inputFields = [];
            this.svgForm = this.fb.group({});

            foreignObjects.forEach((fo) => {
              const input = fo.querySelector('input');
              if (input) {
                const x = parseInt(fo.getAttribute('x') || '0', 10);
                const y = parseInt(fo.getAttribute('y') || '0', 10);
                const value = input.getAttribute('value') || 'Default';
                const controlName = input.getAttribute('placeholder') || `Field_${this.inputFields.length + 1}`;

                this.svgForm.addControl(controlName, this.fb.control(value, Validators.required));
                this.inputFields.push({
                  x: x,
                  y: y,
                  formControlName: controlName,
                  value: value,
                  isEdited: false
                });
              }
            });

            // Create a Blob URL for the SVG image
            const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
            this.imageUrl = svgUrl;

            this.cd.detectChanges();
            setTimeout(() => this.addDragAndDrop(), 0);

            // Clean up any previous Blob URL
            if (this.svgBlobUrl) {
              URL.revokeObjectURL(this.svgBlobUrl);
            }
            this.svgBlobUrl = svgUrl;

          } catch (error) {
            console.error('Error processing SVG:', error);
          }
        } else {
          // For non-SVG files, read as Data URL
          this.imageUrl = e.target?.result || '';
          this.cd.detectChanges();
        }
      };

      if (file.type === 'image/svg+xml') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  }

  updateFieldName(index: number, event: any) {
    const oldName = this.inputFields[index].formControlName;
    const newName = event.target.value;

    // Get the current value
    const currentValue = this.svgForm.get(oldName)?.value;

    // Remove old control
    this.svgForm.removeControl(oldName);

    // Add new control with the same value
    this.svgForm.addControl(newName, this.fb.control(currentValue, Validators.required));

    // Update the field
    this.inputFields[index].formControlName = newName;
    this.cd.detectChanges();
  }

  removeField(index: number) {
    const fieldToRemove = this.inputFields[index];
    this.svgForm.removeControl(fieldToRemove.formControlName);
    this.inputFields.splice(index, 1);
    this.cd.detectChanges();
  }

  addInputField() {
    const controlName = `Field_${this.inputFields.length + 1}`;
    this.svgForm.addControl(controlName, this.fb.control('Default', Validators.required));
    this.inputFields.push({
      id: Date.now(), // Add unique ID for tracking
      x: 100,
      y: 100,
      formControlName: controlName,
      value: 'Default',
      isEdited: false
    });

    setTimeout(() => this.addDragAndDrop(), 0);
  }

  addDragAndDrop() {
    setTimeout(() => {
      const inputs = document.querySelectorAll('.draggable') as NodeListOf<HTMLElement>;
      inputs.forEach((input, index) => {
        input.onmousedown = (event: MouseEvent) => this.onMouseDown(event, input, index);
      });
    }, 100);
  }

  onMouseDown(event: MouseEvent, input: HTMLElement, index: number) {
    event.preventDefault();
    const shiftX = event.clientX - input.getBoundingClientRect().left;
    const shiftY = event.clientY - input.getBoundingClientRect().top;

    const onMouseMoveBound = (moveEvent: MouseEvent) => this.onMouseMove(moveEvent, input, shiftX, shiftY, index);

    document.addEventListener('mousemove', onMouseMoveBound);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMoveBound);
    });
  }

  onMouseMove(moveEvent: MouseEvent, input: HTMLElement, shiftX: number, shiftY: number, index: number) {
    const newX = moveEvent.clientX - shiftX;
    const newY = moveEvent.clientY - shiftY;

    input.style.left = `${newX}px`;
    input.style.top = `${newY}px`;

    if (this.inputFields[index]) {
      this.inputFields[index].x = newX;
      this.inputFields[index].y = newY;
      this.cd.detectChanges();
    }
  }

  onInputChange(field: any, index: number) {
    const inputValue = this.svgForm.get(field.formControlName)?.value;
    field.isEdited = inputValue !== field.value;
    // Update the value in fields panel
    this.cd.detectChanges();
  }

  onHover(field: any) {
    field.isHovered = true;
  }

  onLeave(field: any) {
    field.isHovered = false;
  }

  generateSVGContent(): string {
    if (!this.imageUrl) return '';

    // Get the image element to read actual dimensions
    const imgElement = document.querySelector('.tank-image') as HTMLImageElement;
    const imgWidth = imgElement?.naturalWidth || this.imgWidth;
    const imgHeight = imgElement?.naturalHeight || this.imgHeight;

    // Start SVG content
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${imgWidth}" height="${imgHeight}" viewBox="0 0 ${imgWidth} ${imgHeight}" 
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;

    // Add the image
    const imageUrlStr = typeof this.imageUrl === 'string' ? this.imageUrl : '';
    svgContent += `
  <image xlink:href="${imageUrlStr}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />`;

    // Add input fields using foreignObject
    this.inputFields.forEach(field => {
      const value = this.svgForm.get(field.formControlName)?.value || '';
      const escapedValue = this.escapeXml(value);

      svgContent += `
  <foreignObject x="${field.x}" y="${field.y}" width="200" height="40">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <input type="text" value="${escapedValue}" 
             placeholder="${field.formControlName}"
             style="background-color: white; padding: 4px; border: 1px solid #ccc; font-size: 14px;" />
    </div>
  </foreignObject>`;
    });

    svgContent += `
</svg>`;

    return svgContent;
  }

  // Helper method to escape XML special characters
  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return '';
      }
    });
  }

  saveSVG() {
    const svgContent = this.generateSVGContent();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-tank-details.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generateSVG() {
    console.log(this.generateSVGContent());
  }

  ngAfterViewChecked() {
    this.addDragAndDrop(); // Ensure dragging applies to new elements
  }

}
