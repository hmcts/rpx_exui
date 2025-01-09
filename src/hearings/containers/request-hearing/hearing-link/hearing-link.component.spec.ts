import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { ACTION } from '../../../models/hearings.enum';
import { LovRefDataByServiceModel } from '../../../models/lovRefData.model';
import { CaseReferencePipe } from '../../../pipes/case-reference.pipe';
import { ConvertArrayToStringPipe } from '../../../pipes/convert-array-to-string.pipe';
import { HearingsService } from '../../../services/hearings.service';
import { HearingLinkComponent } from './hearing-link.component';
import createSpyObj = jasmine.createSpyObj;

const reasons: LovRefDataByServiceModel = {
  list_of_values: [
    {
      key: 'partyreq',
      value_en: 'Party requested change',
      value_cy: '',
      hint_text_en: 'Party requested change',
      hint_text_cy: '',
      lov_order: 1,
      category_key: 'ChangeReasons',
      parent_category: '',
      parent_key: '',
      active_flag: '',
      from: 'exui-default'
    },
    {
      key: 'judgereq',
      value_en: 'Judge requested change',
      value_cy: '',
      hint_text_en: 'Judge requested change',
      hint_text_cy: '',
      lov_order: 2,
      category_key: 'ChangeReasons',
      parent_category: '',
      parent_key: '',
      active_flag: '',
      from: 'exui-default'
    },
    {
      key: 'adminreq',
      value_en: 'Admin requested change',
      value_cy: '',
      hint_text_en: 'Admin requested change',
      hint_text_cy: '',
      lov_order: 3,
      category_key: 'ChangeReasons',
      parent_category: '',
      parent_key: '',
      active_flag: '',
      from: 'exui-default'
    },
    {
      key: 'adminerr',
      value_en: 'Admin error',
      value_cy: '',
      hint_text_en: 'Admin error',
      hint_text_cy: '',
      lov_order: 3,
      category_key: 'ChangeReasons',
      parent_category: '',
      parent_key: '',
      active_flag: '',
      from: 'exui-default'
    }
  ]
};

describe('HearingLinkComponent', () => {
  let component: HearingLinkComponent;
  let fixture: ComponentFixture<HearingLinkComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockStore: any;
  const mockHttpClient = createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule
      ],
      declarations: [
        CaseReferencePipe,
        ConvertArrayToStringPipe,
        HearingLinkComponent,
        MockRpxTranslatePipe
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingLinkComponent);
    mockStore = TestBed.inject(Store);
    component = fixture.componentInstance;
    spyOn(component, 'isFormValid').and.callThrough();
    spyOn(component, 'generateLinkedCasesWithReasonDescription').and.callThrough();
    spyOn(hearingsService, 'loadCaseLinkingReasonCodes').and.returnValue(of(reasons));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.hearingLinkForm).toBeTruthy();
  });

  it('should validate form and proceed to next step', () => {
    component.executeAction(ACTION.CONTINUE);
    expect(component.isFormValid).toHaveBeenCalled();
  });

  it('should not validate form and proceed to previous step', () => {
    component.executeAction(ACTION.BACK);
    expect(component.hearingRequestMainModel.hearingDetails.hearingIsLinkedFlag).toBe(false);
    expect(component.isFormValid).not.toHaveBeenCalled();
  });

  it('should set the hearing link form control', () => {
    const yesRadioButton = fixture.debugElement.nativeElement.querySelector('#yes');
    yesRadioButton.click();
    fixture.detectChanges();
    expect(component.hearingLinkForm.get('hearingLink').value).toBe('yes');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
