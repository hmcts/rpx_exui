import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HearingActualsMainModel, HearingActualsModel } from '../models/hearingActualsMainModel';
import { HearingListMainModel } from '../models/hearingListMain.model';
import { HearingRequestMainModel } from '../models/hearingRequestMain.model';
import { ACTION, HearingChannelEnum } from '../models/hearings.enum';
import { PropertiesUpdatedAutomatically, PropertiesUpdatedOnPageVisit } from '../models/hearingsUpdateMode.enum';
import {
  LinkedHearingGroupMainModel,
  LinkedHearingGroupResponseModel,
  ServiceLinkedCasesModel,
  ServiceLinkedCasesWithHearingsModel
} from '../models/linkHearings.model';
import { LovRefDataByServiceModel, LovRefDataModel } from '../models/lovRefData.model';
import { ResponseDetailsModel } from '../models/requestDetails.model';
import { ServiceHearingValuesModel } from '../models/serviceHearingValues.model';

@Injectable()
export class HearingsService {
  public actionSubject = new Subject<ACTION>();

  public navigateAction$: Observable<ACTION> = this.actionSubject.asObservable();

  public propertiesUpdatedOnPageVisit: PropertiesUpdatedOnPageVisit;
  public propertiesUpdatedAutomatically: PropertiesUpdatedAutomatically = { pageless: {}, withinPage: {} };
  public displayValidationError: boolean = false;
  public submitUpdatedRequestClicked: boolean = false;
  public hearingRequestForSubmitValid: boolean = false;

  constructor(private readonly http: HttpClient) { }

  public navigateAction(action: ACTION): void {
    this.actionSubject.next(action);
  }

  public getAllHearings(caseId: string): Observable<HearingListMainModel> {
    return this.http.get<HearingListMainModel>(`api/hearings/getHearings?caseId=${caseId}`);
  }

  public loadHearingValues(jurisdictionId: string, caseId: string): Observable<ServiceHearingValuesModel> {
    return this.http.post<ServiceHearingValuesModel>(`api/hearings/loadServiceHearingValues?jurisdictionId=${jurisdictionId}`,
      { caseReference: caseId });
  }

  public loadServiceLinkedCases(jurisdictionId: string, caseReference: string, hearingId?: string): Observable<ServiceLinkedCasesModel[]> {
    return this.http.post<ServiceLinkedCasesModel[]>(`api/hearings/loadServiceLinkedCases?jurisdictionId=${jurisdictionId}`, {
      caseReference,
      hearingId // could be null, empty string or missing
    });
  }

  public loadLinkedCasesWithHearings(jurisdictionId: string, caseReference: string, caseName: string, hearingId?: string): Observable<ServiceLinkedCasesWithHearingsModel[]> {
    return this.http.post<ServiceLinkedCasesWithHearingsModel[]>(`api/hearings/loadLinkedCasesWithHearings?jurisdictionId=${jurisdictionId}`, {
      caseReference,
      caseName,
      hearingId // could be null, empty string or missing
    });
  }

  public loadCaseLinkingReasonCodes(): Observable<LovRefDataByServiceModel> {
    return this.http.get<LovRefDataByServiceModel>('/refdata/commondata/lov/categories/CaseLinkingReasonCode');
  }

  public cancelHearingRequest(hearingId: string, reasons: LovRefDataModel[]): Observable<ResponseDetailsModel> {
    const cancellationReasonCodes: string[] = reasons.map((reason) => reason.key);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        cancellationReasonCodes
      }
    };
    return this.http.delete<ResponseDetailsModel>(`api/hearings/cancelHearings?hearingId=${hearingId}`, options);
  }

  public loadHearingRequest(hearingId: string): Observable<HearingRequestMainModel> {
    return this.http.get<HearingRequestMainModel>(`api/hearings/getHearing?hearingId=${hearingId}`);
  }

  public submitHearingRequest(hearingRequestMainModel: HearingRequestMainModel): Observable<ResponseDetailsModel> {
    return this.http.post<ResponseDetailsModel>('api/hearings/submitHearingRequest', this.prepareHearingRequestModel(hearingRequestMainModel));
  }

  public updateHearingRequest(hearingRequestMainModel: HearingRequestMainModel): Observable<ResponseDetailsModel> {
    const options = {
      params: new HttpParams()
        .set('hearingId', hearingRequestMainModel.requestDetails.hearingRequestID)
    };
    return this.http.put<ResponseDetailsModel>('api/hearings/updateHearingRequest', this.prepareHearingRequestModel(hearingRequestMainModel), options);
  }

  public getHearingActuals(hearingId: string): Observable<HearingActualsMainModel> {
    return this.http.get<any>(`api/hearings/hearingActuals/${hearingId}`);
  }

  public updateHearingActuals(hearingId: string, hearingActualsModel: HearingActualsModel): Observable<HearingActualsMainModel> {
    return this.http.put<HearingActualsMainModel>(`api/hearings/hearingActuals?hearingId=${hearingId}`, hearingActualsModel);
  }

  public submitHearingActuals(hearingId: string): Observable<HttpResponse<number>> {
    return this.http.post<HttpResponse<number>>(`api/hearings/hearingActualsCompletion/${hearingId}`, null);
  }

  public getLinkedHearingGroup(groupId: string): Observable<LinkedHearingGroupMainModel> {
    return this.http.get<LinkedHearingGroupMainModel>(`api/hearings/getLinkedHearingGroup?groupId=${groupId}`);
  }

  public postLinkedHearingGroup(linkedHearingGroupMainModel: LinkedHearingGroupMainModel): Observable<LinkedHearingGroupResponseModel> {
    return this.http.post<LinkedHearingGroupResponseModel>('api/hearings/postLinkedHearingGroup', linkedHearingGroupMainModel);
  }

  public putLinkedHearingGroup(groupId: string, linkedHearingGroupMainModel: LinkedHearingGroupMainModel): Observable<LinkedHearingGroupResponseModel> {
    return this.http.put<LinkedHearingGroupResponseModel>(`api/hearings/putLinkedHearingGroup?groupId=${groupId}`, linkedHearingGroupMainModel);
  }

  public deleteLinkedHearingGroup(hearingGroupId: string): Observable<LinkedHearingGroupResponseModel> {
    const options = {
      params: new HttpParams()
        .set('hearingGroupId', hearingGroupId)
    };
    return this.http.delete<LinkedHearingGroupResponseModel>('api/hearings/deleteLinkedHearingGroup', options);
  }

  public prepareHearingRequestModel(hearingRequestMainModel: HearingRequestMainModel): HearingRequestMainModel {
    let model = hearingRequestMainModel;
    const newModel: HearingRequestMainModel = {
      ...hearingRequestMainModel,
      hearingDetails: {
        ...hearingRequestMainModel.hearingDetails,
        hearingWindow: null
      }
    };
    if (hearingRequestMainModel.hearingDetails.hearingWindow && Object.keys(hearingRequestMainModel.hearingDetails.hearingWindow).length === 0) {
      model = newModel;
    }
    return model;
  }

  public getHearingChannels(hearingRequestMainModel: HearingRequestMainModel) : string[]{
    return !!hearingRequestMainModel.hearingDetails?.isPaperHearing ?
      [HearingChannelEnum.ONPPR] : hearingRequestMainModel.hearingDetails.hearingChannels;
  }
}
