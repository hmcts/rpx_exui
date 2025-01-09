import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../../../hearings/hearing.test.data';
import { LanguageRequirementsSectionComponent } from './language-requirements-section.component';

describe('LanguageRequirementsSectionComponent', () => {
  let component: LanguageRequirementsSectionComponent;
  let fixture: ComponentFixture<LanguageRequirementsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        LanguageRequirementsSectionComponent
      ],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageRequirementsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showAmmended as true', () => {
    component.hearingInWelshFlagToCompare = true;
    component.hearingInWelshFlag = false;
    component.ngOnInit();
    expect(component.showAmmended).toEqual(true);
  });

  it('should set showAmmended as false', () => {
    component.hearingInWelshFlagToCompare = true;
    component.hearingInWelshFlag = true;
    component.ngOnInit();
    expect(component.showAmmended).toEqual(false);
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('needWelsh');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'needWelsh', changeLink: '/hearings/request/hearing-welsh#welsh_hearing_yes'
    });
  });
});
