import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { ViewHearingComponent } from './view-hearing.component';

describe('ViewHearingComponent', () => {
  let component: ViewHearingComponent;
  let fixture: ComponentFixture<ViewHearingComponent>;
  const mockLocation = jasmine.createSpyObj('Location', ['back']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewHearingComponent, MockRpxTranslatePipe],
      providers: [
        {
          provide: Location,
          useValue: mockLocation
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call back', () => {
    component.onBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
