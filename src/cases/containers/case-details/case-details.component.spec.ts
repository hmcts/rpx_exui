import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { CaseDetailsComponent } from './case-details.component';

describe('CaseDetailsComponent', () => {
  let component: CaseDetailsComponent;
  let fixture: ComponentFixture<CaseDetailsComponent>;
  const storeMock = jasmine.createSpyObj('mockStore', ['pipe']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CaseDetailsComponent],
      providers: [
        {
          provide: Store,
          useValue: storeMock
        }

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDetailsComponent);
    component = fixture.componentInstance;
    storeMock.pipe.and.returnValue(of('dummy'));
    fixture.detectChanges();
  });

  it('should assign case id', () => {
    expect(component.caseId).toEqual('dummy');
  });

  it('should unsubscribe', () => {
    spyOn(component.$caseIdSubscription, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.$caseIdSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should unsubscribe ', () => {
    const subscription = jasmine.createSpyObj('myObject', ['unsubscribe']);

    component.unSubscribe(subscription);
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should not call unsubscribe when no subscription', () => {
    const subscription = jasmine.createSpyObj('myObject', ['unsubscribe']);

    component.unSubscribe(null);
    expect(subscription.unsubscribe).not.toHaveBeenCalled();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
