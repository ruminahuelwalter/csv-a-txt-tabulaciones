import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertirCvsTextoPaparseComponent } from './convertir-cvs-texto-paparse.component';

describe('ConvertirCvsTextoPaparseComponent', () => {
  let component: ConvertirCvsTextoPaparseComponent;
  let fixture: ComponentFixture<ConvertirCvsTextoPaparseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertirCvsTextoPaparseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertirCvsTextoPaparseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
