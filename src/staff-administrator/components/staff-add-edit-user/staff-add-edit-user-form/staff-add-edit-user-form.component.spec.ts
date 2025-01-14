import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { of } from 'rxjs';
import { ErrorMessage } from '../../../../app/models';
import { StaffAddEditFormService } from '../../../services/staff-add-edit-form/staff-add-edit-form.service';
import { StaffDataAccessService } from '../../../services/staff-data-access/staff-data-access.service';
import { staffFilterOptionsTestData } from '../../../test-data/staff-filter-options.test.data';
import { StaffAddEditUserFormComponent } from './staff-add-edit-user-form.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({ selector: 'exui-stub-component', template: '' })
class StubComponent { }

describe('StaffAddEditUserFormComponent', () => {
  let component: StaffAddEditUserFormComponent;
  let fixture: ComponentFixture<StaffAddEditUserFormComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let mockStaffAddEditFormService: Partial<StaffAddEditFormService>;
  let mockStaffDataAccessService: jasmine.SpyObj<StaffDataAccessService>;

  beforeEach(async () => {
    mockStaffDataAccessService = jasmine.createSpyObj<StaffDataAccessService>(
      'mockStaffDataAccessService', ['updateUser']
    );
    mockStaffAddEditFormService = {
      selectedServiceCodes$: of(['code1', 'code2']),
      formGroup: new FormGroup({
        email_id: new FormControl(null),
        first_name: new FormControl(null),
        last_name: new FormControl(null),
        suspended: new FormControl(false),
        user_type: new FormControl(null),
        task_supervisor: new FormControl(false),
        case_allocator: new FormControl(false),
        staff_admin: new FormControl(false),
        roles: new FormArray([...staffFilterOptionsTestData.jobTitles.map(() => new FormControl())]), // Job Titles
        skills: new FormGroup({
          [staffFilterOptionsTestData.skills[0].group]: new FormArray(
            [...staffFilterOptionsTestData.skills[0].options.map(() => new FormControl())])
        }),
        services: new FormArray([...staffFilterOptionsTestData.services.map(() => new FormControl())]),
        base_locations: new FormArray([new FormControl()]),
        region_id: new FormControl(null)
      })
    };

    await TestBed.configureTestingModule({
    declarations: [StaffAddEditUserFormComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterTestingModule.withRoutes([
            { path: 'staff', component: StubComponent }
        ]),
        ReactiveFormsModule,
        ExuiCommonLibModule],
    providers: [
        { provide: StaffDataAccessService, useValue: mockStaffDataAccessService },
        { provide: StaffAddEditFormService, useValue: mockStaffAddEditFormService },
        {
            provide: ActivatedRoute,
            useValue: {
                fragment: of('user-skills'),
                snapshot: {
                    data: {
                        userTypes: staffFilterOptionsTestData.userTypes,
                        jobTitles: staffFilterOptionsTestData.jobTitles,
                        skills: staffFilterOptionsTestData.skills,
                        services: staffFilterOptionsTestData.services
                    }
                }
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(StaffAddEditUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submitForm', () => {
    it('set errors to false, submitted to true and mark all as touched', () => {
      component.errors = {
        title: 'There is a problem',
        description: 'Check the form for errors and try again.',
        multiple: true,
        errors: []
      };
      expect(component.errors).not.toBeFalsy();
      expect(component.submitted).toBe(false);

      const validForm = new FormGroup({});
      spyOn(validForm, 'markAllAsTouched');
      expect(validForm.markAllAsTouched).not.toHaveBeenCalled();

      component.submitForm(validForm);
      expect(component.errors).toBeFalsy();
      expect(component.submitted).toBe(true);
      expect(validForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should give location error if there is an incorrect location', () => {
      component.errors = {
        title: 'There is a problem',
        description: 'Check the form for errors and try again.',
        multiple: true,
        errors: []
      };
      expect(component.errors).not.toBeFalsy();
      expect(component.submitted).toBe(false);

      const validForm = new FormGroup<any>({});
      spyOn(validForm, 'markAllAsTouched');
      expect(validForm.markAllAsTouched).not.toHaveBeenCalled();

      validForm.setControl('services', new FormControl());
      validForm.get('services').setValue('AAA7');
      component.baseLocationsFormControl.patchValue([{ location_id: '123', location: 'Manchester', service_codes: ['BFA1'] }]);
      component.submitForm(validForm);
      expect(component.wrongLocationError).toEqual('There is a problem. Location Manchester is not valid for the services selected');
    });

    it('should give location multiple error if incorrect locations', () => {
      component.errors = {
        title: 'There is a problem',
        description: 'Check the form for errors and try again.',
        multiple: true,
        errors: []
      };
      expect(component.errors).not.toBeFalsy();
      expect(component.submitted).toBe(false);

      const validForm = new FormGroup<any>({});
      spyOn(validForm, 'markAllAsTouched');
      expect(validForm.markAllAsTouched).not.toHaveBeenCalled();

      validForm.setControl('services', new FormControl());
      validForm.get('services').setValue('AAA7');
      component.baseLocationsFormControl.patchValue([{ location_id: '125', location: 'Cardiff', service_codes: ['ABA5'] }, { location_id: '126', location: 'Birmingham', service_codes: ['AAA7'] }]);
      component.submitForm(validForm);
      expect(component.wrongLocationError).toEqual('There is a problem. Location Cardiff is not valid for the services selected');
    });

    it('should navigate to relative route /check-your-answers when form is valid', () => {
      spyOn(router, 'navigate');

      const validForm = new FormGroup({});
      component.submitForm(validForm);

      expect(router.navigate).toHaveBeenCalledWith(['check-your-answers'], { relativeTo: activatedRoute });
    });

    it('should navigate to relative route /check-your-answers when form is invalid', () => {
      // Two invalid form controls
      const invalidForm = new FormGroup({
        first_name: new FormControl(null, [Validators.required]),
        last_name: new FormControl(null, [Validators.required])
      });
      spyOn(window, 'scrollTo');

      expect(component.errors).toBeFalsy();
      expect(window.scrollTo).not.toHaveBeenCalled();

      component.submitForm(invalidForm);

      expect((component.errors as ErrorMessage)?.errors.length).toBe(2);
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });
});
