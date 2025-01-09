import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { HearingAdjournedSummaryComponent } from './hearing-adjourned-summary.component';

describe('HearingAdjournedSummaryComponent', () => {
  let component: HearingAdjournedSummaryComponent;
  let fixture: ComponentFixture<HearingAdjournedSummaryComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockStore: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HearingAdjournedSummaryComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        LoadingService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
    mockStore = TestBed.inject(Store);
    mockStore = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    fixture = TestBed.createComponent(HearingAdjournedSummaryComponent);
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
