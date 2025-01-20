import { InfoMessageContainerComponent } from '../containers/info-message-container/info-message-container.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { CaseReferenceSearchBoxComponent } from './case-reference-search-box/case-reference-search-box.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { ExpiredLoginLinkComponent } from './expired-login-link/expired-login-link.component';
import { GetHelpComponent } from './get-help/get-help.component';
import { HeaderComponent } from './header/header.component';
import { HmctsGlobalFooterComponent } from './hmcts-global-footer/hmcts-global-footer.component';
import { HmctsGlobalHeaderComponent } from './hmcts-global-header/hmcts-global-header.component';
import { InfoMessageComponent } from './info-message/info-message.component';
import { MediaViewerWrapperComponent } from './media-viewer-wrapper/media-viewer-wrapper.component';
import { NotAuthorisedComponent } from './not-authorised/not-authorised.component';
import { PhaseBannerComponent } from './phase-banner/phase-banner.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ApplicationRoutingComponent } from './routing/application-routing.component';
import { ServiceDownComponent } from './service-down/service-down.component';
import { SignedOutComponent } from './signed-out/signed-out.component';

export const components: any[] = [
  HmctsGlobalFooterComponent,
  HeaderComponent,
  HmctsGlobalHeaderComponent,
  CookiePolicyComponent,
  NotAuthorisedComponent,
  PrivacyPolicyComponent,
  AccessibilityComponent,
  PhaseBannerComponent,
  ServiceDownComponent,
  ErrorMessageComponent,
  MediaViewerWrapperComponent,
  GetHelpComponent,
  SignedOutComponent,
  ApplicationRoutingComponent,
  CaseReferenceSearchBoxComponent,
  InfoMessageContainerComponent,
  InfoMessageComponent,
  ExpiredLoginLinkComponent
];

export * from './hmcts-global-footer/hmcts-global-footer.component';
export * from './header/header.component';
export * from './hmcts-global-header/hmcts-global-header.component';
export * from './phase-banner/phase-banner.component';
export * from './service-down/service-down.component';
export * from './error-message/error-message.component';
export * from './cookie-policy/cookie-policy.component';
export * from './privacy-policy/privacy-policy.component';
export * from './accessibility/accessibility.component';
export * from './media-viewer-wrapper/media-viewer-wrapper.component';
export * from './get-help/get-help.component';
export * from './signed-out/signed-out.component';
export * from './not-authorised/not-authorised.component';
export * from './routing/application-routing.component';
export * from './case-reference-search-box/case-reference-search-box.component';
export * from '../containers/info-message-container/info-message-container.component';
export * from './info-message/info-message.component';
export * from './expired-login-link/expired-login-link.component';
