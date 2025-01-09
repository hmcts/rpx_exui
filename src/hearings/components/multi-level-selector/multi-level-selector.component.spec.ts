import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiLevelSelectorComponent } from '..';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { ControlTypeEnum } from '../../models/hearings.enum';
import { LovRefDataModel } from '../../models/lovRefData.model';

class DataModelConvertor {
  constructor(private readonly fb: FormBuilder) {}
  public patchValues = (refDataModel: LovRefDataModel) => {
    return this.fb.group({
      key: [refDataModel.key],
      value_en: [refDataModel.value_en],
      value_cy: [refDataModel.value_cy],
      hint_text_en: [refDataModel.hint_text_en],
      hint_text_cy: [refDataModel.hint_text_cy],
      lov_order: [refDataModel.lov_order],
      parent_key: [refDataModel.parent_key],
      selected: [refDataModel.selected, Validators.required],
      child_nodes: refDataModel.child_nodes && refDataModel.child_nodes.length > 0 ? this.convertRefDataModelToArray(refDataModel.child_nodes) : []
    });
  };

  public convertRefDataModelToArray = (dataSource: LovRefDataModel[]) => {
    const dataSourceArray = this.fb.array([]);
    dataSource.forEach((listOfValue) => {
      (dataSourceArray as FormArray).push(this.patchValues({
        key: listOfValue.key,
        value_en: listOfValue.value_en,
        value_cy: listOfValue.value_cy,
        hint_text_en: listOfValue.hint_text_en,
        hint_text_cy: listOfValue.hint_text_cy,
        lov_order: listOfValue.lov_order,
        parent_key: listOfValue.parent_key,
        child_nodes: listOfValue.child_nodes,
        selected: listOfValue.selected
      } as LovRefDataModel) as FormGroup);
    });
    return dataSourceArray;
  };
}

describe('MultiLevelSelectorComponent', () => {
  let component: MultiLevelSelectorComponent;
  let fixture: ComponentFixture<MultiLevelSelectorComponent>;

  const LIST_OFF_VALUES_REF: LovRefDataModel[] = [
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
      child_nodes: null,
      selected: false
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
      selected: true,
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
          child_nodes: null,
          selected: true
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
          child_nodes: null,
          selected: false
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
          child_nodes: null,
          selected: false
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
          child_nodes: null,
          selected: false
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
      selected: false,
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
          child_nodes: null,
          selected: false
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
          child_nodes: null,
          selected: false
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
          child_nodes: null,
          selected: false
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
          child_nodes: null,
          selected: false
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
      child_nodes: null,
      selected: false
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
      child_nodes: null,
      selected: false
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MultiLevelSelectorComponent, MockRpxTranslatePipe],
      providers: [
        FormBuilder
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLevelSelectorComponent);
    component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
    const modelConvertor = new DataModelConvertor(component.fb);
    component.level = 2;
    component.hasValidationRequested = true;
    component.multiLevelSelect = modelConvertor.convertRefDataModelToArray(LIST_OFF_VALUES_REF);
    component.configLevels = [
      {
        controlType: ControlTypeEnum.CHECK_BOX,
        level: 1
      },
      {
        controlType: ControlTypeEnum.SELECT,
        level: 2
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.controlType).toEqual(component.configLevels[component.level - 1].controlType);
  });

  it('should return true for validation', () => {
    component.formGroup.controls.item.setValue({
      key: 'Cardiologist',
      value_en: 'Cardiologist',
      value_cy: '',
      hint_text_en: 'true',
      hint_text_cy: 'false',
      lov_order: 1,
      parent_key: '3',
      child_nodes: [],
      selected: false
    });
    fixture.detectChanges();
    expect(component.checkValidationWhenRequested).toEqual(true);
  });

  it('should deselect node', () => {
    component.deSelectChildNodes(component.multiLevelSelect.controls[1]);
    fixture.detectChanges();
    component.multiLevelSelect.controls[1].value.child_nodes.forEach((node) => {
      expect(node.selected).toEqual(false);
    });
  });

  it('should assign selected option to item control', () => {
    component.level = 2;
    component.multiLevelSelect = (component.multiLevelSelect.controls[1] as FormGroup).controls.child_nodes as FormArray;
    component.assignSelectedOptionToItemControl();
    fixture.detectChanges();
    expect(component.formGroup.controls.item.value).toEqual('BBA3-MQPM2-003');
  });
});
