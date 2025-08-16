import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignV2Component } from './design-v2';

describe('DesignV2', () => {
  let component: DesignV2Component;
  let fixture: ComponentFixture<DesignV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignV2Component]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DesignV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
