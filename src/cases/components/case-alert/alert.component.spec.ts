import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertComponent as CCDAlertComponent, AlertIconClassPipe, AlertService } from '@hmcts/ccd-case-ui-toolkit';
import { of } from 'rxjs';
import { AlertComponent } from './alert.component';
import { By } from '@angular/platform-browser';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  const alertServiceMock = {
    alerts: of({ message: 'success message', level: 'success' })
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
        ])
      ],
      declarations: [AlertComponent, CCDAlertComponent, AlertIconClassPipe, RpxTranslateMockPipe],
      providers: [{
        provide: AlertService,
        useValue: alertServiceMock
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    spyOn(component, 'ngOnDestroy').and.callFake(() => {});
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have updated the value of message and level in ngOnInit', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    const alertElement = fixture.debugElement.query(By.css('.alert-message')).nativeElement.textContent;
    expect(component.successMessage).toEqual('success message');
    expect(component.level).toEqual('success');
    expect(alertElement).toBe(' success message ');
  });

  it('should unsubscribe onDestroy', () => {
    spyOn(component.alertMessageSubscription, 'unsubscribe').and.callThrough();

    component.ngOnDestroy();
    expect(component.alertMessageSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should unsubscribe onDestroy', () => {
    const subscription = jasmine.createSpyObj('mockObject', ['unsubscribe']);

    component.unSubscribe(subscription);
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should not call unsubscribe when no subscription', () => {
    const subscription = jasmine.createSpyObj('mockObject', ['unsubscribe']);

    component.unSubscribe(null);
    expect(subscription.unsubscribe).not.toHaveBeenCalled();
  });

  it('should hyphenate every 4th digit of alert', () => {
    component.successMessage = '1234567890123456';
    expect(component.hyphenate('1234567890123456')).toBe('1234-5678-9012-3456');
  });
});

describe('AlertComponent warning message', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  const alertServiceMock = {
    alerts: of({ message: 'warning message', level: 'warning' })
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
        ])
      ],
      declarations: [AlertComponent, CCDAlertComponent, AlertIconClassPipe, RpxTranslateMockPipe],
      providers: [{
        provide: AlertService,
        useValue: alertServiceMock
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    spyOn(component, 'ngOnDestroy').and.callFake(() => {});
    fixture.destroy();
  });

  it('should have updated the value to warning message and level in ngOnInit', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    const alertElement = fixture.debugElement.query(By.css('.alert-message')).nativeElement.textContent;
    expect(component.warningMessage).toEqual('warning message');
    expect(component.level).toEqual('warning');
    expect(alertElement).toBe(' warning message ');
  });
});
