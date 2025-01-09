import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NotAuthorisedComponent } from './not-authorised.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('Not Authorised component', () => {
  let component: NotAuthorisedComponent;
  let fixture: ComponentFixture<NotAuthorisedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NotAuthorisedComponent, RpxTranslateMockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAuthorisedComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct heading and body messages', () => {
    const translatePipeSpy = spyOn(RpxTranslateMockPipe.prototype, 'transform').and.callThrough();
    fixture.detectChanges();
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-xl')).nativeElement;
    expect(headingElement.textContent).toContain('Sorry, you\'re not authorised to perform this action');
    expect(translatePipeSpy).toHaveBeenCalledWith('Sorry, you\'re not authorised to perform this action');
    const bodyElement = fixture.debugElement.query(By.css('.govuk-body')).nativeElement;
    expect(bodyElement.textContent).toContain('Try again later.');
    expect(translatePipeSpy).toHaveBeenCalledWith('Try again later.');
  });
});
