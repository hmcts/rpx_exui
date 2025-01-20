import { ExtraOptions, Routes } from '@angular/router';
import { FeatureToggleGuard, RoleGuard, RoleMatching } from '@hmcts/rpx-xui-common-lib';
import { BookingServiceDownComponent, RefreshBookingServiceDownComponent } from '../booking/containers';
import { BookingSystemErrorComponent } from '../booking/containers/utils/booking-system-error/booking-system-error.component';
import { MyTasksComponent } from '../work-allocation/containers';
import {
  AccessibilityComponent,
  ApplicationRoutingComponent,
  CookiePolicyComponent,
  GetHelpComponent,
  MediaViewerWrapperComponent,
  NotAuthorisedComponent,
  PrivacyPolicyComponent,
  ServiceDownComponent,
  SignedOutComponent,
  ExpiredLoginLinkComponent
} from './components';
import { AcceptTcWrapperComponent, LegacyTermsAndConditionsComponent, TermsAndConditionsComponent } from './containers';
import { AcceptTermsGuard } from './guards/acceptTerms.guard';
import { AuthGuard } from './services/auth/auth.guard';

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled'
};

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ApplicationRoutingComponent,
    pathMatch: 'full'
  },
  {
    path: 'cases',
    canActivate: [AuthGuard, AcceptTermsGuard],
    loadChildren: () => import('../cases/cases.module').then((m) => m.CasesModule)
  },
  {
    path: 'booking',
    canActivate: [AuthGuard, AcceptTermsGuard],
    loadChildren: () => import('../booking/booking.module').then((m) => m.BookingModule)
  },
  {
    path: 'work',
    canActivate: [AuthGuard, AcceptTermsGuard],
    loadChildren: () => import('../work-allocation/work-allocation.module').then((m) => m.WorkAllocationModule)
  },
  {
    // EUI-6555 - Stop WA1 urls from being accessible via bookmarks
    path: 'tasks/:subRoute',
    pathMatch: 'prefix',
    canActivate: [AuthGuard, AcceptTermsGuard],
    component: MyTasksComponent
  },
  {
    // EUI-6555 - Stop WA1 urls from being accessible via bookmarks
    path: 'tasks',
    redirectTo: 'work/my-work/list'
  },
  {
    path: 'role-access',
    canActivate: [AuthGuard, AcceptTermsGuard],
    loadChildren: () => import('../role-access/role-access.module').then((m) => m.RoleAccessModule)
  },
  // TODO: remove redundant redirections
  { path: 'case/:jurisdiction/:case-type/:cid', redirectTo: 'cases/case-details/:cid', pathMatch: 'full' },
  { path: 'case/:cid', redirectTo: 'cases/case-details/:cid', pathMatch: 'full' },
  { path: 'case-details/:cid', redirectTo: 'cases/case-details/:cid', pathMatch: 'full' },
  { path: 'v2/case/:cid', redirectTo: 'cases/case-details/:cid', pathMatch: 'full' },
  {
    path: 'case/:jurisdiction/:case-type/:cid/trigger/:triggerPath',
    redirectTo: 'cases/case-details/:cid/trigger/:triggerPath', pathMatch: 'full'
  },
  {
    path: 'case/:jurisdiction/:case-type/:cid/trigger/:triggerPath/:triggerPath2',
    redirectTo: 'cases/case-details/:cid/trigger/:triggerPath/:triggerPath2', pathMatch: 'full'
  },
  {
    path: 'noc',
    canActivate: [AuthGuard, AcceptTermsGuard],
    loadChildren: () => import('../noc/noc.module').then((m) => m.NocModule)
  },
  {
    path: 'hearings',
    canActivate: [AuthGuard, AcceptTermsGuard],
    loadChildren: () => import('../hearings/hearings.module').then((m) => m.HearingsModule)
  },
  {
    path: 'cookies',
    component: CookiePolicyComponent,
    data: {
      title: 'Cookie Policy'
    }
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: {
      title: 'Privacy Policy'
    }
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
    data: {
      title: 'Terms and Conditions'
    }
  },
  {
    path: 'legacy-terms-and-conditions',
    component: LegacyTermsAndConditionsComponent,
    data: {
      title: 'Terms and Conditions'
    }
  },
  {
    path: 'accept-terms-and-conditions',
    component: AcceptTcWrapperComponent,
    data: {
      title: 'Accept Terms and Conditions'
    }
  },
  {
    path: 'accessibility',
    component: AccessibilityComponent,
    data: {
      title: 'Accessibility Statement'
    }
  },
  {
    path: 'service-down',
    component: ServiceDownComponent,
    data: {
      title: 'Service Unavailable'
    }
  },
  {
    path: 'booking-service-down',
    component: BookingServiceDownComponent,
    data: {
      title: 'Service Unavailable'
    }
  },
  {
    path: 'booking-system-error',
    component: BookingSystemErrorComponent,
    data: {
      title: 'Service Unavailable'
    }
  },
  {
    path: 'refresh-booking-service-down',
    component: RefreshBookingServiceDownComponent,
    data: {
      title: 'Service Unavailable'
    }
  },
  {
    path: 'media-viewer',
    component: MediaViewerWrapperComponent,
    data: {
      title: 'View Document'
    }
  },
  { path: 'service-down', component: ServiceDownComponent },
  { path: 'not-authorised', component: NotAuthorisedComponent },
  { path: 'expired-login-link',
    component: ExpiredLoginLinkComponent,
    data: { title: 'Expired Login Link' }
  },
  { path: 'media-viewer', component: MediaViewerWrapperComponent },
  {
    path: 'get-help',
    component: GetHelpComponent,
    data: {
      title: 'Get Help'
    }
  },
  {
    path: 'idle-sign-out',
    component: SignedOutComponent,
    data: {
      title: 'You have been signed out'
    }
  },
  {
    path: 'search',
    canActivate: [AuthGuard, AcceptTermsGuard, FeatureToggleGuard],
    loadChildren: () => import('../search/search.module').then((m) => m.SearchModule),
    data: {
      title: 'Search cases',
      needsFeaturesEnabled: ['feature-global-search'],
      featureDisabledRedirect: '/'
    }
  },
  {
    path: 'refunds',
    canActivate: [AuthGuard, AcceptTermsGuard, FeatureToggleGuard],
    loadChildren: () => import('../refunds/refunds.module').then((m) => m.RefundsModule),
    data: {
      title: 'Refunds',
      needsFeaturesEnabled: ['feature-refunds'],
      featureDisabledRedirect: '/'
    }
  },
  {
    path: 'staff',
    canActivate: [AuthGuard, AcceptTermsGuard, RoleGuard],
    loadChildren: () => import('../staff-administrator/staff-administrator.module').then((m) => m.StaffAdministratorModule),
    data: {
      needsRole: ['staff-admin'],
      roleMatching: RoleMatching.ALL,
      noRoleMatchRedirect: '/'
    }
  },
  {
    path: 'query-management',
    canActivate: [AuthGuard, AcceptTermsGuard],
    loadChildren: () => import('../cases/cases.module').then((m) => m.CasesModule)
    // TODO Define feature toggle
  },
  {
    path: '**',
    redirectTo: '/cases',
    pathMatch: 'full'
  }
];
