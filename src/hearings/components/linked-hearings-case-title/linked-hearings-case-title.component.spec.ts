import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { Mode } from '../../models/hearings.enum';
import { HearingsPipesModule } from '../../pipes/hearings.pipes.module';
import { LinkedHearingsCaseTitleComponent } from './linked-hearings-case-title.component';

describe('LinkedHearingsCaseTitleComponent', () => {
  let component: LinkedHearingsCaseTitleComponent;
  let fixture: ComponentFixture<LinkedHearingsCaseTitleComponent>;
  const mockRoute = {
    snapshot: {
      data: {
        mode: Mode.MANAGE_HEARINGS
      }
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HearingsPipesModule],
      declarations: [LinkedHearingsCaseTitleComponent, MockRpxTranslatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedHearingsCaseTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.hearingTitleTextPrefix).toEqual('Manage hearings linked to');
  });
});
