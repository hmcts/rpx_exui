import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { CaseShareService } from './share-case.service';

describe('Share Case Service', () => {
  let httpClientGetSpy: { get: jasmine.Spy };
  let httpClientPostSpy: { post: jasmine.Spy };
  let service: CaseShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule
      ],
      providers: [CaseShareService],
      teardown: { destroyAfterEach: false }
    });
    httpClientGetSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientPostSpy = jasmine.createSpyObj('HttpClient', ['post']);
  });

  it('should have configuration service', () => {
    service = TestBed.inject(CaseShareService);
    expect(service).toBeTruthy();
  });

  it('should get users from organisation', () => {
    httpClientGetSpy.get.and.returnValue({});
    service.getUsersFromOrg().subscribe((data) => {
      expect(data).toBeDefined();
    });
  });

  it('should get share cases', () => {
    const shareCases = [{
      caseId: 'C111111',
      caseTitle: 'James vs Jasmine',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Godard',
        email: 'james.godard@test.com'
      }],
      pendingShares: [{
        idamId: 'U222222',
        firstName: 'Shaun',
        lastName: 'Priest',
        email: 'shaun.priest@test.com'
      }]
    }];
    httpClientGetSpy.get.and.returnValue({});
    service.getShareCases(shareCases).subscribe((data) => {
      expect(data).toBeDefined();
    });
  });

  it('should assign share cases', () => {
    const shareCases = [{
      caseId: 'C111111',
      caseTitle: 'James vs Jasmine',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Godard',
        email: 'james.godard@test.com'
      }],
      pendingShares: [{
        idamId: 'U222222',
        firstName: 'Shaun',
        lastName: 'Priest',
        email: 'shaun.priest@test.com'
      }]
    }];
    httpClientPostSpy.post.and.returnValue({});
    service.assignUsersWithCases(shareCases).subscribe((data) => {
      expect(data).toBeDefined();
    });
  });
});

