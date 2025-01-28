import { fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromActions from '../../../app/store';
import { SearchStatePersistenceKey } from '../../../search/enums';
import { SearchParameters } from '../../../search/models';
import { SearchService } from '../../../search/services/search.service';
import { CaseReferenceSearchBoxComponent } from './case-reference-search-box.component';
import { LoggerService } from '../../services/logger/logger.service';

describe('CaseReferenceSearchBoxComponent', () => {
  let component: CaseReferenceSearchBoxComponent;

  const mockFormBuilder = jasmine.createSpyObj('FormBuilder', ['group']);
  const mockSearchService = jasmine.createSpyObj('SearchService', ['retrieveState', 'storeState']);
  const mockStore = jasmine.createSpyObj('Store', ['dispatch']);

  const initializeComponent = ({
    formBuilder = {},
    searchService = {},
    router = {},
    route = {},
    store = {},
    logger = {}
  }) => new CaseReferenceSearchBoxComponent(
    store as Store<fromActions.State>,
    formBuilder as FormBuilder,
    searchService as SearchService,
    router as Router,
    route as ActivatedRoute,
    logger as LoggerService
  );

  afterEach(() => {
    mockFormBuilder.group.calls.reset();
    mockSearchService.retrieveState.calls.reset();
    mockSearchService.storeState.calls.reset();
    mockStore.dispatch.calls.reset();
  });

  it('should create', () => {
    component = initializeComponent({});

    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should call \'unsubscribe\'', () => {
      component = initializeComponent({});
      component.searchSubscription$ = {
        unsubscribe: jasmine.createSpy()
      } as unknown as Subscription;

      component.ngOnDestroy();

      expect(component.searchSubscription$.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should decorate 16-digit case reference search box', () => {
      component = initializeComponent({ formBuilder: mockFormBuilder, searchService: mockSearchService });
      const setValueSpy = jasmine.createSpy();

      component.decorate16DigitCaseReferenceSearchBoxInHeader = true;

      mockFormBuilder.group.and.returnValue({
        controls: {
          exuiCaseReferenceSearch: {
            setValue: setValueSpy
          }
        }
      });

      mockSearchService.retrieveState.and.returnValue({
        caseReferences: ['FIRST']
      });

      component.ngOnInit();

      expect(mockSearchService.retrieveState).toHaveBeenCalledTimes(1);
      expect(mockFormBuilder.group).toHaveBeenCalledTimes(1);
      expect(setValueSpy).toHaveBeenCalledWith('FIRST');
    });

    it('should NOT decorate 16-digit case reference search box', () => {
      component = initializeComponent({ formBuilder: mockFormBuilder, searchService: mockSearchService });
      const setValueSpy = jasmine.createSpy();

      component.decorate16DigitCaseReferenceSearchBoxInHeader = false;

      mockFormBuilder.group.and.returnValue({
        controls: {
          exuiCaseReferenceSearch: {
            setValue: setValueSpy
          }
        }
      });

      component.ngOnInit();

      expect(mockSearchService.retrieveState).not.toHaveBeenCalled();
      expect(setValueSpy).not.toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should focus on case reference input element', () => {
      component = initializeComponent({ formBuilder: mockFormBuilder, searchService: mockSearchService });
      const focusSpy = jasmine.createSpy();

      component.decorate16DigitCaseReferenceSearchBoxInHeader = true;
      component.caseReferenceInputEl = {
        nativeElement: {
          focus: focusSpy
        }
      };

      component.ngAfterViewInit();

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    const mockRouter = {
      navigate: jasmine.createSpy().and.returnValue(Promise.resolve(true)),
      url: {
        includes: jasmine.createSpy()
      },
      navigateByUrl: () => Promise.resolve()
    };

    it('should return to case details page if case found', () => {
      component = initializeComponent({ formBuilder: mockFormBuilder, searchService: mockSearchService, store: mockStore, router: mockRouter });

      component.decorate16DigitCaseReferenceSearchBoxInHeader = true;
      component.formGroup = {
        get: () => ({
          value: 'VALID VALUE',
          invalid: false
        })
      } as unknown as FormGroup;

      const searchParameters: SearchParameters = {
        caseReferences: ['VALID VALUE'],
        CCDJurisdictionIds: null,
        otherReferences: null,
        fullName: null,
        address: null,
        postcode: null,
        emailAddress: null,
        dateOfBirth: null,
        dateOfDeath: null
      };

      component.onSubmit();
      expect(mockSearchService.storeState).toHaveBeenCalledTimes(1);
      expect(mockSearchService.storeState).toHaveBeenCalledWith(SearchStatePersistenceKey.SEARCH_PARAMS, searchParameters);
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/cases/case-details/VALIDVALUE'], { state: { origin: '16digitCaseReferenceSearchFromHeader' }, relativeTo: ({}) });
    });

    it('should return to case details page if case found and url includes case-details', fakeAsync(() => {
      component = initializeComponent({ formBuilder: mockFormBuilder, searchService: mockSearchService, store: mockStore, router: mockRouter });

      component.decorate16DigitCaseReferenceSearchBoxInHeader = true;
      component.formGroup = {
        get: () => ({
          value: 'VALID VALUE',
          invalid: false
        })
      } as unknown as FormGroup;

      mockRouter.url.includes.and.returnValue('case-details');

      component.onSubmit();

      tick();
      expect(mockSearchService.storeState).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/cases/case-details/VALIDVALUE'], { state: { origin: '16digitCaseReferenceSearchFromHeader' }, relativeTo: ({}) });
    }));

    it('should return to no results page if case reference entered is invalid', () => {
      component = initializeComponent({ formBuilder: mockFormBuilder, searchService: mockSearchService, store: mockStore, router: mockRouter });

      component.decorate16DigitCaseReferenceSearchBoxInHeader = true;
      component.formGroup = {
        get: () => ({
          value: 'INVALID VALUE',
          invalid: true
        })
      } as unknown as FormGroup;

      component.onSubmit();
      expect(mockSearchService.storeState).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });
});
