import { Component, Input } from '@angular/core';
import { CapturedImages } from '../../app.component';

@Component({
  selector: 'app-image-container',
  standalone: true,
  imports: [],
  templateUrl: './image-container.component.html',
  styleUrl: './image-container.component.css'
})

export class ImageContainerComponent {
  @Input() showCaptureViewer: boolean = true;
  @Input() switchVisibility: (value: boolean) => void = () => {};
  @Input() images: CapturedImages = {
    originalImage: "",
    detectedImage: ""
  };
}
