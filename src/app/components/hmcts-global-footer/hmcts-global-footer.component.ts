import { Component, Input } from '@angular/core';
import { Helper, Navigation } from '../../containers/footer/footer.model';
import { RpxLanguage, RpxTranslationService } from 'rpx-xui-translation';

@Component({
  selector: 'exui-app-hmcts-global-footer',
  templateUrl: './hmcts-global-footer.component.html',
  styleUrls: ['./hmcts-global-footer.component.scss']
})
export class HmctsGlobalFooterComponent {
  @Input() public help: Helper;
  @Input() public navigation: Navigation;

  public get currentLang() {
    return this.langService.language;
  }

  constructor(private readonly langService: RpxTranslationService) { }

  public toggleLanguage(lang: RpxLanguage): void {
    this.langService.language = lang;
  }
}
