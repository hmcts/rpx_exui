import { Component, Input } from '@angular/core';
import { CaseFlagGroup } from '../../models/caseFlagGroup.model';
import { AmendmentLabelStatus } from '../../models/hearingsUpdateMode.enum';
import { PartyFlagsDisplayModel } from 'src/hearings/models/partyFlags.model';

@Component({
  selector: 'exui-case-flags',
  templateUrl: './case-flags.component.html',
  styleUrls: ['./case-flags.component.scss']
})
export class CaseFlagsComponent {
  @Input() public caseFlagsGroup: CaseFlagGroup[];
  @Input() public info: string;

  public amendmentLabelStatus = AmendmentLabelStatus;

  private checkName(name: string): boolean {
    return name?.includes('Language Interpreter');
  }

  public showDescription(partyFlag: PartyFlagsDisplayModel): boolean {
    return this.checkName(partyFlag.displayName) && partyFlag?.flagComment?.length > 0 && partyFlag?.flagDescription?.length > 0;
  }
}
