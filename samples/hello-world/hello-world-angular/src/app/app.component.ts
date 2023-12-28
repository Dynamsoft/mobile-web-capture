import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CaptureViewerComponent } from './components/capture-viewer/capture-viewer.component';
import { ImageContainerComponent } from "./components/image-container/image-container.component";

export interface CapturedImages {
  originalImage: string,
  detectedImage: string
}

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
      CommonModule,
      RouterOutlet,
      CaptureViewerComponent,
      ImageContainerComponent,
    ],
})

export class AppComponent {
  showCaptureViewer: boolean = true;
  images: CapturedImages = {
    originalImage: '',
    detectedImage: ''
  };
  switchVisibility = (value: boolean) => {
    this.showCaptureViewer = value
  };
  setImages = (value: CapturedImages) => {
    this.images =  value;
  };
}
