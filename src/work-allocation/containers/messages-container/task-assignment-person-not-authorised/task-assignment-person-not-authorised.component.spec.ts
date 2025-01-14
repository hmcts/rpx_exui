import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Navigation, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskAssignmentPersonNotAuthorisedComponent } from './task-assignment-person-not-authorised.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TaskAssignmentPersonNotAuthorised', () => {
  let component: TaskAssignmentPersonNotAuthorisedComponent;
  let fixture: ComponentFixture<TaskAssignmentPersonNotAuthorisedComponent>;
  let mockRouter: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [TaskAssignmentPersonNotAuthorisedComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  }));

  beforeEach(() => {
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'getCurrentNavigation').and.returnValue({ extras: { state: { returnUrl: '/work' } } } as unknown as Navigation);
    fixture = TestBed.createComponent(TaskAssignmentPersonNotAuthorisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should set the return url from navigation extras', () => {
    expect(component).toBeTruthy();
    expect(mockRouter.getCurrentNavigation).toHaveBeenCalled();
    expect(component.returnUrl).toEqual('/work');
  });
});
