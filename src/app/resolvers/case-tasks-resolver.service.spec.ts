import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TaskList } from '../../work-allocation/models/dtos';
import { CaseTasksResolverService } from './case-tasks-resolver.service';

describe('CaseTasksResolverService', () => {
  let httpClient: HttpClient;
  const TASKS = {
    tasks: [
      {
        id: '0d22d839-b25a-11eb-a18c-f2d58a9b7bd1',
        task_title: 'Review FTPA application',
        dueDate: '2021-05-05T16:00:00.000+0000',
        location_name: 'Birmingham',
        location_id: '231596',
        case_id: '1620409659381330',
        case_category: 'EEA',
        case_name: 'Kimberly Julian',
        permissions: ['Read', 'Manage']
      },
      {
        id: '0d22d839-b25a-11eb-a18c-f2d58a9b7bd2',
        task_title: 'Review FTPA application',
        dueDate: '2021-05-12T16:00:00.000+0000',
        location_name: 'Glasgow',
        location_id: '366559',
        case_id: '1620409659381330',
        case_category: 'Protection',
        case_name: 'James Carter',
        permissions: ['Execute']
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([])],
    providers: [
        CaseTasksResolverService,
        { provide: APP_BASE_HREF, useValue: '/' },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}
    );
    httpClient = TestBed.inject(HttpClient) as HttpClient;
  });

  it('should return a list of tasks', (done) => {
    spyOn(httpClient, 'get').and.returnValue(of(TASKS));
    const service: CaseTasksResolverService = TestBed.inject(CaseTasksResolverService);
    const activatedRoute = new ActivatedRouteSnapshot();
    activatedRoute.params = {
      cid: '1620409659381330'
    };
    service.resolve(activatedRoute).subscribe((tasks: TaskList) => {
      expect(tasks.tasks.length).toBe(2);
      done();
    });
  });
});
