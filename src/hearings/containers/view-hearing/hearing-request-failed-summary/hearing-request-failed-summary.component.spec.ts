import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { HearingSummaryEnum } from '../../../models/hearings.enum';
import { HearingRequestFailedSummaryComponent } from './hearing-request-failed-summary.component';

describe('HearingRequestFailedSummaryComponent', () => {
  let component: HearingRequestFailedSummaryComponent;
  let fixture: ComponentFixture<HearingRequestFailedSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HearingRequestFailedSummaryComponent, MockRpxTranslatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingRequestFailedSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check error section defined', (): void => {
    const errors = [{ id: 'request-failed', message: HearingSummaryEnum.RequestFailedError }];
    component.requestErrors = errors;
    const errorSummaryEle = fixture.debugElement.query(By.css('.govuk-error-summary__title'));
    expect(errorSummaryEle).toBeDefined();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
