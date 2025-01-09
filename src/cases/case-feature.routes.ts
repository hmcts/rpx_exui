import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseResolver, viewerRouting as caseViewRouting, editorRouting } from '@hmcts/ccd-case-ui-toolkit';
import {
  CaseCreateSubmitComponent,
  CaseDetailsHomeComponent,
  CaseFilterComponent,
  CaseHearingsComponent,
  CaseHomeComponent,
  CaseListComponent,
  CaseShareCompleteComponent,
  CaseShareComponent,
  CaseShareConfirmComponent,
  CasesCreateComponent
} from './containers';
import { CaseLoaderComponent } from './containers/case-loader/case-loader.component';
import { CaseSearchComponent } from './containers/case-search/case-search.component';
import { CaseViewerContainerComponent } from './containers/case-viewer-container/case-viewer-container.component';
import { RestrictedCaseAccessContainerComponent } from './containers/restricted-case-access-container/restricted-case-access-container.component';
import { RolesAndAccessContainerComponent } from './containers/roles-and-access-container/roles-and-access-container.component';
import { TasksContainerComponent } from './containers/tasks-container/tasks-container.component';
import { RestrictedCaseAccessGuard } from './guards/restricted-case-access-guard';
import { ActivityResolver } from './resolvers/activity.resolver';
import { CreateCaseEventTriggerResolver } from './resolvers/create-case-event-trigger.resolver';

export const ROUTES: Routes = [
  {
    path: '',
    resolve: {
      activity: ActivityResolver
    },
    component: CaseHomeComponent,
    children: [
      {
        path: '',
        component: CaseListComponent,
        data: {
          title: 'Case list'
        }
      },
      {
        path: 'case-loader',
        component: CaseLoaderComponent
      },
      {
        path: 'case-share',
        component: CaseShareComponent,
        data: {
          title: 'HMCTS Share Cases | Case Share'
        }
      },
      {
        path: 'case-share-confirm',
        component: CaseShareConfirmComponent,
        data: {
          title: 'HMCTS Share Cases | Case Share Confirm'
        }
      },
      {
        path: 'case-share-complete',
        component: CaseShareCompleteComponent,
        data: {
          title: 'HMCTS Share Cases | Case Share Complete'
        }
      },
      {
        path: 'case-filter',
        component: CaseFilterComponent,
        data: {
          title: 'Create a case'
        }
      },
      {
        path: 'case-create',
        children: [
          {
            path: '',
            component: CasesCreateComponent
          },
          {
            path: ':jid/:ctid/:eid',
            component: CaseCreateSubmitComponent,
            resolve: {
              eventTrigger: CreateCaseEventTriggerResolver
            },
            children: editorRouting
          }
        ],
        data: {
          title: 'Create a case'
        }
      },
      {
        path: 'case-search',
        component: CaseSearchComponent,
        children: editorRouting,
        data: {
          title: 'Find a case'
        }
      },
      {
        path: 'case-details/:cid',
        component: CaseDetailsHomeComponent,
        resolve: { case: CaseResolver },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            component: CaseViewerContainerComponent,
            children: [
              {
                path: '',
                pathMatch: 'full'
              },
              {
                path: 'tasks',
                component: TasksContainerComponent
              },
              {
                path: 'roles-and-access',
                component: RolesAndAccessContainerComponent
              },
              {
                path: 'hearings',
                component: CaseHearingsComponent
              }
            ]
          },
          ...caseViewRouting],
        data: {
          title: 'Case Details'
        }
      },
      {
        path: 'restricted-case-access/:cid',
        component: RestrictedCaseAccessContainerComponent,
        canActivate: [RestrictedCaseAccessGuard],
        data: {
          title: 'Restricted case access'
        }
      }
    ]
  }

];

export const casesRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
