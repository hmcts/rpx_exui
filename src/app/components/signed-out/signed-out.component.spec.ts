import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SignedOutComponent } from './signed-out.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('Signed Out component', () => {
  let component: SignedOutComponent;
  let fixture: ComponentFixture<SignedOutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignedOutComponent, RpxTranslateMockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedOutComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct heading and body messages, and link button text', () => {
    const translatePipeSpy = spyOn(RpxTranslateMockPipe.prototype, 'transform').and.callThrough();
    fixture.detectChanges();
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-xl')).nativeElement;
    expect(headingElement.textContent).toContain('We have signed you out');
    expect(translatePipeSpy).toHaveBeenCalledWith('We have signed you out');
    const bodyElement = fixture.debugElement.query(By.css('.govuk-body')).nativeElement;
    expect(bodyElement.textContent).toContain('For your security, we\'ve signed you out of your account');
    expect(translatePipeSpy).toHaveBeenCalledWith('For your security, we\'ve signed you out of your account');
    const linkButtonElement = fixture.debugElement.query(By.css('.govuk-button')).nativeElement;
    expect(linkButtonElement.textContent).toContain('Sign in');
    expect(translatePipeSpy).toHaveBeenCalledWith('Sign in');
  });
});
