import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ImageNormalizerComponent } from './image-normalizer/image-normalizer.component';
import { VideoNormalizerComponent } from './video-normalizer/video-normalizer.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageNormalizerComponent,
    VideoNormalizerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
