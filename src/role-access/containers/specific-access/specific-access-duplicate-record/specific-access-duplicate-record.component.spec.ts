import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { getMockTasks } from '../../../../work-allocation/tests/utils.spec';
import { SpecificAccessDuplicateRecordComponent } from './specific-access-duplicate-record.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SpecificAccessDuplicateRecordComponent', () => {
  let component: SpecificAccessDuplicateRecordComponent;
  let fixture: ComponentFixture<SpecificAccessDuplicateRecordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [SpecificAccessDuplicateRecordComponent],
    imports: [],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {
                        taskAndRole: {
                            task: {
                                task: getMockTasks()[0]
                            },
                            role: []
                        }
                    }
                }
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificAccessDuplicateRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
