import { Component, DebugElement, Input, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RpxTranslationService } from 'rpx-xui-translation';
import { AppConstants } from '../../app.constants';
import { Helper, Navigation } from '../../containers/footer/footer.model';
import { HmctsGlobalFooterComponent } from './hmcts-global-footer.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('HmctsGlobalFooterComponent', () => {
  @Component({
    selector: 'exui-app-host-dummy-component',
    template: `<exui-app-hmcts-global-footer
                  [reference]="iconFallbackText"
                  [title]="type"
                  [items]="text"></exui-app-hmcts-global-footer>`
  })
  class TestDummyHostComponent {
    @Input() public help: Helper;
    @Input() public navigation: Navigation;
    @ViewChild(HmctsGlobalFooterComponent, { static: false })
    public hmctsGlobalFooterComponent: HmctsGlobalFooterComponent;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testHostComponent = TestDummyHostComponent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let testHostFixture: ComponentFixture<TestDummyHostComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let el: DebugElement;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let de: any;
  let component: HmctsGlobalFooterComponent;
  let fixture: ComponentFixture<HmctsGlobalFooterComponent>;

  const helpData: Helper = AppConstants.FOOTER_DATA;
  const navigationData: Navigation = AppConstants.FOOTER_DATA_NAVIGATION;

  beforeEach(waitForAsync(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const rpxTranslationServiceStub = () => ({ language: 'en', translate: () => {} });

    TestBed.configureTestingModule({
      declarations: [HmctsGlobalFooterComponent, RpxTranslateMockPipe],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {
          provide: RpxTranslationService,
          useFactory: rpxTranslationServiceStub
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsGlobalFooterComponent);
    component = fixture.componentInstance;
    component.help = helpData;
    component.navigation = navigationData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });

  it('should change the language', () => {
    component.toggleLanguage('en');
    expect(component.currentLang).toBe('en');
  });
});
