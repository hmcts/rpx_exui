import { TestBed } from '@angular/core/testing';
import { HeaderConfigService } from './header-config.service';
import { EnvironmentService } from '../../shared/services/environment.service';
import { of } from 'rxjs';
import { NavigationItem } from 'src/app/models';
import { EnvironmentConfig } from 'src/models/environmentConfig.model';

describe('HeaderConfigService', () => {
  let service: HeaderConfigService;
  let environmentServiceSpy: jasmine.SpyObj<EnvironmentService>;

  const mockHeaderConfig = {
    '(admin)|(superuser)': [{
      text: 'Admin Menu',
      href: '/admin/menu',
      active: true,
      ngClass: 'admin-class',
      align: 'right'
    },
    {
      text: 'User Management',
      href: '/admin/users',
      active: false,
      roles: ['admin'],
      ngClass: 'user-management-class',
      align: 'left'
    }],
    '(user)': [{
      text: 'User Dashboard',
      href: '/user/dashboard',
      active: true,
      ngClass: 'user-class',
      align: 'right'
    },
    {
      text: 'User Management',
      href: '/user/users',
      active: false,
      roles: ['user'],
      ngClass: 'user-management-class',
      align: 'left'
    }],
    '.+': [{
      text: 'default Dashboard',
      href: '/default/dashboard',
      active: true,
      ngClass: 'default-class',
      align: 'right'
    },
    {
      text: 'default Management',
      href: '/default/defaults',
      active: false,
      roles: ['default'],
      ngClass: 'default-management-class',
      align: 'left'
    }]
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EnvironmentService', ['config$']);

    TestBed.configureTestingModule({
      providers: [
        HeaderConfigService,
        { provide: EnvironmentService, useValue: spy }
      ]
    });

    service = TestBed.inject(HeaderConfigService);
    environmentServiceSpy = TestBed.inject(EnvironmentService) as jasmine.SpyObj<EnvironmentService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructHeaderConfig', () => {
    it('should return the correct header config based on user roles being admin', (done: DoneFn) => {
      const userRoles = ['admin', 'test'];
      const mockConfig: EnvironmentConfig = {
        idamWeb: '',
        clientId: '',
        oAuthCallback: '',
        protocol: '',
        oidcEnabled: '',
        paymentReturnUrl: '',
        headerConfig: mockHeaderConfig
      };

      environmentServiceSpy.config$ = of(mockConfig);

      service.constructHeaderConfig(userRoles).subscribe((result) => {
        expect(result).toEqual(mockHeaderConfig['(admin)|(superuser)'] as NavigationItem[]);
        done();
      });
    });

    it('should return the correct header config based on regex including multiple roles', (done: DoneFn) => {
      const userRoles = ['superuser', 'test'];
      const mockConfig: EnvironmentConfig = {
        idamWeb: '',
        clientId: '',
        oAuthCallback: '',
        protocol: '',
        oidcEnabled: '',
        paymentReturnUrl: '',
        headerConfig: mockHeaderConfig
      };

      environmentServiceSpy.config$ = of(mockConfig);

      service.constructHeaderConfig(userRoles).subscribe((result) => {
        expect(result).toEqual(mockHeaderConfig['(admin)|(superuser)'] as NavigationItem[]);
        done();
      });
    });

    it('should return the correct header config based on user roles being user', (done: DoneFn) => {
      const userRoles = ['user', 'test'];
      const mockConfig: EnvironmentConfig = {
        idamWeb: '',
        clientId: '',
        oAuthCallback: '',
        protocol: '',
        oidcEnabled: '',
        paymentReturnUrl: '',
        headerConfig: mockHeaderConfig
      };

      environmentServiceSpy.config$ = of(mockConfig);

      service.constructHeaderConfig(userRoles).subscribe((result) => {
        expect(result).toEqual(mockHeaderConfig['(user)'] as NavigationItem[]);
        done();
      });
    });

    it('should return the default header config if no regex matches', (done: DoneFn) => {
      const userRoles = ['magician', 'test'];
      const mockConfig: EnvironmentConfig = {
        idamWeb: '',
        clientId: '',
        oAuthCallback: '',
        protocol: '',
        oidcEnabled: '',
        paymentReturnUrl: '',
        headerConfig: mockHeaderConfig
      };

      environmentServiceSpy.config$ = of(mockConfig);

      service.constructHeaderConfig(userRoles).subscribe((result) => {
        expect(result).toEqual(mockHeaderConfig['.+'] as NavigationItem[]);
        done();
      });
    });
  });
});
