import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureViewerComponent } from './capture-viewer.component';

describe('CaptureViewerComponent', () => {
  let component: CaptureViewerComponent;
  let fixture: ComponentFixture<CaptureViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptureViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaptureViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
