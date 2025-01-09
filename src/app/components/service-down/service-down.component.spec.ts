import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ServiceDownComponent } from './service-down.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('Service Down component', () => {
  let component: ServiceDownComponent;
  let fixture: ComponentFixture<ServiceDownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceDownComponent, RpxTranslateMockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDownComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct heading and body messages', () => {
    const translatePipeSpy = spyOn(RpxTranslateMockPipe.prototype, 'transform').and.callThrough();
    fixture.detectChanges();
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-xl')).nativeElement;
    expect(headingElement.textContent).toContain('Sorry, there is a problem with the service');
    expect(translatePipeSpy).toHaveBeenCalledWith('Sorry, there is a problem with the service');
    const bodyElement = fixture.debugElement.query(By.css('.govuk-body')).nativeElement;
    expect(bodyElement.textContent).toContain('Try again later.');
    expect(translatePipeSpy).toHaveBeenCalledWith('Try again later.');
  });
});
