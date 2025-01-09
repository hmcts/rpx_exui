import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ErrorMessage } from '../../../../app/models';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { ACTION } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';
import { HearingWelshComponent } from './hearing-welsh.component';

@Component({
  selector: 'exui-error-message',
  template: ''
})
class MockTestComponent {
  @Input() public error: ErrorMessage;
}

@Component({
  selector: 'exui-hearing-parties-title',
  template: ''
})
class MockHearingPartiesComponent {
  @Input() public error: ErrorMessage;
}

describe('HearingWelshComponent', () => {
  let component: HearingWelshComponent;
  let fixture: ComponentFixture<HearingWelshComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [
        HearingWelshComponent,
        MockTestComponent,
        MockHearingPartiesComponent,
        MockRpxTranslatePipe
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingWelshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check hearingInWelshFlag', (): void => {
    let errors;
    const hearingInWelshFlag = component.welshForm.controls.hearingInWelshFlag;

    hearingInWelshFlag.setValue(true);
    errors = hearingInWelshFlag.errors;
    fixture.detectChanges();
    expect(errors).toBeNull();

    hearingInWelshFlag.setValue(null);
    errors = hearingInWelshFlag.errors;
    fixture.detectChanges();
    expect(errors).toBeTruthy();
  });

  it('should load default value', (): void => {
    expect(component.welshForm.value.hearingInWelshFlag).toBeTruthy();
  });

  it('should execute a continue action', (): void => {
    spyOn(RequestHearingPageFlow.prototype, 'navigateAction');
    component.executeAction(ACTION.CONTINUE);
    expect(RequestHearingPageFlow.prototype.navigateAction).toHaveBeenCalledWith(ACTION.CONTINUE);
  });

  it('should execute a back action', (): void => {
    spyOn(RequestHearingPageFlow.prototype, 'navigateAction');
    component.executeAction(ACTION.BACK);
    expect(RequestHearingPageFlow.prototype.navigateAction).toHaveBeenCalledWith(ACTION.BACK);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
