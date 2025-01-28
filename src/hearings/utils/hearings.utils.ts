import * as _ from 'lodash';
import * as moment from 'moment';
import { HearingConditions } from '../models/hearingConditions';
import { HearingDayScheduleModel } from '../models/hearingDaySchedule.model';
import { HearingRequestMainModel } from '../models/hearingRequestMain.model';
import { HearingWindowModel } from '../models/hearingWindow.model';
import { HearingDateEnum } from '../models/hearings.enum';
import { IndividualDetailsModel } from '../models/individualDetails.model';
import { LovRefDataModel } from '../models/lovRefData.model';
import { PartyDetailsModel } from '../models/partyDetails.model';
import { ServiceHearingValuesModel } from '../models/serviceHearingValues.model';
import { PartyType } from 'api/hearings/models/hearings.enum';
import { Section } from '../models/section';

export class HearingsUtils {
  public static hasPropertyAndValue(conditions: HearingConditions, propertyName: string, propertyValue: any): boolean {
    return conditions && conditions.hasOwnProperty(propertyName) && conditions[propertyName] === propertyValue;
  }

  public static flattenArray(models: LovRefDataModel[]): LovRefDataModel[] {
    if (Array.isArray(models)) {
      return models.concat(...models.map((lovData) => lovData.child_nodes && lovData.child_nodes.length ?
        this.flattenArray(lovData.child_nodes) : []));
    }

    return models;
  }

  public static getValue(key: string, lovRefDataModels: LovRefDataModel[]): string {
    const flatChannels = HearingsUtils.flattenArray(lovRefDataModels);
    const foundChannel = flatChannels && flatChannels.find((channel) => channel.key === key);
    return foundChannel ? foundChannel.value_en : key;
  }

  public static getValues(keys: string[], lovRefDataModels: LovRefDataModel[]): string[] {
    const flatChannels = HearingsUtils.flattenArray(lovRefDataModels);
    return keys && keys.length && keys.map((key) => {
      const foundChannel = flatChannels.find((channel) => channel.key === key);
      return foundChannel ? foundChannel.value_en : key;
    });
  }

  public static sortHearingDaySchedule(hearingDaySchedule: HearingDayScheduleModel[]): HearingDayScheduleModel[] {
    if (!hearingDaySchedule || hearingDaySchedule.length === 0) {
      return hearingDaySchedule;
    }
    return hearingDaySchedule.slice().sort((schedule1, schedule2) =>
      moment.utc(schedule1.hearingStartDateTime).diff(moment.utc(schedule2.hearingStartDateTime))
    );
  }

  public static getHearingLength(duration: number): string {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    if (duration > 0) {
      minutes = duration % 60;
      duration = duration - minutes;
      days = Math.floor((duration / 60) / 6);
      hours = Math.floor((duration / 60) % 6);
      let formattedHearingLength = '';
      if (days > 0) {
        const daysLabel = days > 1 ? 'Days' : 'Day';
        formattedHearingLength = `${days} ${daysLabel}`;
      }
      if (hours > 0) {
        const hoursLabel = hours > 1 ? 'Hours' : 'Hour';
        formattedHearingLength = formattedHearingLength.length > 0 ? `${formattedHearingLength} ${hours} ${hoursLabel}` : `${hours} ${hoursLabel}`;
      }
      if (minutes > 0) {
        const minutesLabel = 'Minutes';
        formattedHearingLength = formattedHearingLength.length > 0 ? `${formattedHearingLength} ${minutes} ${minutesLabel}` : `${minutes} ${minutesLabel}`;
      }
      if (formattedHearingLength.length > 0) {
        return formattedHearingLength;
      }
    }
    return '';
  }

  public static getHRMHearingWindow(hearingRequestMainModel: HearingRequestMainModel): HearingWindowModel {
    return hearingRequestMainModel.hearingDetails.hearingWindow && Object.keys(hearingRequestMainModel.hearingDetails.hearingWindow).length === 0
      ? null
      : hearingRequestMainModel.hearingDetails.hearingWindow;
  }

  public static getHearingWindow(hearingWindow: HearingWindowModel): HearingWindowModel {
    return hearingWindow && Object.keys(hearingWindow).length === 0
      ? null
      : hearingWindow;
  }

  public static getPartiesNotAvailableDates(parties: PartyDetailsModel[]): string[] {
    const partiesNotAvailableDates: string[] = [];
    const unavailabilityDateList = parties.flatMap((party) => party.unavailabilityRanges);
    unavailabilityDateList?.forEach((dateRange) => {
      if (dateRange) {
        const startDate = moment(dateRange.unavailableFromDate);
        const endDate = moment(dateRange.unavailableToDate);

        while (startDate <= endDate) {
          const currentDate = startDate.format(HearingDateEnum.DisplayMonth);

          partiesNotAvailableDates.push(currentDate);

          startDate.add(1, 'd');
        }
      }
    });
    const uniqueDates = [...new Set(partiesNotAvailableDates)];
    return uniqueDates.sort((currentDate, previousDate) => new Date(currentDate).getTime() - new Date(previousDate).getTime());
  }

  public static getPartyNameFormatted(individualDetails: IndividualDetailsModel): string {
    if (individualDetails) {
      return `${individualDetails.firstName} ${individualDetails.lastName}`;
    }
    return '';
  }

  /**
   * Returns a boolean value based on the difference between
   * the party name in hearing request and the party name in service hearing values
   *
   * @static
   * @param {PartyDetailsModel} partyInHMC party in hearing request returned by HMC API
   * @param {PartyDetailsModel} partyInSHV party in service hearing values returned by the integrated service
   * @return {*}  {boolean}
   * @memberof HearingsUtils
   */
  public static hasPartyNameChanged(partyInHMC: PartyDetailsModel, partyInSHV: PartyDetailsModel): boolean {
    if (partyInHMC.individualDetails && partyInSHV.individualDetails) {
      if ((partyInHMC.individualDetails.firstName !== partyInSHV.individualDetails.firstName) ||
        (partyInHMC.individualDetails.lastName !== partyInSHV.individualDetails.lastName)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns a boolean value on the difference between
   * the unavailability dates of the parties
   *
   * @static
   * @param {PartyDetailsModel[]} partiesInHMC list of parties in hearing request returned by HMC API
   * @param {PartyDetailsModel[]} partiesInSHV list of parties in service hearing values returned by the integrated service
   * @returns {*} {boolean}
   * @memberof HearingsUtils
   */
  public static hasPartyUnavailabilityDatesChanged(partiesInHMC: PartyDetailsModel[], partiesInSHV: PartyDetailsModel[]): boolean {
    const partiesNotAvailableDatesHMC = HearingsUtils.getPartiesNotAvailableDates(partiesInHMC);
    const partiesNotAvailableDatesSHV = HearingsUtils.getPartiesNotAvailableDates(partiesInSHV);

    return !_.isEqual(partiesNotAvailableDatesSHV, partiesNotAvailableDatesHMC);
  }

  public static hasHearingDurationChanged(length: number, lengthToCompare: number): boolean {
    return !_.isEqual(length, lengthToCompare);
  }

  public static hasHearingPriorityChanged(priority: string, priorityToCompare: string): boolean {
    return !_.isEqual(priority, priorityToCompare);
  }

  /**
   * Returns a boolean value on the difference between
   * two hearing windows.
   *
   * @static
   * @param {HearingWindowModel} hearingWindow hearing window.
   * @param {HearingWindowModel} hearingWindowToCompare hearing window to compare to.
   * @returns {*} {boolean}
   * @memberof HearingsUtils
   */
  public static hasHearingDatesChanged(hearingWindow: HearingWindowModel, hearingWindowToCompare: HearingWindowModel): boolean {
    if (this.isDateRangeChanged(hearingWindow, hearingWindowToCompare)) {
      return true;
    }
    if (this.isFirstDateTimeChanged(hearingWindow, hearingWindowToCompare)) {
      return true;
    }
    return false;
  }

  private static isDateRangeChanged(hearingWindow: HearingWindowModel, hearingWindowToCompare: HearingWindowModel): boolean {
    const hasStartDateChanged = hearingWindow?.dateRangeStart && this.hasDateChanged(hearingWindowToCompare?.dateRangeStart, hearingWindow?.dateRangeStart);
    const hasEndDateChanged = hearingWindow?.dateRangeEnd && HearingsUtils.hasDateChanged(hearingWindowToCompare?.dateRangeEnd, hearingWindow?.dateRangeEnd);
    if (hasStartDateChanged || hasEndDateChanged) {
      return true;
    }
    if (!hearingWindow?.dateRangeStart && !hearingWindow?.dateRangeEnd &&
      (hearingWindowToCompare?.dateRangeStart || hearingWindowToCompare?.dateRangeEnd)) {
      return true;
    }
    return false;
  }

  private static isFirstDateTimeChanged(hearingWindow: HearingWindowModel, hearingWindowToCompare: HearingWindowModel): boolean {
    if (hearingWindow?.firstDateTimeMustBe) {
      return HearingsUtils.hasDateChanged(hearingWindowToCompare?.firstDateTimeMustBe, hearingWindow?.firstDateTimeMustBe);
    }
    return hearingWindowToCompare?.firstDateTimeMustBe ? true : false;
  }

  /**
   * Returns a boolean value on the difference between
   * the dateRangeEnd of the parties
   *
   * @static
   * @param {String} inputDateString from HMC hearing window returned by HMC API
   * @param {String} dateToCompareString hearing window returned by the integrated service
   * @returns {*} {boolean}
   * @memberof HearingsUtils
   */
  public static hasDateChanged(inputDateString: string, dateToCompareString: string): boolean {
    const inputDate = inputDateString ? HearingsUtils.convertStringToDate(inputDateString): null;
    const dateToCompare = dateToCompareString ? HearingsUtils.convertStringToDate(dateToCompareString): null;

    return !_.isEqual(inputDate, dateToCompare);
  }

  static convertStringToDate(date: string): number {
    return new Date(date).setHours(0, 0, 0, 0);
  }

  public static checkHearingPartiesConsistency(hearingRequestMainModel: HearingRequestMainModel, serviceHearingValuesModel: ServiceHearingValuesModel): boolean {
    const individualPartiesInHMC = hearingRequestMainModel.partyDetails.filter((party) => party.partyType === PartyType.IND);
    const individualHMCPartyIds = individualPartiesInHMC.map((party) => party.partyID);
    const individualPartiesInSHV = serviceHearingValuesModel.parties.filter((party) => party.partyType === PartyType.IND);
    const individualSHVPartyIds = individualPartiesInSHV.map((party) => party.partyID);
    const contains = individualHMCPartyIds.some((hmcParty) => individualSHVPartyIds.includes(hmcParty));
    return contains;
  }

  public static modifyHearingDetailsYear(hearingDetails: HearingWindowModel): void {
    if (hearingDetails?.dateRangeStart) {
      hearingDetails.dateRangeStart = moment(hearingDetails.dateRangeStart).year(moment().year() + 1).toISOString();
    }
    if (hearingDetails?.dateRangeEnd) {
      hearingDetails.dateRangeEnd = moment(hearingDetails.dateRangeEnd).year(moment().year() + 1).toISOString();
    }
    if (hearingDetails?.firstDateTimeMustBe) {
      hearingDetails.firstDateTimeMustBe = moment(hearingDetails.firstDateTimeMustBe).year(moment().year() + 1).toISOString();
    }
    // return modifiedHearingDetails;
  }

  public static resetHearingWindow(input: any): void {
    if (input?.hearingWindow) {
      HearingsUtils.modifyHearingDetailsYear(input.hearingWindow);
    }
    if (input?.hearingDetails?.hearingWindow) {
      HearingsUtils.modifyHearingDetailsYear(input?.hearingDetails?.hearingWindow);
    }
  }

  public static checkTemplateForHearingRequiremnts(template: Section[], isAPanelFlag: boolean): Section[] {
    if (isAPanelFlag === null || isAPanelFlag === undefined) {
      return template.filter((tp: Section) => !tp.sectionHTMLTitle.includes('Hearing panel required'));
    } else if (isAPanelFlag) {
      return template.filter((tp: Section) => !tp.sectionHTMLTitle.includes('Judge details'));
    }
    return template.filter((tp: Section) => !tp.sectionHTMLTitle.includes('Panel details'));
  }

  public static checkScreensForHearingRequiremnts(screens: string[], isAPanelFlag: boolean): string[] {
    if (isAPanelFlag === null || isAPanelFlag === undefined) {
      return screens.filter((screen: string) => screen !== 'hearing-panel-required');
    } else if (isAPanelFlag) {
      if (!screens.includes('hearing-panel')) {
        screens.push('hearing-panel');
      }
      return screens.filter((screen: string) => screen !== 'hearing-judge');
    }
    if (!screens.includes('hearing-judge')) {
      screens.push('hearing-judge');
    }
    return screens.filter((screen: string) => screen !== 'hearing-panel');
  }
}
