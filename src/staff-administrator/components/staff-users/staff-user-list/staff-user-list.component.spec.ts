import { CdkTableModule } from '@angular/cdk/table';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { NgxPaginationModule } from 'ngx-pagination';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { StaffUsersFilterResult } from '../../../models/staff-users-filter-result.model';
import { StaffDataFilterService } from '../services/staff-data-filter/staff-data-filter.service';
import { StaffUserListComponent } from './staff-user-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StaffUserListComponent', () => {
  let component: StaffUserListComponent;
  let fixture: ComponentFixture<StaffUserListComponent>;
  let mockStaffDataFilterService: Partial<StaffDataFilterService>;

  beforeEach(waitForAsync(() => {
    mockStaffDataFilterService = {
      tableData$: of(null)
    };

    TestBed.configureTestingModule({
    declarations: [StaffUserListComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [CdkTableModule,
        RouterTestingModule,
        NgxPaginationModule,
        ExuiCommonLibModule,
        RpxTranslationModule.forChild()],
    providers: [
        RpxTranslationService,
        RpxTranslationConfig,
        { provide: StaffDataFilterService, useValue: mockStaffDataFilterService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display data if tableData$ returns null', () => {
    // @ts-expect-error - tableData$ is readonly
    mockStaffDataFilterService.tableData$ = of(null);
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('table'));
    expect(element).toBeFalsy();
  });

  it('should display data if tableData$ returns { results: StaffUser[] }' +
    ' and length of results is greater than 0', () => {
    // @ts-expect-error - tableData$ is readonly
    mockStaffDataFilterService.tableData$ = of({ items: [{} as StaffUsersFilterResult] });
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('table'));
    expect(element).toBeTruthy();
  });

  it('should display "No results found" when tableData$ returns { results: [] }' +
    ' and length of results is equal to 0', () => {
    // @ts-expect-error - tableData$ is readonly
    mockStaffDataFilterService.tableData$ = of({ items: [] });
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('#user-list-no-results'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.textContent).toContain(component.noResultsFoundText);
  });
});
