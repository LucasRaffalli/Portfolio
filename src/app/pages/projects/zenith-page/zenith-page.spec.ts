import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZenithPageComponent } from './zenith-page';

describe('ZenithPage', () => {
  let component: ZenithPageComponent;
  let fixture: ComponentFixture<ZenithPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZenithPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZenithPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
