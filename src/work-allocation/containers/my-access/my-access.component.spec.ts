import { CdkTableModule } from '@angular/cdk/table';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, LoadingService, PaginationModule } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule, FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { SessionStorageService } from '../../../app/services';
import { reducers } from '../../../app/store';
import { WorkAllocationComponentsModule } from '../../components/work-allocation.components.module';
import { Case } from '../../models/cases';
import { CaseworkerDataService, WorkAllocationCaseService } from '../../services';
import { getMockCases } from '../../tests/utils.spec';
import { WorkCaseListComponent } from '../work-case-list/work-case-list.component';
import { MyAccessComponent } from './my-access.component';

@Component({ template: '<exui-my-access></exui-my-access>' })
class WrapperComponent {
  @ViewChild(MyAccessComponent) public appComponentRef: MyAccessComponent;
}

xdescribe('MyAccessComponent', () => {
  let component: MyAccessComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;
  const mockCaseService = jasmine.createSpyObj('mockCaseService', ['searchCase', 'getMyAccess']);
  const mockAlertService = jasmine.createSpyObj('mockAlertService', ['destroy']);
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem', 'setItem']);
  const mockCaseworkerService = jasmine.createSpyObj('mockCaseworkerService', ['getAll']);
  const mockFeatureService = jasmine.createSpyObj('mockFeatureService', ['getActiveWAFeature']);
  const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);
  const mockFeatureToggleService = jasmine.createSpyObj('mockLoadingService', ['isEnabled']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CdkTableModule,
        ExuiCommonLibModule,
        RouterTestingModule,
        StoreModule.forRoot({ ...reducers }),
        WorkAllocationComponentsModule,
        PaginationModule
      ],
      declarations: [MyAccessComponent, WrapperComponent, WorkCaseListComponent],
      providers: [
        { provide: WorkAllocationCaseService, useValue: mockCaseService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: CaseworkerDataService, useValue: mockCaseworkerService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    // TODO: CAM_BOOKING 0 not neeed
    // component.isPaginationEnabled$ = of(false);
    router = TestBed.inject(Router);
    const cases: Case[] = getMockCases();
    mockCaseService.searchCase.and.returnValue(of({ cases }));
    mockCaseService.getMyAccess.and.returnValue(of({ cases }));
    mockCaseworkerService.getAll.and.returnValue(of([]));
    mockFeatureService.getActiveWAFeature.and.returnValue(of('WorkAllocationRelease2'));
    mockFeatureToggleService.isEnabled.and.returnValue(of(false));
    fixture.detectChanges();
  });

  // on merge bookingUi and WA service isPaginationEnabled$ seems not part of component so at this stage it s deactivated
  xit('should make a call to load cases using the default search request', () => {
    const searchRequest = component.getSearchCaseRequestPagination();
    const payload = { searchRequest, view: component.view };
    expect(mockCaseService.searchCase).toHaveBeenCalledWith(payload);
    expect(component.cases).toBeDefined();
    expect(component.cases.length).toEqual(2);
  });

  xit('should have all column headers', () => {
    const element = fixture.debugElement.nativeElement;
    const headerCells = element.querySelectorAll('.govuk-table__header');
    const fields = component.fields;
    expect(headerCells).toBeDefined();
    expect(headerCells.length).toEqual(fields.length + 1);
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].columnLabel) {
        expect(headerCells[i].textContent).toEqual(fields[i].columnLabel);
      } else {
        expect(headerCells[i].textContent).toEqual('');
      }
    }
    expect(headerCells[headerCells.length - 1].textContent.trim()).toEqual('');
  });

  it('should not show the footer when there are cases', () => {
    const element = fixture.debugElement.nativeElement;
    const footerRow = element.querySelector('.footer-row');
    expect(footerRow).toBeDefined();
    const footerRowClass = footerRow.getAttribute('class');
    expect(footerRowClass).toContain('footer-row');
    expect(footerRowClass).not.toContain('shown');
  });

  it('should show the footer when there are no cases xx', () => {
    spyOnProperty(component, 'cases').and.returnValue([]);
    fixture.detectChanges();
    const element = fixture.debugElement.nativeElement;
    const footerRow = element.querySelector('.footer-row');
    expect(footerRow).toBeDefined();
    const footerRowClass = footerRow.getAttribute('class');
    expect(footerRowClass).toContain('footer-row');
    expect(footerRowClass).toContain('shown');
    const footerCell = element.querySelector('.cell-footer');
    expect(footerCell).toBeDefined();
    expect(footerCell.textContent.trim()).toEqual(component.emptyMessage);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
