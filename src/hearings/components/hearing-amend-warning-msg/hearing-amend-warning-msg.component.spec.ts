import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../hearing.test.data';
import { HearingAmendWarningMsgComponent } from './hearing-amend-warning-msg.component';

describe('HearingAmendWarningMsgComponent', () => {
  let component: HearingAmendWarningMsgComponent;
  let fixture: ComponentFixture<HearingAmendWarningMsgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HearingAmendWarningMsgComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState })
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(HearingAmendWarningMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false if not view-edit mode', () => {
    expect(component.isViewEditMode).toBeFalsy();
  });

  it('should unsubscribe', () => {
    const unsubscribeSpy = spyOn(component.hearingConditionsSub, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
