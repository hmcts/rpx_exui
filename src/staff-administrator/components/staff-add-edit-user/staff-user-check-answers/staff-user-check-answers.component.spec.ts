import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { InfoMessageCommService } from '../../../../app/shared/services/info-message-comms.service';
import { StaffUser } from '../../../models/staff-user.model';
import { StaffAddEditFormService } from '../../../services/staff-add-edit-form/staff-add-edit-form.service';
import { StaffDataAccessService } from '../../../services/staff-data-access/staff-data-access.service';
import { StaffUserCheckAnswersComponent } from './staff-user-check-answers.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('StaffUserCheckAnswersComponent', () => {
  let component: StaffUserCheckAnswersComponent;
  let fixture: ComponentFixture<StaffUserCheckAnswersComponent>;
  let mockStaffDataAccessService: jasmine.SpyObj<StaffDataAccessService>;
  let mockInfoMessageCommService: jasmine.SpyObj<InfoMessageCommService>;
  let mockStaffAddEditFormService: Partial<StaffAddEditFormService>;
  const mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
  let testStaffUser: StaffUser;

  beforeEach(waitForAsync(() => {
    mockStaffDataAccessService = jasmine.createSpyObj<StaffDataAccessService>('mockStaffDataAccessService', ['addNewUser', 'updateUser']);
    mockInfoMessageCommService = jasmine.createSpyObj('mockInfoMessageCommService', ['nextMessage']);
    testStaffUser = StaffUser.from({
      email_id: 'email@test.hmcts',
      first_name: 'Kevin',
      last_name: 'Silver',
      suspended: 'false',
      user_type: 'userType',
      task_supervisor: 'Y',
      case_allocator: 'Y',
      staff_admin: 'N',
      userCategory: 'userCategory',
      role: [
        {
          role_id: 1,
          role: 'Role',
          is_primary: true
        }
      ],
      skills: [
        {
          skill_id: 1,
          description: 'SKILLDESCRIPTION',
          skill_code: 'SKILLCODE'
        }
      ],
      work_area: [
        {
          area_of_work: 'service',
          service_code: 'SERVICE_CODE'
        }
      ],
      base_location: [
        {
          location_id: 333,
          location: 'Location',
          is_primary: true
        }
      ],
      region: 'West Midlands',
      region_id: 12
    });

    mockStaffAddEditFormService = {
      valuesAsStaffUser: testStaffUser
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StaffUserCheckAnswersComponent, RpxTranslateMockPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: StaffDataAccessService, useValue: mockStaffDataAccessService },
        { provide: Router, useValue: mockRouter },
        { provide: InfoMessageCommService, useValue: mockInfoMessageCommService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                userTypes: [
                  {
                    key: 'userType',
                    label: 'User Types'
                  },
                  {
                    key: 'ctsc',
                    label: 'CTSC'
                  }
                ],
                jobTitles: [
                  {
                    key: 'senior-legal-caseworker',
                    label: 'Senior Legal Caseworker'
                  },
                  {
                    key: 'legal-caseworker',
                    label: 'Legal Caseworker'
                  },
                  {
                    key: 'hearing-centre-team-leader',
                    label: 'Hearing Centre Team Leader'
                  },
                  {
                    key: 'hearing-centre-administrator',
                    label: 'Hearing Centre Administrator'
                  },
                  {
                    key: 'court-clerk',
                    label: 'Court Clerk'
                  }
                ],
                services: [
                  {
                    key: 'ABC1',
                    label: 'Service A'
                  },
                  {
                    key: 'BCD2',
                    label: 'Service B'
                  },
                  {
                    key: 'CDE3',
                    label: 'Service C'
                  },
                  {
                    key: 'DEF4',
                    label: 'Service D'
                  }
                ],
                skills: [
                  {
                    group: 'ABC1',
                    options: [
                      {
                        key: '1',
                        label: 'Underwriter'
                      },
                      {
                        key: '2',
                        label: 'Caseworker'
                      }
                    ]
                  },
                  {
                    group: 'BCD2',
                    options: [
                      {
                        key: '3',
                        label: 'Caseworker'
                      },
                      {
                        key: '4',
                        label: 'Case manager'
                      }
                    ]
                  },
                  {
                    group: 'CDE3',
                    options: [
                      {
                        key: '5',
                        label: 'Underwriter'
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        { provide: StaffAddEditFormService, useValue: mockStaffAddEditFormService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffUserCheckAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the right method based on isEditMode on calling the onSubmit method', () => {
    component.isUpdateMode = false;
    spyOn(component, 'onSubmitAddUser').and.callFake(() => {
      return undefined;
    });
    component.onSubmit();
    expect(component.onSubmitAddUser).toHaveBeenCalled();

    component.isUpdateMode = true;
    spyOn(component, 'onSubmitUpdateUser').and.callFake(() => {
      return undefined;
    });
    component.onSubmit();
    expect(component.onSubmitUpdateUser).toHaveBeenCalled();
  });

  it('should call onSubmit method on clicking the submit button', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    const checkAnswersSubmitButton = fixture.debugElement.query(By.css('#user-staff-check-answers-submit'));
    checkAnswersSubmitButton.triggerEventHandler('click', null);
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call addNewUser and on being succesful it should redirect to "/staff"', (done) => {
    mockStaffDataAccessService.addNewUser.and.returnValue(of(testStaffUser));
    component.onSubmitAddUser();
    done();
    expect(mockStaffDataAccessService.addNewUser).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/staff', { state: { retainMessages: true } });
  });

  it('should display a banner once an user has been added successfully', (done) => {
    mockStaffDataAccessService.addNewUser.and.returnValue(of(testStaffUser));
    component.onSubmitAddUser();
    done();
    expect(mockInfoMessageCommService.nextMessage).toHaveBeenCalled();
  });

  it('should call addNewUser and throw error', (done) => {
    mockStaffDataAccessService.addNewUser.and.returnValue(throwError({ status: 500 }));
    component.onSubmitAddUser();
    done();
    expect(mockStaffDataAccessService.addNewUser).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/service-down');
  });

  it('should handle error with status 400 correctly', () => {
    const errorResponse = {
      message: 'Bad Request',
      name: 'name',
      status: 400,
      statusTest: 'Server Error',
      url: '',
      error: {
        errorCode: 400,
        errorDescription: 'Invalid Email',
        errorMessage: 'Invalid email',
        status: 400,
        timeStamp: ''
      },
      headers: 'any'
    };
    spyOn(window, 'scrollTo');
    mockStaffDataAccessService.addNewUser.and.returnValue(throwError(errorResponse));
    component.onSubmitAddUser();
    expect(mockStaffDataAccessService.addNewUser).toHaveBeenCalledWith(testStaffUser);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should display error message when errMsg is set', () => {
    const errorDescription = 'Error: You must add a valid email address';
    component.errMsg = {
      message: 'Bad Request',
      name: 'name',
      status: 400,
      statusTest: 'Server Error',
      url: '',
      error: {
        errorCode: 400,
        errorDescription: 'Error: You must add a valid email address',
        errorMessage: 'Invalid email',
        status: '400',
        timeStamp: ''
      },
      headers: 'any'
    };
    fixture.detectChanges();

    const errorSummaryElement = fixture.debugElement.query(By.css('.error-summary'));
    expect(errorSummaryElement).toBeTruthy();

    const errorMessageHeading = errorSummaryElement.query(By.css('.error-summary-heading'));
    expect(errorMessageHeading.nativeElement.textContent).toContain('Error: ');
    expect(errorMessageHeading.nativeElement.textContent).toContain(errorDescription);
  });

  it('should not display error message when errMsg is not set', () => {
    component.errMsg = null;
    fixture.detectChanges();
    const errorSummaryElement = fixture.debugElement.query(By.css('.error-summary'));
    expect(errorSummaryElement).toBeFalsy();
  });

  it('should call updateUser and then redirect to staff on successful call when calling onSubmitEditMode', fakeAsync(() => {
    const caseworkerId = '123';
    mockStaffDataAccessService.updateUser.and.returnValue(of({ case_worker_id: caseworkerId }));
    component.onSubmitUpdateUser();
    tick();
    expect(mockStaffDataAccessService.updateUser).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/staff/user-details/${caseworkerId}`, { state: { retainMessages: true } });
    flush();
  }));

  it('should call updateUser and then redirect to service down on error call when calling onSubmitEditMode', fakeAsync(() => {
    mockStaffDataAccessService.updateUser.and.returnValue(throwError('error'));
    spyOn(window, 'scrollTo').and.callFake(() => {
      return undefined;
    });
    component.onSubmitUpdateUser();
    tick();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/service-down');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(mockStaffDataAccessService.updateUser).toHaveBeenCalled();
    flush();
  }));

  describe('getServiceNameFromSkillId', () => {
    it('should get service name from skill id', () => {
      const service = component.getServiceNameFromSkillId(3);
      expect(service).toBe('Service B');
    });
  });
});
