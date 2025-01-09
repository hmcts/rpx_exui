import * as moment from 'moment';
import {
  ActualDayPartyModel,
  ActualHearingDayModel,
  DisplayDayPartyModel,
  HearingActualsMainModel,
  HearingActualsModel,
  PlannedDayPartyModel,
  PlannedHearingDayModel
} from '../models/hearingActualsMainModel';

export class ActualHearingsUtils {
  public static getDate(dateTime: string): string {
    return dateTime ? moment(dateTime).format('YYYY-MM-DD') : null;
  }

  public static getActualHearingDays(hearingActualsMainModel: HearingActualsMainModel, isCheckYourAnswersPage: boolean): ActualHearingDayModel[] {
    let hearingDays: ActualHearingDayModel[];
    const hasAnyActuals = hearingActualsMainModel.hearingActuals?.actualHearingDays?.length > 0;

    hearingDays = hearingActualsMainModel.hearingPlanned.plannedHearingDays.map(
      (plannedDay) => {
        let existingActualData = {} as ActualHearingDayModel;
        if (hasAnyActuals) {
          existingActualData = hearingActualsMainModel.hearingActuals.actualHearingDays.find(
            (item) => item.hearingDate === this.getDate(plannedDay.plannedStartTime)
          );
        }
        // Check your answers page must display only actuals data
        if (isCheckYourAnswersPage) {
          return {
            hearingDate: existingActualData?.hearingDate || this.getDate(plannedDay.plannedStartTime),
            hearingStartTime: existingActualData?.hearingStartTime,
            hearingEndTime: existingActualData?.hearingEndTime,
            pauseDateTimes: existingActualData?.pauseDateTimes || [],
            notRequired: existingActualData?.notRequired || false,
            actualDayParties: ActualHearingsUtils.getActualDayParties(existingActualData, plannedDay, isCheckYourAnswersPage)
          };
        }
        // If not check your answers page, then if actual data exists then display
        // actual data else display planned data
        return {
          hearingDate: existingActualData?.hearingDate || this.getDate(plannedDay.plannedStartTime),
          hearingStartTime: existingActualData?.hearingStartTime ? existingActualData.hearingStartTime : plannedDay.plannedStartTime,
          hearingEndTime: existingActualData?.hearingEndTime ? existingActualData.hearingEndTime : plannedDay.plannedEndTime,
          pauseDateTimes: existingActualData?.pauseDateTimes || [],
          notRequired: existingActualData?.notRequired || false,
          actualDayParties: ActualHearingsUtils.getActualDayParties(existingActualData, plannedDay, isCheckYourAnswersPage)
        };
      });

    if (hearingDays && hearingDays.length > 0) {
      hearingDays = hearingDays.sort((a, b) => {
        return Date.parse(a.hearingDate) === Date.parse(b.hearingDate) ? 0 : Date.parse(a.hearingDate) > Date.parse(b.hearingDate) ? 1 : -1;
      });
    }

    return hearingDays;
  }

  public static getActualDayParties(existingActualData: ActualHearingDayModel, plannedDay: PlannedHearingDayModel, isCheckYourAnswersPage: boolean): ActualDayPartyModel[] {
    if (isCheckYourAnswersPage) {
      return existingActualData?.actualDayParties;
    }

    return existingActualData?.actualDayParties?.length > 0
      ? existingActualData.actualDayParties
      : plannedDay.parties.map((party) => {
        return {
          actualPartyId: party.partyID,
          partyRole: party.partyRole,
          partyChannelSubType: party.partyChannelSubType,
          representedParty: null,
          didNotAttendFlag: false,
          individualDetails: party.individualDetails ? {
            firstName: party.individualDetails.firstName,
            lastName: party.individualDetails.lastName
          } : null,
          actualOrganisationName: party.organisationDetails ? party.organisationDetails.name : null
        };
      });
  }

  public static mergeSingleHearingPartActuals(hearingActualsMainModel: HearingActualsMainModel, hearingDate: string,
    updatedActuals: ActualHearingDayModel): HearingActualsModel {
    const hearingActuals = {
      actualHearingDays: hearingActualsMainModel.hearingActuals?.actualHearingDays
        ? [...hearingActualsMainModel.hearingActuals.actualHearingDays] : []
    } as HearingActualsModel;

    if (hearingActualsMainModel.hearingActuals?.hearingOutcome?.hearingResult) {
      hearingActuals.hearingOutcome = { ...hearingActualsMainModel.hearingActuals.hearingOutcome };
    }

    let indexOfActual: number;
    if (hearingActuals.actualHearingDays?.length > 0) {
      indexOfActual = hearingActuals.actualHearingDays.findIndex(
        (item) => item.hearingDate === hearingDate
      );
    }

    if (indexOfActual >= 0) {
      hearingActuals.actualHearingDays[indexOfActual] = {
        ...hearingActuals.actualHearingDays[indexOfActual],
        ...updatedActuals
      };
    } else {
      const plannedHearingDate = hearingActualsMainModel.hearingPlanned.plannedHearingDays.find(
        (day) => ActualHearingsUtils.getDate(day.plannedStartTime) === hearingDate
      );

      const newHearingActual = {
        hearingDate,
        hearingStartTime: plannedHearingDate.plannedStartTime,
        hearingEndTime: plannedHearingDate.plannedEndTime,
        actualDayParties: [],
        pauseDateTimes: [],
        notRequired: null
      };

      hearingActuals.actualHearingDays.push({
        ...newHearingActual,
        ...updatedActuals
      });
    }

    return hearingActuals;
  }

  public static getActualDayIndexFromHearingDate(hearingActualsMainModel: HearingActualsMainModel, hearingDate: string): number | undefined {
    const hasActualsHearingDays = hearingActualsMainModel?.hearingActuals?.actualHearingDays?.length > 0;
    let index: number;
    if (hasActualsHearingDays) {
      index = hearingActualsMainModel.hearingActuals.actualHearingDays
        .findIndex((item) => item.hearingDate === hearingDate);
    }

    return index;
  }

  public static getPlannedDayIndexFromHearingDate(hearingActualsMainModel: HearingActualsMainModel, hearingDate: string): number | undefined {
    const hasPlannedHearingDays = hearingActualsMainModel?.hearingPlanned?.plannedHearingDays;
    let index: number;
    if (hasPlannedHearingDays) {
      index = hearingActualsMainModel.hearingPlanned.plannedHearingDays
        .findIndex((item) => ActualHearingsUtils.getDate(item.plannedStartTime) === hearingDate);
    }

    return index;
  }

  public static getParties(hearingActualsMainModel: HearingActualsMainModel, hearingDate: string): DisplayDayPartyModel[] {
    const plannedDayIndex = ActualHearingsUtils.getPlannedDayIndexFromHearingDate(hearingActualsMainModel, hearingDate);
    const actualHearingDay = hearingActualsMainModel.hearingActuals?.actualHearingDays?.find((actualDay) => actualDay.hearingDate === hearingDate);
    const actualDayParties = actualHearingDay?.actualDayParties;

    const plannedParties = plannedDayIndex >= 0
      ? hearingActualsMainModel.hearingPlanned.plannedHearingDays[plannedDayIndex].parties
      : [];

    const plannedPartyIds: string[] = plannedParties.map((plannedParty) => plannedParty.partyID);
    const actualPartiesFromPlanned: ActualDayPartyModel[] = actualDayParties?.filter((party) => plannedPartyIds.some((id) => id === party.actualPartyId));
    const actualDisplayModels: DisplayDayPartyModel[] = actualPartiesFromPlanned?.map((party) => ActualHearingsUtils.actualToDisplayModel(party));
    const plannedDisplayModels: DisplayDayPartyModel[] = plannedParties.map((party) => ActualHearingsUtils.plannedToDisplayModel(party));

    return actualDisplayModels?.length
      ? actualDisplayModels
      : plannedDisplayModels;
  }

  public static getPartiesCYA(hearingActualsMainModel: HearingActualsMainModel, hearingDate: string): ActualDayPartyModel[] {
    return hearingActualsMainModel.hearingActuals?.actualHearingDays?.find((actualDay) => actualDay.hearingDate === hearingDate)?.actualDayParties;
  }

  public static getAttendees(hearingActualsMainModel: HearingActualsMainModel, hearingDate: string): ActualDayPartyModel[] {
    const plannedDayIndex = ActualHearingsUtils.getPlannedDayIndexFromHearingDate(hearingActualsMainModel, hearingDate);
    const plannedParties = hearingActualsMainModel.hearingPlanned.plannedHearingDays[plannedDayIndex].parties;
    const plannedPartiesIds = plannedParties.map((party) => party.partyID);

    let actualParties: ActualDayPartyModel[] = [];
    if (hearingActualsMainModel && hearingActualsMainModel.hearingActuals && hearingActualsMainModel.hearingActuals.actualHearingDays) {
      const actualHearingDayIndex = ActualHearingsUtils.getActualDayIndexFromHearingDate(hearingActualsMainModel, hearingDate);
      actualParties = actualHearingDayIndex >= 0 ? hearingActualsMainModel.hearingActuals.actualHearingDays[actualHearingDayIndex].actualDayParties : [];
    }

    return actualParties.filter((actualParty) => !plannedPartiesIds.includes(actualParty.actualPartyId));
  }

  public static getRepresentingAttendee(partyId: string, hearingActualsMainModel: HearingActualsMainModel, hearingDate: string): string {
    let party: PlannedDayPartyModel;
    const plannedDayIndex = ActualHearingsUtils.getPlannedDayIndexFromHearingDate(hearingActualsMainModel, hearingDate);
    if (plannedDayIndex >= 0) {
      const plannedHearingDay = hearingActualsMainModel.hearingPlanned.plannedHearingDays[plannedDayIndex];
      party = plannedHearingDay.parties.find((x) => x.partyID === partyId.toString());
    }

    if (party && party.individualDetails) {
      const names = [party.individualDetails.firstName, party.individualDetails.lastName].filter((item) => item);
      return names.join(' ');
    }

    return '';
  }

  public static actualToDisplayModel(actualDayPartyModel: ActualDayPartyModel): DisplayDayPartyModel {
    return {
      partyID: actualDayPartyModel.actualPartyId,
      partyRole: actualDayPartyModel.partyRole,
      individualDetails: actualDayPartyModel.individualDetails,
      actualOrganisationName: actualDayPartyModel.actualOrganisationName,
      partyChannelSubType: actualDayPartyModel.partyChannelSubType
    };
  }

  public static plannedToDisplayModel(plannedDayPartyModel: PlannedDayPartyModel): DisplayDayPartyModel {
    return {
      partyID: plannedDayPartyModel.partyID,
      partyRole: plannedDayPartyModel.partyRole,
      individualDetails: plannedDayPartyModel.individualDetails,
      actualOrganisationName: plannedDayPartyModel.organisationDetails && plannedDayPartyModel.organisationDetails.name,
      partyChannelSubType: plannedDayPartyModel.partyChannelSubType
    };
  }

  public static getPauseDateTime(day: ActualHearingDayModel, state: 'start' | 'end'): string {
    const pauseTimeState = state === 'start' ? 'pauseStartTime' : 'pauseEndTime';
    return day.pauseDateTimes && day.pauseDateTimes.length && day.pauseDateTimes[0] && day.pauseDateTimes[0].pauseStartTime
      ? day.pauseDateTimes[0][pauseTimeState] : null;
  }

  public static formatTime(time: string, format: string = 'HH:mm'): string {
    return time ? moment(time).format(format) : null;
  }
}
