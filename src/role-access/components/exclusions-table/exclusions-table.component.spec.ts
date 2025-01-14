import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CaseField, CaseView } from '@hmcts/ccd-case-ui-toolkit';
import { ExclusionsTableComponent } from './exclusions-table.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ExclusionsTableComponent', () => {
  let component: ExclusionsTableComponent;
  let fixture: ComponentFixture<ExclusionsTableComponent>;
  const CASE_VIEW: CaseView = {
    events: [],
    triggers: [],
    case_id: '1234567890123456',
    case_type: {
      id: 'TestAddressBookCase',
      name: 'Test Address Book Case',
      jurisdiction: {
        id: 'TEST',
        name: 'Test'
      },
      printEnabled: true
    },
    channels: [],
    state: {
      id: 'CaseCreated',
      name: 'Case created'
    },
    tabs: [
      {
        id: 'NameTab',
        label: 'Name',
        order: 2,
        fields: [
          Object.assign(new CaseField(), {
            id: 'PersonFirstName',
            label: 'First name',
            display_context: 'OPTIONAL',
            field_type: {
              id: 'Text',
              type: 'Text'
            },
            order: 2,
            value: 'Janet',
            show_condition: '',
            hint_text: ''
          }),
          Object.assign(new CaseField(), {
            id: 'PersonLastName',
            label: 'Last name',
            display_context: 'OPTIONAL',
            field_type: {
              id: 'Text',
              type: 'Text'
            },
            order: 1,
            value: 'Parker',
            show_condition: 'PersonFirstName="Jane*"',
            hint_text: ''
          }),
          Object.assign(new CaseField(), {
            id: 'PersonComplex',
            label: 'Complex field',
            display_context: 'OPTIONAL',
            field_type: {
              id: 'Complex',
              type: 'Complex',
              complex_fields: []
            },
            order: 3,
            show_condition: 'PersonFirstName="Park"',
            hint_text: ''
          })
        ],
        show_condition: 'PersonFirstName="Janet"'
      },
      {
        id: 'HistoryTab',
        label: 'History',
        order: 1,
        fields: [Object.assign(new CaseField(), {
          id: 'CaseHistory',
          label: 'Case History',
          display_context: 'OPTIONAL',
          field_type: {
            id: 'CaseHistoryViewer',
            type: 'CaseHistoryViewer'
          },
          order: 1,
          value: null,
          show_condition: '',
          hint_text: ''
        })],
        show_condition: ''
      },
      {
        id: 'SomeTab',
        label: 'Some Tab',
        order: 3,
        fields: [],
        show_condition: ''
      }
    ]
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ExclusionsTableComponent],
    imports: [RouterTestingModule.withRoutes([])],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusionsTableComponent);
    component = fixture.componentInstance;
    component.caseDetails = CASE_VIEW;
    fixture.detectChanges();
  });

  it('should show the no exclusions message', () => {
    const element = fixture.debugElement.nativeElement;
    const rowElement = element.querySelector('.govuk-summary-list__value');
    expect(rowElement).not.toBeNull();
    expect(rowElement.innerHTML).toContain('There are no exclusions for this case.');
  });

  it('should display a list of roles', () => {
    component.exclusions = [
      {
        id: '123',
        added: new Date(2021, 7, 1),
        name: 'Judge Birch',
        notes: 'this case been remitted from Upper Tribunal and required different judge',
        type: 'Other',
        userType: 'Judicial',
        actorId: 'actorId'
      }
    ];
    fixture.detectChanges();
    const tableBody: DebugElement = fixture.debugElement.query(By.css('.govuk-table__body'));
    const tableBodyHTMLElement: HTMLElement = tableBody.nativeElement as HTMLElement;
    expect(tableBodyHTMLElement.children.length).toBe(1);
    expect(tableBodyHTMLElement.children[0].children[0].textContent).toBe('Judge Birch');
    expect(tableBodyHTMLElement.children[0].children[1].textContent).toBe('Judicial');
  });
});
