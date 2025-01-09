import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberType, RequirementType } from '../../../../models/hearings.enum';
import { JudicialUserModel } from '../../../../models/judicialUser.model';
import { LovRefDataModel } from '../../../../models/lovRefData.model';
import { PanelRequirementsModel } from '../../../../models/panelRequirements.model';
import { JudgeDetailsSectionComponent } from './judge-details-section.component';

describe('JudgeDetailsSectionComponent', () => {
  let component: JudgeDetailsSectionComponent;
  let fixture: ComponentFixture<JudgeDetailsSectionComponent>;

  const panelRequirementsToCompare: PanelRequirementsModel = {
    panelPreferences: [
      {
        memberID: '4917866',
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.EXCLUDE
      },
      {
        memberID: '4100728',
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.EXCLUDE
      }
    ],
    roleType: ['Tribunal', 'dtj', 'rtj']
  };

  const panelRequirements: PanelRequirementsModel = {
    panelPreferences: [
      {
        memberID: '4917866',
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.MUSTINC
      },
      {
        memberID: '4100728',
        memberType: MemberType.JUDGE,
        requirementType: RequirementType.EXCLUDE
      }
    ],
    roleType: ['Tribunal', 'dtj', 'rtj']
  };

  const judicialUsers: JudicialUserModel[] = [
    {
      title: 'Mr',
      knownAs: 'Jacky Collins',
      surname: 'Jacky Collins',
      fullName: 'Jacky Collins',
      emailId: 'jacky.collins@judicial.com',
      idamId: '1102839232',
      initials: 'JC',
      postNominals: 'JP',
      personalCode: '4917866',
      isJudge: '',
      isMagistrate: '',
      isPanelMember: ''
    },
    {
      title: 'Mr',
      knownAs: 'Ramon',
      surname: 'Herrera',
      fullName: 'Ramon Herrera',
      emailId: '7007496EMP-@ejudiciary.net',
      idamId: 'a229ec37-d84d-4eed-bd7f-0c77a6721da6',
      initials: 'RH',
      postNominals: 'JP',
      personalCode: '4100728',
      isJudge: '',
      isMagistrate: '',
      isPanelMember: ''
    }
  ];

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
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        JudgeDetailsSectionComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JudgeDetailsSectionComponent);
    component = fixture.componentInstance;
    component.judgeTypesRefData = judgeTypes;
    component.judicialUsers = judicialUsers;
    component.panelRequirements = panelRequirements;
    component.panelRequirementsToCompare = panelRequirementsToCompare;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set judge details', () => {
    expect(component.needJudge).toEqual('Yes');
    expect(component.judgeName).toEqual('Jacky Collins');
    expect(component.judgeTypes).toEqual('Tribunal Judge, Deputy Tribunal Judge, Regional Tribunal Judge');
    expect(component.excludedJudgeNames).toEqual('Ramon Herrera');
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('needJudge');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'needJudge', changeLink: '/hearings/request/hearing-judge#specificJudgeName'
    });
    component.onChange('judgeName');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'judgeName', changeLink: '/hearings/request/hearing-judge#inputSelectPerson'
    });
    component.onChange('judgeTypes');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'judgeTypes', changeLink: '/hearings/request/hearing-judge#judgeTypes'
    });
    component.onChange('judgeExclusion');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'judgeExclusion', changeLink: '/hearings/request/hearing-judge#inputSelectPersonExclude'
    });
  });

  describe('showAmmendedForNeedJudge', () => {
    it('should "showAmmendedForNeedJudge" return true', () => {
      component.panelRequirementsToCompare = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'rtj']
      };
      component.panelRequirements = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.EXCLUDE
          }
        ],
        roleType: []
      };
      component.ngOnInit();
      expect(component.showAmmendedForNeedJudge).toEqual(true);
    });

    it('should "showAmmendedForNeedJudge" return false', () => {
      component.panelRequirementsToCompare = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.panelRequirements = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.EXCLUDE
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.ngOnInit();
      expect(component.showAmmendedForNeedJudge).toEqual(false);
    });
  });

  describe('showAmmendedForJudgeName', () => {
    it('should "showAmmendedForJudgeName" return true', () => {
      component.panelRequirementsToCompare = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.panelRequirements = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.EXCLUDE
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.ngOnInit();
      expect(component.showAmmendedForJudgeName).toEqual(true);
    });

    it('should "showAmmendedForJudgeName" return false', () => {
      component.panelRequirementsToCompare = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.panelRequirements = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.ngOnInit();
      expect(component.showAmmendedForJudgeName).toEqual(false);
    });
  });

  describe('showAmmendedForExcludedJudgeNames', () => {
    it('should "showAmmendedForExcludedJudgeNames" return true', () => {
      component.panelRequirementsToCompare = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.panelRequirements = {
        panelPreferences: [
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.ngOnInit();
      expect(component.showAmmendedForExcludedJudgeNames).toEqual(true);
    });

    it('should "showAmmendedForExcludedJudgeNames" return false', () => {
      component.panelRequirementsToCompare = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.panelRequirements = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.ngOnInit();
      expect(component.showAmmendedForExcludedJudgeNames).toEqual(false);
    });
  });

  describe('showAmendedLabelForPageTitle', () => {
    it('should "showAmendedLabelForPageTitle" return false', () => {
      component.panelRequirementsToCompare = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.panelRequirements = {
        panelPreferences: [
          {
            memberID: '4917866',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          },
          {
            memberID: '4100728',
            memberType: MemberType.JUDGE,
            requirementType: RequirementType.MUSTINC
          }
        ],
        roleType: ['Tribunal', 'dtj', 'rtj']
      };
      component.ngOnInit();
      expect(component.showAmendedLabelForPageTitle).toEqual(false);
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
