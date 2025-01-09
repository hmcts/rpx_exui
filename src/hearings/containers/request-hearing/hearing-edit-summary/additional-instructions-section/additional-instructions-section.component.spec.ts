import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../../../hearings/hearing.test.data';
import { AdditionalInstructionsSectionComponent } from './additional-instructions-section.component';

describe('AdditionalInstructionsSectionComponent', () => {
  let component: AdditionalInstructionsSectionComponent;
  let fixture: ComponentFixture<AdditionalInstructionsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        AdditionalInstructionsSectionComponent
      ],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalInstructionsSectionComponent);
    component = fixture.componentInstance;
    component.hearingRequestMainModel = initialState.hearings.hearingRequest.hearingRequestMainModel;
    component.hearingRequestToCompareMainModel = initialState.hearings.hearingRequestToCompare.hearingRequestMainModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set additional instructions and display amended label', () => {
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      hearingDetails: {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
        listingComments: 'This is a test comment.'
      }
    };
    component.ngOnInit();
    expect(component.additionalInstructions).toEqual('This is a test comment.');
    expect(component.showAmmended).toEqual(true);
  });

  it('should set additional instructions and not display amended label', () => {
    component.hearingRequestMainModel = {
      ...initialState.hearings.hearingRequest.hearingRequestMainModel,
      hearingDetails: {
        ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
        listingComments: 'This is a test comment.'
      }
    };
    component.hearingRequestToCompareMainModel = {
      ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel,
      hearingDetails: {
        ...initialState.hearings.hearingRequestToCompare.hearingRequestMainModel.hearingDetails,
        listingComments: 'This is a test comment.'
      }
    };
    component.ngOnInit();
    expect(component.additionalInstructions).toEqual('This is a test comment.');
    expect(component.showAmmended).toEqual(false);
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('additionalInstruction');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'additionalInstruction', changeLink: '/hearings/request/hearing-additional-instructions#additionalInstructionsTextarea'
    });
  });
});
