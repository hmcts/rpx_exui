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

  xit('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('needWelsh');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'needWelsh', changeLink: '/hearings/request/hearing-welsh#welsh_hearing_yes'
    });
    expect(component.showAmmended).toEqual(true);
  });
});
