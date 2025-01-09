import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { initialState } from '../../hearing.test.data';
import { HearingCaseNameComponent } from './hearing-case-name.component';

describe('HearingPartiesTitleComponent', () => {
  let component: HearingCaseNameComponent;
  let fixture: ComponentFixture<HearingCaseNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HearingCaseNameComponent],
      providers: [
        provideMockStore({ initialState })
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(HearingCaseNameComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return title', () => {
    expect(component.caseName).toBe('Jane Smith vs DWP');
  });

  it('should destroy subscription', () => {
    component.serviceValueSub = of().subscribe();
    const unsubscribeSpy = spyOn(component.serviceValueSub, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
