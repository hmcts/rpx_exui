import { Component, Input } from '@angular/core';
import { HearingsService } from '../../../../../hearings/services/hearings.service';

@Component({
  selector: 'exui-warning-and-error-section',
  templateUrl: './warning-and-error-section.component.html'
})
export class WarningAndErrorSectionComponent {
  @Input() public isPagelessAttributeChanged: boolean;
  @Input() public isWithinPageAttributeChanged: boolean;
  @Input() public pageVisitChangeExists: boolean;

  constructor(protected readonly hearingsService: HearingsService) {
  }

  public displayValidationError(): boolean {
    return this.hearingsService.displayValidationError && this.hearingsService.submitUpdatedRequestClicked;
  }
}
