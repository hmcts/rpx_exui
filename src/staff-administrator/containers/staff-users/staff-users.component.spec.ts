import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import SpyObj = jasmine.SpyObj;
import { of } from 'rxjs';
import { ErrorMessage } from '../../../app/models';
import { InfoMessageCommService } from '../../../app/shared/services/info-message-comms.service';
import {
  StaffDataFilterService
} from '../../components/staff-users/services/staff-data-filter/staff-data-filter.service';
import { StaffUsersComponent } from './staff-users.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StaffUsersComponent', () => {
  let component: StaffUsersComponent;
  let fixture: ComponentFixture<StaffUsersComponent>;
  let infoMessageCommMock: SpyObj<InfoMessageCommService>;
  let staffDataFilterServiceMock: Partial<StaffDataFilterService>;
  let storeMock: SpyObj<Store>;

  beforeEach(waitForAsync(() => {
    infoMessageCommMock = jasmine.createSpyObj('InfoMessageCommService', ['removeAllMessages']);
    staffDataFilterServiceMock = {
      errors$: of({
        title: 'There is a problem',
        description: '',
        multiple: true,
        errors: []
      } as ErrorMessage)
    };
    storeMock = jasmine.createSpyObj('Store', ['pipe']);
    storeMock.pipe.and.returnValue(of([]));

    TestBed.configureTestingModule({
    declarations: [
        StaffUsersComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [
        { provide: StaffDataFilterService, useValue: staffDataFilterServiceMock },
        { provide: InfoMessageCommService, useValue: infoMessageCommMock },
        { provide: Store, useValue: storeMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('advancedSearchClicked', () => {
    it('should toggle advancedSearchEnabled', () => {
      expect(component.advancedSearchEnabled).toBe(false);
      component.advancedSearchClicked();
      expect(component.advancedSearchEnabled).toBe(true);
    });

    it('should call removeAllMessages', () => {
      // @ts-expect-error - infoMessageCommService is private
      expect(component.infoMessageCommService.removeAllMessages).not.toHaveBeenCalled();
      component.advancedSearchClicked();
      // @ts-expect-error - infoMessageCommService is private
      expect(component.infoMessageCommService.removeAllMessages).toHaveBeenCalled();
    });
  });

  it('should update staffSelectError and staffSelectErrors when error is emitted', () => {
    storeMock.pipe.and.returnValue(of({ errorDescription: 'Test error' }));
    component = new StaffUsersComponent(staffDataFilterServiceMock as any, infoMessageCommMock, storeMock);
    expect(component.staffSelectError).toBe(true);
    expect(component.staffSelectErrors).toEqual({ title: 'Staff error', description: 'Test error' });
  });
});
