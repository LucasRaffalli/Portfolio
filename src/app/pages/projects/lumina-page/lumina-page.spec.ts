import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuminaPageComponent } from './lumina-page';

describe('LuminaPage', () => {
  let component: LuminaPageComponent;
  let fixture: ComponentFixture<LuminaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuminaPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuminaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
