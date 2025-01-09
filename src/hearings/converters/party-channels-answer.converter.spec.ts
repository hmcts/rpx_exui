import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { initialState, partyChannelsRefData, partySubChannelsRefData } from '../hearing.test.data';
import { PartyType } from '../models/hearings.enum';
import { PartyDetailsModel } from '../models/partyDetails.model';
import { State } from '../store';
import { PartyChannelsAnswerConverter } from './party-channels-answer.converter';

describe('PartyChannelsAnswerConverter', () => {
  let converter: PartyChannelsAnswerConverter;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: Store<any>;
  let router: any;
  const partyDetails = [
    {
      partyID: 'P1',
      partyName: 'Jane and Smith',
      partyType: PartyType.IND,
      partyRole: 'appellant',
      individualDetails: {
        title: null,
        firstName: 'Jane',
        lastName: 'Smith',
        preferredHearingChannel: 'inPerson'
      }
    },
    {
      partyID: 'P2',
      partyName: 'DWP',
      partyType: PartyType.ORG,
      partyRole: 'claimant',
      individualDetails: {
        title: null,
        firstName: 'DWP',
        lastName: null,
        preferredHearingChannel: 'byVideo'
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                partyChannels: partyChannelsRefData,
                partySubChannels: partySubChannelsRefData
              }
            }
          }
        }
      ]
    });
    store = TestBed.inject(Store);
    router = TestBed.inject(ActivatedRoute);
    converter = new PartyChannelsAnswerConverter(router);
  });

  it('should transform party channel value', () => {
    const STATE: State = _.cloneDeep(initialState.hearings);
    STATE.hearingRequest.hearingRequestMainModel.partyDetails = partyDetails;
    const result$ = converter.transformAnswer(of(STATE));
    const option = '<ul><li>Jane and Smith - In person</li></ul>';
    const expected = cold('(b|)', { b: option });
    expect(result$).toBeObservable(expected);
  });

  it('should return party id if party name is null', () => {
    const party: PartyDetailsModel = {
      partyID: 'P001', partyRole: 'appellant', partyType: PartyType.IND
    };
    const foundPartyFromService: PartyDetailsModel = {
      partyID: 'P002', partyRole: 'appellant', partyType: PartyType.ORG
    };
    expect(converter.getPartyName(party, foundPartyFromService)).toEqual('P001');
  });

  it('should return party id if party name is null or party.individualDetails is null', () => {
    const party: PartyDetailsModel = {
      partyID: 'P001', partyRole: 'appellant', partyType: PartyType.IND
    };
    const foundPartyFromService: PartyDetailsModel = {
      partyID: 'P002', partyRole: 'appellant', partyType: PartyType.ORG
    };
    expect(converter.getPartyName(party, foundPartyFromService)).toEqual('P001');
  });

  it('should return party name if party name from party is not null', () => {
    const party: PartyDetailsModel = {
      partyID: 'P001', partyRole: 'appellant', partyType: PartyType.IND, partyName: 'Smith',
      individualDetails: { firstName: 'John', lastName: 'Smith' }
    };
    const foundPartyFromService: PartyDetailsModel = {
      partyID: 'P002', partyRole: 'appellant', partyType: PartyType.ORG, partyName: 'Jack'
    };
    expect(converter.getPartyName(party, foundPartyFromService)).toEqual('Smith');
  });

  it('should return party firstname and lastname if party name from party is null', () => {
    const party: PartyDetailsModel = {
      partyID: 'P001', partyRole: 'appellant', partyType: PartyType.IND,
      individualDetails: { firstName: 'John', lastName: 'Smith' }
    };
    const foundPartyFromService: PartyDetailsModel = {
      partyID: 'P002', partyRole: 'appellant', partyType: PartyType.ORG, partyName: 'Jack',
      individualDetails: { firstName: 'John', lastName: 'Smith' }
    };
    expect(converter.getPartyName(party, foundPartyFromService)).toEqual('John Smith');
  });

  it('should return party name if party name from party is null whereas foundPartyFromService is not null', () => {
    const foundPartyFromService: PartyDetailsModel = {
      partyID: 'P002', partyRole: 'appellant', partyType: PartyType.ORG, partyName: 'Jack'
    };
    expect(converter.getPartyName(null, foundPartyFromService)).toEqual('Jack');
  });

  it('should return party firstName and lastName if party name from party is null whereas foundPartyFromService is not null', () => {
    const foundPartyFromService: PartyDetailsModel = {
      partyID: 'P002', partyRole: 'appellant', partyType: PartyType.ORG,
      individualDetails: { firstName: 'Jack', lastName: 'Smith' }
    };
    expect(converter.getPartyName(null, foundPartyFromService)).toEqual('Jack Smith');
  });

  it('should return blank space if party name from party is null', () => {
    const party: PartyDetailsModel = {
      partyID: 'P001', partyRole: 'appellant', partyType: PartyType.IND,
      individualDetails: { firstName: null, lastName: null }
    };
    const foundPartyFromService: PartyDetailsModel = {
      partyID: 'P002', partyRole: 'appellant', partyType: PartyType.ORG, partyName: 'Jack'
    };
    expect(converter.getPartyName(party, foundPartyFromService)).toEqual(' ');
  });
});
