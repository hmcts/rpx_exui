import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { JudicialUserModel } from '../../models/judicialUser.model';
import { HearingJudgeNamesListComponent } from './hearing-judge-names-list.component';

describe('HearingJudgeNamesListComponent', () => {
  let component: HearingJudgeNamesListComponent;
  let fixture: ComponentFixture<HearingJudgeNamesListComponent>;

  const judgeDetails: JudicialUserModel = {
    title: '',
    knownAs: 'Hearing Judge',
    surname: 'Jacky',
    fullName: 'Jacky Collins',
    emailId: 'jacky.collins@judicial.com',
    idamId: '38eb0c5e-29c7-453e-b92d-f2029aaed6c1',
    initials: 'JC',
    postNominals: 'JP',
    isJudge: '',
    personalCode: 'P100001',
    isMagistrate: '',
    isPanelMember: ''
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HearingJudgeNamesListComponent, MockRpxTranslatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingJudgeNamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check displayed Judge Name', () => {
    expect(component.displayedJudgeName(judgeDetails)).toBe('Jacky Collins (jacky.collins@judicial.com)');
  });

  it('should remove selected Judge', () => {
    component.judgeList = [judgeDetails];
    component.removeSelectedJudge(judgeDetails);
    expect(component.judgeList.length).toBe(0);
  });

  it('should check exclude judge', () => {
    component.judgeList = [];
    component.selectedJudge = judgeDetails;
    component.personFormGroup.controls.selectedFormControl.setValue(judgeDetails);
    component.excludeJudge();
    expect(component.judgeList.length).toBe(1);
    component.removeSelectedJudge(judgeDetails);
    expect(component.judgeList.length).toBe(0);
  });

  it('should check exclude judge is valid input or not', () => {
    component.selectedJudge = judgeDetails;
    component.judgeList = [];
    component.personFormGroup.controls.selectedFormControl.setValue(judgeDetails);
    expect(component.isExcludeJudgeInputValid()).toBe(false);
    component.personFormGroup.controls.selectedFormControl.setValue(null);
    expect(component.isExcludeJudgeInputValid()).toBe(true);
  });
});
