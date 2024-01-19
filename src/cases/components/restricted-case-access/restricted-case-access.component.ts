import { Component, Input } from '@angular/core';
import { RestrictedCase } from '../../models/restricted-case.model';

@Component({
  selector: 'exui-restricted-case-access',
  templateUrl: './restricted-case-access.component.html'
})
export class RestrictedCaseAccessComponent {
  @Input() restrictedCases: RestrictedCase[];
}
