import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('Header Component', () => {
  let mockStore: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockService: any;
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const rpxTranslationServiceStub = () => ({ language: 'en', translate: () => {}, getTranslation$: (phrase: string) => of(phrase) });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, RpxTranslateMockPipe],
      imports: [HttpClientTestingModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: RpxTranslationService,
          useFactory: rpxTranslationServiceStub
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    mockStore = jasmine.createSpyObj('store', ['pipe']);
    mockService = jasmine.createSpyObj('service', ['get']);
    component = new HeaderComponent(mockStore);
  });

  it('should render the skip to content link', () => {
    const translatePipeSpy = spyOn(RpxTranslateMockPipe.prototype, 'transform').and.callThrough();
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.govuk-skip-link')).nativeElement;
    expect(element.textContent).toEqual('Skip to main content');
    expect(translatePipeSpy).toHaveBeenCalledWith('Skip to main content');
  });

  it('should call emitNavigate with event and this.navigate', () => {
    const event = {};
    spyOn(component, 'emitNavigate');

    component.onNavigate(event);
    expect(component.emitNavigate).toHaveBeenCalled();
  });

  it('should call emitNavigate with event and this.navigate', () => {
    const event = {};
    spyOn(component, 'emitNavigate');

    component.onNavigate(event);
    expect(component.emitNavigate).toHaveBeenCalled();
  });

  it('should emitNavigate', () => {
    const event = {};
    const emitter = jasmine.createSpyObj('emitter', ['emit']);
    component.emitNavigate(event, emitter);
    expect(emitter.emit).toHaveBeenCalled();
  });
});
