import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { hearingRoles, partyChannelsRefData, partySubChannelsRefData } from '../../hearing.test.data';
import { ConvertToValuePipe } from '../../pipes/convert-to-value.pipe';
import { HearingActualSummarySingleDayComponent } from './hearing-actual-summary-single-day.component';

describe('HearingActualSummarySingleDayComponent', () => {
  let component: HearingActualSummarySingleDayComponent;
  let fixture: ComponentFixture<HearingActualSummarySingleDayComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HearingActualSummarySingleDayComponent, ConvertToValuePipe, MockRpxTranslatePipe],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                partyChannels: partyChannelsRefData,
                partySubChannels: partySubChannelsRefData,
                hearingRoles
              }
            },
            fragment: of('point-to-me')
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HearingActualSummarySingleDayComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
