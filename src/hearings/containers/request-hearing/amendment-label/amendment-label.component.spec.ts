import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmendmentLabelStatus } from '../../../models/hearingsUpdateMode.enum';
import { AmendmentLabelComponent } from './amendment-label.component';

describe('AmendmentLabelComponent', () => {
  let component: AmendmentLabelComponent;
  let fixture: ComponentFixture<AmendmentLabelComponent>;
  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmendmentLabelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentLabelComponent);
    nativeElement = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display amended label', () => {
    component.displayLabel = AmendmentLabelStatus.AMENDED;
    fixture.detectChanges();
    const tagElement = nativeElement.querySelector('.govuk-tag');
    expect(tagElement.textContent).toContain('AMENDED');
  });

  it('should display action needed label', () => {
    component.displayLabel = AmendmentLabelStatus.ACTION_NEEDED;
    fixture.detectChanges();
    const tagElement = nativeElement.querySelector('.govuk-tag');
    expect(tagElement.textContent).toContain('ACTION NEEDED');
  });

  it('should display amended label', () => {
    component.displayLabel = AmendmentLabelStatus.WARNING;
    fixture.detectChanges();
    const tagElement = nativeElement.querySelector('.govuk-tag');
    expect(tagElement.textContent).toContain('WARNING');
  });
});
