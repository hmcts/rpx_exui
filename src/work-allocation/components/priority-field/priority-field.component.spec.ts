import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PriorityLimits, TaskPriority } from '../../enums';
import { PriorityFieldComponent } from './priority-field.component';

describe('PriorityFieldComponent', () => {
  let component: PriorityFieldComponent;
  let fixture: ComponentFixture<PriorityFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PriorityFieldComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only show if there is a dueDate set', () => {
    expect(component.priority).toBe(TaskPriority.HIGH);
    component.priorityDate = new Date();
    fixture.detectChanges();
    expect(component.priority).toBeDefined();
  });

  it('should correctly set the priority to HIGH', () => {
    expect(component.priority).toBe(TaskPriority.HIGH);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(new Date().getDate() - 1);
    component.majorPriority = PriorityLimits.High;
    component.priorityDate = yesterdayDate;
    fixture.detectChanges();
    expect(component.priority).toBe(TaskPriority.HIGH);
  });
  it('should correctly set the priority to MEDIUM', () => {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(new Date().getDate() + 1);
    component.majorPriority = PriorityLimits.High;
    component.priorityDate = tomorrowDate;
    fixture.detectChanges();
    expect(component.priority).toBe(TaskPriority.MEDIUM);
  });
  it('should correctly set the priority to LOW', () => {
    const dayafterTomorrowDate = new Date();
    dayafterTomorrowDate.setDate(new Date().getDate() + 2);
    component.majorPriority = PriorityLimits.High;
    component.priorityDate = dayafterTomorrowDate;
    fixture.detectChanges();
    expect(component.priority).toBe(TaskPriority.LOW);
  });
  it('should correctly set the priority to URGENT', () => {
    component.majorPriority = PriorityLimits.Urgent;
    fixture.detectChanges();
    expect(component.priority).toBe(TaskPriority.URGENT);
  });
  it('should correctly set the priority to LOW when priority greater than 5000', () => {
    component.majorPriority = 5001;
    fixture.detectChanges();
    expect(component.priority).toBe(TaskPriority.LOW);
  });
  it('should correctly set the priority to HIGH when priority between 2000 and 5000', () => {
    component.majorPriority = 2500;
    fixture.detectChanges();
    expect(component.priority).toBe(TaskPriority.HIGH);
  });
});

