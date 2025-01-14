import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../../app/services/user/user.service';
import * as fromRoot from '../../../app/store/reducers';
import * as fromNocStore from '../../../noc/store';
import { HmctsGlobalHeaderComponent } from './hmcts-global-header.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('HmctsGlobalHeaderComponent - with active user', () => {
  let component: HmctsGlobalHeaderComponent;
  let fixture: ComponentFixture<HmctsGlobalHeaderComponent>;
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<fromRoot.State>;
  const storeMock = jasmine.createSpyObj('Store', [
    'dispatch', 'pipe'
  ]);

  const changesMock = {
    items: {
      currentValue: 'a',
      previousValue: 'b',
      firstChange: false,
      isFirstChange: () => false
    }
  };
  const flags = {
    enabledFlag: true,
    disabledFlag: false
  };

  const userDetails = {
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 1
    },
    canShareCases: true,
    userInfo: {
      id: 'someId',
      forename: 'foreName',
      surname: 'surName',
      email: 'email@email.com',
      active: true,
      roles: ['pui-case-manager']
    }
  };

  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(waitForAsync(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
    declarations: [HmctsGlobalHeaderComponent, RpxTranslateMockPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [RouterTestingModule,
        StoreModule.forRoot({
            ...fromRoot.reducers,
            feature: combineReducers(fromNocStore.reducers)
        })],
    providers: [
        {
            provide: Store,
            useValue: storeMock
        },
        {
            provide: UserService,
            useValue: {
                getUserDetails: () => of({
                    userInfo: {
                        roles: ['roleA', 'roleB']
                    }
                })
            }
        },
        {
            provide: FeatureToggleService,
            useValue: {
                isEnabled: (flag) => of(flags[flag])
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    mockRouter = TestBed.inject(Router);
    spyOnProperty(mockRouter, 'url').and.returnValues('/cases', '/tasks/list', '/tasks/task-manager');
    fixture = TestBed.createComponent(HmctsGlobalHeaderComponent);
    component = fixture.componentInstance;
    component.headerTitle = {
      name: 'Service name',
      url: '#'
    };
    component.showItems = true;
    component.navigation = {
      label: 'Account navigation',
      items: [
        { text: 'Nav item 1', emit: '#1' },
        { text: 'Nav item 2', emit: '#1' }
      ]
    };
    store = TestBed.inject(Store);
    storeMock.pipe.and.returnValue(of(userDetails));
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should onEmitSubMenu', () => {
    const menuItem = { href: '/noc', text: null };
    component.onEmitSubMenu(menuItem);
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should onEmitEvent', () => {
    spyOn(component.navigate, 'emit');
    component.onEmitEvent(1);
    expect(component.navigate.emit).toHaveBeenCalled();
  });

  it('should display find case right aligned', () => {
    component.showItems = true;
    component.items = [{
      align: 'right',
      text: 'Find case',
      href: '/cases/case-search',
      active: false,
      ngClass: 'hmcts-search-toggle__button'
    },
    {
      text: '2',
      href: '',
      active: false
    },
    {
      text: '3',
      href: '',
      active: false
    }];
    component.ngOnInit();
    fixture.detectChanges();
    component.isUserCaseManager$.subscribe((result) => {
      expect(result).toBe(true);
    });
  });

  it('should not display find case right aligned', () => {
    component.showItems = true;
    component.items = [{
      text: 'Find case',
      href: '/cases/case-search',
      active: false
    },
    {
      text: '2',
      href: '',
      active: false
    },
    {
      text: '3',
      href: '',
      active: false
    }];
    userDetails.userInfo.roles = ['roleA', 'roleB'];
    storeMock.pipe.and.returnValue(of(userDetails));
    component.ngOnInit();
    fixture.detectChanges();
    component.isUserCaseManager$.subscribe((result) => {
      expect(result).toBe(false);
    });
  });

  it('splitNavItems', () => {
    component.items = [{
      align: 'right',
      text: '1',
      href: '',
      active: false
    },
    {
      align: null,
      text: '2',
      href: '',
      active: false
    },
    {
      align: 'right',
      text: '3',
      href: '',
      active: false
    }];
    component.ngOnChanges(changesMock);
    fixture.detectChanges();
    const leftItems = component.leftItems;
    const rightItems = component.rightItems;

    leftItems.pipe(
      switchMap((items) => {
        expect(items).toEqual([{
          align: null,
          text: '2',
          href: '',
          active: false
        }]);
        return rightItems;
      })
    ).subscribe((items) => {
      expect(items).toEqual([{
        align: 'right',
        text: '1',
        href: '',
        active: false
      },
      {
        align: 'right',
        text: '3',
        href: '',
        active: false
      }]);
    });
  });

  it('filters out menu items for which the user does not hold the correct role', () => {
    component.items = [{
      align: 'right',
      text: '1',
      href: '',
      active: false,
      roles: ['roleA']
    },
    {
      align: null,
      text: '2',
      href: '',
      active: false,
      roles: ['roleB']
    },
    {
      align: 'right',
      text: '3',
      href: '',
      active: false,
      roles: ['roleC']
    }];
    component.ngOnChanges(changesMock);
    const leftItems = component.leftItems;
    const rightItems = component.rightItems;
    leftItems.pipe(
      switchMap((items) => {
        expect(items).toEqual([component.items[1]]);
        return rightItems;
      })
    ).subscribe((items) => {
      expect(items).toEqual([component.items[0]]);
    });
  });

  it('filters out menu items for which not all features are enabled', (done) => {
    component.items = [{
      align: 'right',
      text: '1',
      href: '',
      active: false,
      flags: ['enabledFlag'],
      roles: ['roleA']
    },
    {
      align: null,
      text: '2',
      href: '',
      active: false,
      roles: ['roleB']
    },
    {
      align: 'right',
      text: '3',
      href: '',
      active: false,
      flags: ['enabledFlag', 'disabledFlag'],
      roles: ['roleC']
    }];
    component.ngOnChanges(changesMock);
    const leftItems = component.leftItems;
    const rightItems = component.rightItems;
    leftItems.pipe(
      switchMap((items) => {
        expect(items).toEqual([component.items[1]]);
        return rightItems;
      })
    ).subscribe((items) => {
      expect(items).toEqual([component.items[0]]);
      done();
    });
  });

  it('filters out menu items for which not all features are enabled correctly with non-left-right observable', (done) => {
    component.items = [{
      align: 'right',
      text: '1',
      href: '',
      active: false,
      flags: ['enabledFlag'],
      roles: ['roleA']
    },
    {
      align: null,
      text: '2',
      href: '',
      active: false,
      // important to verify this
      flags: ['enabledFlag2'],
      roles: ['roleB']
    },
    {
      align: 'right',
      text: '3',
      href: '',
      active: false,
      flags: ['enabledFlag'],
      roles: ['roleC']
    }];
    component.ngOnChanges(changesMock);
    const leftItems = component.leftItems;
    const rightItems = component.rightItems;
    leftItems.pipe(
      switchMap((items) => {
        expect(items).toEqual([]);
        return rightItems;
      })
    ).subscribe((items) => {
      expect(items).toEqual([component.items[0]]);
      done();
    });
  });

  it('filters out menu items for which not all features are enabled correctly with non-left-right observable', (done) => {
    component.items = [{
      align: 'right',
      text: '1',
      href: '',
      active: false,
      flags: ['enabledFlag'],
      roles: ['roleA']
    },
    {
      align: null,
      text: '2',
      href: '',
      active: false,
      // important to verify this
      flags: ['enabledFlag2'],
      roles: ['roleB']
    },
    {
      align: 'right',
      text: '3',
      href: '',
      active: false,
      flags: ['enabledFlag'],
      roles: ['roleC']
    }];
    component.ngOnChanges(changesMock);
    const leftItems = component.leftItems;
    const rightItems = component.rightItems;
    leftItems.pipe(
      switchMap((items) => {
        expect(items).toEqual([]);
        return rightItems;
      })
    ).subscribe((items) => {
      expect(items).toEqual([component.items[0]]);
      done();
    });
  });
});

describe('HmctsGlobalHeaderComponent - logged out', () => {
  let component: HmctsGlobalHeaderComponent;
  let fixture: ComponentFixture<HmctsGlobalHeaderComponent>;
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<fromRoot.State>;
  const storeMock = jasmine.createSpyObj('Store', [
    'dispatch', 'pipe'
  ]);

  const changesMock = {
    items: {
      currentValue: 'a',
      previousValue: 'b',
      firstChange: false,
      isFirstChange: () => false
    }
  };
  const flags = {
    enabledFlag: true,
    disabledFlag: false
  };

  const userDetails = {};

  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(waitForAsync(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
    declarations: [HmctsGlobalHeaderComponent, RpxTranslateMockPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [RouterTestingModule,
        StoreModule.forRoot({
            ...fromRoot.reducers,
            feature: combineReducers(fromNocStore.reducers)
        })],
    providers: [
        {
            provide: Store,
            useValue: storeMock
        },
        {
            provide: UserService,
            useValue: {
                getUserDetails: () => of({})
            }
        },
        {
            provide: FeatureToggleService,
            useValue: {
                isEnabled: (flag) => of(flags[flag])
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    mockRouter = TestBed.inject(Router);
    spyOnProperty(mockRouter, 'url').and.returnValues('/cases', '/tasks/list', '/tasks/task-manager');
    fixture = TestBed.createComponent(HmctsGlobalHeaderComponent);
    component = fixture.componentInstance;
    component.headerTitle = {
      name: 'Service name',
      url: '#'
    };
    component.showItems = true;
    component.navigation = {
      label: 'Account navigation',
      items: [
        { text: 'Nav item 1', emit: '#1' },
        { text: 'Nav item 2', emit: '#1' }
      ]
    };
    store = TestBed.inject(Store);
    storeMock.pipe.and.returnValue(of(userDetails));
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters out menu items for which the user does not hold the correct role', () => {
    component.items = [{
      align: 'right',
      text: '1',
      href: '',
      active: false,
      roles: ['roleA']
    },
    {
      align: null,
      text: '2',
      href: '',
      active: false,
      roles: ['roleB']
    },
    {
      align: 'right',
      text: '3',
      href: '',
      active: false,
      roles: ['roleC']
    }];
    component.ngOnChanges(changesMock);
    const leftItems = component.leftItems;
    const rightItems = component.rightItems;
    leftItems.pipe(
      switchMap((items) => {
        expect(items).toEqual([]);
        return rightItems;
      })
    ).subscribe((items) => {
      expect(items).toEqual([]);
    });
  });

  it('filters out menu items for which not all features are enabled', (done) => {
    component.items = [{
      align: 'right',
      text: '1',
      href: '',
      active: false,
      flags: ['enabledFlag'],
      roles: ['roleA']
    },
    {
      align: null,
      text: '2',
      href: '',
      active: false,
      roles: ['roleB']
    },
    {
      align: 'right',
      text: '3',
      href: '',
      active: false,
      flags: ['enabledFlag', 'disabledFlag'],
      roles: ['roleC']
    }];
    component.ngOnChanges(changesMock);
    const leftItems = component.leftItems;
    const rightItems = component.rightItems;

    leftItems.pipe(
      switchMap((items) => {
        expect(items).toEqual([]);
        return rightItems;
      })
    ).subscribe((items) => {
      expect(items).toEqual([]);
      done();
    });
  });
});

