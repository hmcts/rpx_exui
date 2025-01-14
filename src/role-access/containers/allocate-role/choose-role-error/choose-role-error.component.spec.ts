import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ChooseRoleErrorComponent } from './choose-role-error.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ChooseRoleErrorComponent', () => {
  let component: ChooseRoleErrorComponent;
  let fixture: ComponentFixture<ChooseRoleErrorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [ChooseRoleErrorComponent],
    imports: [],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    queryParams: {
                        roleCategory: 'JUDICIAL',
                        jurisdiction: 'IA'
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
    fixture = TestBed.createComponent(ChooseRoleErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show the correct message with the correct parameters', () => {
    expect(component.jurisdiction).toBe('IA');
    // Note: Do not need to test every option - getLabe() test already does this
    expect(component.roleCategory).toBe('Judicial');
  });

  afterEach(() => {
    component = null;
    fixture.destroy();
  });
});
