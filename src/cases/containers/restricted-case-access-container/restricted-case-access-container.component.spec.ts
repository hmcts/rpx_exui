import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@hmcts/ccd-case-ui-toolkit';
import { Observable, of } from 'rxjs';
import { CASEWORKERS } from '../../../../api/test/pact/constants/work-allocation/caseworkers.spec';
import { CASEROLES } from '../../../../api/workAllocation/constants/roles.mock.data';
import { CaseReferencePipe } from '../../../hearings/pipes/case-reference.pipe';
import { AllocateRoleService } from '../../../role-access/services';
import { CaseworkerDataService, WASupportedJurisdictionsService } from '../../../work-allocation/services';
import { RestrictedCaseAccessContainerComponent } from './restricted-case-access-container.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('RestrictedCaseAccessContainerComponent', () => {
  let component: RestrictedCaseAccessContainerComponent;
  let fixture: ComponentFixture<RestrictedCaseAccessContainerComponent>;
  const mockAllocateService = jasmine.createSpyObj('AllocateRoleService', ['getCaseAccessRolesByCaseId']);
  const mockWASupportedJurisdictionsService = jasmine.createSpyObj('WASupportedJurisdictionsService', ['getWASupportedJurisdictions']);
  const mockCaseworkerDataService = jasmine.createSpyObj('CaseworkerDataService', ['getUsersFromServices']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['register', 'unregister']);
  const mockActivatedRoute = {
    snapshot: {
      params: {
        cid: '1234123412341234'
      }
    }
  };
  const mockRouter = {
    navigate: jasmine.createSpy()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        RestrictedCaseAccessContainerComponent,
        CaseReferencePipe,
        RpxTranslateMockPipe
      ],
      providers: [
        { provide: AllocateRoleService, useValue: mockAllocateService },
        { provide: WASupportedJurisdictionsService, useValue: mockWASupportedJurisdictionsService },
        { provide: CaseworkerDataService, useValue: mockCaseworkerDataService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
    mockAllocateService.getCaseAccessRolesByCaseId.and.returnValue(of(CASEROLES));
    mockWASupportedJurisdictionsService.getWASupportedJurisdictions.and.returnValue(of(['IA']));
    mockCaseworkerDataService.getUsersFromServices.and.returnValue(of([CASEWORKERS.JANE_DOE, CASEWORKERS.JOHN_SMITH]));
    mockLoadingService.register.and.callThrough();
    mockLoadingService.unregister.and.callThrough();
    fixture = TestBed.createComponent(RestrictedCaseAccessContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockLoadingService.register).toHaveBeenCalled();
    expect(mockAllocateService.getCaseAccessRolesByCaseId).toHaveBeenCalled();
    expect(mockWASupportedJurisdictionsService.getWASupportedJurisdictions).toHaveBeenCalled();
    expect(mockCaseworkerDataService.getUsersFromServices).toHaveBeenCalled();
    expect(mockLoadingService.unregister).toHaveBeenCalled();
  });

  it('should unsubscribe', () => {
    component.allocateServiceSubscription = new Observable().subscribe();
    spyOn(component.allocateServiceSubscription, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.allocateServiceSubscription.unsubscribe).toHaveBeenCalled();
  });
});
