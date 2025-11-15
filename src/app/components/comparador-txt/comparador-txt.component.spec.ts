import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparadorTxtComponent } from './comparador-txt.component';

describe('ComparadorTxtComponent', () => {
  let component: ComparadorTxtComponent;
  let fixture: ComponentFixture<ComparadorTxtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparadorTxtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparadorTxtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
