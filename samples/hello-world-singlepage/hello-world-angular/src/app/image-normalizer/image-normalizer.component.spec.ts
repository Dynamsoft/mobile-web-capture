import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageNormalizerComponent } from './image-normalizer.component';

describe('ImageNormalizerComponent', () => {
  let component: ImageNormalizerComponent;
  let fixture: ComponentFixture<ImageNormalizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageNormalizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageNormalizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
