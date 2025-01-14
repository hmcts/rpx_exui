import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StaffStatusComponent } from './staff-status.component';

describe('StaffStatusComponent', () => {
  let component: StaffStatusComponent;
  let fixture: ComponentFixture<StaffStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StaffStatusComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
