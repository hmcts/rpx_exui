import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockRpxTranslatePipe } from '../../../../app/shared/test/mock-rpx-translate.pipe';
import { initialState } from '../../../hearing.test.data';
import { ACTION } from '../../../models/hearings.enum';
import { HearingsService } from '../../../services/hearings.service';
import { RequestHearingPageFlow } from '../request-hearing.page.flow';
import { HearingPanelRequiredComponent } from './hearing-panel-required.component';

describe('HearingPanelRequiredComponent', () => {
  let component: HearingPanelRequiredComponent;
  let fixture: ComponentFixture<HearingPanelRequiredComponent>;
  const mockedHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const hearingsService = new HearingsService(mockedHttpClient);
  hearingsService.navigateAction$ = of(ACTION.CONTINUE);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [HearingPanelRequiredComponent, MockRpxTranslatePipe],
      providers: [
        provideMockStore({ initialState }),
        { provide: HearingsService, useValue: hearingsService },
        { provide: ActivatedRoute, useValue: { fragment: of('point-to-me') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HearingPanelRequiredComponent);
    component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check isAPanelFlag', (): void => {
    let errors;
    const hearingPanelRequired = component.hearingPanelRequiredForm.controls.hearingPanelRequired;

    hearingPanelRequired.setValue(true);
    errors = hearingPanelRequired.errors;
    fixture.detectChanges();
    expect(errors).toBeNull();

    hearingPanelRequired.setValue(null);
    errors = hearingPanelRequired.errors;
    fixture.detectChanges();
    expect(errors).toBeTruthy();
  });

  it('should load default value', (): void => {
    expect(component.hearingPanelRequiredForm.value.hearingPanelRequired).toEqual(false);
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
