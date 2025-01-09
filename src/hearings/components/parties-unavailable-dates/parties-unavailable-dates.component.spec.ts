import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { PartiesUnavailableDatesComponent } from './parties-unavailable-dates.component';

describe('PartiesUnavailableDatesComponent', () => {
  let component: PartiesUnavailableDatesComponent;
  let fixture: ComponentFixture<PartiesUnavailableDatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartiesUnavailableDatesComponent, MockRpxTranslatePipe]
    })
      .compileComponents();
    fixture = TestBed.createComponent(PartiesUnavailableDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
