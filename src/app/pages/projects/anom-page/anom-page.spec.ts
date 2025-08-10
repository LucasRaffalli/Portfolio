import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnomPageComponent } from './anom-page';

describe('AnomPage', () => {
  let component: AnomPageComponent;
  let fixture: ComponentFixture<AnomPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnomPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
