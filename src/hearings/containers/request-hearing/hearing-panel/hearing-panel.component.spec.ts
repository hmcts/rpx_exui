import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { HearingJudgeNamesListComponent } from '../../../components';
import { initialState } from '../../../hearing.test.data';
import { ACTION, MemberType, RadioOptions, RequirementType } from '../../../models/hearings.enum';
import { JudicialUserModel } from '../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../models/lovRefData.model';
import { HearingsService } from '../../../services/hearings.service';
import { HearingPanelComponent } from './hearing-panel.component';

describe('HearingPanelComponent', () => {
  let component: HearingPanelComponent;
  let fixture: ComponentFixture<HearingPanelComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  const OTHER_PANEL_ROLES: LovRefDataModel[] = [
    {
      category_key: 'PanelMemberType',
      key: 'BBA3-DQPM',
      value_en: 'Disability Qualified Panel Member',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'PanelMemberType',
      key: 'BBA3-MQPM2',
      value_en: 'Medically Qualified Panel Member',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: [
        {
          category_key: 'PanelMemberSpecialism',
          key: 'BBA3-MQPM2-003',
          value_en: 'Eye Surgeon',
          value_cy: '',
          hint_text_en: '',
          hint_text_cy: '',
          lov_order: null,
          parent_category: 'PanelMemberType',
          parent_key: 'BBA3-MQPM2',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          category_key: 'PanelMemberSpecialism',
          key: 'BBA3-MQPM2-004',
          value_en: 'General Practitioner',
          value_cy: '',
          hint_text_en: '',
          hint_text_cy: '',
          lov_order: null,
          parent_category: 'PanelMemberType',
          parent_key: 'BBA3-MQPM2',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          category_key: 'PanelMemberSpecialism',
          key: 'BBA3-MQPM2-001',
          value_en: 'Cardiologist',
          value_cy: '',
          hint_text_en: '',
          hint_text_cy: '',
          lov_order: null,
          parent_category: 'PanelMemberType',
          parent_key: 'BBA3-MQPM2',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          category_key: 'PanelMemberSpecialism',
          key: 'BBA3-MQPM2-002',
          value_en: 'Carer',
          value_cy: '',
          hint_text_en: '',
          hint_text_cy: '',
          lov_order: null,
          parent_category: 'PanelMemberType',
          parent_key: 'BBA3-MQPM2',
          active_flag: 'Y',
          child_nodes: null
        }
      ]
    },
    {
      category_key: 'PanelMemberType',
      key: 'BBA3-MQPM1',
      value_en: 'Medically Qualified Panel Member',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: [
        {
          category_key: 'PanelMemberSpecialism',
          key: 'BBA3-MQPM1-001',
          value_en: 'Cardiologist',
          value_cy: '',
          hint_text_en: '',
          hint_text_cy: '',
          lov_order: null,
          parent_category: 'PanelMemberType',
          parent_key: 'BBA3-MQPM1',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          category_key: 'PanelMemberSpecialism',
          key: 'BBA3-MQPM1-002',
          value_en: 'Carer',
          value_cy: '',
          hint_text_en: '',
          hint_text_cy: '',
          lov_order: null,
          parent_category: 'PanelMemberType',
          parent_key: 'BBA3-MQPM1',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          category_key: 'PanelMemberSpecialism',
          key: 'BBA3-MQPM1-004',
          value_en: 'General Practitioner',
          value_cy: '',
          hint_text_en: '',
          hint_text_cy: '',
          lov_order: null,
          parent_category: 'PanelMemberType',
          parent_key: 'BBA3-MQPM1',
          active_flag: 'Y',
          child_nodes: null
        },
        {
          category_key: 'PanelMemberSpecialism',
          key: 'BBA3-MQPM1-003',
          value_en: 'Eye Surgeon',
          value_cy: '',
          hint_text_en: '',
          hint_text_cy: '',
          lov_order: null,
          parent_category: 'PanelMemberType',
          parent_key: 'BBA3-MQPM1',
          active_flag: 'Y',
          child_nodes: null
        }
      ]
    },
    {
      category_key: 'PanelMemberType',
      key: 'BBA3-FQPM',
      value_en: 'Financially Qualified Panel Member',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    },
    {
      category_key: 'PanelMemberType',
      key: 'BBA3-RMM',
      value_en: 'Regional Medical Member',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      child_nodes: null
    }
  ];
  const JUDICAIL_USER_DETAILS = [{
    memberID: 'P0000001',
    memberType: MemberType.PANEL_MEMBER,
    requirementType: RequirementType.MUSTINC
  }];

  const MEDICALLY_QUALIFIED_PANEL_MEMBERS: LovRefDataModel = {
    category_key: 'PanelMemberType',
    key: 'BBA3-MQPM2',
    value_en: 'Medically Qualified Panel Member',
    value_cy: '',
    hint_text_en: '',
    hint_text_cy: '',
    lov_order: null,
    parent_category: '',
    parent_key: '',
    active_flag: 'Y',
    child_nodes: [
      {
        category_key: 'PanelMemberSpecialism',
        key: 'BBA3-MQPM2-003',
        value_en: 'Eye Surgeon',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'PanelMemberType',
        parent_key: 'BBA3-MQPM2',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'PanelMemberSpecialism',
        key: 'BBA3-MQPM2-004',
        value_en: 'General Practitioner',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'PanelMemberType',
        parent_key: 'BBA3-MQPM2',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'PanelMemberSpecialism',
        key: 'BBA3-MQPM2-001',
        value_en: 'Cardiologist',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'PanelMemberType',
        parent_key: 'BBA3-MQPM2',
        active_flag: 'Y',
        child_nodes: null
      },
      {
        category_key: 'PanelMemberSpecialism',
        key: 'BBA3-MQPM2-002',
        value_en: 'Carer',
        value_cy: '',
        hint_text_en: '',
        hint_text_cy: '',
        lov_order: null,
        parent_category: 'PanelMemberType',
        parent_key: 'BBA3-MQPM2',
        active_flag: 'Y',
        child_nodes: null
      }
    ],
    selected: false
  };

  beforeEach(() => {
    const STATE = _.cloneDeep(initialState);
    STATE.hearings.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements = {
      panelPreferences: JUDICAIL_USER_DETAILS,
      panelSpecialisms: ['BBA3-DQPM', 'BBA3-MQPM2-001', 'BBA3-MQPM1-001'],
      roleType: ['BBA3-RMM', 'BBA3-DQPM', 'BBA3-MQPM1']
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [HearingPanelComponent, HearingJudgeNamesListComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState: STATE }),
        { provide: HearingsService, useValue: hearingsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                otherPanelRoles: OTHER_PANEL_ROLES,
                judicialUsers: JUDICAIL_USER_DETAILS
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingPanelComponent);
    component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    spyOn(component, 'fragmentFocus').and.callFake(() => { });
    spyOn(component, 'prepareData').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check specificPanel selection', () => {
    component.showSpecificPanel(RadioOptions.YES);
    expect(component.panelSelection).toBe(RadioOptions.YES);
  });

  it('should fail the form validation when no panel member/roles are selected', () => {
    component.panelJudgeForm.controls.multiLevelSelect.value.forEach((node) => {
      node.selected = false;
    });
    component.includedJudge.judgeList = [];
    component.excludedJudge.judgeList = [];
    component.panelJudgeForm.controls.specificPanel.setValue(RadioOptions.YES);
    component.isFormValid();
    expect(component.validationErrors.length).toBeGreaterThan(0);
  });

  xit('should check form valid', () => {
    component.panelJudgeForm.controls.specificPanel.setValue('');
    expect(component.isFormValid()).toBeFalsy();
    component.showSpecificPanel(RadioOptions.YES);
    expect(component.panelSelection).toBe(RadioOptions.YES);
    expect(component.isFormValid()).toBeTruthy();
  });

  it('should check getPanelMemberList', () => {
    component.personalCodejudgeList = [{
      title: 'Mr',
      knownAs: 'Hearing Judge',
      surname: 'Jacky Collins',
      fullName: 'Jacky Collins',
      emailId: 'jacky.collins@judicial.com',
      idamId: '1102839232',
      initials: 'JC',
      postNominals: 'JP',
      personalCode: 'P0000001',
      isJudge: '',
      isMagistrate: '',
      isPanelMember: ''
    }];
    component.initForm();
    expect(component.includedJudgeList.length).toBe(1);
    expect(component.getPanelMemberList(RequirementType.MUSTINC).length).toBe(1);
    expect(component.panelSelection).toBe(RadioOptions.YES);
    expect(component.getPanelMemberList(RequirementType.EXCLUDE).length).toBe(0);
  });

  it('should check prepareData', () => {
    const judgeInfo: JudicialUserModel = {
      title: 'Mr',
      knownAs: 'Hearing Judge',
      surname: 'Jacky',
      fullName: 'Jacky Collins',
      emailId: 'jacky.collins@judicial.com',
      idamId: '38eb0c5e-29c7-453e-b92d-f2029aaed6c1',
      initials: 'JC',
      postNominals: 'JP',
      personalCode: 'P0000001',
      isJudge: '',
      isMagistrate: '',
      isPanelMember: ''
    };

    component.includedJudge.judgeList = [judgeInfo];
    component.excludedJudge.judgeList = [judgeInfo];
    component.prepareData();
    expect(component.hearingRequestMainModel.hearingDetails.panelRequirements.panelPreferences.length).toBe(2);
  });

  it('should load panel and return true when matching panelSpecialism is found', () => {
    const panelSpecialism = 'BBA3-MQPM2-001';
    const result = component.loadPanel(MEDICALLY_QUALIFIED_PANEL_MEMBERS, panelSpecialism);
    expect(result).toBe(true);
    expect(MEDICALLY_QUALIFIED_PANEL_MEMBERS.selected).toBe(true);
    expect(MEDICALLY_QUALIFIED_PANEL_MEMBERS.child_nodes[2].selected).toBe(true);
  });

  it('should return false when matching panelSpecialism is not found', () => {
    const panelSpecialism = 'NonExistentSpecialism';
    const panelMembers = {
      category_key: 'PanelMemberType',
      key: 'BBA3-MQPM2',
      value_en: 'Medically Qualified Panel Member',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      selected: false
    };
    const result = component.loadPanel(panelMembers, panelSpecialism);
    expect(result).toBe(false);
    expect(panelMembers.selected).toBe(false);
  });

  it('should return false when child_nodes is empty', () => {
    const panelSpecialism = 'BBA3-MQPM2';
    const panelMembers = {
      category_key: 'PanelMemberType',
      key: 'BBA3-MQPM2',
      value_en: 'Medically Qualified Panel Member',
      value_cy: '',
      hint_text_en: '',
      hint_text_cy: '',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      active_flag: 'Y',
      selected: false
    };
    const result = component.loadPanel(panelMembers, panelSpecialism);
    expect(result).toBe(true);
    expect(panelMembers.selected).toBe(true);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
