import { Component, Input } from '@angular/core';
import { AppUtils } from '../../../app/app-utils';
import { PriorityLimits, TaskPriority } from '../../enums';

@Component({
  selector: 'exui-priority-field',
  templateUrl: './priority-field.component.html'
})
export class PriorityFieldComponent {
  /**
   * The current date being examined
   */
  @Input() public priorityDate: Date;

  @Input() public majorPriority?: number;

  public get priority(): TaskPriority {
    if (this.majorPriority === PriorityLimits.High) {
      if (AppUtils.isPriorityDateTimePast(this.priorityDate)) {
        return TaskPriority.HIGH;
      }
      return AppUtils.isPriorityDateTimeInNext24Hours(this.priorityDate) ? TaskPriority.MEDIUM : TaskPriority.LOW;
    }
    if (this.majorPriority <= PriorityLimits.Urgent) {
      return TaskPriority.URGENT;
    }
    if (this.majorPriority > PriorityLimits.High) {
      return TaskPriority.LOW;
    }
    return TaskPriority.HIGH;
  }
}
