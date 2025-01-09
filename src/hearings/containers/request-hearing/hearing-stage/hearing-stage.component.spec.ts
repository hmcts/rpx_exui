import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorMessage } from '@hmcts/ccd-case-ui-toolkit';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { HearingRequestMainModel } from '../../../models/hearingRequestMain.model';
import { ACTION, HearingStageEnum } from '../../../models/hearings.enum';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsService } from '../../../services/hearings.service';
import { HearingStageComponent } from './hearing-stage.component';

@Component({
  selector: 'exui-hearing-parties-title',
  template: ''
})
class MockHearingPartiesComponent {
  @Input() public error: ErrorMessage;
}

describe('HearingStageComponent', () => {
  let component: HearingStageComponent;
  let fixture: ComponentFixture<HearingStageComponent>;

  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  const source: LovRefDataModel[] = [
    {
      key: 'initial',
      value_en: 'Initial',
      value_cy: '',
      hint_text_en: 'Initial',
      hint_text_cy: '',
      lov_order: 1,
      parent_key: null,
      category_key: 'HearingType',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      key: 'final',
      value_en: 'Final',
      value_cy: '',
      hint_text_en: 'Final',
      hint_text_cy: '',
      lov_order: 2,
      parent_key: null,
      category_key: 'HearingType',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      key: 'substantial',
      value_en: 'Substantial',
      value_cy: '',
      hint_text_en: 'Substantial',
      hint_text_cy: '',
      lov_order: 3,
      parent_key: null,
      category_key: 'HearingType',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      key: 'case-management',
      value_en: 'Case management',
      value_cy: '',
      hint_text_en: 'Case management',
      hint_text_cy: '',
      lov_order: 4,
      parent_key: null,
      category_key: 'HearingType',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [HearingStageComponent, MockHearingPartiesComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hearingStages: source
              }
            },
            fragment: of('point-to-me')
          }
        },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HearingStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and set option collection', () => {
    expect(component).toBeDefined();
    expect(component.hearingStageOptions).toEqual(source);
    expect(component.stageForm.controls['stage-option']).toBeDefined();
  });

  it('should set hearing type', () => {
    fixture.detectChanges();
    expect(component.hearingType).toEqual(initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails.hearingType);
  });

  it('should initialise control value to hearing type from store', () => {
    fixture.detectChanges();
    component.ngAfterViewInit();
    expect(component.stageForm.controls['stage-option'].value).toEqual(initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails.hearingType);
  });

  it('should call unsubscribe', () => {
    spyOn(component.hearingStateSub, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.hearingStateSub.unsubscribe).toHaveBeenCalled();
  });

  it('should be in the same order as service', () => {
    const radioLabels = fixture.debugElement.queryAll(By.css('.govuk-radios__item'));
    expect(radioLabels.length).toBeGreaterThan(0);

    for (let index = 0; index < radioLabels.length; index++) {
      expect(radioLabels[index].nativeElement.innerText).toEqual(source[index].value_en);
    }
  });

  it('should check form data', () => {
    component.stageForm.controls['stage-option'].setValue('Final');
    component.checkFormData();
    expect(component.hearingStageSelectionError).toBe(null);
    component.stageForm.controls['stage-option'].setValue('');
    component.checkFormData();
    expect(component.hearingStageSelectionError).toBe(HearingStageEnum.SelectHearingStageError);
  });

  it('should check form valid', () => {
    component.stageForm.controls['stage-option'].setValue('Final');
    expect(component.isFormValid()).toBe(true);
  });

  it('should execute Action', () => {
    (component as any).hearingRequestMainModel = {} as HearingRequestMainModel;
    component.stageForm.controls['stage-option'].setValue('');
    component.executeAction(ACTION.CONTINUE);
    expect(component.hearingStageSelectionError).toBe(HearingStageEnum.SelectHearingStageError);
    component.stageForm.controls['stage-option'].setValue('Final');
    component.executeAction(ACTION.CONTINUE);
    expect(component.hearingStageSelectionError).toBe(null);
    component.executeAction(ACTION.BACK);
    expect(component.hearingStageSelectionError).toBe(null);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
