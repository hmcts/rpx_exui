import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { InitialisationSyncService } from './initialisation-sync-service';
import createSpy = jasmine.createSpy;

describe('InitialisationSyncService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        InitialisationSyncService
      ]
    });
  });

  it('should create an instance of injectable service', () => {
    const iss = TestBed.inject(InitialisationSyncService);
    expect(iss).toBeTruthy();
  });

  it('should call callback when initialisation is complete', fakeAsync(() => {
    const iss = TestBed.inject(InitialisationSyncService);
    const foo = (complete: boolean) => {
      if (complete) {
        console.log('initialisation done');
      } else {
        console.log('callback called, initialisation incomplete');
      }
    };
    const spyFoo = createSpy('testSpy', foo).and.callThrough();
    iss.waitForInitialisation(spyFoo);
    expect(iss.getSubscriptionCount()).toBe(1);
    iss.initialisationComplete();
    flush();
    expect(spyFoo).toHaveBeenCalled();
  }));
});
