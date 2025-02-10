import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SvgDataService } from '../../services/svg-data.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-editable-svg',
  templateUrl: './editable-svg.component.html',
  styleUrls: ['./editable-svg.component.scss']
})
export class EditableSvgComponent implements OnInit {
  images: string[] = [];
  selectedImage: string = '';
  svgData: any;
  @ViewChild('svgContainer') svgContainer!: ElementRef;
  svgImageElement: any;

  constructor(private svgDataService: SvgDataService, private renderer: Renderer2) {

  }

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.svgDataService.getImageList().subscribe(
      (response: any) => {
        this.images = response;
      },
      (error) => {
        alert(error)
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
      },
      (error) => {
        alert(error)
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
}
