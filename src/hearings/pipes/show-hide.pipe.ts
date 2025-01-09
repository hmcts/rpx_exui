import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app/store';
import { AdditionalInstructionsExclusionHiddenConverter } from '../converters/additional-instructions-exclusion.hidden.converter';
import { DefaultHiddenConverter } from '../converters/default.hidden.converter';
import { HearingFacilitiesExclusionHiddenConverter } from '../converters/hearing-facilities-exclusion.hidden.converter';
import { HearingRequirementsExclusionHiddenConverter } from '../converters/hearing-requirements-exclusion.hidden.converter';
import { HearingStageExclusionHiddenConverter } from '../converters/hearing-stage-exclusion.hidden.converter';
import { HearingTimingExclusionHiddenConverter } from '../converters/hearing-timing-exclusion.hidden.converter';
import { HearingVenueExclusionHiddenConverter } from '../converters/hearing-venue-exclusion.hidden.converter';
import { HiddenConverter } from '../converters/hidden.converter';
import { JudgeDetailsExclusionHiddenConverter } from '../converters/judge-details-exclusion.hidden.converter';
import { JudgeExclusionHiddenConverter } from '../converters/judge-exclusion.hidden.converter';
import { JudgeNameHiddenConverter } from '../converters/judge-name.hidden.converter';
import { JudgeTypesHiddenConverter } from '../converters/judge-types.hidden.converter';
import { LinkedHearingsExclusionHiddenConverter } from '../converters/linked-hearings-exclusion.hidden.converter';
import { ListedHearingViewerHiddenConverter } from '../converters/listed-hearing-viewer.hidden.converter';
import { ListedHiddenConverter } from '../converters/listed.hidden.converter';
import { NotListedHiddenConverter } from '../converters/not-listed.hidden.converter';
import { PanelDetailsExclusionHiddenConverter } from '../converters/panel-details-exclusion.hidden.converter';
import { PanelExclusionHiddenConverter } from '../converters/panel-exclusion.hidden.converter';
import { PanelInclusionHiddenConverter } from '../converters/panel-inclusion.hidden.converter';
import { PanelRolesHiddenConverter } from '../converters/panel-roles.hidden.converter';
import { PaperHearingHiddenConverter } from '../converters/paper-hearing.hidden.converter';
import { ParticipantAttendanceExclusionHiddenConverter } from '../converters/participant-attendance-exclusion.hidden.converter';
import { WelshHiddenConverter } from '../converters/welsh.hidden.converter';
import { IsHiddenSource } from '../models/hearings.enum';
import { LocationsDataService } from '../services/locations-data.service';
import { State } from '../store';

@Pipe({
  name: 'isHidden'
})
export class ShowHidePipe implements PipeTransform {
  constructor(protected readonly locationsDataService: LocationsDataService,
    private readonly store: Store<fromRoot.State>) {}

  public transform(isHiddenSource: IsHiddenSource, hearingState$: Observable<State>): Observable<boolean> {
    let converter: HiddenConverter = new DefaultHiddenConverter();
    switch (isHiddenSource) {
      case IsHiddenSource.WELSH_LOCATION:
        converter = new WelshHiddenConverter(this.locationsDataService);
        break;
      case IsHiddenSource.JUDGE_NAME:
        converter = new JudgeNameHiddenConverter();
        break;
      case IsHiddenSource.JUDGE_TYPES:
        converter = new JudgeTypesHiddenConverter();
        break;
      case IsHiddenSource.JUDGE_EXCLUSION:
        converter = new JudgeExclusionHiddenConverter();
        break;
      case IsHiddenSource.PAPER_HEARING:
        converter = new PaperHearingHiddenConverter();
        break;
      case IsHiddenSource.PANEL_INCLUSION:
        converter = new PanelInclusionHiddenConverter();
        break;
      case IsHiddenSource.PANEL_EXCLUSION:
        converter = new PanelExclusionHiddenConverter();
        break;
      case IsHiddenSource.PANEL_DETAILS_EXCLUSION:
        converter = new PanelDetailsExclusionHiddenConverter();
        break;
      case IsHiddenSource.JUDGE_DETAILS_EXCLUSION:
        converter = new JudgeDetailsExclusionHiddenConverter();
        break;
      case IsHiddenSource.HEARING_TIMING_EXCLUSION:
        converter = new HearingTimingExclusionHiddenConverter();
        break;
      case IsHiddenSource.PANEL_ROLES:
        converter = new PanelRolesHiddenConverter();
        break;
      case IsHiddenSource.HEARING_REQUIREMENTS_EXCLUSION:
        converter = new HearingRequirementsExclusionHiddenConverter();
        break;
      case IsHiddenSource.HEARING_FACILITIES_EXCLUSION:
        converter = new HearingFacilitiesExclusionHiddenConverter();
        break;
      case IsHiddenSource.HEARING_STAGE_EXCLUSION:
        converter = new HearingStageExclusionHiddenConverter();
        break;
      case IsHiddenSource.HEARING_VENUE_EXCLUSION:
        converter = new HearingVenueExclusionHiddenConverter();
        break;
      case IsHiddenSource.LINKED_HEARINGS_EXCLUSION:
        converter = new LinkedHearingsExclusionHiddenConverter();
        break;
      case IsHiddenSource.PARTICIPANT_ATTENDANCE_EXCLUSION:
        converter = new ParticipantAttendanceExclusionHiddenConverter();
        break;
      case IsHiddenSource.ADDITIONAL_INSTRUCTION_EXCLUSION:
        converter = new AdditionalInstructionsExclusionHiddenConverter();
        break;
      case IsHiddenSource.LISTED_HEARING_VIEWER:
        converter = new ListedHearingViewerHiddenConverter(this.store);
        break;
      case IsHiddenSource.LISTED:
        converter = new ListedHiddenConverter();
        break;
      case IsHiddenSource.NOT_LISTED:
        converter = new NotListedHiddenConverter();
        break;
      default:
        break;
    }
    return converter.transformHidden(hearingState$);
  }
}
