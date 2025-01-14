import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as fromRoot from '../../app/store';
import { RefundsComponent } from './refunds.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RefundsComponent', () => {
  let component: RefundsComponent;
  let fixture: ComponentFixture<RefundsComponent>;
  let store: MockStore;
  const initialState = {
    user: {
      userInfo: {
        email: 'john.doe@mail.com',
        roles: ['role1'],
        id: '123',
        forename: 'John',
        surname: 'Doe',
        active: true
      },
      sessionTimeout: {
        idleModalDisplayTime: 5,
        totalIdleTime: 25
      },
      canShareCases: true
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [RefundsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [],
    providers: [
        provideMockStore({ initialState }),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    store.overrideSelector(fromRoot.getUserDetails, initialState.user);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user details on init', () => {
    component.ngOnInit();
    expect(component.userEmail).toBe('john.doe@mail.com');
    expect(component.userRoles).toEqual(['role1']);
    expect(component.userDataLoaded).toBeTruthy();
  });
});

