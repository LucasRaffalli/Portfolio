import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSwitcherComponent } from './svg-switcher';

describe('SvgSwitcher', () => {
  let component: SvgSwitcherComponent;
  let fixture: ComponentFixture<SvgSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgSwitcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
