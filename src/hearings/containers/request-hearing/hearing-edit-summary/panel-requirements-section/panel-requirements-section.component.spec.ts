import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../../../../hearings/hearing.test.data';
import { PanelRequirementsSectionComponent } from './panel-requirements-section.component';

describe('LanguageRequirementsSectionComponent', () => {
  let component: PanelRequirementsSectionComponent;
  let fixture: ComponentFixture<PanelRequirementsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        PanelRequirementsSectionComponent
      ],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    fixture = TestBed.createComponent(PanelRequirementsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showAmmended as true', () => {
    component.isAPanelFlagToCompare = true;
    component.isAPanelFlag = false;
    component.ngOnInit();
    expect(component.showAmmended).toEqual(true);
  });

  it('should set showAmmended as false', () => {
    component.isAPanelFlagToCompare = true;
    component.isAPanelFlag = true;
    component.ngOnInit();
    expect(component.showAmmended).toEqual(false);
  });

  it('should verify onChange', () => {
    spyOn(component.changeEditHearing, 'emit');
    component.onChange('needPanel');
    expect(component.changeEditHearing.emit).toHaveBeenCalledWith({
      fragmentId: 'needPanel', changeLink: '/hearings/request/hearing-panel-required#hearingPanelRequired'
    });
  });
});
