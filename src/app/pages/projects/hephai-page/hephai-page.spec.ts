import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HephaiPageComponent } from './hephai-page';

describe('HephaiPage', () => {
  let component: HephaiPageComponent;
  let fixture: ComponentFixture<HephaiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HephaiPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HephaiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
