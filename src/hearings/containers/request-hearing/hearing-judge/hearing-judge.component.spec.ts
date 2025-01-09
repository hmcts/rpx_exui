import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { HearingJudgeNamesListComponent } from '../../../components';
import { initialState } from '../../../hearing.test.data';
import { ACTION, HearingJudgeSelectionEnum, MemberType, RadioOptions, RequirementType } from '../../../models/hearings.enum';
import { JudicialUserModel } from '../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsService } from '../../../services/hearings.service';
import { HearingJudgeComponent } from './hearing-judge.component';

describe('HearingJudgeComponent', () => {
  let component: HearingJudgeComponent;
  let fixture: ComponentFixture<HearingJudgeComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const childComponent = jasmine.createSpyObj('HearingJudgeNamesListComponent', ['isExcludeJudgeInputValid']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);
  const judgeInfo: JudicialUserModel = {
    title: 'Mr',
    knownAs: 'Hearing Judge',
    surname: 'Jacky',
    fullName: 'Jacky Collins',
    emailId: 'jacky.collins@judicial.com',
    idamId: '38eb0c5e-29c7-453e-b92d-f2029aaed6c1',
    initials: 'JC',
    postNominals: 'JP',
    personalCode: 'P100001',
    isJudge: '',
    isMagistrate: '',
    isPanelMember: ''
  };
  const judgeTypes: LovRefDataModel[] = [
    {
      key: 'Tribunal',
      value_en: 'Tribunal Judge',
      value_cy: '',
      hint_text_en: 'Tribunal',
      hint_text_cy: '',
      lov_order: 1,
      parent_key: null,
      category_key: 'JudgeType',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null,
      from: 'exui-default'
    },
    {
      key: 'dtj',
      value_en: 'Deputy Tribunal Judge',
      value_cy: '',
      hint_text_en: 'Deputy',
      hint_text_cy: '',
      lov_order: 2,
      parent_key: null,
      category_key: 'JudgeType',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null,
      from: 'exui-default'
    },
    {
      key: 'rtj',
      value_en: 'Regional Tribunal Judge',
      value_cy: '',
      hint_text_en: 'Regional',
      hint_text_cy: '',
      lov_order: 3,
      parent_key: null,
      category_key: 'JudgeType',
      parent_category: '',
      active_flag: 'Y',
      child_nodes: null,
      from: 'exui-default'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [HearingJudgeComponent, HearingJudgeNamesListComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hearingJudgeTypes: judgeTypes,
                judicialUsers: [{ personalCode: 'p1000000' }]
              }
            },
            fragment: of('point-to-me')
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingJudgeComponent);
    component = fixture.componentInstance;
    component.hearingJudgeTypes = judgeTypes;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check specificJudge section', () => {
    component.showSpecificJudge(RadioOptions.YES);
    expect(component.specificJudgeSelection).toBe(RadioOptions.YES);
  });

  it('should check form data', () => {
    component.excludedJudge = childComponent;
    component.excludedJudge.validationError = { id: 'elementId', message: 'Error Message' };
    component.checkFormData();
    component.showExcludeJudgeError();
    expect(childComponent.isExcludeJudgeInputValid).toHaveBeenCalled();
    expect(component.validationErrors.length).toBeGreaterThan(0);
  });

  it('should check RadioButton selection', () => {
    component.hearingJudgeForm.get('specificJudge').setValue(null);
    component.showRadioButtonError();
    expect(component.specificJudgeSelectionError).toBe(HearingJudgeSelectionEnum.SelectionError);
    component.hearingJudgeForm.get('specificJudge').setValue(RadioOptions.NO);
    component.showSpecificJudge(RadioOptions.NO);
    component.showRadioButtonError();
    expect(component.selectJudgeTypesError).toBe(HearingJudgeSelectionEnum.SelectOneJudgeError);
  });

  it('should check RadioButton selection', () => {
    component.showSpecificJudge(RadioOptions.YES);
    expect(component.specificJudgeSelection).toBe(RadioOptions.YES);
    component.hearingJudgeForm.controls.specificJudge.setValue(RadioOptions.YES);
    component.hearingJudgeForm.controls.judgeName.setValue(judgeInfo);
    component.hearingJudgeForm.controls.judgeName.markAsTouched();
    component.showRadioButtonError();
    expect(component.selectJudgeNameError).toBe(HearingJudgeSelectionEnum.ExcludeFullNameJudge);
    component.hearingJudgeForm.controls.judgeName.setValue(null);
    component.showRadioButtonError();
    expect(component.selectJudgeNameError).toBe(HearingJudgeSelectionEnum.ValidNameError);
  });

  it('should check form valid', () => {
    component.excludedJudge = childComponent;
    component.isFormValid();
    expect(childComponent.isExcludeJudgeInputValid).toHaveBeenCalled();
  });

  it('should not allow the same judge name in include and exclude list', () => {
    component.showSpecificJudge(RadioOptions.YES);
    component.hearingJudgeForm.controls.judgeName.setValue(judgeInfo);
    component.excludedJudge.judgeList = [judgeInfo];
    component.isFormValid();
    component.checkSameJudgeSelectionError();
    expect(component.selectJudgeNameError).toBe(HearingJudgeSelectionEnum.SameJudgeInIncludeExcludeList);
    expect(component.isFormValid()).toBeFalsy();
  });

  it('should not validate the same judge name in include and exclude list when no specific judge option selected', () => {
    component.showSpecificJudge(RadioOptions.NO);
    component.hearingJudgeForm.controls.judgeName.setValue(judgeInfo);
    component.excludedJudge.judgeList = [judgeInfo];
    component.isFormValid();
    component.checkSameJudgeSelectionError();
    expect(component.selectJudgeNameError).toBe(null);
  });

  it('should check prepareHearingRequestData', () => {
    component.hearingJudgeForm.controls.specificJudge.setValue(RadioOptions.YES);
    component.hearingJudgeForm.controls.judgeName.setValue(judgeInfo);
    component.prepareHearingRequestData();
    expect(component.hearingRequestMainModel.hearingDetails.panelRequirements.panelPreferences.length).toBe(1);
    component.hearingJudgeForm.controls.judgeName.setValue(judgeInfo);
    component.excludedJudge.judgeList = [judgeInfo];
    component.prepareHearingRequestData();
    expect(component.hearingRequestMainModel.hearingDetails.panelRequirements.panelPreferences.length).toBeGreaterThan(0);
    component.hearingJudgeForm.controls.specificJudge.setValue(RadioOptions.NO);
    component.prepareHearingRequestData();
    expect(component.hearingRequestMainModel.hearingDetails.panelRequirements.roleType.length).toBe(0);
  });

  it('should get getFormData', () => {
    component.hearingRequestMainModel.hearingDetails.panelRequirements = { roleType: ['Tribunal'] };
    component.hearingRequestMainModel.hearingDetails.panelRequirements.panelPreferences = [{
      memberID: 'P000001',
      memberType: MemberType.JUDGE,
      requirementType: RequirementType.EXCLUDE
    }];
    component.getFormData();
    expect(component.hearingJudgeFormInfo.excludedJudges.length).toBe(1);
    expect(component.specificJudgeSelection).toBe(RadioOptions.NO);
    component.hearingRequestMainModel.hearingDetails.panelRequirements.roleType = null;
    component.hearingRequestMainModel.hearingDetails.panelRequirements.panelPreferences = [{
      memberID: 'P000001',
      memberType: MemberType.JUDGE,
      requirementType: RequirementType.MUSTINC
    }];
    component.getFormData();
    expect(component.specificJudgeSelection).toBe(RadioOptions.YES);
  });

  it('should check setFormData', () => {
    component.setFormData();
    expect(component.excludedJudgeList.length).toBe(0);
    const personalCodeJudgeList: JudicialUserModel[] = [{
      title: 'Mr',
      knownAs: 'Jacky Collins',
      surname: 'Jacky Collins',
      fullName: 'Jacky Collins',
      emailId: 'jacky.collins@judicial.com',
      idamId: '1102839232',
      initials: 'JC',
      postNominals: 'JP',
      personalCode: 'P100001',
      isJudge: '',
      isMagistrate: '',
      isPanelMember: ''
    },
    {
      title: 'Mr',
      knownAs: 'Jammie Williams',
      surname: 'Jammie Williams',
      fullName: 'Jammie Williams',
      emailId: 'jammie.williams@judicial.com',
      idamId: '1102839233',
      initials: 'JW',
      postNominals: 'JP',
      personalCode: 'P0000002',
      isJudge: '',
      isMagistrate: '',
      isPanelMember: ''
    }];
    component.specificJudgeSelection = RadioOptions.YES;
    component.hearingJudgeFormInfo.includedJudges = ['P0000001'];
    component.hearingJudgeFormInfo.excludedJudges = ['P0000002'];
    component.personalCodejudgeList = personalCodeJudgeList;
    component.setFormData();
    expect(component.excludedJudgeList.length).toBe(1);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
