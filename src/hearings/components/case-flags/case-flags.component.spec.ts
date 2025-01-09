import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockRpxTranslatePipe } from '../../../app/shared/test/mock-rpx-translate.pipe';
import { CaseFlagGroup } from '../../models/caseFlagGroup.model';
import { AmendmentLabelStatus } from '../../models/hearingsUpdateMode.enum';
import { CaseFlagsComponent } from './case-flags.component';

describe('CaseFlagsComponent', () => {
  let component: CaseFlagsComponent;
  let fixture: ComponentFixture<CaseFlagsComponent>;
  let nativeElement: any;

  const caseFlagsGroup: CaseFlagGroup[] = [
    {
      name: 'Jane Smith',
      partyFlags: [
        {
          partyId: '1234-uytr-7654-asdf-0001',
          partyName: 'Jane Smith',
          flagParentId: 'PARENT_0',
          flagId: 'RA001',
          flagDescription: 'Some comment',
          flagStatus: 'ACTIVE',
          displayName: 'A',
          displayPath: [
            'Reasonable adjustment'
          ]
        }
      ],
      partyAmendmentLabelStatus: AmendmentLabelStatus.AMENDED
    },
    {
      name: 'Jack Ryan',
      partyFlags: [
        {
          partyId: '1234-uytr-7654-asdf-0002',
          partyName: 'Jack Ryan',
          flagParentId: 'PARENT_0',
          flagId: 'RA001',
          flagDescription: 'Some additional comment',
          flagStatus: 'ACTIVE',
          displayName: 'A',
          displayPath: [
            'Reasonable adjustment'
          ]
        },
        {
          partyId: '1234-uytr-7654-asdf-0002',
          partyName: 'Jack Ryan',
          flagParentId: 'PARENT_0',
          flagId: 'RA0042',
          flagDescription: 'Some more additional comment',
          flagStatus: 'ACTIVE',
          displayName: 'B',
          displayPath: [
            'Reasonable adjustment'
          ],
          flagAmendmentLabelStatus: AmendmentLabelStatus.ACTION_NEEDED
        }
      ],
      partyAmendmentLabelStatus: AmendmentLabelStatus.NONE
    },
    {
      name: 'Rob Kennedy',
      partyFlags: [
        {
          partyId: '1234-uytr-7654-asdf-0004',
          partyName: 'Rob Kennedy',
          flagParentId: 'PARENT_0',
          flagId: 'RA0042',
          flagDescription: 'Some details about the flag',
          flagStatus: 'ACTIVE',
          displayName: 'B',
          displayPath: [
            'Reasonable adjustment'
          ]
        }
      ],
      partyAmendmentLabelStatus: AmendmentLabelStatus.ACTION_NEEDED
    },
    {
      name: 'test',
      partyFlags: [
        {
          partyId: '1234-uytr-7654-asdf-1111',
          partyName: 'Case level flags',
          flagParentId: 'PARENT_10',
          flagId: 'CF0012',
          flagDescription: 'hello world',
          flagStatus: 'Active',
          flagComment: 'Comment to show',
          displayName: 'Language Interpreter',
          displayPath: [
            'Reasonable adjustment'
          ]
        }
      ],
      partyAmendmentLabelStatus: AmendmentLabelStatus.ACTION_NEEDED
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CaseFlagsComponent, MockRpxTranslatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
    fixture = TestBed.createComponent(CaseFlagsComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the values', () => {
    component.caseFlagsGroup = caseFlagsGroup;
    fixture.detectChanges();
    const headerElements = nativeElement.querySelectorAll('.govuk-table__header_name');
    const tableRowElements = nativeElement.querySelectorAll('.govuk-table__row');
    expect(headerElements[0].textContent).toContain('Jane Smith');
    expect(tableRowElements[1].textContent).toContain('Some comment');
    expect(headerElements[1].textContent).toContain('Jack Ryan');
    expect(tableRowElements[3].textContent).toContain('Some additional comment');
    expect(tableRowElements[4].textContent).toContain('Some more additional comment');
    expect(headerElements[2].textContent).toContain('Rob Kennedy');
    expect(tableRowElements[6].textContent).toContain('Some details about the flag');
  });

  it('should not render the party labels', () => {
    component.caseFlagsGroup = [
      {
        ...caseFlagsGroup[0],
        partyAmendmentLabelStatus: AmendmentLabelStatus.NONE
      },
      {
        ...caseFlagsGroup[1],
        partyAmendmentLabelStatus: AmendmentLabelStatus.NONE
      },
      {
        ...caseFlagsGroup[2],
        partyAmendmentLabelStatus: AmendmentLabelStatus.NONE
      }
    ];
    fixture.detectChanges();
    expect(nativeElement.querySelector('#party-label-0')).toBeNull();
    expect(nativeElement.querySelector('#party-label-1')).toBeNull();
    expect(nativeElement.querySelector('#party-label-2')).toBeNull();
  });

  it('should return true if all the check pass', () => {
    expect(component.showDescription(caseFlagsGroup[3].partyFlags[0])).toBeTruthy();
  });

  it('should return false if all the check pass', () => {
    caseFlagsGroup[3].partyFlags[0].flagComment = null;
    expect(component.showDescription(caseFlagsGroup[3].partyFlags[0])).toBeFalsy();
  });
});
