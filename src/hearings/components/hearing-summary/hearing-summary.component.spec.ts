import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { caseFlagsRefData, initialState } from '../../hearing.test.data';
import { HearingConditions } from '../../models/hearingConditions';
import { Mode } from '../../models/hearings.enum';
import { HearingsPipesModule } from '../../pipes/hearings.pipes.module';
import * as fromHearingStore from '../../store';
import { HearingSummaryComponent } from './hearing-summary.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HearingSummaryComponent', () => {
  const routerMock = jasmine.createSpyObj('Router', [
    'navigateByUrl'
  ]);
  let component: HearingSummaryComponent;
  let fixture: ComponentFixture<HearingSummaryComponent>;
  let store: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
    declarations: [HearingSummaryComponent, MockRpxTranslatePipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [HearingsPipesModule],
    providers: [
        LoadingService,
        provideMockStore({ initialState }),
        {
            provide: Router,
            useValue: routerMock
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
    fixture = TestBed.createComponent(HearingSummaryComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe', () => {
    component.sub = of().subscribe();
    spyOn(component.sub, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.sub.unsubscribe).toHaveBeenCalled();
  });

  it('should change answer', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockMouseEvent = { preventDefault: () => {} } as MouseEvent;
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.mode = Mode.CREATE_EDIT;
    component.changeAnswer(mockMouseEvent, 'venue', 'hearing/request/venue');
    const hearingCondition: HearingConditions = {
      fragmentId: 'venue',
      mode: Mode.CREATE_EDIT
    };
    expect(storeDispatchSpy).toHaveBeenCalledWith(new fromHearingStore.SaveHearingConditions(hearingCondition));
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('hearing/request/venue');
  });
});
