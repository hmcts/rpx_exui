import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { PipesModule } from '@hmcts/ccd-case-ui-toolkit';
import { of } from 'rxjs';
import { CaseworkerDataService, WASupportedJurisdictionsService } from '../../../work-allocation/services';
import { getMockCaseRoles } from '../../../work-allocation/tests/utils.spec';
import { CaseRoleDetails, RoleCategory } from '../../models';
import { RejectionReasonText } from '../../models/enums/answer-text';
import { AllocateRoleService } from '../../services';
import { RejectedRequestViewComponent } from './rejected-request-view.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RejectedRequestViewComponent', () => {
  let component: RejectedRequestViewComponent;
  let fixture: ComponentFixture<RejectedRequestViewComponent>;

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockSupportedJurisdictionsService = jasmine.createSpyObj('WASupportedJurisdictionsService', ['getWASupportedJurisdictions']);
  const mockAllocateRoleService = jasmine.createSpyObj('allocateRoleService', ['getCaseRolesUserDetails']);
  const mockCaseworkerDataService = jasmine.createSpyObj('caseworkerDataService', ['getUsersFromServices']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [RejectedRequestViewComponent],
    imports: [PipesModule],
    providers: [
        { provide: WASupportedJurisdictionsService, useValue: mockSupportedJurisdictionsService },
        { provide: AllocateRoleService, useValue: mockAllocateRoleService },
        { provide: CaseworkerDataService, useValue: mockCaseworkerDataService },
        { provide: Router, useValue: router },
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    queryParams: {
                        caseName: 'case name',
                        caseReference: '123456789',
                        roleCategory: RoleCategory.JUDICIAL,
                        jurisdiction: 'IA',
                        // date of role created is actually date rejected, not originally requested
                        dateRejected: '01-01-2020',
                        infoRequired: false,
                        reviewer: 'example',
                        dateSubmitted: '01-01-2019',
                        specificAccessReason: 'I would like access'
                    }
                }
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedRequestViewComponent);
    component = fixture.componentInstance;
    const caseRoles: CaseRoleDetails[] = getMockCaseRoles();
    component.roleCategory = RoleCategory.JUDICIAL;
    mockCaseworkerDataService.getUsersFromServices.and.returnValue(of([]));
    mockAllocateRoleService.getCaseRolesUserDetails.and.returnValue(of(caseRoles));
    mockSupportedJurisdictionsService.getWASupportedJurisdictions.and.returnValue(of(['IA']));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should all the correct services for details', () => {
    expect(mockAllocateRoleService.getCaseRolesUserDetails).toHaveBeenCalled();
    component.roleCategory = RoleCategory.ADMIN;
    component.ngOnInit();
    expect(mockSupportedJurisdictionsService.getWASupportedJurisdictions).toHaveBeenCalled();
    expect(mockCaseworkerDataService.getUsersFromServices).toHaveBeenCalled();
  });

  it('should allow the user to go to request again', () => {
    component.goToRequest();
    expect(router.navigate).toHaveBeenCalledWith(['/cases/case-details/123456789/specific-access-request']);
  });

  it('should show default message if infoRequired is false', () => {
    expect(component.reviewReason).toEqual('No reason for rejection found');
  });

  it('should not show infoRequiredComment if infoRequired is false and infoRequiredComment', () => {
    const reviewReason = component.getRejectReason(false, 'Need more Info');
    expect(reviewReason).toEqual(RejectionReasonText.Rejected);
  });

  it('should not show infoRequiredComment if infoRequired is true and infoRequiredComment is empty', () => {
    const reviewReason = component.getRejectReason(true, null);
    expect(reviewReason).toEqual(RejectionReasonText.MoreInformation);
  });

  it('should show infoRequiredComment if infoRequired is true and infoRequiredComment', () => {
    const reviewReason = component.getRejectReason(true, 'Need more Info');
    expect(reviewReason).toEqual('Need more Info');
  });

  afterEach(() => {
    component = null;
    fixture.destroy();
  });
});
