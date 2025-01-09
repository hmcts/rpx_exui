import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberType, RequirementType } from '../../../../models/hearings.enum';
import { JudicialUserModel } from '../../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../../models/lovRefData.model';
import { PanelRequirementsModel } from '../../../../models/panelRequirements.model';
import { PanelDetailsSectionComponent } from './panel-details-section.component';

describe('PanelDetailsSectionComponent', () => {
  let component: PanelDetailsSectionComponent;
  let fixture: ComponentFixture<PanelDetailsSectionComponent>;

  const panelRequirements: PanelRequirementsModel = {
    panelPreferences: [
      {
        memberID: '7007496',
        memberType: MemberType.PANEL_MEMBER,
        requirementType: RequirementType.MUSTINC
      },
      {
        memberID: '6006842',
        memberType: MemberType.PANEL_MEMBER,
        requirementType: RequirementType.EXCLUDE
      }
    ],
    panelSpecialisms: ['BBA3-DQPM', 'BBA3-MQPM2-001', 'BBA3-MQPM1-001'],
    roleType: ['BBA3-RMM', 'BBA3-DQPM', 'BBA3-MQPM1']
  };

  const panelMembersRefData: JudicialUserModel[] = [
    {
      title: 'Mr',
      knownAs: 'Ramon',
      surname: 'Herrera',
      fullName: 'Ramon Herrera',
      emailId: '7007496EMP-@ejudiciary.net',
      idamId: 'a229ec37-d84d-4eed-bd7f-0c77a6721da6',
      initials: 'RH',
      postNominals: 'JP',
      personalCode: '7007496',
      isJudge: '',
      isMagistrate: '',
      isPanelMember: ''
    },
    {
      title: 'Mr',
      knownAs: 'Jack',
      surname: 'Collins',
      fullName: 'Jack Collins',
      emailId: '6006842EMP-@ejudiciary.net',
      idamId: 'b329fe37-d84d-4eed-bd7f-0c77a6722eh5',
      initials: 'RH',
      postNominals: 'JP',
      personalCode: '6006842',
      isJudge: '',
      isMagistrate: '',
      isPanelMember: ''
    }
  ];

  const panelRoles: LovRefDataModel[] = [
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        PanelDetailsSectionComponent
      ],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(PanelDetailsSectionComponent);
    component = fixture.componentInstance;
    component.panelRolesRefData = panelRoles;
    component.panelRequirements = panelRequirements;
    component.panelMembers = panelMembersRefData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set panel details', () => {
    expect(component.hearingPanel).toEqual('Yes');
    expect(component.includedPanelMembers).toEqual('Ramon Herrera');
    expect(component.excludedPanelMembers).toEqual('Jack Collins');
    expect(component.panelRoles).toEqual('Disability Qualified Panel Member<br>Medically Qualified Panel Member - Cardiologist<br>Medically Qualified Panel Member - Cardiologist');
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('hearingPanel');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'hearingPanel', changeLink: '/hearings/request/hearing-panel#specificPanelSelection'
    });
    component.onChange('panelInclusion');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'panelInclusion', changeLink: '/hearings/request/hearing-panel#inputSelectPersonInclude'
    });
    component.onChange('panelExclusion');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'panelExclusion', changeLink: '/hearings/request/hearing-panel#inputSelectPersonExclude'
    });
    component.onChange('panelRoles');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'panelRoles', changeLink: '/hearings/request/hearing-panel#specificPanelSelection'
    });
  });
});
