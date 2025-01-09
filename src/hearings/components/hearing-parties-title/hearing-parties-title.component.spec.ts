import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { HearingsFeatureService } from '../../../hearings/services/hearings-feature.service';
import * as fromHearingStore from '../../../hearings/store';
import { initialState } from '../../hearing.test.data';
import { HearingPartiesTitleComponent } from './hearing-parties-title.component';

describe('HearingPartiesTitleComponent', () => {
  let component: HearingPartiesTitleComponent;
  let fixture: ComponentFixture<HearingPartiesTitleComponent>;
  let storeMock: Store<fromHearingStore.State>;
  let featureToggleServiceMock: any;
  let hearingsFeatureServiceMock;

  beforeEach(() => {
    featureToggleServiceMock = jasmine.createSpyObj('featureToggleService', ['isEnabled']);
    hearingsFeatureServiceMock = jasmine.createSpyObj('FeatureServiceMock', ['isFeatureEnabled']);
    TestBed.configureTestingModule({
      declarations: [HearingPartiesTitleComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: FeatureToggleService,
          useValue: featureToggleServiceMock
        },
        {
          provide: HearingsFeatureService,
          useValue: hearingsFeatureServiceMock
        }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(HearingPartiesTitleComponent);
    storeMock = TestBed.inject(Store);
    spyOn(storeMock, 'pipe').and.returnValue(of(initialState.hearings.hearingValues.serviceHearingValuesModel));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return internal case name for title', () => {
    hearingsFeatureServiceMock.isFeatureEnabled.and.returnValue(of(true));
    featureToggleServiceMock.isEnabled.and.returnValue(of(true));
    component.ngOnInit();
    expect(component.caseTitle).toBe('Jane Smith vs DWP');
  });

  it('should return public case name for title', () => {
    hearingsFeatureServiceMock.isFeatureEnabled.and.returnValue(of(true));
    featureToggleServiceMock.isEnabled.and.returnValue(of(false));
    component.ngOnInit();
    expect(component.caseTitle).toBe('Jane Smith vs DWP');
  });

  it('should destroy subscription', () => {
    component.serviceValueSub = of().subscribe();
    const unsubscribeSpy = spyOn(component.serviceValueSub, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
