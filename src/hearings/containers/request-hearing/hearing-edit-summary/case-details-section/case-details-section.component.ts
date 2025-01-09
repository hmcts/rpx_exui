import { Component, Input, OnInit } from '@angular/core';
import { AmendmentLabelStatus, WithinPageProperties } from '../../../../../hearings/models/hearingsUpdateMode.enum';
import { HearingsService } from '../../../../../hearings/services/hearings.service';
import { CaseCategoryDisplayModel } from '../../../../models/caseCategory.model';
import { HearingRequestMainModel } from '../../../../models/hearingRequestMain.model';
import { LovRefDataModel } from '../../../../models/lovRefData.model';
import { CaseTypesUtils } from '../../../../utils/case-types.utils';

@Component({
  selector: 'exui-case-details-section',
  templateUrl: './case-details-section.component.html'
})
export class CaseDetailsSectionComponent implements OnInit {
  @Input() public caseTypeRefData: LovRefDataModel[];
  @Input() public hearingRequestMainModel: HearingRequestMainModel;

  public caseTypes: CaseCategoryDisplayModel[];
  public withinPage: WithinPageProperties;
  public amendmentLabelEnum = AmendmentLabelStatus;

  constructor (protected readonly hearingsService: HearingsService) {}

  public ngOnInit(): void {
    this.withinPage = this.hearingsService.propertiesUpdatedAutomatically.withinPage;
    this.caseTypes = CaseTypesUtils.getCaseCategoryDisplayModels(this.caseTypeRefData, this.hearingRequestMainModel.caseDetails?.caseCategories);
  }
}
