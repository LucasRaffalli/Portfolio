import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuroraPageComponent } from './aurora-page';

describe('AuroraPage', () => {
  let component: AuroraPageComponent;
  let fixture: ComponentFixture<AuroraPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuroraPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuroraPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
