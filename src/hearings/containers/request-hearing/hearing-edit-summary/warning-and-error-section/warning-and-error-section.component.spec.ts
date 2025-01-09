import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingsService } from '../../../../../hearings/services/hearings.service';
import { WarningAndErrorSectionComponent } from './warning-and-error-section.component';

describe('WarningAndErrorSectionComponent', () => {
  let component: WarningAndErrorSectionComponent;
  let fixture: ComponentFixture<WarningAndErrorSectionComponent>;
  const hearingService = jasmine.createSpyObj('HearingsService', ['displayValidationError', 'submitUpdatedRequestClicked']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarningAndErrorSectionComponent],
      providers: [{ provide: HearingsService, useValue: hearingService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningAndErrorSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display validation error', () => {
    hearingService.displayValidationError = true;
    hearingService.submitUpdatedRequestClicked = true;
    expect(component.displayValidationError()).toBe(true);
    expect(fixture.debugElement.nativeElement.innerText).toBe('You have not added all the updates. Click the \'Change\' link under any sections labelled \'Action needed\' and then click the continue button at the end of the page to add the changes to the hearing summary. You will not be able to submit the request until this is done.');
  });

  it('should not display validation error', () => {
    hearingService.displayValidationError = false;
    hearingService.submitUpdatedRequestClicked = false;
    expect(component.displayValidationError()).toBe(false);
  });
});
