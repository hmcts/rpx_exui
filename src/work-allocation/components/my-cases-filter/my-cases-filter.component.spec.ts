import { CdkTableModule } from '@angular/cdk/table';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiCommonLibModule, FilterService } from '@hmcts/rpx-xui-common-lib';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { LocationDataService } from '../../services';
import { ALL_LOCATIONS } from '../constants/locations';
import { MyCasesFilterComponent } from './my-cases-filter.component';

@Component({
  template: '<exui-my-cases-filter></exui-my-cases-filter>'
})
class WrapperComponent {
  @ViewChild(MyCasesFilterComponent, { static: true }) public appComponentRef: MyCasesFilterComponent;
}

describe('MyCasesFilterComponent', () => {
  let component: MyCasesFilterComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;
  // const mockTaskService = jasmine.createSpyObj('mockTaskService', ['searchTask']);
  const SELECTED_LOCATIONS = { id: 'case_locations', fields: [{ name: 'case_locations', value: ['231596', '698118'] }] };
  const mockFilterService: any = {
    getStream: () => of(SELECTED_LOCATIONS),
    get: () => SELECTED_LOCATIONS,
    persist: () => null,
    givenErrors: {
      subscribe: () => null,
      next: () => null,
      unsubscribe: () => null
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        ExuiCommonLibModule,
        RouterTestingModule,
        ExuiCommonLibModule,
        RpxTranslationModule
      ],
      declarations: [MyCasesFilterComponent, WrapperComponent],
      providers: [
        RpxTranslationService, RpxTranslationConfig,
        { provide: LocationDataService, useValue: { getLocations: () => of(ALL_LOCATIONS) } },
        {
          provide: FilterService, useValue: mockFilterService
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    router = TestBed.inject(Router);
    spyOn(mockFilterService.givenErrors, 'unsubscribe');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should show the show filter button', () => {
    const button = fixture.debugElement.query(By.css('.govuk-button.hmcts-button--secondary'));
    expect(button.nativeElement.innerText).toContain('Show work filter');
  });

  it('should show the hide filter button', () => {
    const button = fixture.debugElement.query(By.css('.govuk-button.hmcts-button--secondary'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(button.nativeElement.innerText).toContain('Hide work filter');
  });

  it('should select two locations', fakeAsync(() => {
    const button = fixture.debugElement.query(By.css('.govuk-button.hmcts-button--secondary'));
    button.nativeElement.click();
    fixture.detectChanges();
    const checkBoxes = fixture.debugElement.query(By.css('.govuk-checkboxes'));
    const firstLocation = checkBoxes.nativeElement.children[0];
    const secondLocation = checkBoxes.nativeElement.children[1];

    firstLocation.click();
    secondLocation.click();

    fixture.detectChanges();
    const applyButton = fixture.debugElement.query(By.css('#applyFilter'));
    applyButton.nativeElement.click();
    expect(component.selectedLocations.length).toEqual(2);
  }));
});
