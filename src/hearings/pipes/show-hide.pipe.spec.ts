import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { UserService } from '../../app/services/user/user.service';
import { initialState } from '../hearing.test.data';
import { HearingChannelEnum, IsHiddenSource, MemberType, RequirementType } from '../models/hearings.enum';
import { LocationByEPIMMSModel } from '../models/location.model';
import { State } from '../store/reducers';
import { ShowHidePipe } from './show-hide.pipe';

const storeMock = jasmine.createSpyObj('Store', [
  'dispatch', 'pipe'
]);

describe('ShowHidePipe', () => {
  const FOUND_LOCATIONS: LocationByEPIMMSModel[] = [{
    epimms_id: '234850',
    site_name: 'Cardiff Civil and Family Justice Centre',
    court_name: 'CARDIFF CIVIL AND FAMILY JUSTICE CENTRE',
    open_for_public: 'YES',
    region_id: '7',
    region: 'Wales',
    cluster_id: null,
    cluster_name: null,
    court_status: 'Open',
    court_open_date: null,
    closed_date: null,
    postcode: 'CF10 1ET',
    court_address: 'PARK STREET, CARDIFF',
    phone_number: '',
    court_location_code: '',
    dx_address: '99500 CARDIFF 6',
    welsh_site_name: '',
    welsh_court_address: '',
    venue_name: '',
    is_case_management_location: '',
    is_hearing_location: ''
  }];
  let showHidePipe: ShowHidePipe;
  const locationsDataService = jasmine.createSpyObj('LocationsDataService', ['getLocationById']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({})
      ],
      providers: [
        { provide: Store, useValue: storeMock },
        {
          provide: UserService,
          useValue: {
            getUserDetails: () => of({
              userInfo: {
                roles: ['roleA', 'roleB']
              }
            })
          }
        }
      ]
    });
    showHidePipe = new ShowHidePipe(locationsDataService, storeMock);
    locationsDataService.getLocationById.and.returnValue(of(FOUND_LOCATIONS));
  });

  it('should transform is welsh page hidden', () => {
    const STATE: State = initialState.hearings;
    const result$ = showHidePipe.transform(IsHiddenSource.WELSH_LOCATION, of(STATE));
    const isHidden = false;
    const expected = cold('(b|)', { b: isHidden });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is judge name hidden', () => {
    const STATE: State = initialState.hearings;
    const result$ = showHidePipe.transform(IsHiddenSource.JUDGE_NAME, of(STATE));
    const isHidden = true;
    const expected = cold('(b|)', { b: isHidden });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is judge type page hidden1', () => {
    const STATE: State = initialState.hearings;
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements = {
      roleType: ['role1']
    };
    const result$ = showHidePipe.transform(IsHiddenSource.JUDGE_TYPES, of(STATE));
    const isHidden = false;
    const expected = cold('(b|)', { b: isHidden });
    expect(result$).toBeObservable(expected);
  });

  it('should transform is judge type page hidden2', () => {
    const STATE: State = initialState.hearings;
    STATE.hearingRequest.hearingRequestMainModel.hearingDetails.panelRequirements = {
      roleType: []
    };
    const result$ = showHidePipe.transform(IsHiddenSource.JUDGE_TYPES, of(STATE));
    const isHidden = true;
    const expected = cold('(b|)', { b: isHidden });
    expect(result$).toBeObservable(expected);
  });

  describe('Paper hearing', () => {
    it('should transform is paper hearing page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingRequest: {
          ...initialState.hearings.hearingRequest,
          hearingRequestMainModel: {
            ...initialState.hearings.hearingRequest.hearingRequestMainModel,
            hearingDetails: {
              ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
              hearingChannels: [HearingChannelEnum.ONPPR]
            }
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.PAPER_HEARING, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is paper hearing page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingRequest: {
          ...initialState.hearings.hearingRequest,
          hearingRequestMainModel: {
            ...initialState.hearings.hearingRequest.hearingRequestMainModel,
            hearingDetails: {
              ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
              hearingChannels: [HearingChannelEnum.NotAttending]
            }
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.PAPER_HEARING, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Panel inclusion', () => {
    it('should transform is panel inclusion page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingRequest: {
          ...initialState.hearings.hearingRequest,
          hearingRequestMainModel: {
            ...initialState.hearings.hearingRequest.hearingRequestMainModel,
            hearingDetails: {
              ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
              panelRequirements: {
                roleType: ['role1']
              }
            }
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.PANEL_INCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is panel inclusion page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingRequest: {
          ...initialState.hearings.hearingRequest,
          hearingRequestMainModel: {
            ...initialState.hearings.hearingRequest.hearingRequestMainModel,
            hearingDetails: {
              ...initialState.hearings.hearingRequest.hearingRequestMainModel.hearingDetails,
              panelRequirements: {
                panelPreferences: [
                  {
                    memberType: MemberType.PANEL_MEMBER,
                    requirementType: RequirementType.MUSTINC,
                    memberID: '1234'
                  }
                ]
              }
            }
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.PANEL_INCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Panel details exclusion', () => {
    it('should transform is panel details page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.PANEL_DETAILS_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is panel details page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              },
              {
                screenName: 'hearing-panel',
                navigation: [
                  {
                    resultValue: 'hearing-timing'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.PANEL_DETAILS_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Judge details exclusion', () => {
    it('should transform is judge details page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.JUDGE_DETAILS_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is judge details page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              },
              {
                screenName: 'hearing-judge',
                navigation: [
                  {
                    resultValue: 'hearing-panel'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.JUDGE_DETAILS_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Hearing requirements exclusion', () => {
    it('should transform is hearing requirements section page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_REQUIREMENTS_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is hearing requirements section page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              },
              {
                screenName: 'hearing-panel',
                navigation: [
                  {
                    resultValue: 'hearing-timing'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_REQUIREMENTS_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Hearing facilities exclusion', () => {
    it('should transform is hearing facilities section page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_FACILITIES_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is hearing facilities section page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-timing'
                  }
                ]
              },
              {
                screenName: 'hearing-timing',
                navigation: [
                  {
                    resultValue: 'hearing-link'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_FACILITIES_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Hearing stage exclusion', () => {
    it('should transform is hearing stage section page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_STAGE_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is hearing stage section page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-timing'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_STAGE_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Hearing timing exclusion', () => {
    it('should transform is hearing timing section page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_TIMING_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is hearing timing section page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-timing'
                  }
                ]
              },
              {
                screenName: 'hearing-timing',
                navigation: [
                  {
                    resultValue: 'hearing-link'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_TIMING_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Hearing venue exclusion', () => {
    it('should transform is hearing venue section page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_VENUE_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is hearing venue section page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-timing'
                  }
                ]
              },
              {
                screenName: 'hearing-venue',
                conditionKey: 'regionId',
                navigation: [
                  {
                    conditionOperator: 'INCLUDE',
                    conditionValue: '7',
                    resultValue: 'hearing-welsh'
                  },
                  {
                    conditionOperator: 'NOT INCLUDE',
                    conditionValue: '7',
                    resultValue: 'hearing-judge'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.HEARING_VENUE_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Linked hearings exclusion', () => {
    it('should transform is linked hearings section page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-stage'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.LINKED_HEARINGS_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is linked hearings section page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-timing'
                  }
                ]
              },
              {
                screenName: 'hearing-link',
                navigation: [
                  {
                    resultValue: 'hearing-additional-instructions'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.LINKED_HEARINGS_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Participant attendance exclusion', () => {
    it('should transform is participant attendance section page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.PARTICIPANT_ATTENDANCE_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is participant attendance section page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-timing'
                  }
                ]
              },
              {
                screenName: 'hearing-attendance',
                navigation: [
                  {
                    resultValue: 'hearing-venue'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.PARTICIPANT_ATTENDANCE_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });

  describe('Additional instruction exclusion', () => {
    it('should transform is additional instruction section page hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-stage',
                navigation: [
                  {
                    resultValue: 'hearing-attendance'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.ADDITIONAL_INSTRUCTION_EXCLUSION, of(STATE));
      const isHidden = true;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });

    it('should transform is additional instruction section page not hidden', () => {
      const STATE: State = {
        ...initialState.hearings,
        hearingValues: {
          ...initialState.hearings.hearingValues,
          serviceHearingValuesModel: {
            ...initialState.hearings.hearingValues.serviceHearingValuesModel,
            screenFlow: [
              {
                screenName: 'hearing-requirements',
                navigation: [
                  {
                    resultValue: 'hearing-facilities'
                  }
                ]
              },
              {
                screenName: 'hearing-facilities',
                navigation: [
                  {
                    resultValue: 'hearing-timing'
                  }
                ]
              },
              {
                screenName: 'hearing-additional-instructions',
                navigation: [
                  {
                    resultValue: 'hearing-create-edit-summary'
                  }
                ]
              }
            ]
          }
        }
      };
      const result$ = showHidePipe.transform(IsHiddenSource.ADDITIONAL_INSTRUCTION_EXCLUSION, of(STATE));
      const isHidden = false;
      const expected = cold('(b|)', { b: isHidden });
      expect(result$).toBeObservable(expected);
    });
  });
});
