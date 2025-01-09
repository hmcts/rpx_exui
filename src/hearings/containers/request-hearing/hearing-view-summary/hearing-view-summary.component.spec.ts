import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { UserDetails } from '../../../../app/models';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import * as fromAppStore from '../../../../app/store';
import { ACTION } from '../../../../hearings/models/hearings.enum';
import { caseFlagsRefData, initialState } from '../../../hearing.test.data';
import { HearingsFeatureService } from '../../../services/hearings-feature.service';
import { HearingsService } from '../../../services/hearings.service';
import { HEARING_REQUEST_VIEW_SUMMARY_TEMPLATE } from '../../../templates/hearing-request-view-summary.template';
import { HEARING_VIEW_ONLY_SUMMARY_TEMPLATE } from '../../../templates/hearing-view-only-summary.template';
import { HearingViewSummaryComponent } from './hearing-view-summary.component';

describe('HearingViewSummaryComponent', () => {
  let component: HearingViewSummaryComponent;
  let fixture: ComponentFixture<HearingViewSummaryComponent>;
  let storeMock: jasmine.SpyObj<Store<fromAppStore.State>>;
  let featureToggleServiceMock: any;
  let hearingsFeatureServiceMock: any;
  let routerMock: any;

  const USER: UserDetails = {
    canShareCases: true,
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 50
    },
    userInfo: {
      id: '41a90c39-d756-4eba-8e85-5b5bf56b31f5',
      forename: 'Luke',
      surname: 'Wilson',
      email: 'lukesuperuserxui@mailnesia.com',
      active: true,
      roles: [
        'caseworker',
        'caseworker-sscs'
      ]
    }
  };

  const httpClientMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
  const hearingsService = new HearingsService(httpClientMock);

  beforeEach(() => {
    storeMock = jasmine.createSpyObj<Store<fromAppStore.State>>('store', ['pipe']);
    featureToggleServiceMock = jasmine.createSpyObj('featureToggleService', ['isEnabled']);
    hearingsFeatureServiceMock = jasmine.createSpyObj('FeatureServiceMock', ['isFeatureEnabled']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [HearingViewSummaryComponent, MockRpxTranslatePipe],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: Store,
          useValue: storeMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                caseFlags: caseFlagsRefData
              }
            },
            fragment: of('point-to-me')
          }
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: FeatureToggleService,
          useValue: featureToggleServiceMock
        },
        {
          provide: HearingsService,
          useValue: hearingsService
        },
        {
          provide: HearingsFeatureService,
          useValue: hearingsFeatureServiceMock
        }
      ]
    }).compileComponents();

    storeMock.pipe.and.returnValue(of(USER));
    featureToggleServiceMock.isEnabled.and.returnValue(of(false));
    hearingsFeatureServiceMock.isFeatureEnabled.and.returnValue(of(false));
    fixture = TestBed.createComponent(HearingViewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set new template if the feature toggle is off and user is not hearing manager', () => {
    component.ngOnInit();
    expect(component.template).toBe(HEARING_VIEW_ONLY_SUMMARY_TEMPLATE);
  });

  it('should set new template if the feature toggle is on and user is hearing manager', () => {
    USER.userInfo.roles.push('hearing-manager');
    featureToggleServiceMock.isEnabled.and.returnValue(of(true));
    hearingsFeatureServiceMock.isFeatureEnabled.and.returnValue(of(true));
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.template).toBe(HEARING_REQUEST_VIEW_SUMMARY_TEMPLATE);
  });

  it('should navigate to edit hearing page', () => {
    component.onEdit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'hearings', 'request', 'hearing-edit-summary']);
  });

  it('should navigate to case details page', () => {
    component.hearingRequestMainModel = initialState.hearings.hearingRequest.hearingRequestMainModel;
    component.executeAction(ACTION.BACK);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'cases', 'case-details', '1234123412341234', 'hearings']);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
