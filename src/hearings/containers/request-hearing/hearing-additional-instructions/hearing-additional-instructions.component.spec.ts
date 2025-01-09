import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { ACTION } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import { HearingAdditionalInstructionsComponent } from './hearing-additional-instructions.component';

describe('HearingAdditionalInstructionsComponent', () => {
  let component: HearingAdditionalInstructionsComponent;
  let fixture: ComponentFixture<HearingAdditionalInstructionsComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [HearingAdditionalInstructionsComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('point-to-me')
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingAdditionalInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check form validity', () => {
    spyOn<HearingsService>(hearingsService, 'navigateAction$' as never);
    component.instructionsForm.controls.instructions.setValue('instructions');
    component.executeAction(ACTION.CONTINUE);
    expect(component.isFormValid()).toBeTruthy();
  });

  it('should check AutoListFlag', () => {
    component.initForm();
    component.instructionsForm.controls.instructions.setValue(null);
    component.serviceHearingValuesModel.autoListFlag = true;
    expect(component.getAutoListFlag()).toBeTruthy();
    component.instructionsForm.controls.instructions.setValue('instructions');
    expect(component.getAutoListFlag()).toBeFalsy();
  });

  it('should getListingAutoChangeReasonCode', () => {
    component.initForm();
    component.instructionsForm.controls.instructions.setValue(null);
    component.serviceHearingValuesModel.autoListFlag = true;
    expect(component.getListingAutoChangeReasonCode()).toBeNull();
    component.instructionsForm.controls.instructions.setValue('instructions');
    expect(component.getListingAutoChangeReasonCode()).toBe('user-added-comments');
  });

  it('should sanitise HTML strings', () => {
    const sanitisedString = component.santiseHTML('<h1>this is a test</h1>');
    expect(sanitisedString).toBe('this is a test');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
